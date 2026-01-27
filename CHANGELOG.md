# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.1.0] - 2026-01-27

### Added

- **Content:**
  - New blog post: "How to set up a secure cloud server with Ubuntu and SSH".
  - New course: "Benchmarking Embedding Models".
  - Project showcase section to README with image preview.
  - Monthly maintenance checklist to README.
- **Components & Features:**
  - `OrderedList` and `OrderedItem` components.
  - `useImageModal` composable for improved image handling.
- **Community & Documentation:**
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

### Description

I am excited to announce the first official release of [imadsaddik.com](https://imadsaddik.com/). This project represents a complete, self-hosted personal website and blog platform built from scratch.

The website is now live and production-ready. The custom design is created in Inkscape, featuring a dark, space-inspired UI. There are dedicated sections for technical blogs, free courses, and astronomy tutorials.

### Tech stack

- **Frontend:** Vue.js (Vite)
- **Backend:** FastAPI
- **Search engine:** Self-hosted **Meilisearch** instance.

### CI/CD & Automation

The project uses a CI/CD pipeline that ensures code quality and stability before every deployment. Some features of the pipeline:

- **Quality gates:** Automated linting (Ruff, ESLint) and formatting (Prettier).
- **Testing:** Full suite of Unit, Integration, and End-to-End (Playwright) tests.
- **Security scanning:** Automated security checks using OWASP ZAP.
- **Deployment:** Zero-downtime deployment to DigitalOcean via SSH.

### Infrastructure & Security

- **Server:** Ubuntu VM on DigitalOcean protected by UFW firewall and Fail2Ban.
- **Web server:** Nginx configured with strict caching rules and security headers (CSP).
- **Monitoring:** Real-time resource tracking with Btop and traffic analysis with GoAccess.
- **Performance:** Global delivery optimization via Cloudflare CDN.
