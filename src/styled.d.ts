import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    desktopBackground?: string
    material?: string
    borderDark?: string
    borderDarkest?: string
    borderLightest?: string
    borderLight?: string
    canvas?: string
    boxShadow?: string
    hoverBackground?: string
    [key: string]: string | undefined
  }
}
