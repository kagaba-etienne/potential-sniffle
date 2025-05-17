import { NextResponse } from "next/server";
import getEmbedding from "@/lib/getEmbedding";
import Papa from "papaparse";
import db from "@/lib/db";
import toPgVector from "@/lib/toPgVector";

interface Profile {
  id: string;
  name: string;
  bio: string;
}

interface Post {
  id: string;
  author: string;
  networkId: string;
  content: string;
}

function getCleanChunk(data: Profile | Post) {
  return Object.entries(data)
    .filter(([key]) => key !== "id" && key !== "networkId")
    .map(
      ([key, value]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
    )
    .join("\n");
}

async function processProfiles(profiles: Profile[]) {
  for (const profile of profiles) {
    const chunk = getCleanChunk(profile);
    const embedding = await getEmbedding(chunk);
    const id = profile.id;

    const results = await db.query(
      `
            SELECT network_id
            FROM members
            WHERE profile_id=$1;
            `,
      [id],
    );

    const networkIds = results.rows.map(
      (row: { network_id: string }) => row.network_id,
    );

    await db.query(
      `
        INSERT INTO embeddings (network_ids, doc_type, doc_id, chunk_data, embedding)
        VALUES ($1, $2, $3, $4, $5)
        `,
      [networkIds, "profile", id, chunk, toPgVector(embedding)],
    );
  }

  return NextResponse.json({ message: "Profiles processed successfully" });
}

async function processPosts(posts: Post[]) {
  for (const post of posts) {
    const chunk = getCleanChunk(post);
    const embedding = await getEmbedding(chunk);
    const networkId = parseInt(post.networkId);
    const id = post.id;

    await db.query(
      `
        INSERT INTO embeddings (network_ids, doc_type, doc_id, chunk_data, embedding)
        VALUES ($1, $2, $3, $4, $5)
        `,
      [[networkId], "post", id, chunk, toPgVector(embedding)],
    );
  }

  return NextResponse.json({ message: "Posts processed successfully" });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const scope = formData.get("scope"); // This can be profiles or posts
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isCSV = file.type === "text/csv";

    if (!isCSV) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);

    const { data, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "CSV parsing failed", details: errors },
        { status: 400 },
      );
    }

    if (scope === "profiles") {
      return await processProfiles(data as Profile[]);
    } else if (scope === "posts") {
      return await processPosts(data as Post[]);
    } else {
      return NextResponse.json(
        { error: "Invalid scope. possible values are 'profiles' and 'posts'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 400 },
    );
  }
}
