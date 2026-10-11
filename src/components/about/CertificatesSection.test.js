import { describe, expect, it } from 'vitest'
import { renderComponent, textContent } from '../../test-utils/renderComponent'
import CertificatesSection from './CertificatesSection.vue'

describe('CertificatesSection', () => {
  it.each(['zh-TW', 'en', 'ja'])(
    'renders certificate names and levels in %s',
    async locale => {
      const html = await renderComponent(CertificatesSection, { locale })
      const body = html.match(/<tbody>(.*?)<\/tbody>/s)?.[1]
      const rows = [...body.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)].map(match =>
        [...match[1].matchAll(/<td[^>]*>(.*?)<\/td>/gs)].map(cell =>
          textContent(cell[1])
        )
      )
      const expected = {
        'zh-TW': {
          tqc: 'TQC+ 基礎物件導向程式語言 Java6',
          software: '勞動部勞動力發展署技能檢定中心 電腦軟體應用',
          hardware: '勞動部勞動力發展署技能檢定中心 電腦硬體裝修',
          professional: '專業級',
          classC: '丙級',
          classB: '乙級'
        },
        en: {
          tqc: 'TQC+ Basic Object-Oriented Programming — Java6',
          software:
            'Skill Evaluation Center, Workforce Development Agency, Ministry of Labor (Taiwan) — Computer Software Application',
          hardware:
            'Skill Evaluation Center, Workforce Development Agency, Ministry of Labor (Taiwan) — Computer Hardware Maintenance',
          professional: 'Professional',
          classC: 'Level C',
          classB: 'Level B'
        },
        ja: {
          tqc: 'TQC+ 基礎オブジェクト指向プログラミング — Java6',
          software:
            '台湾労働部労働力発展署技能検定センター — コンピューターソフトウェア応用',
          hardware:
            '台湾労働部労働力発展署技能検定センター — コンピューターハードウェア整備',
          professional: 'プロフェッショナル',
          classC: 'レベルC（台湾）',
          classB: 'レベルB（台湾）'
        }
      }[locale]

      expect(rows).toHaveLength(10)
      expect(rows.every(cells => cells.length === 4)).toBe(true)
      expect(rows.map(cells => cells[0])).toEqual(
        Array.from({ length: 10 }, (_value, index) => String(index + 1))
      )
      expect(rows.map(cells => cells[1])).toEqual([
        '2017',
        '2018',
        '2018',
        '2018',
        '2018',
        '2019',
        '2019',
        '2019',
        '2020',
        '2021'
      ])
      expect(rows[0][2]).toBe(expected.tqc)
      expect(rows[4][2]).toBe('Certiport IC3 GS5')
      expect(rows[5][2]).toContain('Android6')
      expect(rows[6][2]).toBe(expected.software)
      expect(rows[7][2]).toBe(expected.hardware)
      expect(rows[8][2]).toBe(expected.hardware)
      expect(rows[9][2]).toBe('Microsoft Certified Azure AI Fundamentals')
      expect(rows.map(cells => cells[3])).toEqual([
        expected.professional,
        '',
        '',
        '',
        '',
        expected.professional,
        expected.classC,
        expected.classC,
        expected.classB,
        ''
      ])
    }
  )

  it('lists the certificates under the section title without hiding them', async () => {
    const html = await renderComponent(CertificatesSection)

    expect(html).not.toContain('<details')
    expect(html).toMatch(/<h2[^>]*>證照<\/h2>/)
    expect(html).toMatch(/<table class="ts-table/)
  })

  it('does not publish certificate serial numbers', async () => {
    const html = await renderComponent(CertificatesSection)

    expect(html).not.toContain('序號')
    expect(html).not.toContain('2321170800001350')
    expect(html).not.toContain('yyC5-DwWu')
    const [headerRow] = html.match(/<thead.*?<\/thead>/s)
    expect(headerRow.match(/<th[\s>]/g)).toHaveLength(4)
  })

  it('spells the Azure certification correctly', async () => {
    const text = textContent(await renderComponent(CertificatesSection))

    expect(text).toContain('Microsoft Certified Azure AI Fundamentals')
    expect(text).not.toContain('Mircosoft')
  })
})
