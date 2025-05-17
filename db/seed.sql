--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: embeddings; Type: TABLE DATA; Schema: public; Owner: rocco
--

COPY public.embeddings (id, doc_type, chunk_data, embedding, doc_id, network_ids) FROM stdin;
\.


--
-- Data for Name: networks; Type: TABLE DATA; Schema: public; Owner: rocco
--

COPY public.networks (id, name) FROM stdin;
1	AI Builders
2	Climate Founders
3	Bootstrapped Startups
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: rocco
--

COPY public.profiles (id, name, bio) FROM stdin;
1	Alice Zhang	Founder of a productivity tool. Background in UX and marketing.
2	Bob Lee	"Bootstrapper, engineer, growth nerd."
3	Charlie Kim	Worked at Tesla and now exploring climate tech.
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: rocco
--

COPY public.members (id, profile_id, network_id) FROM stdin;
1	1	1
2	2	1
3	3	1
4	1	2
5	2	2
6	3	2
7	1	3
8	2	3
9	3	3
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: rocco
--

COPY public.posts (id, author, network_id, content) FROM stdin;
1	alice	1	How do I find early users for my SaaS startup?
2	bob	1	We just hit $10K MRR — AMA about sales and growth.
3	charlie	1	Looking for a technical cofounder for a climate startup.
4	alice	2	Best practices for training large language models?
5	bob	2	How to raise seed funding from climate-focused VCs?
6	charlie	2	What carbon accounting tools are YC-backed?
7	alice	3	We hit $1K MRR from SEO in month 2 — ask me anything.
8	bob	3	How to run a pre-order campaign for a hardware product?
9	charlie	3	Solo founder tips for staying motivated?
\.


--
-- Name: embeddings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rocco
--

SELECT pg_catalog.setval('public.embeddings_id_seq', 1, false);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rocco
--

SELECT pg_catalog.setval('public.members_id_seq', 9, true);


--
-- Name: networks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rocco
--

SELECT pg_catalog.setval('public.networks_id_seq', 3, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rocco
--

SELECT pg_catalog.setval('public.posts_id_seq', 10, false);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rocco
--

SELECT pg_catalog.setval('public.profiles_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

