# MS Paint Web

A Windows 95 MS Paint inspired app built with React, featuring retro styling and classic painting functionality, with a modern twist of being able to easily share your creations via short URLs.

![MS Paint Web](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![React95](https://img.shields.io/badge/React95-4.0.0-teal)

## Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.14** - Build tool (using Rolldown)
- **React95 4.0.0** - Windows 95 UI components
- **Styled Components 6.1.19** - CSS-in-JS styling
- **HTML5 Canvas API** - Drawing functionality
- **lz-string** - URL compression

### Backend
- **Vercel Serverless Functions** - API endpoints
- **Redis** - URL storage with 30-day expiration (via Vercel Marketplace)
- **TypeScript** - Type-safe serverless functions

## Development

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

Outputs to `dist/` directory

### Lint

```bash
npm run lint
```

## Deployment

This project is deployed on Vercel with automatic deployments on every push to `main`.

### Vercel Setup

1. **Install Vercel CLI** (optional, for local development)
   ```bash
   npm install -g vercel
   ```

2. **Link Project to Vercel**
   ```bash
   vercel link
   ```

3. **Create Redis Database**
   - Go to Vercel Dashboard → Storage → Create Database
   - Select "Redis"
   - Name it (e.g., `ms-paint-urls`)
   - Connect to your project
   - Environment variable `REDIS_URL` is auto-configured

4. **Deploy**
   - Push to `main` branch for automatic deployment
   - Or manually deploy: `vercel --prod`

### Local Development with Vercel Functions

```bash
vercel dev
```

This starts both the Vite dev server and simulates Vercel serverless functions locally.

### Environment Variables

Redis automatically sets this when you connect the database via Vercel Marketplace:
- `REDIS_URL` - Redis connection string (e.g., `redis://default:password@host:port`)

## Project Structure

```
ms-paint-web/
├── api/                 # Vercel serverless functions
│   ├── shorten.ts       # POST /api/shorten - create short URL
│   └── [id].ts          # GET /[id] - redirect to long URL
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```
