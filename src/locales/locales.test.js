import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import en from './en'
import ja from './ja'
import zhTW from './zh-TW'

const flattenKeys = (messages, prefix = '') =>
  Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? flattenKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  )

describe('locales', () => {
  it('define the same keys in zh-TW, en, and ja', () => {
    const expected = flattenKeys(zhTW).sort()

    expect(flattenKeys(en).sort()).toEqual(expected)
    expect(flattenKeys(ja).sort()).toEqual(expected)
  })
})

describe('home resume link', () => {
  it('points to a PDF in the public directory', () => {
    const file = fileURLToPath(
      new URL(
        '../../public/resume/Chien-Hsun_Chang_Resume.pdf',
        import.meta.url
      )
    )
    expect(existsSync(file)).toBe(true)
  })
})
