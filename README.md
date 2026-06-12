
# BuildMyIdea
BuildMyIdea is a platform where users can post any AI, Software, App ideas and developers can browse, submit solutions, and collaborate to build them.

---

## System architecture

![Alt text](assets/architecture.png)

## Tech Stack

### Frontend

* Next.js
* ShadCN UI
* TanStack Table
* React Hook Form
* Sonner

### Backend

* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Passport.js OAuth
* Redis Pub/Sub
* Docker

---

## Monorepo Structure

```bash
BuildMyIdea/
│
├── apps/
│   ├── frontend/        # Next.js frontend
│   ├── backend/         # Express backend
│   └── websockets/      # WebSockets backend
│
├── packages/
│   ├── db/              # Prisma schema + Prisma Client
│   ├── common/          # Shared Zod schemas / Types
│   └── redis/           # Shared Redis
└── docker-compose.yml
```

---

## Features

### Authentication

* Email / Password Login
* Google OAuth
* GitHub OAuth

### User Roles

* Idea Creator
* Developer

### Projects

* Post New Project Ideas
* Edit / Delete Projects
* Browse All Projects
* View Project Details

### Submissions

* Developers Submit Project Solutions
* GitHub / Live Demo Links
* Prevent Duplicate Submissions

### Profile

* Public Profile Pages
* Role Switching with Validation
* View Posted Projects / Submitted Projects

---

## Setup

### Using Docker

```bash
docker-compose --env-file .env up
```
---

### Manual Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd BuildMyIdea
```

---

### 2. Install Dependencies

```bash
pnpm install
```

---

### 3. Setup Environment Variables

Create `.env` files in required apps/packages.

Example:

```env
FRONTEND="http://localhost:3000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"   
BACKEND_URL="http://localhost:3001"    (For calling backend in docker, use: http://backend:3001)
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

### 4. Run Prisma Migrations

```bash
cd packages/db
npx prisma migrate dev
```

---

### 5. Build Shared Packages

```bash
pnpm --filter db build
pnpm --filter common build
```

---

### 6. Start Development Servers

```bash
pnpm run dev
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
NODE_ENV=production
```

### OAuth

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## Future Improvements

* Project Status Tracking
* Reviews / Ratings
* Team Collaboration
* Payment / Escrow Support

---

## Author

**Mohd Talha**

---

## License

MIT


