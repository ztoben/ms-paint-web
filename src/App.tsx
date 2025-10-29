import { useState, useRef, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'
import original from 'react95/dist/themes/original'
import { styleReset, MenuList, MenuListItem, Separator, Frame, Button } from 'react95'
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2'
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2'
import styled from 'styled-components'

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  body, html {
    font-family: 'ms_sans_serif';
    background: ${({ theme }) => theme.desktopBackground};
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
  * {
    box-sizing: border-box;
  }
`

const AppContainer = styled.div<{ $isFullscreen?: boolean }>`
  padding: ${({ $isFullscreen }) => $isFullscreen ? '0' : '20px'};
  height: 100vh;
  width: 100vw;
  max-height: 100vh;
  max-width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
`

const WindowContainer = styled.div<{ $width: number; $height: number; $x: number; $y: number; $isFullscreen?: boolean }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  position: absolute;
  left: ${({ $x }) => $x}px;
  top: ${({ $y }) => $y}px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.material};
  box-shadow: ${({ $isFullscreen, theme }) => $isFullscreen ? 'none' : theme.boxShadow};
  border: ${({ $isFullscreen, theme }) => $isFullscreen ? 'none' : `2px solid ${theme.borderDarkest}`};
`

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  background: ${({ theme }) => theme.material};
  border-left: 2px solid ${({ theme }) => theme.borderLightest};
  border-top: 2px solid ${({ theme }) => theme.borderLightest};
  border-right: 2px solid ${({ theme }) => theme.borderDark};
  border-bottom: 2px solid ${({ theme }) => theme.borderDark};

  &:after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 46%,
      ${({ theme }) => theme.borderDark} 46%,
      ${({ theme }) => theme.borderDark} 54%,
      transparent 54%
    );
  }
`

const TitleBar = styled.div<{ $isFullscreen?: boolean }>`
  background: linear-gradient(to right, #000080, #1084d0);
  color: white;
  padding: 2px 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: ${({ $isFullscreen }) => $isFullscreen ? 'default' : 'move'};
  user-select: none;
`

const TitleBarButtons = styled.div`
  display: flex;
  gap: 2px;
`

const TitleBarButton = styled(Button)`
  width: 16px;
  height: 14px;
  padding: 0;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CloseButton = styled(TitleBarButton)``
const MaximizeButton = styled(TitleBarButton)``

const MenuBar = styled.div`
  background: ${({ theme }) => theme.material};
  border-bottom: 2px solid ${({ theme }) => theme.borderDark};
  padding: 2px 4px;
  display: flex;
  gap: 8px;
`

const MenuItemWrapper = styled.div`
  position: relative;
`

const MenuItem = styled.div<{ $active?: boolean }>`
  padding: 2px 8px;
  cursor: pointer;
  background: ${({ $active, theme }) => $active ? theme.hoverBackground : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.hoverBackground};
  }
`

const DropdownMenu = styled(MenuList)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 150px;
`

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`

const ToolPanel = styled(Frame)`
  width: 60px;
  margin: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-content: start;
`

const UndoRedoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.borderDark};
`

const ToolGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
`

const ToolButton = styled.button<{ $selected?: boolean }>`
  width: 24px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: #c0c0c0;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;

  ${({ $selected }) => $selected ? `
    box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
  ` : `
    box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
  `}

  &:active {
    ${({ $selected }) => !$selected && `
      box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080;
    `}
  }
`

const UndoRedoButton = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`

const CanvasContainer = styled.div`
  flex: 1;
  margin: 4px;
  padding: 4px;
  overflow: auto;
  background: ${({ theme }) => theme.canvas};
  position: relative;
`

const CanvasWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const Canvas = styled.canvas<{ $cursor?: string }>`
  border: 1px solid ${({ theme }) => theme.borderDark};
  background: white;
  cursor: ${({ $cursor }) => $cursor || 'crosshair'};
  display: block;
`

const SelectionCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  display: block;
`

const CanvasResizeHandle = styled.div`
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 12px;
  height: 12px;
  cursor: nwse-resize;
  background: white;
  border: 1px solid ${({ theme }) => theme.borderDark};

  &:after {
    content: '';
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 6px;
    height: 6px;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 46%,
      ${({ theme }) => theme.borderDark} 46%,
      ${({ theme }) => theme.borderDark} 54%,
      transparent 54%
    );
  }
`

