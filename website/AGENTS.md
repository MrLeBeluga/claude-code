<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

- Stack: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- Animation: use Framer Motion for all animations — scroll-triggered fades,
  staggered reveals on lists/grids, and smooth hover/tap transitions on
  interactive elements. Don't ship static, motion-less sections.
- Design: follow `.claude/skills/frontend-design/SKILL.md` for typography,
  spacing (8px grid), color tokens, and component patterns. Avoid the
  generic AI-website look (see "Avoid the generic AI aesthetic" in that
  skill).
- Components: prefer adapting a component from https://21st.dev (heroes,
  pricing tables, testimonials, navbars, footers) over building one from
  scratch — copy the component, then restyle it to match this project's
  design tokens and replace placeholder content with real copy. Add Framer
  Motion entrance animations when integrating a static component.
- Mobile-first, fully responsive. Target a 90+ Lighthouse performance score:
  lazy-load images (`next/image`), optimize fonts (`next/font`, already set
  up), avoid unnecessary client-side JS.
