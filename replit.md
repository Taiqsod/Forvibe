# forvibe

## Overview

forvibe is a creative web playground featuring casual mini-games and utility tools. The application provides a relaxing digital space with games like "Click Mania" and "Glyph Match" with leaderboard functionality, plus creative tools including a fancy text generator and AI chatbot. Built as a full-stack TypeScript application with React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite with HMR support

The frontend follows a pages-based structure under `client/src/pages/` with reusable components in `client/src/components/`. Custom hooks handle data fetching (`use-scores.ts`) and UI state (`use-toast.ts`, `use-mobile.tsx`).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod validation
- **AI Integration**: OpenAI-compatible API via Replit AI Integrations for chat and image generation

The server uses a modular structure with separate files for routes, storage (database operations), and static file serving. The `server/replit_integrations/` directory contains AI-powered features including chat, image generation, and batch processing utilities.

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle database schema definitions with Zod validation schemas
- `routes.ts`: API route definitions with type-safe request/response contracts

### Database Schema
- **scores**: Game leaderboard entries (id, gameName, score, playerName, createdAt)
- **conversations**: AI chat sessions (id, title, createdAt)
- **messages**: Chat messages within conversations (id, conversationId, role, content, createdAt)

### Build System
- Development: Vite dev server with Express backend via `tsx`
- Production: Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `./migrations/`

### AI Services
- **OpenAI-compatible API**: Chat completions and image generation via Replit AI Integrations
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Key NPM Packages
- **UI**: Radix UI primitives, shadcn/ui components, Lucide icons
- **Data**: TanStack React Query, Drizzle ORM, Zod validation
- **Effects**: canvas-confetti for celebrations, date-fns for formatting
- **Server**: Express, connect-pg-simple for sessions