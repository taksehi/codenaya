# CodeNaya

A Next.js application built with Convex, Clerk, Inngest, and various AI providers.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Bun](https://bun.sh/) (The project uses `bun.lock`)

## Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the repository

```bash
git clone <repository-url>
cd codenaya
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up Environment Variables

Copy the `.env.example` file to create a local `.env.local` file.

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and fill in the missing API keys for:

- **Clerk:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, etc.
- **AI Providers:** `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
- **Firecrawl:** `FIRECRAWL_API_KEY`

### 4. Set up Convex (Database & Backend)

Initialize your Convex backend. This command will log you into Convex, create a new project on your dashboard, and automatically inject your Convex environment variables (`CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`) into your `.env.local` file.

```bash
bunx convex dev
```

You can keep this terminal running, or close it if you'd prefer to use the unified start command below.

### 5. Run the Development Server

The application relies on Next.js, Convex, and Inngest to be running simultaneously. We have a unified script in `package.json` that runs all three together.

```bash
bun run load
```

_This single command will execute `next dev`, `inngest-cli dev`, and `convex dev` in parallel._

### 6. View the Application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
