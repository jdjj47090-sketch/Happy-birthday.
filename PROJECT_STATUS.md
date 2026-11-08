# ASOUGA project status

## Stage 1 — project inspection and structure

- Inspected the existing Next.js 15 / React 19 / TypeScript application and retained its existing layout, theme, content, and Git history.
- Confirmed the configured Git remote is the requested repository and the current branch is `main`. The requested repository is configured on `main`; deployment code is pushed after final local verification.

## Stage 2 — visual identity, opening, and portal

- Existing cinematic opening, Arabic RTL layout, CSS sky/portal, SVG rose, responsive theme, and reduced-motion styles retained.
- Portal is now touch-operable and opens on interaction.

## Stage 3 — main world and memory museum

- Existing five editable, non-fictional museum entries retained and rendered from the content model.

## Stage 4 — games and galaxy

- Added interactive heart-piece completion, one-time question answering, star discovery and local progress persistence, and a riddle-triggered secret scene.
- Canvas galaxy continues to animate only while its scene is mounted; stars use editable content messages.

## Stage 5 — secret box and main letter

- Existing CSS box retained with opening/reveal interaction.
- Letter now begins with the required exact line and has pause, speed-up, restart, and continue-reading controls.

## Stage 6 — final celebration

- Existing CSS-rendered final celebration and restart control retained.

## Stage 7 — admin and storage

- Added server-side admin login/logout and protected content API routes.
- Password verification uses scrypt hashes supplied through server environment variables; signed, HTTP-only, SameSite cookies protect the editor API.
- Admin editor validates content before saving. Production uses a private Vercel Blob object so updates persist across serverless requests and deployments; local development falls back to `data/asouga-content.json` when no Blob token is configured. Generated content data is excluded from Git.
- Admin requires `ADMIN_PASSWORD_HASH`, `ADMIN_PASSWORD_SALT`, and `ADMIN_SESSION_SECRET`; setup instructions are in `.env.example` and README.
- Vercel production storage is provisioned as a private Blob store named `asouga-content`; the CLI supplies `BLOB_READ_WRITE_TOKEN` to the linked project.

## Stage 8 — verification

- `npm run typecheck` passes.
- `npm run build` passes and produces the static journey plus protected admin and public content API routes.
- Production HTTP smoke checks pass for the home page, public content, anonymous admin rejection, scrypt login, session cookie, authenticated reads, valid saves, visitor-side persistence, invalid theme rejection, restoration, and logout.
- No browser automation tool is present, so visual device and console checks remain outstanding.

## Outstanding limitations

- Production deployment must provide the three admin environment variables and a linked private Blob store. Vercel Hobby currently includes a monthly Blob allowance; see https://vercel.com/docs/vercel-blob/usage-and-pricing.
- Visual device and browser console checks remain outstanding because no browser automation tool is available here.
- GitHub repository access was verified during deployment setup.

## Additional implementation notes

- Saved edits are served to visitors through a public no-store content endpoint.
- Galaxy canvas caps device pixel ratio and slows its frame rate when reduced motion is requested.
- Secret-door unlock checks the heart, question, all six stars, and the riddle.
- Game progress can be reset locally, and questions cycle through editable entries.
