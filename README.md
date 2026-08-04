
# BuildMyIdea
BuildMyIdea is a modern, high-performance marketplace platform that connects early stage startup founders with developers. It provides a secure environment to post tech projects, collaborate, and manage multi-developer bounty payouts via an integrated escrow system, or negotiate equity splits. 

---

## System architecture

![Alt text](assets/architecture.png) 

## Key Features

* **Secure Bounty Escrow (Razorpay Route):** Creators fund projects upfront. Funds are securely held in escrow until a winning submission is selected.
* **Team Submissions & Split Payouts:** Developers can submit work solo or as a team (up to 4 members). The backend automatically calculates contribution percentages and distributes funds to multiple bank accounts using background workers.
* **AI Semantic Search:** Powered by OpenAI embeddings and Postgres `pgvector`. Search doesn't just look for keywords; it understands the *meaning* of the project and developer skills to find the perfect match.
* **Real-Time WebSockets:** Live, persistent connections via Redis Pub/Sub for instant chat messaging and platform notifications.
* **Asynchronous Background Jobs:** Heavy tasks (like generating AI embeddings or processing multi-account financial transfers) are offloaded to **BullMQ** workers to keep the API lightning fast.

## Tech Stack

### Frontend (apps/frontend)

* Next.js
* ShadCN UI
* TanStack Table
* React Hook Form
* Sonner
* Razorpay Checkout SDK

### Backend (apps/http-backend & ws & workers)

* Express.js
* Passport.js OAuth & JWT (Cookie-based Authentication)
* ws (Native WebSockets)
* BullMQ (Job Queues)
* Razorpay Node SDK
* Embedding Model

### Database & Infrastructure (packages/* & docker/*)

* PostgreSQL (hosted on Neon Serverless DB)
* Prisma ORM (with pgvector extension)
* Redis / IORedis (Pub/Sub & Queues)
* Docker

---

## Monorepo Structure

```bash
BuildMyIdea/
│
├── apps/
│   ├── frontend/            # Next.js frontend
│   ├── backend/             # Express backend
│   ├── websockets/          # Express backend
│   ├── worker-payouts/      # Payments Background Worker
│   └── worker-embeddings/   # Embeddings Background Worker
│
├── packages/
│   ├── db/              # Prisma schema + Prisma Client
│   ├── common/          # Shared Zod schemas / Types
│   ├── redis/           # Shared Redis
│   └── redis/           # Shared Embeddings
│
├── docker/*             # dockerfiles
└── docker-compose.yml

```

---

## Setup

### 1. Clone Repository & Install

```bash
git clone https://github.com/Talha9509/BuildMyIdea.git
cd BuildMyIdea
pnpm install
```

### 2. Setup Environment Variables

Create `.env` files in required apps/packages.

Example:

```env
# Frontend
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"   
BACKEND_URL="http://localhost:3001"    (For calling backend in docker, use: http://backend:3001)

# Database & Redis
DATABASE_URL="postgresql://user:password@host:port/neondb"
REDIS_URL="redis://localhost:6379"

# Security
JWT_SECRET="your_super_secret_string"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
FRONTEND="http://localhost:3000"

# External APIs
OPENAI_API_KEY="sk-..."
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

### 3. Run Prisma Migrations

```bash
cd packages/db
npx prisma migrate dev
```

### 4. Run using 

### i. Docker

```bash
docker-compose --env-file .env up
```

### ii. without Docker

#### Build Shared Packages

```bash
pnpm run build
```

---

#### Start Development Servers

```bash
pnpm run dev
```

---

## Future Improvements

* Project Status Tracking
* Reviews / Ratings

---

## Author

**Mohd Abdul Wasay Talha**

---

## License

MIT


