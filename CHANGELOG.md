# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-08-15

### Added

- Initial project scaffold with Vue 3, TypeScript, and Vite
- Vue Router configured for client-side routing
- Pinia store for global state management
- Axios integration with typed request/response interceptors
- Shared composables for cross-cutting concerns (e.g. `useAsync`, `useLocalStorage`)
- Reusable UI component library in `src/components/`
- Type definitions and interfaces in `src/types/`
- Utility functions in `src/utils/`
- Service layer in `src/services/` for API communication
- View pages in `src/views/` with lazy-loaded routes
- Global CSS styles and design tokens in `src/style.css`
- Vitest test configuration with `vitest.config.ts`
- Unit test examples in `src/__tests__/`
- Vite environment type declarations (`vite-env.d.ts`)
- Project documentation (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`)
- Editor and CI configuration (`.editorconfig`, `.vscode/settings.json`, `.gitignore`)

### Security

- Environment variable handling via Vite's `import.meta.env`
- No secrets committed to version control

---

[Unreleased]: https://github.com/<owner>/<repo>/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/<owner>/<repo>/releases/tag/v1.0.0
