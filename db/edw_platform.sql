

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-04-17 00:44:09

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16952)
-- Name: communications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communications (
    id integer NOT NULL,
    message character varying NOT NULL,
    sender_id integer NOT NULL,
    project_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.communications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16951)
-- Name: communications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.communications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communications_id_seq OWNER TO postgres;

--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 225
-- Name: communications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.communications_id_seq OWNED BY public.communications.id;


--
-- TOC entry 224 (class 1259 OID 16928)
-- Name: invite_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite_codes (
    id integer NOT NULL,
    code character varying NOT NULL,
    is_used boolean,
    created_by integer,
    used_by integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invite_codes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16927)
-- Name: invite_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invite_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_codes_id_seq OWNER TO postgres;

--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 223
-- Name: invite_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invite_codes_id_seq OWNED BY public.invite_codes.id;


--
-- TOC entry 228 (class 1259 OID 16977)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_number character varying NOT NULL,
    amount integer NOT NULL,
    description character varying,
    status character varying,
    due_date timestamp without time zone,
    project_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16976)
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 227
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- TOC entry 232 (class 1259 OID 17018)
-- Name: project_criteria_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_criteria_history (
    id integer NOT NULL,
    project_id integer NOT NULL,
    content character varying NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.project_criteria_history OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17017)
-- Name: project_criteria_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_criteria_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_criteria_history_id_seq OWNER TO postgres;

--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 231
-- Name: project_criteria_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_criteria_history_id_seq OWNED BY public.project_criteria_history.id;


--
-- TOC entry 230 (class 1259 OID 16998)
-- Name: project_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_files (
    id integer NOT NULL,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    project_id integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.project_files OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16997)
-- Name: project_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_files_id_seq OWNER TO postgres;

--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 229
-- Name: project_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_files_id_seq OWNED BY public.project_files.id;


--
-- TOC entry 222 (class 1259 OID 16908)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying,
    description character varying,
    status character varying,
    client_id integer NOT NULL,
    trello_url character varying,
    github_url character varying,
    github_token character varying,
    wip_url character varying,
    start_date timestamp without time zone,
    acceptance_criteria character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16907)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 221
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 220 (class 1259 OID 16894)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    email character varying,
    password character varying,
    fullname character varying,
    bio character varying,
    role character varying,
    registration_date timestamp without time zone DEFAULT now(),
    last_login timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16893)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4894 (class 2604 OID 16955)
-- Name: communications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications ALTER COLUMN id SET DEFAULT nextval('public.communications_id_seq'::regclass);


