# Contributing to oBerry

Thank you for your interest in contributing! oBerry is a small, focused library and contributions of all sizes are welcome.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Coding Guidelines](#coding-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Getting Started

oBerry uses [pnpm](https://pnpm.io/) as its package manager.

```sh
# Clone the repository
git clone https://github.com/oberryjs/oberry.git
cd oberry

# Install dependencies
pnpm install

# Start the dev build watcher
pnpm dev
```

## Project Structure

```
oberry/
├── src/
│   ├── index.ts        # Public exports
│   ├── selector.ts     # $() selector function
│   ├── wrapper.ts      # ElementWrapper class
│   ├── reactivity.ts   # $ref, $computed, $effect, $effectScope
│   ├── component.ts    # $component
│   ├── creator.ts      # $new element factory
│   └── plugins.ts      # Plugin / use
├── tests/
│   ├── setup.ts        # Global test setup and alien-signals mock
│   ├── selector.test.ts
│   ├── wrapper.test.ts
│   ├── reactivity.test.ts
│   ├── creator.test.ts
│   └── plugins.test.ts
├── dist/               # Build output (gitignored)
├── package.json
└── biome.jsonc         # Linter / formatter config
```

## Development Workflow

### Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Build and watch for changes |
| `pnpm build` | Production build with type declarations |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:run` | Run tests once |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm test:ui` | Open the Vitest browser UI |
| `pnpm lint` | Lint and check formatting (Biome) |
| `pnpm format` | Auto-fix lint and formatting issues |

### Typical flow

1. Make your changes in `src/`.
2. Run `pnpm test` to verify nothing is broken.
3. Add or update tests in `tests/` to cover your change.
4. Run `pnpm lint` (and `pnpm format` to auto-fix) before committing.

## Testing

Tests are written with [Vitest](https://vitest.dev/) and run in a [happy-dom](https://github.com/capricorn86/happy-dom) environment.

```sh
pnpm test
pnpm test:run      # single pass
pnpm test:coverage # with coverage
pnpm test:ui       # with browser UI
```

`tests/setup.ts` is loaded before every test file. It resets the DOM and mocks `alien-signals` with a synchronous, non-reactive stub so tests stay fast and deterministic.

### Writing tests

- Place test files in `tests/` and name them `<module>.test.ts`.
- Reset relevant DOM state in a `beforeEach` block — do not rely on state from other tests.
- New features should be accompanied by tests. Bug fixes should include a regression test.

---

## Coding Guidelines

oBerry is **TypeScript-first** and linted with [Biome](https://biomejs.dev/). The rules are defined in `biome.jsonc`; the most important ones to keep in mind:

- Avoid `any` where a reasonable type exists.
- Prefer explicit return types on public functions and methods.
- All `ElementWrapper` methods that mutate elements should return `this` to support chaining.
- Keep the library dependency-free apart from `alien-signals`, which is the reactive core.
- `src/index.ts` is the intentional public surface and all the public functions should be exported here.

## Submitting Changes

1. **Fork** the repository and create a branch from `main`:

   ```sh
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/issue-123
   ```

2. Make your changes, add tests, and ensure everything passes:

   ```sh
   pnpm test:run && pnpm lint
   ```

3. Commit with a clear, conventional message:

   ```
   feat: add .scrollTo() method on ElementWrapper
   fix: handle empty selection in .parent()
   docs: add JSDoc for $effectScope
   test: cover .siblings() with selector filter
   ```

4. Push your branch and open a **Pull Request** against `main`.

5. In the PR description, explain *what* you changed and *why*. Reference any related issue with `Closes #123`.

## Reporting Issues

Please use [GitHub Issues](https://github.com/oberryjs/oberry/issues) to report bugs or request features.

When reporting a bug, include:

- oBerry version (`npm ls oberry`)
- A minimal reproduction (inline code snippet or a link to a sandbox)
- Expected vs. actual behaviour
- Browser or Node version if relevant

## License

By contributing, you agree that your changes will be licensed under the project's [MIT License](LICENSE).
