

# Plan: Replace Logo with Uploaded Image + Weather-Adaptive Background

## What Changes

1. **Copy the uploaded logo** (`searchall-logo.png`) into `src/assets/` so it can be imported in React components.

2. **Update the header logo** (Index.tsx, line 145-149): Replace the SVG icon with the uploaded logo image. Remove the colored background box and render the image directly.

3. **Update the WelcomePage logo** (WelcomePage.tsx, line 11-15): Replace the SVG icon with the uploaded logo image, sized larger for the welcome screen.

4. **Make the logo background weather-adaptive**: The logo image has a light/white background. Wrap it in a container that uses CSS classes tied to the current weather theme (these already exist via `.theme-*` classes on `:root`). The container will use `bg-background` and `rounded-2xl` so it blends with whatever weather theme is active — sunny gets warm tones, night gets dark tones, rainy gets cool blues, etc. The image itself will have a transparent-friendly treatment using `mix-blend-mode: multiply` so the white background of the PNG blends into the themed container color.

## Technical Details

- **Files modified**: `src/pages/Index.tsx`, `src/components/WelcomePage.tsx`
- **File copied**: `user-uploads://searchall-logo.png` → `src/assets/searchall-logo.png`
- Import the image as an ES module: `import searchAllLogo from "@/assets/searchall-logo.png"`
- The logo container will use existing theme CSS variables (`bg-card`, `bg-background`) which already change per weather theme, so no new CSS is needed
- The tagline "PLACE WHERE IDEAS MEET INNOVATION" from the image can optionally replace "Scan • Discover • Create" in the header subtitle