--
-- TOC entry 4892 (class 2604 OID 16931)
-- Name: invite_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes ALTER COLUMN id SET DEFAULT nextval('public.invite_codes_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 16980)
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 17021)
-- Name: project_criteria_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_criteria_history ALTER COLUMN id SET DEFAULT nextval('public.project_criteria_history_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 17001)
-- Name: project_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_files ALTER COLUMN id SET DEFAULT nextval('public.project_files_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16911)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16897)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: communications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.communications (id, message, sender_id, project_id, created_at) VALUES
(1, 'Welcome to the E-commerce Redesign project!', 1, 1, now()),
(2, 'Looking forward to the new UI.', 2, 1, now()),
(3, 'Mobile App MVP initiated.', 1, 2, now()),
(4, 'CRM Integration started.', 1, 3, now()),
(5, 'AI Chatbot development in progress.', 1, 5, now()),
(6, 'SEO Audit completed for Project 6.', 3, 6, now()),
(7, 'Blockchain Prototype ready for review.', 1, 7, now()),
(8, 'Data Warehouse Migration kick-off.', 1, 9, now()),
(9, 'Cybersecurity Audit ongoing.', 1, 11, now()),
(10, 'Cloud Infrastructure Setup finished.', 1, 13, now()),
(11, 'SaaS Dashboard design signed off.', 1, 15, now()),
(12, 'Project 16 is live!', 1, 16, now());



--
-- TOC entry 5088 (class 0 OID 16928)
-- Dependencies: 224
-- Data for Name: invite_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite_codes (id, code, is_used, created_by, used_by, created_at) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.invoices (id, invoice_number, amount, description, status, due_date, project_id, created_at) VALUES
(1, 'INV-001', 1500, 'Initial Deposit - Project 1', 'paid', now() + interval '7 days', 1, now()),
(2, 'INV-002', 2000, 'Milestone 1 - Project 2', 'pending', now() + interval '14 days', 2, now()),
(3, 'INV-003', 1200, 'Setup Fee - Project 3', 'paid', now() + interval '5 days', 3, now()),
(4, 'INV-004', 3500, 'Development Phase 1 - Project 5', 'pending', now() + interval '20 days', 5, now()),
(5, 'INV-005', 1800, 'Consulting Fee - Project 7', 'unpaid', now() + interval '2 days', 7, now()),
(6, 'INV-006', 4500, 'Final Settlement - Project 16', 'paid', now() - interval '1 day', 16, now());



--
-- TOC entry 5096 (class 0 OID 17018)
-- Dependencies: 232
-- Data for Name: project_criteria_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_criteria_history (id, project_id, content, created_by, created_at) FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 16998)
-- Dependencies: 230
-- Data for Name: project_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_files (id, file_name, file_path, project_id, uploaded_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.projects (id, title, description, status, client_id, trello_url, github_url, github_token, wip_url, start_date, acceptance_criteria, created_at, updated_at) VALUES
(1, 'E-commerce Redesign', 'Complete overhaul of the online store UI/UX.', 'active', 2, 'https://trello.com/b/123', 'https://github.com/client1/shop', 'ghp_dummy1', 'https://wip.client1.com', now(), 'Modern UI, Fast load times', now(), now()),
(2, 'Mobile App MVP', 'Initial version of the customer loyalty app.', 'pending', 2, 'https://trello.com/b/456', 'https://github.com/client1/app', 'ghp_dummy2', 'https://wip.app.com', now(), 'Auth, Profile, Rewards list', now(), now()),
(3, 'CRM Integration', 'Linking Salesforce with internal lead manager.', 'active', 3, 'https://trello.com/b/789', 'https://github.com/client2/crm', 'ghp_dummy3', 'https://wip.crm.com', now(), 'Real-time sync', now(), now()),
(4, 'Legacy Migration', 'Porting COBOL data to PostgreSQL.', 'active', 3, 'https://trello.com/b/abc', 'https://github.com/client2/legacy', 'ghp_dummy4', 'https://wip.mig.com', now(), 'Zero data loss', now(), now()),
(5, 'AI Chatbot', 'Natural language customer support agent.', 'active', 4, 'https://trello.com/b/def', 'https://github.com/client3/ai', 'ghp_dummy5', 'https://wip.ai.com', now(), '90% intent recognition', now(), now()),
(6, 'SEO Audit', 'Optimization of the main marketing site.', 'completed', 4, NULL, NULL, NULL, NULL, now(), 'Top 3 ranking for key terms', now(), now()),
(7, 'Blockchain Prototype', 'Smart contract for decentralized supply chain.', 'active', 5, 'https://trello.com/b/ghi', 'https://github.com/client4/chain', 'ghp_dummy6', 'https://wip.chain.com', now(), 'Gas efficiency', now(), now()),
(8, 'NFT Gallery', 'Frontend for displaying digital collectibles.', 'pending', 5, 'https://trello.com/b/jkl', 'https://github.com/client4/nft', 'ghp_dummy7', 'https://wip.nft.com', now(), 'Fast image loading', now(), now()),
(9, 'Data Warehouse', 'Snowflake implementation for BI.', 'active', 6, 'https://trello.com/b/mno', 'https://github.com/client5/data', 'ghp_dummy8', 'https://wip.data.com', now(), 'Sub-second queries', now(), now()),
(10, 'Tableau Dashboarding', 'Visualizations for executive reporting.', 'completed', 6, NULL, NULL, NULL, NULL, now(), 'Interactive filter support', now(), now()),
(11, 'Cybersecurity Audit', 'Pentesting of the main web application.', 'active', 7, 'https://trello.com/b/pqr', 'https://github.com/client6/sec', 'ghp_dummy9', 'https://wip.sec.com', now(), 'No Critical vulns found', now(), now()),
(12, 'Firewall Setup', 'Hardening the local network infra.', 'pending', 7, NULL, NULL, NULL, NULL, now(), 'Zero open ports', now(), now()),
(13, 'Cloud Migration', 'Moving workloads to Google Cloud Platform.', 'active', 8, 'https://trello.com/b/stu', 'https://github.com/client7/cloud', 'ghp_dummy10', 'https://wip.cloud.com', now(), 'Cost reduction of 20%', now(), now()),
(14, 'K8s Cluster Setup', 'Orchestration for microservices.', 'pending', 8, 'https://trello.com/b/vwx', 'https://github.com/client7/k8s', 'ghp_dummy11', 'https://wip.k8s.com', now(), 'Autoscaling working', now(), now()),
(15, 'SaaS Dashboard', 'Management console for enterprise users.', 'active', 9, 'https://trello.com/b/yz1', 'https://github.com/client8/saas', 'ghp_dummy12', 'https://wip.saas.com', now(), 'RBAC support', now(), now()),
(16, 'Subscription Logic', 'Billing system with Stripe integration.', 'completed', 9, 'https://trello.com/b/234', 'https://github.com/client8/stripe', 'ghp_dummy13', 'https://wip.stripe.com', now(), 'Recurring billing active', now(), now());



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, email, password, fullname, bio, role, registration_date, last_login) VALUES
(1, 'admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$w7qntD48xUpoT9HW7R8woA$m8bRK5oFoxDbDk0V1WUtvxTL+hZ+/vUnBBfplkpaOKs', 'System Admin', 'Platform Administrator', 'admin', now(), now()),
(2, 'client1', 'client1@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'John Doe', 'Founder of ShopNext', 'client', now(), now()),
(3, 'client2', 'client2@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Jane Smith', 'CEO of LegacyCorp', 'client', now(), now()),
(4, 'client3', 'client3@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Alice Williams', 'AI Researcher', 'client', now(), now()),
(5, 'client4', 'client4@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Bob Brown', 'Crypto Enthusiast', 'client', now(), now()),
(6, 'client5', 'client5@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Charlie Davis', 'Data Scientist', 'client', now(), now()),
(7, 'client6', 'client6@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Eve Miller', 'Security Specialist', 'client', now(), now()),
(8, 'client7', 'client7@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Frank Wilson', 'Cloud Architect', 'client', now(), now()),
(9, 'client8', 'client8@example.com', '$argon2id$v=19$m=65536,t=3,p=4$/JN4v4lneujdF9GYQeW1Tg$gwRNC1ptlJG5g70o3G/UxRETnvkPCcBxZjI6dmeUqm8', 'Grace Taylor', 'SaaS Entrepreneur', 'client', now(), now());



SELECT pg_catalog.setval('public.communications_id_seq', 12, true);
SELECT pg_catalog.setval('public.invite_codes_id_seq', 1, false);
SELECT pg_catalog.setval('public.invoices_id_seq', 6, true);
SELECT pg_catalog.setval('public.project_criteria_history_id_seq', 1, false);
SELECT pg_catalog.setval('public.project_files_id_seq', 1, false);
SELECT pg_catalog.setval('public.projects_id_seq', 16, true);
SELECT pg_catalog.setval('public.users_id_seq', 9, true);



--
-- TOC entry 4915 (class 2606 OID 16964)
-- Name: communications communications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_pkey PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 16938)
-- Name: invite_codes invite_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4918 (class 2606 OID 16989)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 17029)
-- Name: project_criteria_history project_criteria_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_criteria_history
    ADD CONSTRAINT project_criteria_history_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 17010)
