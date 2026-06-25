<div align="center">
  <img src="public/logo.svg" width="92" alt="Runix" />
  <h1>Runix — website</h1>
  <p>Landing page and documentation for <strong>Runix</strong>, the universal process supervisor.</p>
</div>

---

A [Next.js](https://nextjs.org) (App Router) + TypeScript site with a terminal /
amber-CRT design. Styled with plain CSS Modules — no UI framework.

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
```

## Build

```sh
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx        root layout, fonts, favicon (icon.svg)
  page.tsx          landing page
  docs/page.tsx     documentation reference
components/         Hero, SupervisorBoard (live demo), Features, Commands, …
public/logo.svg     brand mark
```

The signature element is `components/SupervisorBoard.tsx` — a live view where a
process crashes and Runix restarts it automatically.

The Runix CLI itself lives in a separate repository.
