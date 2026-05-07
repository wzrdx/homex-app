# Repository Guidelines

## Project Structure & Module Organization

This is a Create React App TypeScript frontend. Application code lives in `src/`, with `src/App.tsx` wiring providers, routing, transaction handling, and shared toasts. Feature screens are under `src/components/`, reusable UI lives in `src/shared/`, service/context logic is in `src/services/`, and MultiversX contract/API code is grouped under `src/blockchain/`. Global styling is in `src/global.scss`, Chakra theme configuration is in `src/theme.ts`, and component-scoped styles use `*.module.scss` beside their component. Static browser assets, audio, and the app manifest live in `public/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`. AI agents must not initiate this command because they run in WSL and the project should remain Windows-compatible; a human contributor should run installs from the intended Windows environment.
- `npm start`: run the local CRA dev server at `http://localhost:3000` with hot reload.
- `npm run build`: create a production build in `build/`; run this before deployment-facing changes.

There is no `npm test` script in `package.json` at the moment. Add a test script before introducing automated tests that should run in CI.

## Coding Style & Naming Conventions

Use TypeScript with React function components and hooks. Follow the existing 4-space indentation, single quotes, semicolons, and named exports for shared components where practical. Name components and files in `PascalCase` (`ActionButton.tsx`, `ParticipantsList.tsx`), hooks with `use` prefixes, and service modules by domain (`transactions.tsx`, `resources.tsx`). Prefer existing Chakra UI, `react-query`, lodash, and local context/service helpers over new utility patterns. Keep SCSS module class names camelCase and colocated with the component they style.

## Testing Guidelines

No test framework is currently configured. For new coverage, prefer React Testing Library with CRA/Jest conventions and place tests next to source files as `Component.test.tsx` or `service.test.ts`. Focus tests on transaction resolution, route protection, blockchain API adapters, and context behavior. Until a test script exists, verify changes with `npm run build` and manual checks through `npm start`.

## Commit & Pull Request Guidelines

Recent commits use short imperative subjects, often with Conventional Commit-style prefixes such as `build:`, `chore:`, `fix:`, and `refactor:`. Keep subjects specific, for example `fix: Update restake gas limit` or `build: Update mainnet API URL`.

Pull requests should include a concise description, affected routes/features, environment changes, and screenshots or recordings for visible UI changes. Link related issues when applicable and mention any contract, ABI, gas-limit, or `.env` changes explicitly.

## Security & Configuration Tips

Environment files (`.env`, `.env.development`, `.env.production`) control API and network settings. Do not commit secrets or wallet credentials. When changing MultiversX configuration, verify both `src/blockchain/config.ts` and the relevant environment file before building.
