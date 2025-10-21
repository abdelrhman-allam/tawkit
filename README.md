This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy to GitHub Pages

This project is configured for static export and GitHub Pages.

- Static export is enabled in `next.config.ts` (`output: "export"`, `trailingSlash: true`, `images.unoptimized: true`).
- A workflow at `.github/workflows/pages.yml` builds and deploys to Pages on pushes to `main`.
- The GitHub Pages base path is set to the repository name (e.g., `/REPO_NAME`) via `NEXT_PUBLIC_BASE_PATH` in the workflow.

### Usage
1. Push to `main`.
2. In your repo settings → Pages, set source to "GitHub Actions".
3. Access the site at `https://<username>.github.io/<repo>/`.

### User/Org site (root) instead of repo subpath
If you’re deploying to `https://<username>.github.io/` (no repo path), edit `.github/workflows/pages.yml` and set:

```yaml
NEXT_PUBLIC_BASE_PATH: ""
```

Or remove the line entirely. This makes `basePath` empty.
