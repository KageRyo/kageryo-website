import { describe, expect, it } from 'vitest'
import en from './en'
import ja from './ja'
import zhTW from './zh-TW'
import { skillGroups } from '../config/resume'

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

describe('skill groups', () => {
  it('have a label and description in every locale', () => {
    for (const messages of [zhTW, en, ja]) {
      const { groups, descriptions } = messages.about.resume.skills
      for (const { id } of skillGroups) {
        expect(groups[id], id).toBeTruthy()
        expect(descriptions[id], id).toBeTruthy()
      }
    }
  })
})
