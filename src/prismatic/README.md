# Standalone Prismatic UI

This directory is the source of the browser-ready theme used by the
`prismatic-terminal-ui` agent skill.

## Distribution shape

- `prismatic.css` contains the complete visual system and responsive layout.
- `prismatic.js` contains theme controls plus bundled GFM rendering and HTML
  sanitizing.
- Next serves the generated files from `/prismatic/v2/` with immutable cache
  headers and permissive cross-origin access.

The deployed public contract is:

```html
<link rel="stylesheet" href="https://blog.stw.tw/prismatic/v2/prismatic.css">
<script defer src="https://blog.stw.tw/prismatic/v2/prismatic.js"></script>
```

## Commands

```sh
pnpm build:prismatic
pnpm sync:prismatic-skill
```

The sync command rebuilds and copies the generated files into
`~/.agents/skills/prismatic-terminal-ui/assets`. Set `PRISMATIC_SKILL_DIR` to
override that destination.

## Versioning

Treat every published `/prismatic/vN/` path as immutable after its first production deployment.
Any published CSS or runtime change requires a new versioned path, plus
matching URL updates in the skill templates. There is deliberately no
`latest` alias: long-lived generated HTML should not change appearance because
someone adjusted a shadow six months later.
