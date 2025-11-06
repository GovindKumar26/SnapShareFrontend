# Tailwind CSS Utility Classes - Usage Guide

> This document tracks all Tailwind classes used in the SnapShare frontend with explanations.

---

## 📐 Layout & Positioning

### Flexbox

| Class | CSS Equivalent | Usage | Where Used |
|-------|---------------|--------|------------|
| `flex` | `display: flex` | Creates flex container | SignupPage outer container |
| `items-center` | `align-items: center` | Centers flex items vertically (cross-axis) | SignupPage - vertical centering |
| `justify-center` | `justify-content: center` | Centers flex items horizontally (main-axis) | SignupPage - horizontal centering |

**Why flex for centering?**
- `flex` + `items-center` + `justify-center` = perfect centering in both directions
- Alternative: `grid place-items-center` (simpler but less control)
- **NOT** `m-auto` - only works for block elements with defined width, not flex children

---

## 📏 Sizing

### Height

| Class | CSS Equivalent | Usage | Where Used |
|-------|---------------|--------|------------|
| `min-h-screen` | `min-height: 100vh` | Full viewport height (ensures content can scroll if needed) | SignupPage - makes centering work vertically |

**Why `min-h-screen`?**
- Without height, `items-center` has nothing to center against
- `min-h-screen` = 100vh (full viewport)
- Allows content to grow beyond viewport if needed (unlike `h-screen`)

---

## 🎨 Spacing

### Margin

| Class | CSS Equivalent | Usage | Where Used |
|-------|---------------|--------|------------|
| `m-auto` | `margin: auto` | Centers block element horizontally (needs defined width) | Not used yet (flex approach chosen instead) |
| `mx-auto` | `margin-left: auto; margin-right: auto` | Horizontal centering only | - |

---

## 🧩 Common Patterns

### Pattern 1: Full-Screen Centered Layout
```jsx
<div className="flex items-center justify-center min-h-screen">
  {/* Content is perfectly centered */}
</div>
```
**Why this works:**
1. `flex` - enables flexbox
2. `items-center` - vertical centering
3. `justify-center` - horizontal centering
4. `min-h-screen` - gives vertical space to center in

---

## 📝 Notes & Best Practices

### Centering Approaches

1. **Flexbox (current approach):**
   ```jsx
   <div className="flex items-center justify-center min-h-screen">
   ```
   ✅ Best for centering both axes
   ✅ Full control over alignment

2. **Margin Auto (block elements only):**
   ```jsx
   <div className="mx-auto max-w-md">
   ```
   ✅ Good for horizontal centering with width constraint
   ❌ Doesn't work with flex children
   ❌ Only horizontal centering

3. **Grid (alternative):**
   ```jsx
   <div className="grid place-items-center min-h-screen">
   ```
   ✅ Simpler syntax
   ✅ Perfect centering
   ⚠️ Less control for complex layouts

---

**Last Updated:** November 4, 2025

---

## 🎨 Gradients in Tailwind CSS

### Gradient Syntax

Tailwind provides utilities for linear gradients using the pattern:
```
bg-gradient-to-{direction} from-{color} via-{color} to-{color}
```

**Direction values:**
- `bg-gradient-to-r` → left to right (horizontal)
- `bg-gradient-to-l` → right to left
- `bg-gradient-to-b` → top to bottom (vertical)
- `bg-gradient-to-t` → bottom to top
- `bg-gradient-to-br` → top-left to bottom-right (diagonal)
- `bg-gradient-to-bl` → top-right to bottom-left
- `bg-gradient-to-tr` → bottom-left to top-right
- `bg-gradient-to-tl` → bottom-right to top-left

**Color stops:**
- `from-{color}` → starting color
- `via-{color}` → middle color (optional)
- `to-{color}` → ending color

