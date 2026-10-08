# Quire

This directory is the source of the browser-ready theme used by the `quire`
agent skill.

## Distribution shape

- `quire.css` contains the complete visual system and responsive layout.
- `quire.js` contains theme controls plus bundled GFM rendering and HTML
  sanitizing.
- Next serves the generated files from `/quire/v2/` with immutable cache
  headers and permissive cross-origin access.

The deployed public contract is:

```html
<link rel="stylesheet" href="https://blog.stw.tw/quire/v2/quire.css">
<script defer src="https://blog.stw.tw/quire/v2/quire.js"></script>
```

Colors use `light-dark()`, which needs Chrome 123, Firefox 120, or Safari
17.5 or newer.

## Sandboxed embedding

Quire v2 supports iframes with `sandbox="allow-scripts"`; `allow-same-origin`
is optional. When storage is blocked, Markdown still renders and theme controls
work for the current page without persisting the selection. With storage
available, the runtime continues to save the theme under `quire-theme`.

Existing pages must update their asset URLs to `/quire/v2/` to receive this fix.

## Commands

```sh
pnpm build:quire
pnpm sync:quire-skill
```

The sync command rebuilds and copies the generated files into
`~/.agents/skills/quire/assets`. Set `QUIRE_SKILL_DIR` to override that
destination.

## Fonts

The bundle ships no font files. Berkeley Mono appears in the stack as a local
font name only, because its personal license covers web font use on this
blog, not serving the file to generated pages hosted elsewhere. Machines
without it fall back to the system monospace and sans-serif fonts.

## Versioning

Treat every published `/quire/vN/` path as immutable after its first
production deployment. Any published CSS or runtime change requires a new
versioned path, plus matching URL updates in the skill templates. There is
deliberately no `latest` alias: long-lived generated HTML should not change
appearance because someone adjusted a shadow six months later.

## Prismatic

Quire replaces the Prismatic theme. `public/prismatic/v1/` and `/v2/` stay as
frozen static files so pages that already link them keep working. Their source
lives in git history before the Quire commit.
