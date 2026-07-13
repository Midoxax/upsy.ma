## Problem

Your GitHub Actions runs are failing on every push with build failures on Node 18.x / 20.x / 22.x. The failing workflow is `.github/workflows/webpack.yml` — a generic "NodeJS with Webpack" template that runs `npm install && npx webpack`.

This workflow is not related to your app:
- Your project is a **Vite** app, not a webpack app. There is no `webpack.config.js`, so `npx webpack` fails with exit code 1.
- The workflow uses deprecated Node 20 runners and pins Node 18, which GitHub is phasing out — hence the extra "Node.js 20 is deprecated" warnings.
- Lovable does not need this workflow to build or publish. Publishing goes through Lovable's own pipeline, independent of GitHub Actions.

These red X's on GitHub are cosmetic noise — they do **not** affect your live app or the Lovable publish. Your earlier blank-screen issue was a separate problem (the `.env` fix already handled that).

## Fix

Delete the unused workflow file so GitHub stops running it.

### Change

- **Delete `.github/workflows/webpack.yml`**

The other workflow files (`jekyll-docker.yml`, `npm-publish-github-packages.yml`) are also templates unrelated to this Vite app. I'll leave them alone unless you want them removed too — let me know.

### Verification

After the next push, GitHub Actions will no longer run a webpack build, and the failing checks will disappear from the repo.

No app code, dependency, or backend changes.
