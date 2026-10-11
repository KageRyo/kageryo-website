# KageRyo Developer Website

My personal website, explore more new things here ❤️

- **Link**: https://kageryo.coderyo.com/

## Local development

This project uses Node.js 24.19.0, managed with `mise`.

```sh
mise install
mise exec -- npm ci --ignore-scripts
mise exec -- npm run dev
```

The development server is available at http://localhost:3000. Before opening a pull request, run `mise exec -- npm run lint`, `mise exec -- npm test`, and `mise exec -- npm run build`. For changes to browser behavior, also run `mise exec -- npm run test:e2e` and `mise exec -- npm run test:a11y`.

Pull requests to `main` run the same lint, test, accessibility, end-to-end, and build checks in the CI workflow with read-only permissions. Only pushes to `main` deploy the site to GitHub Pages.

The accessibility check additionally requires the Chromium system libraries; on Debian/Ubuntu, install them with `mise exec -- npx playwright install --with-deps chromium`.

`mise exec -- npm run test:e2e` runs Playwright Test in `e2e/`: `navigation`, `i18n`, `home`, `highlights`, `about`, `projects`, and `contact` each have a `.spec.js` file. The shared `openPage` fixture in `e2e/fixtures.js` creates browser contexts and mocks the GitHub API. `playwright.config.js` starts Vite at `127.0.0.1:4175` and runs one worker in CI or four locally. To run one spec or matching test, use `mise exec -- npx playwright test e2e/home.spec.js` or `mise exec -- npx playwright test -g "tablets"`. This suite needs the same Chromium setup as the accessibility check.

`mise exec -- npm test` runs Vitest, including SSR component tests through `src/test-utils/renderComponent.js` and data/build checks in `scripts/*.test.mjs`. `mise exec -- npm run test:a11y` runs the separate axe accessibility script at `scripts/run-a11y.mjs`, which starts Vite at `127.0.0.1:4174`.

UI changes follow the editorial layout rules in [docs/ui-guidelines.md](docs/ui-guidelines.md).

## Contact Me

If you have any questions or suggestions, feel free to contact me through the following ways:

- [Submit an Issue](https://github.com/KageRyo/kageryo-website/issues)
- Email: kageryo@coderyo.com

## License

The content of this project page is licensed under `CC-BY4`, which allows free reproduction, redistribution, or use, including but not limited to commercial purposes, as long as the author is credited. The source code is licensed under `MIT`.
