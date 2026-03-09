# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.1.0] - 2026-03-09

### Added

- **Optimistic UI (Claps):** Enhanced the "clap" interaction to update the UI immediately upon click, significantly improving perceived responsiveness.
- **Request batching & debouncing:** Replaced multiple per-click API calls with a single batched request sent after a 1-second debounce, optimizing backend performance.
- **Reliability:** Integrated `fetch` with `keepalive` and `pagehide` listeners to ensure pending claps are successfully transmitted even if the user navigates away or closes the tab.
- **Backend API:** Updated the clap increment endpoint to support bulk updates via a `count` parameter.

### Tests

- Added unit tests for the frontend debounce and batching logic.
- Added backend integration tests for bulk clap count increments.

## [v2.0.1] - 2026-03-03

### Changed

- **Image transformer:** Migrated the `ImageWithCaption` component from the default inline Markdown image syntax (`![alt](path "caption")`) to a `markdown-it-container` block, enabling rich slot-based captions that support Vue components.
- **Content:** Updated all `content.md` files across `blogs/`, `astronomy/`, and `courses/` to use the new `::: image` container syntax (143 images across 10 files).
- **ImageWithCaption component:** Replaced the `image-caption` prop with a default slot, allowing captions to contain arbitrary HTML and Vue components.
- **Views:** Migrated `HireMe.vue` and `AboutMeFullStory.vue` to use the new slot-based caption API.

### Tests

- Rewrote `transformer-image.test.js` to cover the new container syntax.
- Updated `ImageWithCaption.test.js` to use slot-based caption testing.

## [v2.0.0] - 2026-02-26

### Added

- **Architecture (v2.0):**
  - **Markdown content authoring:** Migrated entire article content from individual Vue files (`index.vue`) to unified Markdown (`content.md`) files for better authoring and separation of concerns.
  - **Custom rendering engine:** Developed a comprehensive system of custom Vue-based Markdown transformers (headers, lists, code blocks, images, videos, admonitions, tables, and YouTube embeds) to render Markdown into functional Vue components.
- **SEO and routing:**
  - **Nginx redirect map:** Added an Nginx configuration map to handle automatic redirection of old camelCase URLs to their new kebab-case equivalents, preserving SEO rankings and external links.
- **New components:**
  - `InlineIcon.vue` for embedding SVG icons directly within text paragraphs.
  - `DataTable.vue` component for rich data presentation.
  - Automated component importing using `unplugin-vue-components`.
- **Content:**
  - New guides on battery capacity monitoring on Linux, configuring UFW/Fail2Ban, and design warping in Inkscape.

### Changed

- **Frontend refactoring:** Consolidated separate blog, course, and astronomy pages into a single abstract layout component, significantly reducing code duplication.
- **CI/CD and security:**
  - Major dependency upgrades including Vue Router v5.0, Gunicorn v24, Meilisearch v0.40, and Pandas v3.0.
  - Improved "Edit on GitHub" links to target the new `content.md` source files.

## [v1.1.0] - 2026-01-27

### Added

- **Content:**
  - New blog post: "How to set up a secure cloud server with Ubuntu and SSH".
  - New course: "Benchmarking Embedding Models".
  - Project showcase section to README with image preview.
  - Monthly maintenance checklist to README.
- **Components and features:**
  - `OrderedList` and `OrderedItem` components.
  - `useImageModal` composable for improved image handling.
- **Community and documentation:**
  - `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `CODEOWNERS` files.
  - Issue templates (Bug Report, Feature Request) and Pull Request template.

### Changed

- **Refactoring:**
  - Refactored article components to utilize the `useArticleContent` composable.
  - Optimized SVG images and adjusted CSS styling for better performance and consistency.
- **CI/CD:**
  - Improved pipelines with better caching, retry mechanisms, and fixes for flaky tests.
  - Updated dependencies including Vue, Vite, and FastAPI.

### Security

- Enhanced Content Security Policy (CSP) headers.

## [v1.0.0] - 2026-01-06

### Added

- **Initial release:** Announcing the first official release of [imadsaddik.com](https://imadsaddik.com/), a self-hosted personal website and blog platform.
- **Design:** Custom design created in Inkscape, featuring a dark, space-inspired UI with dedicated sections for technical blogs, free courses, and astronomy tutorials.
- **Tech stack:**
  - **Frontend:** Vue.js (Vite)
  - **Backend:** FastAPI
  - **Search engine:** Self-hosted Meilisearch instance.
- **CI/CD and automation:**
  - **Quality gates:** Automated linting (Ruff, ESLint) and formatting (Prettier).
  - **Testing:** Full suite of Unit, Integration, and End-to-End (Playwright) tests.
  - **Security scanning:** Automated security checks using OWASP ZAP.
  - **Deployment:** Zero-downtime deployment to DigitalOcean via SSH.
- **Infrastructure and security:**
  - **Server:** Ubuntu VM on DigitalOcean protected by UFW firewall and Fail2Ban.
  - **Web server:** Nginx configured with strict caching rules and security headers (CSP).
  - **Monitoring:** Real-time resource tracking with Btop and traffic analysis with GoAccess.
  - **Performance:** Global delivery optimization via Cloudflare CDN.

[v2.1.0]: https://github.com/ImadSaddik/ImadSaddikWebsite/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/ImadSaddik/ImadSaddikWebsite/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/ImadSaddik/ImadSaddikWebsite/compare/v1.1.0...v2.0.0
[v1.1.0]: https://github.com/ImadSaddik/ImadSaddikWebsite/compare/v1.0.0...v1.1.0
[v1.0.0]: https://github.com/ImadSaddik/ImadSaddikWebsite/releases/tag/v1.0.0
