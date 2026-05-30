# Michal Fecko — Portfolio

Minimal Hugo site, no theme, no JS framework, no build step beyond `hugo`. Optimised for GitHub Pages.

## Local

```
hugo server -D
```

Open <http://localhost:1313>.

## Build

```
hugo --gc --minify
```

Output goes to `public/`.

## Deploy

Pushing to `main` triggers `.github/workflows/hugo.yml`, which builds and publishes via GitHub Pages.

In your GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

If the site lives at `https://<user>.github.io/<repo>/` (project page) rather than at the user root, the workflow already injects the right `baseURL` via `actions/configure-pages`, so the `baseURL` in `hugo.toml` is only used for local dev and RSS.

## Adding a project

Create `content/projects/<slug>.md`:

```yaml
---
title: "Project title"
client: "Client name"
date: 2025-01-01
categories: ["graphic", "art", "interior"]   # any subset
cover: /img/projects/<slug>.svg
role: "Your role"
gallery:
  - { src: "/img/projects/<slug>.svg", alt: "..." , caption: "..." }
  - { src: "/img/projects/<slug>/clip.mp4", caption: "local video (auto-detected by extension)" }
  - { youtube: "VIDEO_ID", caption: "YouTube embed" }
  - { vimeo: "VIDEO_ID", caption: "Vimeo embed" }
---

Short paragraph about the project.
```

Drop the cover image into `static/img/projects/`. If you drop images
*and* videos (`.mp4`, `.webm`, `.mov`, `.m4v`, `.ogv`) into
`static/img/projects/<slug>/` and omit `gallery`, they're auto-discovered.

## Editing site identity

All copy (name, role, location, services, clients, recognition, social links) is in `hugo.toml` under `[params]` — no need to touch templates.

## Structure

```
content/
  _index.md            home stub
  info/_index.md       info page stub
  contact/_index.md    contact page stub
  projects/*.md        one file per project
layouts/
  _default/baseof.html  shell
  _default/single.html  project + generic pages
  index.html            home (grid/list, filter)
  info/list.html        info page
  contact/list.html     contact page
  partials/             header, footer
static/
  css/main.css
  js/main.js
  img/projects/*.svg
```

## Customising

- **Theme colours / typography** — `static/css/main.css` (top of file: `:root` and `[data-theme="light"]`)
- **Layout copy** — `hugo.toml`
- **Contact details** — phone + email live in `hugo.toml` under `[params]`. Social URLs in the `[[params.social]]` blocks.