**Examples used in SignupPage:**
```jsx
// Background gradient (diagonal)
className="bg-linear-to-br from-indigo-50 via-white to-purple-50"
// CSS: background: linear-gradient(to bottom right, indigo-50, white, purple-50)

// Button gradient (horizontal)
className="bg-linear-to-r from-indigo-600 to-purple-600"
// CSS: background: linear-gradient(to right, indigo-600, purple-600)

// Hover state gradient
className="hover:from-indigo-700 hover:to-purple-700"
// Dynamically changes gradient colors on hover
```

**Tailwind v4 Note:**
Tailwind v4 linter suggests using `bg-linear-to-{direction}` instead of `bg-gradient-to-{direction}`, but both syntaxes work. The older `bg-gradient-to-*` is more widely recognized and supported.

### Shadow with Color Tint

```jsx
// Standard shadow with size
className="shadow-2xl shadow-indigo-200"
// CSS: box-shadow with indigo tint

// Shadow with opacity for glow effect
className="shadow-lg shadow-indigo-500/50"
// The /50 applies 50% opacity to the shadow color
```

---

## 🧾 SignupPage - Utilities used (current)

This section documents every Tailwind utility used in `src/features/auth/SignupPage.jsx` and why it was chosen.

| Class | CSS | Purpose / Why used |
|------|-----|--------------------|
| `flex` | display: flex | Creates the horizontal card container and enables flex layout for sections |
| `items-center` | align-items: center | Vertically centers content inside the flex container when combined with `min-h-screen` |
| `justify-center` | justify-content: center | Horizontally centers the outer container |
| `min-h-screen` | min-height: 100vh | Ensures vertical centering has a reference (full viewport height) |
| `bg-gradient-to-br` | background: linear-gradient(to bottom right, ...) | Creates diagonal gradient for subtle, modern background (indigo-50 → white → purple-50) |
| `from-indigo-50` | gradient start color | Light indigo for soft gradient start |
| `via-white` | gradient middle color | White midpoint for smooth transition |
| `to-purple-50` | gradient end color | Light purple for cohesive indigo-purple theme |
| `w-full` | width: 100% | Ensure inputs and form column span available width |
| `max-w-4xl` | max-width: 56rem | Constrain card width to a readable measure on large screens |
| `shadow-2xl` | box-shadow (extra large) | Gives card strong elevation for depth |
| `shadow-indigo-200` | box-shadow color tint | Subtle indigo tint on shadow matching brand colors |
| `rounded-2xl` | border-radius: 1rem | More rounded corners for modern card appearance |
| `bg-white` | background-color: white | Solid white card background for contrast with gradient page background |
| `md:w-1/2` | at md breakpoint width: 50% | Splits layout into two columns on medium+ screens (form + illustration/logo) |
| `p-8` | padding: 2rem | Internal spacing inside the form column for comfortable touch targets and spacing |
| `flex-col` | flex-direction: column | Stacks inputs vertically in the form column |
| `space-y-4` / `space-y-0.5` | vertical gap between children | Consistent vertical spacing between form fields and smaller label->input gaps |
| `text-3xl` | font-size: 1.875rem | Larger heading for better visual hierarchy |
| `text-indigo-600` | color: indigo-600 | Primary brand color for heading (strong, professional) |
| `font-bold` | font-weight: 700 | Bold heading for emphasis |
| `text-gray-600` | color: gray-600 | Softer color for welcome text (secondary text) |
| `text-gray-700` | color: gray-700 | Medium gray for labels (better contrast than gray-600) |
| `font-medium` | font-weight: 500 | Medium weight for labels (hierarchy between heading and body text) |
| `px-3 py-2` / `py-3` | padding on inputs/button | Comfortable padding for readability and touch targets |
| `border` | border: 1px solid | Basic input border for definition |
| `border-gray-300` | border-color: gray-300 | Light border for subtle input definition |
| `rounded-lg` | border-radius: 0.5rem | More rounded corners than `rounded-md` for modern feel |
| `focus:outline-none` | remove default focus outline | Cleaner focus UI; replaced by ring styles for accessibility |
| `focus:ring-2` | focus ring width | Visible focus indicator for accessibility |
| `focus:ring-indigo-500` | focus ring color | Matches primary brand color for cohesive focus states |
| `focus:border-indigo-500` | focus border color | Border color changes on focus to match ring |
| `bg-gray-50` | background-color: gray-50 | Very light gray background for inputs (adds depth vs pure white) |
| `bg-gradient-to-r` | background: linear-gradient(to right, ...) | Horizontal gradient for button (indigo to purple) |
| `from-indigo-600` | gradient start | Primary brand color start for button |
| `to-purple-600` | gradient end | Purple end for visual interest and brand cohesion |
| `hover:from-indigo-700` | hover gradient start | Darker indigo on hover for affordance |
| `hover:to-purple-700` | hover gradient end | Darker purple on hover |
| `text-white` | color: white | White text on colored button for contrast |
| `font-semibold` | font-weight: 600 | Semi-bold button text for readability on gradient |
| `transition-all` | transition: all | Smooth transitions for all changing properties |
| `duration-200` | transition-duration: 200ms | Fast, responsive transition timing |
| `shadow-lg` | box-shadow (large) | Button elevation for depth |
| `shadow-indigo-500/50` | box-shadow color with opacity | Indigo shadow at 50% opacity for glow effect |
| `disabled:opacity-50` | disabled state opacity | Visual feedback for disabled submit button |
| `disabled:cursor-not-allowed` | disabled cursor | Pointer feedback for disabled state |
| `cursor-pointer` | cursor: pointer | Pointer affordance for clickable elements |
| `hidden md:flex` | responsive visibility | Show logo panel on medium+ screens, hide on mobile to prioritize form |
| `bg-gradient-to-br` (logo panel) | background: linear-gradient(to bottom right, ...) | Diagonal gradient for logo panel background |
| `from-indigo-600 to-purple-700` | gradient colors | Darker, richer gradient for logo panel contrast with white card

