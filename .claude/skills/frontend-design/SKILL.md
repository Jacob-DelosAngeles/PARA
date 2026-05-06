---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality, for web (HTML/React) OR mobile (React Native / Expo). Use this skill when the user asks to build UI components, screens, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics and respects platform constraints.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces — for either web or mobile — that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, screen, page, or interface to build. They may include context about the purpose, audience, platform (web vs mobile), or technical constraints. **Always identify the target platform first** — many implementation rules differ between web and React Native.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (web vs mobile, framework, performance, accessibility, viewport).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

Then implement working code that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail
- Faithful to the platform's idioms (don't make web pretend to be mobile or vice versa)

## Universal Aesthetics Guidelines

These apply to BOTH web and mobile:

- **Typography**: Choose fonts that are beautiful, unique, interesting. Avoid generic fonts (Arial, Inter, Roboto, system defaults); opt for distinctive choices that elevate the aesthetic. Pair a distinctive display font with a refined body font. Apply tight tracking on large headings, generous line-height on body. Vary across projects — never default to "Space Grotesk + Inter" for everything.
- **Color & Theme**: Commit to a cohesive palette. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Use CSS variables (web) or a constants file (mobile) for consistency. Never use default Tailwind blue/indigo as primary.
- **Motion**: Animations are punctuation, not decoration. Use them at high-impact moments — staggered page/screen entrance, pressed feedback, state transitions. Animate `transform` and `opacity` only; never layout properties.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Gradient meshes, noise textures, geometric patterns, layered transparencies, tinted shadows, decorative borders, grain overlays — choose what fits the aesthetic.

NEVER use generic AI-generated aesthetics: overused fonts (Inter, Roboto, Arial), cliched color schemes (purple-gradient-on-white), predictable layouts, cookie-cutter design that lacks context-specific character. Interpret creatively. Make unexpected choices that feel genuinely designed for THIS context.

---

## Web Implementation (HTML / React / Next)

### Defaults
- Single `index.html` file with inline styles, unless project structure dictates otherwise
- Tailwind via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

### Web-Specific Rules
- **Interactive states**: every clickable element needs `:hover`, `:focus-visible`, and `:active` states
- **Animations**: only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing
- **Shadows**: layered, color-tinted, low opacity — never flat `shadow-md`
- **Images**: gradient overlay (`bg-gradient-to-t from-black/60`) and color treatment with `mix-blend-multiply`
- **Depth**: explicit layering system (base → elevated → floating)

### Scroll-Driven Websites
When building a scroll-driven animated website (used alongside `video-to-website`):
- Hero headings: 6rem minimum, line-height 0.9–1.0, weight 700–800
- Section headings: 3rem minimum, weight 600–700
- Horizontal marquee text: 10–15vw, uppercase, letterspaced
- No glassmorphism cards or boxes around text — text sits directly on background
- Background color must shift between sections (light → dark → accent → light) via GSAP
- Every section uses a different entrance animation (fade-up, slide-left, slide-right, scale-up, clip-path reveal)
- Stagger delays 0.08–0.12s between elements within a section
- At least one pinned section, at least one oversized horizontal-scroll text element
- Stats display at 4rem+, count up via GSAP, never appear statically

---

## Mobile Implementation (React Native / Expo)

### Stack Defaults
- React Native (latest stable Expo SDK) + Expo Router for file-based navigation
- `StyleSheet.create` for component-internal styles. NativeWind v4 className for shared utility patterns. Don't use NativeWind for one-off styles — the runtime overhead isn't worth it.
- Reanimated v4 for animations (UI thread, worklets)
- `Pressable` for all touchables (not `TouchableOpacity` — Pressable is the modern primitive)
- Custom fonts via `@expo-google-fonts/<font>` + `expo-font`

### Mobile-Specific Rules
- **No hover, no focus-visible.** Touch devices only. Use `Pressable`'s `pressed` state for press feedback (opacity 0.7 or scale 0.97 are good defaults).
- **Animate transform and opacity only.** Reanimated worklets run on UI thread; layout animations (width, height, padding) drop to JS thread and stutter. Use `useSharedValue` + `useAnimatedStyle`.
- **Safe areas always.** `useSafeAreaInsets()` from `react-native-safe-area-context`. Top inset for headers, bottom inset for tab bars. Never hardcode `paddingTop: 44`.
- **Flexbox is the only layout primitive.** No CSS Grid in RN. `flexDirection: 'row' | 'column'`, `justifyContent`, `alignItems`, `gap`. Yoga handles the rest.
- **Shadows differ by platform.** iOS uses `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`. Android uses `elevation` (number, 0–24). Set both for cross-platform.
- **Border radius rhythm.** Stick to a small set (e.g., 12, 16, 24, 32). Avoid arbitrary 7px or 13px.
- **No dividers.** Separate sections with tonal surface layering (e.g., `surface` → `surfaceContainer` → `surfaceContainerHigh`), not 1px lines.
- **Map / camera / GPS components don't render on web.** Use `.web.tsx` platform extensions for graceful web fallbacks.
- **Screenshots come from the user's iPhone**, not Puppeteer. Save to `<project>/.screenshots/<screen>-current.png` and read with the Read tool.

### Mobile Typography
- Display: 32–48px, line-height 1.05, weight 700, tight letter-spacing (-0.02em equivalent via fontVariant or SpaceGrotesk)
- Headline: 22–28px, weight 700
- Body: 14–16px, weight 400, line-height 1.5
- Label: 11–13px, weight 500, often uppercase or tracked

### Mobile Motion
- **Press feedback**: 100–150ms opacity dip (0.7) or scale (0.97), spring or easeOut
- **Screen entrance**: stagger children 60–80ms (faster than web; users expect instant tactile response)
- **Bottom sheet / modal**: use `@gorhom/bottom-sheet` for native-feel snap points
- **Tab transitions**: let Expo Router/React Navigation handle defaults — don't override unless the design demands it
- **Loading states**: skeleton shimmer with Reanimated (animate `opacity` 0.3 → 0.7 in a loop), never spinners

### Mobile Color Discipline
- One canonical `COLORS` constant file. All hex values originate there.
- Use design-token names, not raw hex, in component code: `COLORS.primary` not `'#00236f'`.
- Surface system: `surface` (base) / `surfaceContainerLow` / `surfaceContainer` / `surfaceContainerHigh` / `surfaceContainerHighest`. Each step is a slight tonal shift (~3% darker).
- Text colors paired with surfaces: `onSurface` (primary text) / `onSurfaceVariant` (secondary) / `outline` (tertiary).

### Mobile Verification Workflow
1. User runs `npx expo start --clear`
2. User opens app on iPhone via Expo Go
3. User screenshots the screen, saves to `.screenshots/<screen>-current.png`
4. Claude reads the PNG, compares against reference (e.g., `brand_assets/<screen>/screen.png`)
5. Claude states specific differences with measurements
6. Claude edits component code
7. User hot-reloads (save triggers Fast Refresh)
8. Repeat from step 3 — minimum 2 rounds before declaring done

---

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: don't hold back. Show what can truly be created when committing fully to a distinctive vision — within the platform's idioms.
