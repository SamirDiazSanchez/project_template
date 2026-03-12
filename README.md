# API Template Project

This is a template repository for building RESTful APIs using Node.js, Express, and TypeScript. It comes pre-configured with a set of essential libraries and a modular folder structure suitable for scalable applications.

## 🚀 Technologies

*   **Runtime:** [Node.js](https://nodejs.org/)
*   **Framework:** [Express 5](https://expressjs.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** Local SQLite using [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
*   **Testing:** [Vitest](https://vitest.dev/)
*   **Authentication:** JSON Web Tokens (`jsonwebtoken`) + cookies (`cookie-parser`)

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   npm (or your preferred package manager: yarn, pnpm)

### Installation

1.  Clone the repository and go into the Api folder:
    ```bash
    cd Api
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Available Scripts

In the project directory (`Api`), you can run:

*   **`npm run dev`**: Runs the app in development mode using `tsx watch`. The server will restart if you make edits.
*   **`npm run build`**: Compiles the TypeScript application into the `dist` folder. Includes `tsc-alias` to resolve path aliases inside the compiled code.
*   **`npm run start`**: Starts the compiled production application (requires `npm run build` first).
*   **`npm run test`**: Executes unit tests using Vitest.

## 📂 Project Structure

```text
Api/
├── src/       # Source code
│   ├── auth/  # Authentication domain (login, tokens, etc.)
│   ├── user/  # User domain (CRUD, entities, etc.)
│   └── main.ts # Entry point of the Express application
├── dist/      # Compiled files (generated after build)
└── database.db # SQLite database (created at runtime)
```

## 🔐 Features included

*   **Clean/Domain-based Architecture:** Code is organized by domain (user, auth) to maintain separation of concerns.
*   **JWT Auth:** Configured for secure authentication using tokens and HTTP-only cookies.
*   **Path Aliases:** Configured out-of-the-box (e.g. `@/user`) for cleaner imports (configured in `tsconfig.json` and handled by `tsc-alias`).
*   **SQLite Ready:** Pre-configured to persist data locally using a high-performance SQLite driver.
*   **ES Modules:** Native ESM setup with `"type": "module"`.

## 📜 License

[ISC](https://opensource.org/licenses/ISC) - Samir Diaz
