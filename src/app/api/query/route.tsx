import { NextResponse } from "next/server";
import db from "@/lib/db";
import getEmbedding from "@/lib/getEmbedding";
import toPgVector from "@/lib/toPgVector";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const prompt = requestBody.prompt;
    const networkIdValue = requestBody.networkId;

    const errors: Record<string, string> = {};

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      errors.prompt = "Prompt is required.";
    }

    if (!networkIdValue || isNaN(Number(networkIdValue))) {
      errors.networkId = "Valid networkId is required.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const query_embedding = await getEmbedding(prompt as string);
    const networkId = parseInt(networkIdValue as string, 10);

    const results = await db.query(
      `
            WITH similar_docs AS (
                SELECT doc_type, doc_id, embedding <=> $1::vector as similarity
                FROM embeddings
                WHERE $2 = ANY(network_ids)
                ORDER BY similarity
                LIMIT 5
            )
            SELECT
                sd.doc_type,
                sd.similarity,
                p.id AS profile_id,
                p.name,
                p.bio,
                ps.id AS post_id,
                ps.author,
                ps.content
            FROM similar_docs sd
            LEFT JOIN profiles p ON sd.doc_type = 'profile' AND sd.doc_id::text = p.id::text
            LEFT JOIN posts ps ON sd.doc_type = 'post' AND sd.doc_id::text = ps.id::text
            ORDER BY sd.similarity ASC;
            `,
      [toPgVector(query_embedding), networkId.toString()],
    );

    return NextResponse.json({ data: results.rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
