# MS Paint Web

A Windows 95 MS Paint clone built with React, featuring authentic retro styling and classic painting functionality.

![MS Paint Web](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![React95](https://img.shields.io/badge/React95-4.0.0-teal)

## Live Demo

[https://ztoben.github.io/ms-paint-web/](https://ztoben.github.io/ms-paint-web/)

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

### Keyboard Shortcuts
- `Ctrl+Z` - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` - Redo
- `Ctrl+C` - Copy selection
- `Ctrl+X` - Cut selection
- `Ctrl+V` - Paste
- `Ctrl+A` - Select all
- `Delete` - Clear selection

## Tech Stack

- **React 19.1.1** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.14** - Build tool (using Rolldown)
- **React95 4.0.0** - Windows 95 UI components
- **Styled Components 6.1.19** - CSS-in-JS styling
- **HTML5 Canvas API** - Drawing functionality

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

This project automatically deploys to GitHub Pages on every push to the `main` branch using GitHub Actions.

### Workflow
1. Push changes to `main` branch
2. GitHub Action builds the project
3. Deploys to GitHub Pages
4. Available at https://ztoben.github.io/ms-paint-web/

## Project Structure

```
ms-paint-web/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
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
