# Design System Specification: Editorial Transit

## 1. Overview & Creative North Star
### The Creative North Star: "The Kinetic Gallery"
In the world of transit, information is usually dense, chaotic, and stressful. This design system rejects the "dashboard" mentality in favor of a "gallery" experience. We treat transit data—routes, times, and maps—as high-end editorial content. 

By leveraging **Space Grotesk’s** geometric confidence and a **"Lesser Information"** philosophy, we create a sense of calm authority. We break the standard rigid grid through **intentional asymmetry**: large headline displacements, oversized floating action buttons, and overlapping translucent layers that mimic the fluid motion of a city. This is not a utility; it is a curated journey.

---

## 2. Colors & Tonal Depth
We move away from the "flat web" by using a sophisticated palette of blues and greys that prioritize depth over decoration.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts.
*   *Example:* A `surface-container-low` (#f2f4f6) card sits on a `surface` (#f7f9fb) background. The change in tone is the border.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine vellum.
- **Base Layer:** `surface` (#f7f9fb)
- **Secondary Sectioning:** `surface-container-low` (#f2f4f6)
- **Interactive Elevated Cards:** `surface-container-lowest` (#ffffff)

### The "Glass & Gradient" Rule
To prevent the design from feeling "sterile," use Glassmorphism for floating elements (like bottom navigation or top blur bars). Use `surface` colors at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#00236f) to `primary-container` (#1e3a8a) at a 135-degree angle to provide a "weighted" premium feel.

---

## 3. Typography
The interplay between the technical precision of **Space Grotesk** and the human readability of **Manrope** creates a high-contrast, editorial rhythm.

| Role | Token | Font | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Space Grotesk | 3.5rem | Impactful arrivals/departures. |
| **Headline** | `headline-md` | Space Grotesk | 1.75rem | Page titles and primary wayfinding. |
| **Title** | `title-lg` | Manrope | 1.375rem | Bold sub-headers for route names. |
| **Body** | `body-md` | Manrope | 0.875rem | Functional details and instructions. |
| **Label** | `label-sm` | Manrope | 0.6875rem | Micro-copy and secondary metadata. |

**Typography Strategy:** Use `display-lg` for single, "hero" numbers (e.g., "5 mins") with significant negative space around them. Ensure `headline` styles utilize `on_surface` (#191c1e) for maximum legibility.

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f2f4f6) section. This creates a soft, natural lift without "dirtying" the white-based aesthetic with grey shadows.
*   **Ambient Shadows:** When an element must float (e.g., a "Book Now" FAB), use a large blur (32px) at 6% opacity. The shadow color must be a tint of `primary` (#00236f) rather than black, mimicking a natural refraction of the brand colors.
*   **The "Ghost Border":** If accessibility requires a stroke (e.g., input fields), use `outline-variant` (#c5c5d3) at **15% opacity**. High-contrast outlines are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#00236f) with `on_primary` (#ffffff) text. Radius: `DEFAULT` (1rem). 
*   **Secondary:** `secondary_container` (#2170e4) with `on_secondary` (#ffffff) text.
*   **Tertiary:** No background. Uses `primary` text. Padding: `spacing-3`.

### Cards & Lists
*   **No Dividers:** Forbid the use of 1px lines. Separate list items using `spacing-4` (1.4rem) of vertical whitespace.
*   **Grouping:** Group related items inside a `surface-container-high` (#e6e8ea) wrapper with a `md` (1.5rem) corner radius.

### Input Fields
*   **Styling:** Use `surface-container-lowest` (#ffffff) as the fill. 
*   **Active State:** Instead of a thick border, use a subtle 2px glow of `primary_fixed_dim` (#b6c4ff) to indicate focus.

### Transit-Specific: "The Arrival Plate"
*   A custom component: A large `surface-container-lowest` card with a `xl` (3rem) radius. It features a `display-lg` time on the left and an asymmetrical `headline-sm` route name displaced to the top right.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use the `spacing-16` (5.5rem) token for top-of-page margins to create an "airy" editorial feel.
*   **DO** allow map elements to bleed edge-to-edge under floating translucent interface panels.
*   **DO** use `surface_tint` (#4059aa) for subtle interactive states (hover/press).

### Don't
*   **DON'T** use 100% black (#000000). Use `on_surface` (#191c1e) for all "black" text.
*   **DON'T** use sharp corners. Everything must adhere to the `DEFAULT` (1rem) or `lg` (2rem) scale to maintain the "Soft Minimalism" vibe.
*   **DON'T** crowd the screen. If you have more than 5 elements in a view, use a "See More" progressive disclosure pattern.