import { describe, expect, test } from 'bun:test'
import { parse } from '../index'

describe('Markdown 解析测试', () => {
  test('基础块级与行内 token', () => {
    const code = `# Title
> quote line
- item one
1. item two
This is **bold** and *italic* with \`inline\`.`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'markup.heading.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.quote.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.list.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.bold.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.italic.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.inline.raw.markdown')).toBe(
      true
    )
  })

  test('支持 fenced code、link、注释与删除线', () => {
    const code = `<!-- meta -->
Visit [docs](https://example.com/docs)
~~deprecated~~
\`\`\`ts
const x = 1
\`\`\``
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'comment.block.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.link.label.markdown')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'markup.link.url.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.strikethrough.markdown')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'markup.fenced-code.block.begin.markdown')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'markup.fenced-code.block.end.markdown')
    ).toBe(true)
  })

  test('支持任务列表、分割线、表格和缩进代码块', () => {
    const code = `- [x] done
- [ ] todo
***
| Lang | Status |
| --- | :---: |
| md | wip |
    const inBlock = true`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'markup.task.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.hr.markdown')).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.table.row.markdown')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'markup.table.separator.markdown')
    ).toBe(true)
    expect(tokens.some((t) => t.scope === 'markup.code.indented.markdown')).toBe(
      true
    )
  })

  test('支持 setext 标题、图片与参考式链接', () => {
    const code = `Section Title
-------------
![logo](https://example.com/logo.png)
[ref]: https://example.com/docs "Docs"
See [Doc][ref].`
    const tokens = parse(code).flat()

    expect(tokens.some((t) => t.scope === 'markup.heading.setext.markdown')).toBe(
      true
    )
    expect(tokens.some((t) => t.scope === 'markup.image.label.markdown')).toBe(
      true
    )
    expect(
      tokens.some((t) => t.scope === 'markup.reference.link.label.markdown')
    ).toBe(true)
    expect(
      tokens.some((t) => t.scope === 'markup.reference.link.url.markdown')
    ).toBe(true)
  })

  test('未闭合强调和 code fence 不应崩溃', () => {
    const code = `**not closed
~~not closed
\`\`\`
line`
    const tokens = parse(code).flat()

    expect(tokens.length).toBeGreaterThan(0)
    expect(
      tokens.some(
        (t) =>
          t.scope === 'markup.bold.markdown' ||
          t.scope === 'markup.strikethrough.markdown' ||
          t.scope === 'markup.fenced-code.block.begin.markdown' ||
          t.scope === 'string.unquoted.markdown'
      )
    ).toBe(true)
  })

  test('行号追踪正确', () => {
    const code = `text
## Section
more text`
    const tokens = parse(code).flat()
    const sectionToken = tokens.find((t) => t.text.startsWith('## '))

    expect(sectionToken?.line).toBe(2)
    expect(sectionToken?.scope).toBe('markup.heading.markdown')
  })
})
