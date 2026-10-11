import { describe, expect, it } from 'vitest'
import { renderComponent } from '../test-utils/renderComponent'
import Home from './Home.vue'

describe('Home page', () => {
  it('integrates the highlights into the introduction before the quote and card row', async () => {
    const html = await renderComponent(Home)
    const order = [
      '</h1>',
      'aria-roledescription=',
      'ts-quote',
      'aria-labelledby="home-cards-title"'
    ].map(marker => html.indexOf(marker))

    expect(order.every(position => position >= 0)).toBe(true)
    expect(order).toEqual([...order].sort((left, right) => left - right))
    expect(html).not.toContain('home-selected-work')
  })

  it('makes View Projects the only filled button in the introduction', async () => {
    const html = await renderComponent(Home)
    const hero = html.slice(0, html.indexOf('ts-quote'))
    const buttons = [
      ...hero.matchAll(/<(a|button)[^>]*class="(ts-button[^"]*)"[^>]*>/g)
    ].map(([tag, , classes]) => ({
      tag,
      filled: !classes.split(' ').includes('is-outlined')
    }))
    const filled = buttons.filter(({ filled }) => filled)

    expect(buttons.length).toBeGreaterThan(1)
    expect(filled).toHaveLength(1)
    expect(filled[0].tag).toMatch(/href="\/projects"/)
  })
})

describe('Home introduction', () => {
  it('keeps the highlights together with the social links and email', async () => {
    const html = await renderComponent(Home)
    const visual = html.slice(
      html.indexOf('class="hero-visual"'),
      html.indexOf('ts-quote')
    )

    expect(visual).toContain('card.webp')
    for (const link of [
      'https://coderyo.com/discord',
      'https://github.com/KageRyo',
      'https://www.linkedin.com/in/kageryo/',
      'mailto:kageryo@coderyo.com'
    ]) {
      expect(visual).toContain(`href="${link}"`)
    }
  })
})

describe('Home without the See More drawer', () => {
  it('has no See More button or side drawer', async () => {
    const html = await renderComponent(Home)

    expect(html).not.toContain('id="more"')
    expect(html).not.toMatch(
      /<button[^>]*>\s*<span class="ts-icon is-heart-icon"/
    )
  })
})
