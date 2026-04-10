export type ThemeStyleMap = Record<string, string>

export interface HighlightTheme {
  id: string
  displayName: string
  defaultStyle: string
  styles: ThemeStyleMap
  preStyle?: string
}
