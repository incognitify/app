# Incognitify - core
## Tech stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- Shadcn UI - [Tailwind UI](https://ui.shadcn.com/)
- Zustand - [Zustand](https://github.com/pmndrs/zustand)
- Zod - [Zod](https://github.com/colinhacks/zod)
- Framer Motion - [Framer Motion](https://www.framer.com/motion/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Branch Naming Conventions

When creating new branches, follow these naming conventions to maintain consistency and clarity across the project:

### Branch Types

- `feature/` - For new features or enhancements
  - Example: `feature/user-authentication`
  - Example: `feature/dark-mode`

- `bugfix/` - For bug fixes
  - Example: `bugfix/login-error`
  - Example: `bugfix/responsive-layout`

- `hotfix/` - For urgent fixes that need immediate deployment
  - Example: `hotfix/security-vulnerability`
  - Example: `hotfix/critical-error`

- `release/` - For release preparation
  - Example: `release/v1.0.0`
  - Example: `release/2023-q1`

- `refactor/` - For code refactoring without changing functionality
  - Example: `refactor/cleanup-components`
  - Example: `refactor/optimize-queries`

- `docs/` - For documentation changes
  - Example: `docs/api-documentation`
  - Example: `docs/update-readme`

- `test/` - For adding or modifying tests
  - Example: `test/integration-tests`
  - Example: `test/unit-tests`

### Best Practices

1. **Be descriptive**: Use clear, descriptive names that indicate the purpose of the branch
2. **Keep it concise**: Aim for brevity while maintaining clarity
3. **Include issue numbers**: If applicable, reference issue numbers (e.g., `feature/user-auth-#123`)
4. **Delete merged branches**: Clean up branches after they've been merged to keep the repository tidy

Following these conventions helps team members understand the purpose of each branch and improves workflow organization.
