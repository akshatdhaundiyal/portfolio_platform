# 🚀 Executive AI PM & Applied ML Engineering Portfolio

An executive-grade, full-stack portfolio platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM (PostgreSQL)**.

Tailored for an experienced Data Scientist pursuing an MBA, positioning for roles at the intersection of **AI Product Management (Technical / AI PM)** and **Senior Applied AI / ML Engineering**.

Synthesizes the design systems of **Marius Ballot** (minimal dark canvas, monospace telemetry metadata), **Jackie Zhang** (editorial case study artifact cards, prominent metric badges, "Learnt that..." retrospectives), and **Eyeballs** (clean problem-solution-impact pacing).

---

## 🌟 Key Capabilities

1. **Executive Strategic Case Studies**:
   - *Actuarial Pricing & GLM Engine* (+$12M Annual Recovery at EXL Service)
   - *Claims NLP Triage on Google Vertex AI* (70% Triage Acceleration)
   - *Media Chronicle* (Sub-100ms On-Device YOLO Face Detection)
2. **The Builder Arsenal (Marius Ballot Engineering Grid)**:
   - WashQueue Smart Appliance (FastAPI/WebSockets IoT), Rooftop CV, Decentralized Marketplace, Full-Stack Platform.
3. **The 3-Stage Evolution Timeline**:
   - Engineering Core (EXL / MIT DSP) → Strategy & Discovery (MBA) → The Intersection (AI PM & Technical Strategy).
4. **Super Admin Dynamic Blog Studio (`/admin/blogs`)**:
   - Passcode-protected studio (`ADMIN_PASSWORD`).
   - Hybrid rich-markdown editor with instant block insertion toolbar for responsive images, video embeds (YouTube / MP4), syntax-highlighted code blocks, and retrospective callouts.
   - Live split-view or tabbed preview.
   - **1-Click Medium Syndication**: Cross-posts to Medium as Draft or Public, automatically setting `canonicalUrl` for 100% SEO credit to your portfolio website.
5. **Single-Container Deployment**:
   - Multi-stage standalone `Dockerfile` ready for deployment to **Google Cloud Run** with sub-second cold starts.

---

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx             # Root layout (Inter, JetBrains Mono, dark canvas)
│   ├── page.tsx               # Executive landing narrative
│   ├── work/page.tsx          # Dedicated Case Studies & Builder Arsenal
│   ├── about/page.tsx         # 3-Stage Evolution, MIT Manipal DSP background, Skills Matrix
│   ├── blog/                  # Technical Papers catalog & dynamic reader ([slug])
│   ├── admin/blogs/page.tsx   # Super Admin Dynamic Studio & Medium Hub
│   └── api/                   # Route Handlers (auth, blogs, upload, medium)
├── components/                # Modular React 19 UI components
├── lib/                       # Prisma client, auth session, Medium client, and data
├── prisma/                    # PostgreSQL schema & seed script
├── public/uploads/            # Uploaded media assets
├── Dockerfile                 # Multi-stage standalone build for Google Cloud Run
└── docker-compose.yml         # Local orchestration (Next.js app + PostgreSQL)
```

---

## ⚡ Quick Start (Local Development)

### Option 1: Native Node.js
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Access the platform
# Open http://localhost:3000 in your browser
# Access Super Admin Studio at http://localhost:3000/admin/blogs (Passcode: admin)
```

### Option 2: Docker Compose
```bash
# Build and launch Next.js full-stack app + PostgreSQL
docker compose up --build
```

---

## 🚢 Google Cloud Run Deployment

The project includes an optimized multi-stage standalone `Dockerfile`:
```bash
# Build the container image
docker build -t gcr.io/[PROJECT-ID]/portfolio-platform .

# Deploy to Google Cloud Run
gcloud run deploy portfolio-platform \
  --image gcr.io/[PROJECT-ID]/portfolio-platform \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=[YOUR_POSTGRES_URL],ADMIN_PASSWORD=[YOUR_SECRET]
```
