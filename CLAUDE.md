# CLAUDE.md — PARA Mobile App

This is a React Native + Expo mobile app, **not a website**. Ignore web-only patterns.

## Stack
- React Native 0.81 + Expo SDK 54 + Expo Router v6 (file-based routing under `para-app/app/`)
- NativeWind v4 + StyleSheet (prefer `StyleSheet` for component-internal styles; reserve NativeWind className for global utility patterns)
- Reanimated v4 + Worklets v0.5 for animations
- Supabase (PostGIS + Auth + Realtime + Storage)
- Zustand (global) + TanStack Query (server state)
- Fonts: Space Grotesk (display) + Manrope (body) via `@expo-google-fonts`

## Always Do First
- Invoke the `frontend-design` skill before writing UI code, every session.
- Invoke the `backend` skill before any Supabase / database / auth / RLS / RPC / realtime / PostGIS work.
- Reference [brand_assets/aura_transit/DESIGN.md](brand_assets/aura_transit/DESIGN.md) for the "Kinetic Gallery" design philosophy and color/component tokens.
- Read [para-app/lib/constants.ts](para-app/lib/constants.ts) for the canonical `COLORS` palette — never invent hex values.

## Local Dev
- Start the dev server from `para-app/`: `npx expo start --clear`
- WSL2 is configured for **mirrored networking mode** (see `C:\Users\Jacob\.wslconfig`). This is required so iPhone Expo Go can reach Metro at the Windows LAN IP. Do not change `.wslconfig` without asking.
- iPhone Expo Go must match SDK 54. Project pinned to `expo@~54.0.0` for this reason.
- iPhone scans the QR via the **iOS Camera app** (not Expo Go's scanner — newer Expo Go removed it). Never tell the user to use Expo Go's "Reload JS" on a cached project entry — it reuses stale URLs.

## Screenshot Workflow (Mobile)
- Puppeteer **does not work** for this project. The app runs on iPhone via Expo Go, not in a browser. Do not attempt to launch a browser-based screenshot tool, do not look for `serve.mjs`.
- **Current-state screenshots**: user takes iPhone screenshot → saves to `para-app/.screenshots/<screen>-current.png` → tells Claude the path. Claude reads the PNG with the Read tool.
- **Design reference screenshots**: [brand_assets/para_commuter_map/screen.png](brand_assets/para_commuter_map/screen.png) and [brand_assets/para_driver_heatmap/screen.png](brand_assets/para_driver_heatmap/screen.png) are the canonical layouts.
- When comparing: be specific about pixel measurements (e.g., "ArrivalPlate radius is 24px but reference shows ~32px"). Do at least 2 comparison rounds before declaring done.

## Reference Image Discipline
- If a reference image is provided: match layout, spacing, typography, color exactly. Do not improve, do not add.
- "Exact" on mobile means: visual match at iPhone 11 viewport (414×896 logical pixels, scale 2x).
- If no reference: design from scratch following the Kinetic Gallery philosophy in DESIGN.md.

## Mobile Design Rules
- **No hover states.** Touch only. Use `Pressable`'s `pressed` state for feedback.
- **No web-only CSS.** No `transition-all`, no `:hover`, no `:focus-visible`, no CSS Grid, no z-index hacks. Use Reanimated shared values for motion, flexbox for layout, native `elevation`/`shadow*` for depth.
- **Animate `transform` and `opacity` only.** Never animate width/height/layout properties on the JS thread.
- **Safe areas always.** Wrap top-level screens with `useSafeAreaInsets` padding for notch + home indicator. The `(tabs)` layout already handles bottom inset; screens handle top.
- **Typography**: `Manrope_700Bold` for emphasis, `Manrope_400Regular` for body, `SpaceGrotesk_700Bold` for display. Tight tracking on display, generous line-height on body.
- **Surfaces layer**: base (`COLORS.surface`) → elevated (`COLORS.surfaceContainer`) → floating glass (`rgba(247, 249, 251, 0.92)`). No flat designs.

## Anti-Generic Guardrails
- **Colors**: never use the default Tailwind palette (indigo-500, blue-600). Use `COLORS.primary` (#00236f navy) and derived tints.
- **Shadows**: layered, color-tinted, low opacity — e.g., `shadowColor: COLORS.primary, shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: -4 }`.
- **Press feedback**: every `Pressable` needs an `opacity` or `scale` change on `pressed`.
- **Border radius**: use the project rhythm — 12, 16, 24, 32. No 4/6/8.
- **No dividers**: separate sections with tonal layering (different surface containers), not lines.

## Hard Rules
- Do not add features, sections, or content not in the PRD or reference.
- Do not "improve" reference designs — match them.
- Do not stop after one screenshot comparison pass.
- Do not introduce web-only code patterns. If unsure whether something works on RN, check the [React Native API docs](https://reactnative.dev/docs).
- Do not commit changes unless explicitly asked.
