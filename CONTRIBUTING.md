# Contributing

Thank you for your interest in contributing to this project! Please follow the guidelines below to help us keep development smooth and consistent.

---

## Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if applicable)
   ```bash
   cp .env.example .env
   # Edit .env with your local values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## Code Style

- **Language**: TypeScript with strict mode enabled.
- **Style guide**: Follow the project's `.editorconfig` and `.vscode/settings.json` settings.
- **Linting**: Run the linter before committing (see `package.json` scripts).
- **Formatting**: Use Prettier or the configured formatter; format on save is enabled in VS Code.
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format, e.g. `feat:`, `fix:`, `docs:`, `chore:`.
- **Naming**: PascalCase for components, camelCase for variables/functions, UPPER_SNAKE_CASE for constants.

---

## Pull Request Guidelines

1. **Create a branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and ensure:
   - All tests pass (`npm test`).
   - The linter reports no errors.
   - New code is covered by tests where applicable.
   - Documentation is updated for any user-facing changes.

3. **Commit your changes** using Conventional Commits.

4. **Open a Pull Request** against `main`:
   - Fill out the PR template completely.
   - Link any related issues.
   - Request review from the appropriate code owners.

5. **Address review feedback** promptly. Once approved, a maintainer will merge your PR.

---

Thank you for contributing! 🎉
