# Tax Manager

A web app for managing taxes, built with Next.js.

**Live app:** [ledger-plum-seven.vercel.app](https://ledger-plum-seven.vercel.app)

## Tech Stack

- **[Next.js](https://nextjs.org/)** — React framework using the App Router
- **[shadcn/ui](https://ui.shadcn.com/)** — accessible UI components built on Radix and Tailwind CSS
- **[pnpm](https://pnpm.io/)** — package manager
- **[Vercel](https://vercel.com/)** — hosting and deployment

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (18.18 or later)
- [pnpm](https://pnpm.io/installation)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd tax-manager

# Install dependencies
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
# Create a production build
pnpm build

# Run the production build locally
pnpm start
```

## Project Structure

```
tax-manager/
├── app/          # Routes, layouts, and pages (Next.js App Router)
├── components/   # Reusable UI components, including shadcn/ui
└── lib/          # Utilities, helpers, and shared logic
```

- **`app/`** — Route segments, layouts, and pages. Each folder maps to a route.
- **`components/`** — Shared React components. shadcn/ui components live here (typically under `components/ui/`).
- **`lib/`** — Framework-agnostic helpers, data utilities, and shared configuration.

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). To add a component:

```bash
pnpm dlx shadcn@latest add <component-name>
```

For example, `pnpm dlx shadcn@latest add button` adds the Button component to `components/ui/`.

## Deployment

The app is deployed on [Vercel](https://vercel.com/) at [ledger-plum-seven.vercel.app](https://ledger-plum-seven.vercel.app).

Pushes to the main branch deploy automatically. Pull requests get their own preview deployments.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run the linter |
