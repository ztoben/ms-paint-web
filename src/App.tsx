import { useState } from 'react'
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
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
    background: ${({ theme }) => theme.desktopBackground};
  }
  * {
    box-sizing: border-box;
  }
`

const AppContainer = styled.div`
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const WindowContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.material};
  box-shadow: ${({ theme }) => theme.boxShadow};
  border: 2px solid ${({ theme }) => theme.borderDarkest};
`

const TitleBar = styled.div`
  background: linear-gradient(to right, #000080, #1084d0);
  color: white;
  padding: 2px 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  align-content: start;
`

const ToolButton = styled(Button)<{ $active?: boolean }>`
  width: 24px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: ${({ $active, theme }) => $active ? theme.hoverBackground : 'transparent'};
`

const CanvasContainer = styled.div`
  flex: 1;
  margin: 4px;
  padding: 4px;
  overflow: auto;
  background: ${({ theme }) => theme.canvas};
`

const Canvas = styled.canvas`
  border: 1px solid ${({ theme }) => theme.borderDark};
  background: white;
  cursor: crosshair;
  display: block;
`

const ColorPalette = styled(Frame)`
  height: 50px;
  margin: 4px;
  padding: 4px;
  display: flex;
  gap: 4px;
  align-items: center;
`

const ColorBox = styled.div<{ $color: string; $active?: boolean }>`
  width: 24px;
  height: 24px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ $active, theme }) => $active ? theme.borderDarkest : theme.borderLightest};
  cursor: pointer;
`

const colors = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'
]

const tools = [
  { id: 'pencil', icon: '✏️', label: 'Pencil' },
  { id: 'brush', icon: '🖌️', label: 'Brush' },
  { id: 'fill', icon: '🪣', label: 'Fill' },
  { id: 'eraser', icon: '🧹', label: 'Eraser' },
  { id: 'picker', icon: '💧', label: 'Color Picker' },
  { id: 'zoom', icon: '🔍', label: 'Magnifier' },
  { id: 'line', icon: '/', label: 'Line' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle' },
]

function App() {
  const [activeTool, setActiveTool] = useState('pencil')
  const [activeColor, setActiveColor] = useState('#000000')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu)
  }

  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <AppContainer>
        <WindowContainer>
          <TitleBar>
            <span>untitled - Paint</span>
          </TitleBar>

          <MenuBar>
            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'file'} onClick={() => toggleMenu('file')}>
                File
              </MenuItem>
              {openMenu === 'file' && (
                <DropdownMenu>
                  <MenuListItem>New</MenuListItem>
                  <MenuListItem>Open...</MenuListItem>
                  <MenuListItem>Save</MenuListItem>
                  <MenuListItem>Save As...</MenuListItem>
                  <Separator />
                  <MenuListItem>Print Preview</MenuListItem>
                  <MenuListItem>Print...</MenuListItem>
                  <Separator />
                  <MenuListItem>Set as Wallpaper (Tiled)</MenuListItem>
                  <MenuListItem>Set as Wallpaper (Centered)</MenuListItem>
                  <Separator />
                  <MenuListItem>Exit</MenuListItem>
                </DropdownMenu>
              )}
            </MenuItemWrapper>

            <MenuItemWrapper>
              <MenuItem $active={openMenu === 'edit'} onClick={() => toggleMenu('edit')}>
                Edit
              </MenuItem>
              {openMenu === 'edit' && (
                <DropdownMenu>
                  <MenuListItem>Undo</MenuListItem>
                  <MenuListItem>Repeat</MenuListItem>
                  <Separator />
                  <MenuListItem>Cut</MenuListItem>
                  <MenuListItem>Copy</MenuListItem>
                  <MenuListItem>Paste</MenuListItem>
                  <MenuListItem>Clear Selection</MenuListItem>
                  <MenuListItem>Select All</MenuListItem>
                  <Separator />
                  <MenuListItem>Copy To...</MenuListItem>
                  <MenuListItem>Paste From...</MenuListItem>
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
              {tools.map(tool => (
                <ToolButton
                  key={tool.id}
                  $active={activeTool === tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  title={tool.label}
                >
                  {tool.icon}
                </ToolButton>
              ))}
            </ToolPanel>

            <CanvasContainer>
              <Canvas width={800} height={600} />
            </CanvasContainer>
          </MainContent>

          <ColorPalette variant="outside">
            <span style={{ marginRight: '8px' }}>Colors:</span>
            {colors.map(color => (
              <ColorBox
                key={color}
                $color={color}
                $active={activeColor === color}
                onClick={() => setActiveColor(color)}
              />
            ))}
          </ColorPalette>
        </WindowContainer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
