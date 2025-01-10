# Contributing to Follow

Thank you for considering contributing to Follow! We welcome contributions from the community to help improve and expand the project.

## Getting Started

Before you start contributing, please ensure you have enabled [Corepack](https://nodejs.org/api/corepack.html). Corepack ensures you are using the correct version of the package manager specified in the `package.json`.

```sh
corepack enable
```

### Installing Dependencies

To install the necessary dependencies, run:

```sh
pnpm install
```

## Development Setup

### Develop in the Browser

For a more convenient development experience, we recommend developing in the browser:

```sh
pnpm run dev:web
```

This will open the browser at `https://app.follow.is/__debug_proxy`, allowing you to access the online API environment for development and debugging.

### Develop in Electron

If you prefer to develop in Electron, follow these steps:

1. Copy the example environment variables file:

   ```sh
   cp .env.example .env
   ```

2. Set `VITE_API_URL` to `https://api.follow.is` in your `.env` file.

3. Run the development server:

   ```sh
   pnpm run dev
   ```

> **Tip:** If you encounter login issues, copy the `__Secure-better-auth.session_token` from your browser's cookies into the app.

## Contribution Guidelines

- Ensure your code follows the project's coding standards and conventions.
- Write clear, concise commit messages.
- Include relevant tests for your changes.
- Update documentation as necessary.

## Community

Join our community to discuss ideas, ask questions, and share your contributions:

- [Discord](https://discord.gg/followapp)
- [Twitter](https://x.com/intent/follow?screen_name=follow_app_)

We look forward to your contributions!

## License

By contributing to Follow, you agree that your contributions will be licensed under the GNU General Public License version 3, with the special exceptions noted in the `README.md`.
