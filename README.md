
# BuildMyIdea
BuildMyIdea is a platform where users can post software/app ideas and developers can browse, submit solutions, and collaborate to build them.

---

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
* JWT Authentication
* Docker

---

## Monorepo Structure

```bash
BuildMyIdea/
│
├── apps/
│   ├── frontend/        # Next.js frontend
│   └── backend/         # Express backend
│
├── packages/
│   ├── db/              # Prisma schema + Prisma Client
│   └── common/          # Shared Zod schemas / Types
│
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
docker-compose up
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
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

### 4. Run Database (Docker)

```bash
docker compose up -d postgres
```

---

### 5. Run Prisma Migrations

```bash
cd packages/db
npx prisma migrate dev
```

---

### 6. Build Shared Packages

```bash
pnpm --filter db build
pnpm --filter common build
```

---

### 7. Start Development Servers

```bash
pnpm dev
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
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

---

## Future Improvements

* Chat / Messaging between Creator and Developer
* Project Status Tracking
* Reviews / Ratings
* Team Collaboration
* Payment / Escrow Support
* AI Project Description Enhancement

---

## Author

**Mohd Talha**

---

## License

MIT


