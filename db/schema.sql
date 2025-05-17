CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE networks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    network_id INTEGER NOT NULL REFERENCES networks(id),
    content TEXT NOT NULL
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id),
    network_id INTEGER NOT NULL REFERENCES networks(id)
);

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
    id SERIAL PRIMARY KEY,
    network_ids INTEGER[],
    doc_type TEXT NOT NULL,
    doc_id INTEGER,
    chunk_data TEXT NOT NULL,
    embedding VECTOR(1536)
)