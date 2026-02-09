# Specification

## Summary
**Goal:** Optimize the app for mobile by making core screens responsive, improving touch-friendly HUD controls, and scaling/optimizing the game canvas for mobile performance.

**Planned changes:**
- Make the Title Screen, Profile Setup flow, Store Initializer flow, and in-game HUD fully responsive for small screens (320px width and up) so UI does not clip or overlap at common mobile breakpoints.
- Update the in-game HUD for mobile touch use: increase tap target sizes, reduce control crowding, and adapt the bottom action row layout to remain usable without horizontal scrolling (keeping all user-facing text in English).
- Make the game canvas scale to the available viewport/container (instead of fixed 800x600) across orientations, including devicePixelRatio handling with a reasonable clamp for crisp but performant rendering.
- Improve touch input handling in the game view to prevent unwanted page scrolling/bounce when interacting with the canvas while preserving intended scrolling inside sheets/panels.
- Optimize the canvas render loop for mobile browsers by reducing redundant redraws (e.g., prefer animation-frame/simulation-driven redraw) while preserving current visual behavior.
- Make the Sectors panel content mobile-friendly (readable typography, wrapping, and/or horizontal scrolling within the table region as needed) without degrading desktop layout.

**User-visible outcome:** On mobile, key screens and dialogs fit the viewport without clipping, the in-game HUD is easy to tap and doesn’t overlap, the canvas scales cleanly in portrait/landscape without causing page scrolling, and gameplay rendering performs better on mobile browsers.
