# Contributing to RoastMaster

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to RoastMaster. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/roastmaster.git
    cd roastmaster
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```

## Development Workflow

### Building
The project is written in TypeScript.
```bash
npm run build
```

### Running Locally
To test the CLI:
```bash
node dist/index.js roast src/index.ts
```

### Linting & Formatting
Make sure your code is clean before submitting:
```bash
npm run lint
npm run format
```

## Submitting a Pull Request

1.  Push your branch to GitHub.
2.  Open a Pull Request against the `main` branch.
3.  Describe your changes clearly.
4.  Wait for a review (or a roast 😈).

## Code Style
- We use ESLint and Prettier.
- Keep functions small and focused.
- Add comments only where necessary (self-documenting code is preferred, unless you're the "Senior Dev" persona).

## Reporting Bugs
- Open an issue on GitHub.
- Provide a clear description and reproduction steps.
- If you can, provide a fix in a PR!
