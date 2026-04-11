import type { HighlightTheme } from '../types'

import {
  DARK_PLUS_DEFAULT_STYLE,
  DARK_PLUS_PRE_STYLE,
  DARK_PLUS_THEME_DISPLAY_NAME,
  DARK_PLUS_THEME_ID
} from './base'
import { darkPlusSharedStyles } from './shared'
import { darkPlusJsStyles } from './js'
import { darkPlusTypeScriptStyles } from './typescript'
import { darkPlusJsonStyles } from './json'
import { darkPlusPythonStyles } from './python'
import { darkPlusBashStyles } from './bash'
import { darkPlusSqlStyles } from './sql'
import { darkPlusYamlStyles } from './yaml'
import { darkPlusMarkdownStyles } from './markdown'
import { darkPlusJavaStyles } from './java'
import { darkPlusCStyles } from './c'
import { darkPlusCppStyles } from './cpp'
import { darkPlusGoStyles } from './go'
import { darkPlusRustStyles } from './rust'
import { darkPlusCSharpStyles } from './csharp'
import { darkPlusPhpStyles } from './php'
import { darkPlusHtmlStyles } from './html'
import { darkPlusCssStyles } from './css'

/**
 * VS Code Dark+ style theme
 */
export const darkPlusTheme: HighlightTheme = {
  id: DARK_PLUS_THEME_ID,
  displayName: DARK_PLUS_THEME_DISPLAY_NAME,
  defaultStyle: DARK_PLUS_DEFAULT_STYLE,
  preStyle: DARK_PLUS_PRE_STYLE,
  styles: {
    ...darkPlusSharedStyles,
    ...darkPlusJsStyles,
    ...darkPlusTypeScriptStyles,
    ...darkPlusJsonStyles,
    ...darkPlusPythonStyles,
    ...darkPlusBashStyles,
    ...darkPlusSqlStyles,
    ...darkPlusYamlStyles,
    ...darkPlusMarkdownStyles,
    ...darkPlusJavaStyles,
    ...darkPlusCStyles,
    ...darkPlusCppStyles,
    ...darkPlusGoStyles,
    ...darkPlusRustStyles,
    ...darkPlusCSharpStyles,
    ...darkPlusPhpStyles,
    ...darkPlusHtmlStyles,
    ...darkPlusCssStyles
  }
}
