# Setup status

Based on "Build a $10K Website in Claude Code — Free Setup Guide".

- [x] Step 1 — Claude Code: already running (this session).
- [x] Step 2 — Framer Motion installed (`framer-motion` in package.json).
- [x] Step 3 — Design skill added at `.claude/skills/frontend-design/SKILL.md`,
      referenced from `AGENTS.md`.
- [ ] Step 4 — 21st.dev components: not automated (no browser access from this
      session). Browse https://21st.dev yourself, copy a component's code,
      paste it into `src/`, then ask Claude Code to integrate it — see prompt
      below.

## Starter prompt (fill in the brackets, then send it to Claude Code)

```
Build a modern landing page for [YOUR PRODUCT/SERVICE].

Requirements:
- Use Next.js 14 with the App Router
- Tailwind CSS for styling
- Framer Motion for all animations (scroll reveals, hover states, page transitions)
- Pull hero, features, and pricing sections from 21st.dev components
- Follow the design tokens defined in our frontend design skill
- Add a sticky navbar, a hero with a headline + CTA, 3 feature cards, social proof section, pricing, FAQ, and footer
- Mobile-first, fully responsive
- Lighthouse score 90+ on performance

Start by setting up the project structure, then build section by section. Show me each section before moving to the next.
```

## Integrating a 21st.dev component

1. Browse https://21st.dev and pick a component.
2. Copy its code.
3. Paste it into a new file under `src/components/`.
4. Ask Claude Code: "Integrate this 21st.dev component into our landing
   page. Match it to our design tokens, replace the placeholder content
   with our copy, and add Framer Motion entrance animations."

## Common mistakes to avoid

- Skipping the design skill — without it you get a generic "AI-generated" look.
- Vague prompts — be specific about sections, animations, and content.
- Not iterating — ask Claude Code to refine spacing, contrast, and motion
  after the first pass.
- Forgetting performance — lazy-loaded images, optimized fonts, Lighthouse
  audit at the end.

## Images (`public/images/`)

The three photos (`truffe-coupe.jpg`, `assiette.jpg`, `truffe-entiere.jpg`) and
the 3D slice texture (`slice-texture.jpg`, cropped from `truffe-coupe.jpg`) were
generated with Higgsfield (Z Image model). They are placeholders for the
concept — replace them with the restaurant's real photography before going
live.
