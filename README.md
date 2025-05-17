## Instructions

1. `npm install` to install all necessary dependencies
2. Configure environment variables

```
DATABASE_URL=postgresql://user:pass@host:port/db
OPENAI_API_KEY="sk-proj-_V....."
```

3. Appy the database schema with `psql -U your_username -d your_database_name -f db/schema.sql`
4. Apply the seed with `psql -U your_username -d your_database_name -f db/seed.sql`

Remember to replace `your-username` with the actual username with appropriate permissions to `your_database_name` database.

5. Start the server locally `npm run dev` and open another terminal.

6. Use the command below to upload the profiles and posts CSVs.

- The endpoint is at `/api/embed`.
- Expects `multipart-formdata` content-Type.
- The form data should contain `file` and `scope` attributes.
- The `file` attribute should contain a respecitve CSV.
- The `scope` should be indicate whether it is a profiles or posts file. It takes any of the two values `profiles` or `posts`.

For example:

```curl
curl -X POST http://localhost:3000/api/embed \
 -F "scope=profiles" \
 -F "file=@./db/profiles.csv;type=text/csv"
```

Sample response:

```json
{ "message": "Profiles processed successfully" }
```

This endpoint generates embeddings of the provided data and stores them in the database.

7. To query the data use the following command:

- The endpoint is at `api/query`.
- Expects `application/json` content-Type.
- The request body should contain `prompt` and `networkId` attribute
- The `prompt` should be non-empty
- The `networkId` should be a number representing the network
- Currently, there are only 3 networks in the database so (1,2,3) are the meaningful values for `networkId`.

For example:

```curl
curl -X POST http://localhost:3000/api/query \
 -H "Content-Type: application/json" \
 -d '{
   "prompt": "Founders",
   "networkId": 1
}' | jq
```

Sample response:

```json
{
  "data": [
    {
      "doc_type": "post",
      "similarity": 0.5960968016414736,
      "profile_id": null,
      "name": null,
      "bio": null,
      "post_id": 1,
      "author": "alice",
      "content": "How do I find early users for my SaaS startup?"
    },
    {
      "doc_type": "post",
      "similarity": 0.6046704421249939,
      "profile_id": null,
      "name": null,
      "bio": null,
      "post_id": 3,
      "author": "charlie",
      "content": "Looking for a technical cofounder for a climate startup."
    },
    {
      "doc_type": "profile",
      "similarity": 0.6179044203076656,
      "profile_id": 2,
      "name": "Bob Lee",
      "bio": "\"Bootstrapper, engineer, growth nerd.\"",
      "post_id": null,
      "author": null,
      "content": null
    },
    {
      "doc_type": "profile",
      "similarity": 0.6778409087014353,
      "profile_id": 1,
      "name": "Alice Zhang",
      "bio": "Founder of a productivity tool. Background in UX and marketing.",
      "post_id": null,
      "author": null,
      "content": null
    },
    {
      "doc_type": "profile",
      "similarity": 0.6965530424282753,
      "profile_id": 3,
      "name": "Charlie Kim",
      "bio": "Worked at Tesla and now exploring climate tech.",
      "post_id": null,
      "author": null,
      "content": null
    }
  ]
}
```

- If a matched record is a post, its `doc_type` will be set to `post` otherwise `profile`.
- If a matched record is a `post`, we will consider 3 useful attributes: `post_id, author, and content`.
- If a matched record is a `profile`, we will consider 3 useful attributes `profile_id, name, and bio`.

### Thank you!