const ColorPalette = styled(Frame)`
  margin: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ColorPaletteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 20px);
  gap: 2px;
`

const ColorBox = styled.div<{ $color: string; $active?: boolean }>`
  width: 20px;
  height: 20px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active, theme }) => $active ? theme.borderDarkest : theme.borderLightest};
  cursor: pointer;

  &:hover {
    border: 2px solid ${({ theme }) => theme.borderDark};
  }
`

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const ColorPickerLabel = styled.span`
  font-size: 11px;
`

const ColorPickerInput = styled.input`
  width: 60px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.borderDark};
  cursor: pointer;
`

const CurrentColorDisplay = styled.div<{ $color: string }>`
  width: 40px;
  height: 24px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.borderDarkest};
`

const colors = [
  // Row 1
  '#000000', '#FFFFFF', '#808080', '#C0C0C0', '#800000', '#FF0000', '#808000', '#FFFF00', '#008000', '#00FF00',
  // Row 2
  '#008080', '#00FFFF', '#000080', '#0000FF', '#800080', '#FF00FF', '#FFA500', '#A52A2A', '#FFC0CB', '#FFD700'
]

const tools = [
  { id: 'pencil', icon: '✏️', label: 'Pencil' },
  { id: 'brush', icon: '🖌️', label: 'Brush' },
  { id: 'fill', icon: '🪣', label: 'Fill' },
  { id: 'eraser', icon: '🧹', label: 'Eraser' },
  { id: 'line', icon: '/', label: 'Line' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle' },
  { id: 'circle', icon: '○', label: 'Circle' },
  { id: 'star', icon: '★', label: 'Star' },
  { id: 'picker', icon: '💧', label: 'Color Picker' },
  { id: 'zoom', icon: '🔍', label: 'Magnifier' },
  { id: 'select', icon: '⬚', label: 'Select' },
]

function App() {
  const [activeTool, setActiveTool] = useState('pencil')
  const [selectedTool, setSelectedTool] = useState('pencil')
  const [activeColor, setActiveColor] = useState('#000000')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
  const [windowSize, setWindowSize] = useState(() => {
    const saved = localStorage.getItem('ms-paint-window-size')
    if (saved) {
      return JSON.parse(saved)
    }
    return { width: 1200, height: 800 }
  })
  const [windowPos, setWindowPos] = useState(() => {
    const saved = localStorage.getItem('ms-paint-window-pos')
    if (saved) {
      return JSON.parse(saved)
    }
    const x = Math.max(0, (window.innerWidth - 1200) / 2)
    const y = Math.max(0, (window.innerHeight - 800) / 2)
    return { x, y }
  })
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [isResizingWindow, setIsResizingWindow] = useState(false)
  const [isResizingCanvas, setIsResizingCanvas] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [clipboard, setClipboard] = useState<ImageData | null>(null)
  const [dashOffset, setDashOffset] = useState(0)
  const [isDraggingSelection, setIsDraggingSelection] = useState(false)
  const [selectionImageData, setSelectionImageData] = useState<ImageData | null>(null)
  const [canvasCursor, setCanvasCursor] = useState('crosshair')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const snapshotRef = useRef<ImageData | null>(null)
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null)
  const dragStartRef = useRef<{ x: number; y: number; windowX: number; windowY: number } | null>(null)
  const historyRef = useRef<ImageData[]>([])
  const historyIndexRef = useRef<number>(-1)
  const canvasResizeImageRef = useRef<ImageData | null>(null)
  const preFullscreenStateRef = useRef<{ width: number; height: number; x: number; y: number } | null>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)

  // Animate marching ants for selection
  useEffect(() => {
    if (!selection) return

    let animationId: number
    const animate = () => {
      setDashOffset((prev) => (prev + 0.5) % 10)
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [selection])

  // Draw selection overlay
  useEffect(() => {
    const selectionCanvas = selectionCanvasRef.current
    if (!selectionCanvas) return

    const ctx = selectionCanvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height)

    // If no selection, just clear and return
    if (!selection) return

    // Draw marching ants selection
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.lineDashOffset = -dashOffset
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)

    // Draw white dashes offset by half
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineDashOffset = -dashOffset - 5
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
  }, [selection, dashOffset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.lineCap = 'round'
    context.lineJoin = 'round'
    contextRef.current = context

    // Try to load saved canvas from localStorage
    const savedCanvas = localStorage.getItem('ms-paint-canvas')
    if (savedCanvas) {
      const img = new Image()
      img.onload = () => {
        context.drawImage(img, 0, 0)
        // Save to history after loading
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        historyRef.current = [imageData]
        historyIndexRef.current = 0
      }
      img.src = savedCanvas
    } else {
      // Save initial blank canvas to history
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      historyRef.current = [imageData]
      historyIndexRef.current = 0
    }
  }, [canvasSize])

  // Save window size to localStorage
  useEffect(() => {
    localStorage.setItem('ms-paint-window-size', JSON.stringify(windowSize))
  }, [windowSize])

  // Save window position to localStorage
  useEffect(() => {
    localStorage.setItem('ms-paint-window-pos', JSON.stringify(windowPos))
  }, [windowPos])


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        copySelection()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault()
        cutSelection()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        pasteSelection()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        selectAll()
      } else if (e.key === 'Delete' && selection) {
        e.preventDefault()
        cutSelection()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selection, clipboard])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y

        // Calculate new position
        let newX = dragStartRef.current.windowX + deltaX
        let newY = dragStartRef.current.windowY + deltaY

        // Apply boundary constraints to keep entire window on screen
        // Prevent left edge from going off screen
        newX = Math.max(newX, 0)
        // Prevent right edge from going off screen
        newX = Math.min(newX, window.innerWidth - windowSize.width)
        // Prevent top edge from going off screen
        newY = Math.max(newY, 0)
        // Prevent bottom edge from going off screen
        newY = Math.min(newY, window.innerHeight - windowSize.height)

        setWindowPos({ x: newX, y: newY })
      } else if (isResizingWindow && resizeStartRef.current) {
        const deltaX = e.clientX - resizeStartRef.current.x
        const deltaY = e.clientY - resizeStartRef.current.y
        const newWidth = Math.max(250, resizeStartRef.current.width + deltaX)
        const newHeight = Math.max(250, resizeStartRef.current.height + deltaY)
        setWindowSize({ width: newWidth, height: newHeight })
      } else if (isResizingCanvas && resizeStartRef.current) {
        const deltaX = e.clientX - resizeStartRef.current.x
        const deltaY = e.clientY - resizeStartRef.current.y
        const newWidth = Math.max(50, resizeStartRef.current.width + deltaX)
        const newHeight = Math.max(50, resizeStartRef.current.height + deltaY)
        setCanvasSize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      // Restore canvas content after resizing
      if (isResizingCanvas && canvasResizeImageRef.current) {
        const context = contextRef.current
        if (context) {
          context.putImageData(canvasResizeImageRef.current, 0, 0)
          canvasResizeImageRef.current = null
        }
      }

      setIsDragging(false)
      setIsResizingWindow(false)
      setIsResizingCanvas(false)
      resizeStartRef.current = null
      dragStartRef.current = null
    }

    if (isDragging || isResizingWindow || isResizingCanvas) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizingWindow, isResizingCanvas, windowSize.width, windowSize.height])

  const startResizingWindow = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingWindow(true)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height
    }
  }

  const startResizingCanvas = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizingCanvas(true)
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: canvasSize.width,
      height: canvasSize.height
    }

    // Save current canvas content before resizing
    const context = contextRef.current
    if (context) {
      canvasResizeImageRef.current = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    }
  }

  const startDragging = (e: React.MouseEvent) => {
    // Don't allow dragging when fullscreen
    if (isFullscreen) return

    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      windowX: windowPos.x,
      windowY: windowPos.y
    }
  }

  const handleClose = () => {
    // Try to close the window
    window.close()
    // If window.close() doesn't work (in some browsers), show a message
    setTimeout(() => {
      alert('Please close this window/tab manually.')
    }, 100)
  }

  const printImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create a new window with the canvas image
    const dataUrl = canvas.toDataURL('image/png')
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print - Paint</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      // Exit fullscreen - restore previous state
      if (preFullscreenStateRef.current) {
        setWindowSize({
          width: preFullscreenStateRef.current.width,
          height: preFullscreenStateRef.current.height
        })
        setWindowPos({
          x: preFullscreenStateRef.current.x,
          y: preFullscreenStateRef.current.y
        })
        preFullscreenStateRef.current = null
      }
      setIsFullscreen(false)
    } else {
      // Enter fullscreen - save current state and maximize
      preFullscreenStateRef.current = {
        width: windowSize.width,
        height: windowSize.height,
        x: windowPos.x,
        y: windowPos.y
      }
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setWindowPos({ x: 0, y: 0 })
      setIsFullscreen(true)
    }
  }

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }

  const saveImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'paint-drawing.png'
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  const loadImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const context = contextRef.current
          if (!context) return

          // Clear canvas
          context.clearRect(0, 0, context.canvas.width, context.canvas.height)

          // Draw image on canvas
          context.drawImage(img, 0, 0)

          // Save to history
          saveToHistory()
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  const newImage = () => {
    const context = contextRef.current
    if (!context) return

    const confirmClear = window.confirm('Create a new image? This will clear your current drawing.')
    if (confirmClear) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      saveToHistory()
    }
  }

  const saveToHistory = () => {
    const context = contextRef.current
    if (!context) return

    const canvas = context.canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // Remove any history after current index (for when we undo then draw something new)
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)

    // Add new state to history
    historyRef.current.push(imageData)
    historyIndexRef.current++

    // Limit history to 50 states to prevent memory issues
    if (historyRef.current.length > 50) {
      historyRef.current.shift()
      historyIndexRef.current--
    }

    // Save to localStorage
    const dataURL = canvas.toDataURL('image/png')
    localStorage.setItem('ms-paint-canvas', dataURL)
  }

  const undo = () => {
    if (historyIndexRef.current <= 0) return

    historyIndexRef.current--
    const context = contextRef.current
    if (!context) return

    const imageData = historyRef.current[historyIndexRef.current]
    if (imageData) {
      context.putImageData(imageData, 0, 0)
      // Save to localStorage
      const dataURL = context.canvas.toDataURL('image/png')
      localStorage.setItem('ms-paint-canvas', dataURL)
    }
  }

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return

    historyIndexRef.current++
    const context = contextRef.current
    if (!context) return

    const imageData = historyRef.current[historyIndexRef.current]
    if (imageData) {
      context.putImageData(imageData, 0, 0)
      // Save to localStorage
      const dataURL = context.canvas.toDataURL('image/png')
      localStorage.setItem('ms-paint-canvas', dataURL)
    }
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const isPointInSelection = (x: number, y: number): boolean => {
    if (!selection) return false
    return (
      x >= selection.x &&
      x <= selection.x + selection.width &&
      y >= selection.y &&
      y <= selection.y + selection.height
    )
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)

    // Check if clicking inside an existing selection
    if (selection && isPointInSelection(pos.x, pos.y)) {
      // Start dragging the selection
      setIsDraggingSelection(true)
      setStartPos(pos)

      const context = contextRef.current
      if (!context) return

      // If selection hasn't been extracted yet (first drag), extract it
      if (!selectionImageData) {
        // This is the first time dragging - extract the selection
        const imageData = context.getImageData(
          Math.round(selection.x),
          Math.round(selection.y),
          Math.round(selection.width),
          Math.round(selection.height)
        )
        setSelectionImageData(imageData)

        // Clear the area where the selection was
        context.fillStyle = '#FFFFFF'
        context.fillRect(
          Math.round(selection.x),
          Math.round(selection.y),
          Math.round(selection.width),
          Math.round(selection.height)
        )
      } else {
        // Selection was already extracted - just clear current position before dragging
        context.fillStyle = '#FFFFFF'
        context.fillRect(
          Math.round(selection.x),
          Math.round(selection.y),
          Math.round(selection.width),
          Math.round(selection.height)
        )
      }

      // Save snapshot of canvas state (with selection area cleared) for drawing during drag
      snapshotRef.current = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
      return
    }

    // If clicking outside selection, commit and clear it
    if (selection && !isPointInSelection(pos.x, pos.y)) {
      // Commit the selection if it exists
      if (selectionImageData) {
        const context = contextRef.current
        if (context) {
          context.putImageData(selectionImageData, Math.round(selection.x), Math.round(selection.y))
          saveToHistory()
        }
      }
      // Clear selection state
      setSelection(null)
      setSelectionImageData(null)
      setCanvasCursor('crosshair')
    }

    // Auto-clear selection when using non-selection drawing tools
    if (selection && activeTool !== 'select' && ['pencil', 'brush', 'eraser', 'line', 'rectangle', 'circle', 'star', 'fill'].includes(activeTool)) {
      // Commit selection if it was being dragged
      if (selectionImageData) {
        const context = contextRef.current
        if (context) {
          context.putImageData(selectionImageData, Math.round(selection.x), Math.round(selection.y))
          saveToHistory()
        }
      }
      setSelection(null)
      setSelectionImageData(null)
      setCanvasCursor('crosshair')
    }

    setIsDrawing(true)
    setStartPos(pos)

    const context = contextRef.current
    if (!context) return

    // Save snapshot for shape tools and selection
    if (['line', 'rectangle', 'circle', 'star', 'select'].includes(activeTool)) {
      snapshotRef.current = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
    }

    context.strokeStyle = activeColor
    context.fillStyle = activeColor

    if (activeTool === 'pencil') {
      context.lineWidth = 1
      context.beginPath()
      context.moveTo(pos.x, pos.y)
    } else if (activeTool === 'brush') {
      context.lineWidth = 5
      context.beginPath()
      context.moveTo(pos.x, pos.y)
    } else if (activeTool === 'eraser') {
      context.lineWidth = 10
      context.strokeStyle = '#FFFFFF'
      context.beginPath()
      context.moveTo(pos.x, pos.y)
    } else if (['line', 'rectangle', 'circle', 'star'].includes(activeTool)) {
      // Set default line width for shape tools
      context.lineWidth = 1
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e)
    lastPosRef.current = pos

    // Handle dragging selection
    if (isDraggingSelection && selection && startPos && selectionImageData) {
      const deltaX = pos.x - startPos.x
      const deltaY = pos.y - startPos.y

      const newX = selection.x + deltaX
      const newY = selection.y + deltaY

      // Update selection position
      setSelection({
        x: newX,
        y: newY,
        width: selection.width,
        height: selection.height
      })
      setStartPos(pos)

      // Draw the selection image at new position for visual feedback
      const context = contextRef.current
      if (context && snapshotRef.current) {
        // Restore canvas to blank state (selection area was already cleared)
        context.putImageData(snapshotRef.current, 0, 0)
        // Draw selection at new position
        context.putImageData(selectionImageData, Math.round(newX), Math.round(newY))
      }
      return
    }

    if (!isDrawing) return

    const context = contextRef.current
    if (!context || !startPos) return

    // Handle selection tool
    if (activeTool === 'select') {
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
      const width = pos.x - startPos.x
      const height = pos.y - startPos.y

      // Draw selection rectangle with dashed border
      context.strokeStyle = '#000000'
      context.lineWidth = 1
      context.setLineDash([5, 5])
      context.strokeRect(startPos.x, startPos.y, width, height)
      context.setLineDash([])
      return
    }

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      context.lineTo(pos.x, pos.y)
      context.stroke()
    } else if (activeTool === 'line') {
      // Restore snapshot and draw line
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
      context.beginPath()
      context.moveTo(startPos.x, startPos.y)
      context.lineTo(pos.x, pos.y)
      context.stroke()
    } else if (activeTool === 'rectangle') {
      // Restore snapshot and draw rectangle
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
      let width = pos.x - startPos.x
      let height = pos.y - startPos.y

      // If shift is held, constrain to square
      if (e.shiftKey) {
        const size = Math.max(Math.abs(width), Math.abs(height))
        width = width >= 0 ? size : -size
        height = height >= 0 ? size : -size
      }

      context.strokeRect(startPos.x, startPos.y, width, height)
    } else if (activeTool === 'circle') {
      // Restore snapshot and draw circle
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
      let width = pos.x - startPos.x
      let height = pos.y - startPos.y

      // If shift is held, constrain to perfect circle
      if (e.shiftKey) {
        const size = Math.max(Math.abs(width), Math.abs(height))
        width = width >= 0 ? size : -size
        height = height >= 0 ? size : -size
      }

      const radiusX = Math.abs(width / 2)
      const radiusY = Math.abs(height / 2)
      const centerX = startPos.x + width / 2
      const centerY = startPos.y + height / 2

      context.beginPath()
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
      context.stroke()
    } else if (activeTool === 'star') {
      // Restore snapshot and draw star
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
      const width = pos.x - startPos.x
      const height = pos.y - startPos.y
      const centerX = startPos.x + width / 2
      const centerY = startPos.y + height / 2
      const radiusX = Math.abs(width / 2)
      const radiusY = Math.abs(height / 2)

      // Draw a 5-pointed star
      context.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const x = centerX + radiusX * Math.cos(angle)
        const y = centerY + radiusY * Math.sin(angle)
        if (i === 0) {
          context.moveTo(x, y)
        } else {
          context.lineTo(x, y)
        }
      }
      context.closePath()
      context.stroke()
    }
  }

  const stopDrawing = () => {
    const context = contextRef.current
    if (!context) return

    // Handle stopping selection drag
    if (isDraggingSelection && selection && selectionImageData) {
      // Draw the selection at its final position (temporary, for display)
      context.putImageData(selectionImageData, Math.round(selection.x), Math.round(selection.y))
      // DO NOT save to history yet - selection is still "floating"
      // Reset dragging state but keep selection active
      setIsDraggingSelection(false)
      setStartPos(null)
      snapshotRef.current = null
      // Don't clear selectionImageData - keep it for potential future drags
      return
    }

    if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      context.closePath()
    }

    // Handle selection tool - save selection area
    if (activeTool === 'select' && isDrawing && startPos && lastPosRef.current) {
      const endPos = lastPosRef.current
      const width = Math.abs(endPos.x - startPos.x)
      const height = Math.abs(endPos.y - startPos.y)
      const x = Math.min(startPos.x, endPos.x)
      const y = Math.min(startPos.y, endPos.y)

      if (width > 5 && height > 5) {
        setSelection({ x, y, width, height })
      }

      // Restore canvas without selection rectangle
      if (snapshotRef.current) {
        context.putImageData(snapshotRef.current, 0, 0)
      }
    }

    // Save to history if something was drawn (but not for selection)
    if (isDrawing && activeTool !== 'select') {
      saveToHistory()
    }

    setIsDrawing(false)
    setStartPos(null)
    snapshotRef.current = null
  }

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const context = contextRef.current
    if (!context) return

    const canvas = context.canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const startPos = (startY * canvas.width + startX) * 4
    const startR = pixels[startPos]
    const startG = pixels[startPos + 1]
    const startB = pixels[startPos + 2]
    const startA = pixels[startPos + 3]

    const fillColorRgb = hexToRgb(fillColor)
    if (!fillColorRgb) return

    // Don't fill if clicking on same color
    if (startR === fillColorRgb.r && startG === fillColorRgb.g && startB === fillColorRgb.b) {
      return
    }

    const stack = [[startX, startY]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (visited.has(key)) continue
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue

      const pos = (y * canvas.width + x) * 4
      const r = pixels[pos]
      const g = pixels[pos + 1]
      const b = pixels[pos + 2]
      const a = pixels[pos + 3]

      if (r === startR && g === startG && b === startB && a === startA) {
        visited.add(key)
        pixels[pos] = fillColorRgb.r
        pixels[pos + 1] = fillColorRgb.g
        pixels[pos + 2] = fillColorRgb.b
        pixels[pos + 3] = 255

        stack.push([x + 1, y])
        stack.push([x - 1, y])
        stack.push([x, y + 1])
        stack.push([x, y - 1])
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'fill') {
      const pos = getMousePos(e)
      floodFill(Math.floor(pos.x), Math.floor(pos.y), activeColor)
      saveToHistory()
    }
  }

  const handleCanvasHover = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Update cursor based on whether hovering over selection
    if (selection && !isDrawing && !isDraggingSelection) {
      const pos = getMousePos(e)
      if (isPointInSelection(pos.x, pos.y)) {
        setCanvasCursor('move')
      } else {
        setCanvasCursor('crosshair')
      }
    } else if (!isDraggingSelection) {
      setCanvasCursor('crosshair')
    }
  }

  const copySelection = () => {
    if (!selection) return
    const context = contextRef.current
    if (!context) return

    const imageData = context.getImageData(
      Math.round(selection.x),
      Math.round(selection.y),
      Math.round(selection.width),
      Math.round(selection.height)
    )
    setClipboard(imageData)
  }

  const cutSelection = () => {
    if (!selection) return
    const context = contextRef.current
    if (!context) return

    // Copy to clipboard
    copySelection()

    // Clear the selected area
    context.fillStyle = '#FFFFFF'
    context.fillRect(
      Math.round(selection.x),
      Math.round(selection.y),
      Math.round(selection.width),
      Math.round(selection.height)
    )

    saveToHistory()
    setSelection(null)
    setSelectionImageData(null)
    setCanvasCursor('crosshair')
  }

  const pasteSelection = () => {
    if (!clipboard) return
    const context = contextRef.current
    if (!context) return

    // Paste at top-left corner or at selection position
    const x = selection ? selection.x : 10
    const y = selection ? selection.y : 10

    context.putImageData(clipboard, Math.round(x), Math.round(y))
    saveToHistory()

    // Create new selection around pasted content
    setSelection({
      x,
      y,
      width: clipboard.width,
      height: clipboard.height
    })
  }

  const clearSelection = () => {
    setSelection(null)
    setCanvasCursor('crosshair')
  }

  const selectAll = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setSelection({
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    })
  }

  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <AppContainer $isFullscreen={isFullscreen}>
        <WindowContainer
          $width={windowSize.width}
          $height={windowSize.height}
          $x={windowPos.x}
          $y={windowPos.y}
          $isFullscreen={isFullscreen}
        >
          <TitleBar
            $isFullscreen={isFullscreen}
            onMouseDown={startDragging}
            onDoubleClick={toggleFullscreen}
          >
            <span>untitled - Paint</span>
            <TitleBarButtons>
              <MaximizeButton
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                title={isFullscreen ? "Restore Down" : "Maximize"}
              >
                {isFullscreen ? '❐' : '□'}
              </MaximizeButton>
              <CloseButton
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                title="Close"
              >
                ✕
              </CloseButton>
            </TitleBarButtons>
          </TitleBar>

          <MenuBar>
            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'file'} onClick={() => toggleMenu('file')}>
                File
              </MenuItem>
              {openMenu === 'file' && (
                <DropdownMenu>
                  <MenuListItem onClick={() => { newImage(); setOpenMenu(null); }}>New</MenuListItem>
                  <MenuListItem onClick={() => { loadImage(); setOpenMenu(null); }}>Open...</MenuListItem>
                  <MenuListItem onClick={() => { saveImage(); setOpenMenu(null); }}>Save</MenuListItem>
                  <MenuListItem onClick={() => { saveImage(); setOpenMenu(null); }}>Save As...</MenuListItem>
                  <Separator />
                  <MenuListItem onClick={() => { printImage(); setOpenMenu(null); }}>Print...</MenuListItem>
                  <Separator />
                  <MenuListItem onClick={() => { handleClose(); setOpenMenu(null); }}>Exit</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'edit'} onClick={() => toggleMenu('edit')}>
                Edit
              </MenuItem>
              {openMenu === 'edit' && (
                <DropdownMenu>
                  <MenuListItem onClick={() => { undo(); setOpenMenu(null); }}>Undo</MenuListItem>
                  <MenuListItem onClick={() => { redo(); setOpenMenu(null); }}>Redo</MenuListItem>
                  <Separator />
                  <MenuListItem onClick={() => { cutSelection(); setOpenMenu(null); }} disabled={!selection}>Cut</MenuListItem>
                  <MenuListItem onClick={() => { copySelection(); setOpenMenu(null); }} disabled={!selection}>Copy</MenuListItem>
                  <MenuListItem onClick={() => { pasteSelection(); setOpenMenu(null); }} disabled={!clipboard}>Paste</MenuListItem>
                  <MenuListItem onClick={() => { clearSelection(); setOpenMenu(null); }} disabled={!selection}>Clear Selection</MenuListItem>
                  <MenuListItem onClick={() => { selectAll(); setOpenMenu(null); }}>Select All</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'view'} onClick={() => toggleMenu('view')}>
                View
              </MenuItem>
              {openMenu === 'view' && (
                <DropdownMenu>
                  <MenuListItem>Tool Box</MenuListItem>
                  <MenuListItem>Color Box</MenuListItem>
                  <MenuListItem>Status Bar</MenuListItem>
                  <Separator />
                  <MenuListItem>Zoom</MenuListItem>
                  <MenuListItem>View Bitmap</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'image'} onClick={() => toggleMenu('image')}>
                Image
              </MenuItem>
              {openMenu === 'image' && (
                <DropdownMenu>
                  <MenuListItem>Flip/Rotate...</MenuListItem>
                  <MenuListItem>Stretch/Skew...</MenuListItem>
                  <MenuListItem>Invert Colors</MenuListItem>
                  <MenuListItem>Attributes...</MenuListItem>
                  <MenuListItem>Clear Image</MenuListItem>
                  <MenuListItem>Draw Opaque</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'options'} onClick={() => toggleMenu('options')}>
                Options
              </MenuItem>
              {openMenu === 'options' && (
                <DropdownMenu>
                  <MenuListItem>Edit Colors...</MenuListItem>
                  <MenuListItem>Get Colors</MenuListItem>
                  <MenuListItem>Save Colors</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'help'} onClick={() => toggleMenu('help')}>
                Help
              </MenuItem>
              {openMenu === 'help' && (
                <DropdownMenu>
                  <MenuListItem>Help Topics</MenuListItem>
                  <Separator />
                  <MenuListItem>About Paint</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>
          </MenuBar>

          <MainContent>
            <ToolPanel variant="outside">
              <UndoRedoSection>
                <UndoRedoButton onClick={(e) => { undo(); (e.target as HTMLButtonElement).blur(); }} title="Undo">↶</UndoRedoButton>
                <UndoRedoButton onClick={(e) => { redo(); (e.target as HTMLButtonElement).blur(); }} title="Redo">↷</UndoRedoButton>
              </UndoRedoSection>
              <ToolGrid>
                {tools.map(tool => (
                  <ToolButton
                    key={tool.id}
                    $selected={selectedTool === tool.id}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setSelectedTool(tool.id);
                    }}
                    title={tool.label}
                  >
                    {tool.icon}
                  </ToolButton>
                ))}
              </ToolGrid>
            </ToolPanel>

            <CanvasContainer>
              <CanvasWrapper>
                <Canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  $cursor={canvasCursor}
                  onMouseDown={startDrawing}
                  onMouseMove={(e) => {
                    handleCanvasHover(e)
                    draw(e)
                  }}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onClick={handleCanvasClick}
                />
                <SelectionCanvas
                  ref={selectionCanvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                />
                <CanvasResizeHandle onMouseDown={startResizingCanvas} />
              </CanvasWrapper>
            </CanvasContainer>
          </MainContent>

          <ColorPalette variant="outside">
            <ColorPaletteHeader>
              <ColorPickerLabel>Colors:</ColorPickerLabel>
              <ColorPickerWrapper>
                <CurrentColorDisplay $color={activeColor} />
                <ColorPickerLabel>Custom:</ColorPickerLabel>
                <ColorPickerInput
                  type="color"
                  value={activeColor}
                  onChange={(e) => setActiveColor(e.target.value)}
                  title="Pick custom color"
                />
              </ColorPickerWrapper>
            </ColorPaletteHeader>
            <ColorGrid>
              {colors.map(color => (
                <ColorBox
                  key={color}
                  $color={color}
                  $active={activeColor === color}
                  onClick={() => setActiveColor(color)}
                />
              ))}
            </ColorGrid>
          </ColorPalette>
          {!isFullscreen && <ResizeHandle onMouseDown={startResizingWindow} />}
        </WindowContainer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