-- Name: project_files project_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 16919)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16904)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 1259 OID 16975)
-- Name: ix_communications_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_communications_id ON public.communications USING btree (id);


--
-- TOC entry 4912 (class 1259 OID 16949)
-- Name: ix_invite_codes_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_invite_codes_code ON public.invite_codes USING btree (code);


--
-- TOC entry 4913 (class 1259 OID 16950)
-- Name: ix_invite_codes_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_invite_codes_id ON public.invite_codes USING btree (id);


--
-- TOC entry 4919 (class 1259 OID 16996)
-- Name: ix_invoices_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_invoices_id ON public.invoices USING btree (id);


--
-- TOC entry 4920 (class 1259 OID 16995)
-- Name: ix_invoices_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_invoices_invoice_number ON public.invoices USING btree (invoice_number);


--
-- TOC entry 4924 (class 1259 OID 17040)
-- Name: ix_project_criteria_history_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_project_criteria_history_id ON public.project_criteria_history USING btree (id);


--
-- TOC entry 4921 (class 1259 OID 17016)
-- Name: ix_project_files_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_project_files_id ON public.project_files USING btree (id);


--
-- TOC entry 4906 (class 1259 OID 16926)
-- Name: ix_projects_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_id ON public.projects USING btree (id);


--
-- TOC entry 4907 (class 1259 OID 16925)
-- Name: ix_projects_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_projects_title ON public.projects USING btree (title);


--
-- TOC entry 4902 (class 1259 OID 16905)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4903 (class 1259 OID 16906)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4930 (class 2606 OID 16970)
-- Name: communications communications_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4931 (class 2606 OID 16965)
-- Name: communications communications_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4928 (class 2606 OID 16939)
-- Name: invite_codes invite_codes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4929 (class 2606 OID 16944)
-- Name: invite_codes invite_codes_used_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_used_by_fkey FOREIGN KEY (used_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4932 (class 2606 OID 16990)
-- Name: invoices invoices_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4934 (class 2606 OID 17035)
-- Name: project_criteria_history project_criteria_history_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_criteria_history
    ADD CONSTRAINT project_criteria_history_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4935 (class 2606 OID 17030)
-- Name: project_criteria_history project_criteria_history_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_criteria_history
    ADD CONSTRAINT project_criteria_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4933 (class 2606 OID 17011)
-- Name: project_files project_files_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 4927 (class 2606 OID 16920)
-- Name: projects projects_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-04-17 00:44:10

--
-- PostgreSQL database dump complete
--


