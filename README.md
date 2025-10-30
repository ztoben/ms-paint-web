# MS Paint Web

A Windows 95 MS Paint inspired app built with React, featuring authentic retro styling and classic painting functionality.

![MS Paint Web](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![React95](https://img.shields.io/badge/React95-4.0.0-teal)

## Live Demo

Deployed on Vercel with URL shortening backend

## Features

### Drawing Tools
- **Pencil** - 1px freehand drawing
- **Brush** - 5px freehand drawing
- **Eraser** - 10px eraser tool
- **Line** - Draw straight lines
- **Rectangle** - Draw rectangles (hold Shift for squares)
- **Circle** - Draw ellipses (hold Shift for perfect circles)
- **Star** - Draw 5-pointed stars
- **Fill Bucket** - Flood fill with selected color

### Selection & Editing
- **Selection Tool** - Select rectangular areas
- **Drag selections** - Move selected areas around the canvas
- **Marching ants animation** - Animated selection outline
- **Copy/Cut/Paste** - Full clipboard support
- **Select All** - Quick selection of entire canvas
- **Floating selections** - Selections remain non-destructive until deselected

### History
- **Undo/Redo** - Full history management (50 states)
- **Keyboard shortcuts** - Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+Shift+Z (redo)

### File Operations
- **New** - Create new blank canvas
- **Open** - Load images from your computer
- **Save** - Download canvas as PNG
- **Print** - Print canvas contents

### Color Management
- **20 preset colors** - Common paint colors in 2x10 grid
- **Custom color picker** - HTML5 color picker for any color
- **Current color display** - Visual indicator of selected color

### Window Management
- **Draggable window** - Move the paint window around
- **Resizable window** - Adjust window size with handle
- **Resizable canvas** - Adjust canvas size independently
- **Fullscreen mode** - Maximize/restore button and double-click header
- **Boundary constraints** - Window stays within viewport

### Persistence
- **LocalStorage** - Saves window position, size, and canvas contents
- **Auto-restore** - Automatically restores your last session

### Sharing
- **Share button** - Generate short URLs to share your drawings
- **URL shortening** - Built-in backend service creates short, shareable links
- **Persistent storage** - Shared links expire after 30 days

### Keyboard Shortcuts
- `Ctrl+Z` - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` - Redo
- `Ctrl+C` - Copy selection
- `Ctrl+X` - Cut selection
- `Ctrl+V` - Paste
- `Ctrl+A` - Select all
- `Delete` - Clear selection

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

## Implementation Details

### Canvas Drawing
- Uses HTML5 Canvas 2D context for all drawing operations
- Snapshot pattern for shape tool previews
- ImageData API for history management and clipboard operations

### Selection System
- Separate overlay canvas for non-destructive selection display
- `requestAnimationFrame` for marching ants animation
- Floating selections that don't affect canvas until committed

### State Management
- React hooks (useState, useRef, useEffect)
- Refs for performance-critical data (history, canvas context)
- LocalStorage for persistence

## License

MIT

## Author

Zach Toben
