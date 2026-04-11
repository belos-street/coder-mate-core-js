import type { HighlightTheme, ThemeStyleMap } from './types'

const HEX_COLOR_PATTERN = /#[\dA-Fa-f]{6}/g

const normalizeColor = (color: string): string => color.toUpperCase()

const normalizeColorMap = (
  colorMap: Record<string, string>
): Record<string, string> => {
  const normalized: Record<string, string> = {}

  for (const [sourceColor, targetColor] of Object.entries(colorMap)) {
    normalized[normalizeColor(sourceColor)] = targetColor
  }

  return normalized
}

const replaceStyleColors = (
  style: string,
  colorMap: Record<string, string>
): string => {
  return style.replace(HEX_COLOR_PATTERN, (color) => {
    const mappedColor = colorMap[normalizeColor(color)]
    return mappedColor ?? color
  })
}

export interface ThemeVariantOptions {
  id: string
  displayName: string
  defaultStyle: string
  preStyle: string
  colorMap: Record<string, string>
}

export const createThemeVariant = (
  baseTheme: HighlightTheme,
  options: ThemeVariantOptions
): HighlightTheme => {
  const normalizedColorMap = normalizeColorMap(options.colorMap)
  const styles: ThemeStyleMap = {}

  for (const [scope, style] of Object.entries(baseTheme.styles)) {
    styles[scope] = replaceStyleColors(style, normalizedColorMap)
  }

  return {
    id: options.id,
    displayName: options.displayName,
    defaultStyle: options.defaultStyle,
    preStyle: options.preStyle,
    styles
  }
}
