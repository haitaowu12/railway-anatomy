# Railway Anatomy publishing

Firebase Hosting is the primary destination for future releases at https://railway-anatomy.web.app/. Preserve the existing GitHub Pages workflow and GPT Site as legacy hosts.

- Use Node.js 24. Run `npm run check`, `npm run build`, then `npm run check:release`.
- Publish `build/`, not the repository or authored `dist/` directory. Keep the release identity and versioned asset URLs intact.
- For Firebase, use `firebase deploy --only hosting --project tony-wu-projects`. The checked-in configuration pins the `railway-anatomy` site.
- Keep the shared Firebase project on its no-cost Spark plan; billing and paid services are outside this deployment.
- Exercise an equipment journey and its reading-page link on the published Firebase address. Retain the existing hosts unless a migration is explicitly requested.

The `Firebase Hosting` workflow packages and publishes successful `main` revisions. Pull requests only run checks. Google federation and the two repository variables must be configured before automated publication is active.