### Notes on usage and accessibility

- Always pair `focus:outline-none` with a visible `focus:ring-*` so keyboard users still receive clear focus feedback.
- Use responsive utilities (`md:`) to switch layout from single-column (mobile) to two-column (desktop). The signup form hides the logo on small screens to prioritize the form.
- Prefer `min-h-screen` for vertical centering rather than `h-screen` so content can expand beyond the viewport if needed without clipping.
- **Color Scheme (Current):** Indigo-to-purple gradient theme for modern, professional appearance with clear visual hierarchy
  - Primary: Indigo-600 (headings, focus states, button gradient start)
  - Secondary: Purple-600/700 (button gradient end, logo panel gradient)
  - Accents: Gray-50/300/600/700 (inputs, labels, secondary text)
  - Background: Subtle gradient (indigo-50 → white → purple-50)
  - Shadows: Indigo-tinted for cohesion (indigo-200 for card, indigo-500/50 for button glow)

---

## 🔐 LoginPage - Utilities used

This section documents Tailwind utilities specific to `src/features/auth/LoginPage.jsx`.

| Class | CSS | Purpose / Why used |
|------|-----|--------------------|
| `mb-2` | margin-bottom: 0.5rem | Small spacing between heading and subtitle |
| `mb-6` | margin-bottom: 1.5rem | Larger spacing after subtitle before form |
| `mt-4` | margin-top: 1rem | Spacing above "Don't have an account?" link |
| `text-center` | text-align: center | Centers heading and subtitle text |
| `text-sm` | font-size: 0.875rem | Smaller font for signup link (secondary action) |
| `hover:text-indigo-700` | hover color change | Darker indigo on hover for link affordance |

**Notes:**
- LoginPage uses the same design system as SignupPage (indigo-purple gradient theme)
- Reuses most utilities from SignupPage (flex centering, gradient backgrounds, form inputs)
- Only unique utilities are documented here
- Main differences: Simplified validation (no confirmPassword), single identifier field

---

## 🔄 AuthProvider - Loading Spinner Utilities

This section documents Tailwind utilities used for the loading state in `src/features/auth/AuthProvider.jsx`.

