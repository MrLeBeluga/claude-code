---
name: frontend-design
description: Design rules Claude should follow when building or editing any UI in this project (pages, sections, components). Use whenever writing or reviewing frontend/UI code — layout, styling, typography, spacing, color, or component structure.
---

# Frontend design rules

Apply these whenever building or editing UI in this project.

## Typography
- Use a real type scale, not arbitrary font sizes. Stick to Tailwind's scale
  (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-5xl`, ...)
  and pick one scale step per role (body, subheading, heading, hero) — don't mix
  one-off sizes like `text-[17px]`.
- One font family for body text, one (or the same) for headings. Don't introduce
  a third typeface.

## Spacing
- Base everything on an 8px grid: use Tailwind spacing tokens that are multiples
  of 2 (`p-2`, `p-4`, `p-6`, `p-8`, `gap-4`, `gap-8`, ...). Avoid odd values like
  `p-[13px]` or `mt-5` unless there's a specific reason.
- Keep vertical rhythm consistent between sections (e.g. all top-level sections
  use the same `py-*` unless there's a deliberate reason to break it).

## Color
- Define color as tokens (CSS variables or Tailwind theme extensions) for
  primary, neutral, and accent — never hardcode random hex codes in components.
- Neutral/gray scale for text and backgrounds, one accent color for CTAs and
  highlights. Don't introduce new colors ad hoc per component.

## Component patterns
- Buttons: define explicit states (default, hover, active, disabled, loading)
  and reuse one button component instead of ad hoc `<button className=...>` per page.
- Cards: consistent padding, radius, and shadow across the app.
- Forms: consistent label/input/error layout.

## Animation
- Use Framer Motion for all animation: scroll-triggered fades, staggered
  reveals on lists/grids, and smooth hover/tap transitions on interactive
  elements. Prefer subtle, fast transitions (150–400ms) over slow or bouncy
  ones unless the brand calls for it.

## Avoid the generic AI aesthetic
- No default centered hero with a generic gradient blob and three feature
  cards with emoji icons unless explicitly asked for.
- No purple-to-blue gradient as a default choice — pick colors that fit the
  actual brand/content.
- Vary layout rhythm between sections (don't repeat the same
  icon-title-paragraph grid four times in a row).
- Real copy over lorem-ipsum-style placeholder text whenever the content is known.

## Performance
- Use `next/image` for images (lazy-loaded, sized).
- Use `next/font` for font loading (already set up in this project).
- Keep an eye on Lighthouse performance; ask before adding heavy client-side
  dependencies to a mostly-static page.
