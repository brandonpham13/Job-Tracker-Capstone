# Job Application Tracker

A web app for tracking job and internship applications, the skills they require, and the people you meet along the way.

## Overview

Job hunting involves juggling a lot of moving pieces: open applications, recurring skill requirements, and a growing network of contacts. This app centralizes that information so users can see patterns across their applications (e.g. which skills show up most often) and keep their networking organized.

## Planned Features

### Account Creation (User Auth)
- Users can sign up, log in, and manage their own private data.

### Jobs / Internships
- Create and track job and internship applications.
- Store details relevant to each application (company, role, status, etc.).

### Skills
- Create skills and associate them with specific jobs or internships.
- See which applications require which skills.
- View frequency insights across applications (e.g. *"Docker is noted in 60% of your applications"*).
- Track personal comfort level with each skill to identify areas to improve.

### Contacts
- Track networking contacts and their information.
- Link contacts to the jobs or companies they're associated with.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) running locally
- A [Clerk](https://dashboard.clerk.com/) account (for authentication keys)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Job\ Tracker
```

### 2. Install dependencies

```bash
npm install
cd server && npm install
```

### 3. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp server/.env.example .env
```

Edit `.env` with your values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `CLERK_PUBLISHABLE_KEY` | Publishable key from [Clerk Dashboard → API Keys](https://dashboard.clerk.com/) |
| `CLERK_SECRET_KEY` | Secret key from Clerk Dashboard |

### 4. Set up the database

```bash
cd server
npx prisma migrate dev
```

### 5. Start the app

From the project root:

```bash
npm run dev
```

The server (and client) will be available at **http://localhost:3000**.

## Project Structure

```
.
├── client/        # Static HTML/JS/CSS front-end
│   ├── index.html # Sign-in landing page
│   ├── pages/     # App pages (applications, contacts, skills, trends)
│   ├── scripts/   # Client-side JavaScript (auth, etc.)
│   └── styles/    # CSS
├── server/        # Express API + Prisma ORM
│   ├── prisma/    # Schema and migrations
│   └── src/       # TypeScript source (routes, services, middleware)
└── .env           # Environment variables (not committed)
```