| Class | CSS | Purpose / Why used |
|------|-----|--------------------|
| `inline-block` | display: inline-block | Allows animation on span element |
| `h-12` | height: 3rem | Sets spinner size (48px) |
| `w-12` | width: 3rem | Sets spinner size (48px) |
| `animate-spin` | animation: spin | Built-in Tailwind animation for rotating spinner |
| `rounded-full` | border-radius: 9999px | Makes square div into perfect circle |
| `border-4` | border-width: 4px | Thickness of spinner ring |
| `border-solid` | border-style: solid | Solid border for spinner |
| `border-indigo-600` | border-color: indigo-600 | Primary brand color for spinner |
| `border-r-transparent` | border-right-color: transparent | Transparent right border creates spinning effect |

**How the spinner works:**
1. Square div with equal width/height (`h-12 w-12`)
2. Made circular with `rounded-full`
3. Thick border (`border-4 border-solid border-indigo-600`)
4. Right border made transparent (`border-r-transparent`) creates gap
5. `animate-spin` rotates the element, creating spinning animation
6. Result: Classic loading spinner in brand color

**Usage context:**
- Shown while AuthProvider checks for existing session on app load
- Prevents flash of logged-out state
- Better UX than rendering app immediately with wrong auth state

---

## 📰 FeedPage - Utilities used

This section documents Tailwind utilities used for the feed page stub in `src/features/feed/FeedPage.jsx`.

| Class | CSS | Purpose / Why used |
|------|-----|--------------------|
| `bg-gray-50` | background-color: gray-50 | Very light gray background for page (softer than white) |
| `p-8` | padding: 2rem | Page padding for breathing room |
| `max-w-4xl` | max-width: 56rem | Constrains content width for readability (same as signup card) |
| `mx-auto` | margin-left: auto; margin-right: auto | Centers content horizontally |
| `flex` | display: flex | Creates flex container for header layout |
| `justify-between` | justify-content: space-between | Pushes heading left and logout button right |
| `items-center` | align-items: center | Vertically centers heading and button |
| `text-3xl` | font-size: 1.875rem | Large heading size |
| `text-gray-900` | color: gray-900 | Darkest gray for heading (strong contrast on light bg) |
| `mb-4` | margin-bottom: 1rem | Spacing below heading |
| `mb-6` | margin-bottom: 1.5rem | Larger spacing below header section |
| `mt-2` | margin-top: 0.5rem | Small spacing above subtitle |
| `bg-white` | background-color: white | White card background for content |
| `rounded-lg` | border-radius: 0.5rem | Rounded corners for card |
| `shadow` | box-shadow (default) | Subtle shadow for card elevation |
| `p-6` | padding: 1.5rem | Internal card padding |
| `text-gray-500` | color: gray-500 | Medium gray for body text |
| `text-gray-400` | color: gray-400 | Lighter gray for secondary text |
| `text-sm` | font-size: 0.875rem | Smaller text for secondary content |

**Logout Button Utilities:**

| Class | CSS | Purpose / Why used |
|------|-----|--------------------|
| `px-4` | padding-left/right: 1rem | Horizontal padding for button |
| `py-2` | padding-top/bottom: 0.5rem | Vertical padding for button |
| `bg-red-600` | background-color: red-600 | Red background (indicates destructive action) |
| `text-white` | color: white | White text for contrast on red background |
| `font-medium` | font-weight: 500 | Medium weight for button text |
| `rounded-lg` | border-radius: 0.5rem | Rounded button corners |
| `hover:bg-red-700` | hover background: red-700 | Darker red on hover for affordance |
| `transition-colors` | transition: color/background | Smooth color transitions |
| `duration-200` | transition-duration: 200ms | Fast transition timing |

**Notes:**
- FeedPage uses a different layout pattern than auth pages (full-width with max-width constraint)
- No gradient backgrounds (cleaner, simpler feed layout)
- Uses grayscale palette for content-focused design
- **Logout button**: Red color follows UX convention for destructive/exit actions
- Header uses flexbox with `justify-between` for classic "title left, actions right" pattern
- Placeholder stub - will be replaced with actual feed content

**Last Updated:** November 7, 2025
