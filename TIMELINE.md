# SnapShare Frontend - Development Timeline

## Phase 1: Initial Setup & Configuration

### ✅ Project Bootstrap
- Created Vite + React app
- Installed dependencies:
  - Redux Toolkit + react-redux
  - TanStack Query + devtools
  - React Router DOM
  - React Hook Form + Zod + @hookform/resolvers
  - Axios
  - React Hot Toast
  - React Icons
  - Tailwind CSS v4 + Vite plugin

### ✅ Tailwind CSS v4 Setup
- Installed `@tailwindcss/vite` plugin
- Added `@import "tailwindcss"` to `index.css`
- Configured `vite.config.js` with Tailwind plugin
- Cleaned up Vite boilerplate (removed demo files)

### ✅ Redux Store Configuration
- Created `app/store.js` with `configureStore`
- Created `features/auth/authSlice.js`:
  - State: `{ user: null, isAuthenticated: false }`
  - Actions: `setUser`, `logout`
- Wrapped app with `<Provider store={store}>` in `main.jsx`

### ✅ TanStack Query Setup
- Created `app/queryClient.js` with default options:
  - `staleTime: 60s`
  - `retry: 1`
  - `refetchOnWindowFocus: false`
- Wrapped app with `<QueryClientProvider>` in `main.jsx`

### ✅ Axios Configuration
- Created `api/axios.js` with base instance:
  - `baseURL: import.meta.env.VITE_API_URL`
  - `withCredentials: true` (for cookie-based auth)
  - Default headers: `Content-Type: application/json`
- **Important Note:** Axios automatically treats any HTTP status code outside the 200–299 range as an error and throws an exception. This means server responses with status 400, 401, 404, 500, etc. will be caught in the `catch` block, not the `then` block. Always access error response data via `error.response.data`

### ✅ Router Setup (Option A: createBrowserRouter)
- Created `routes/AppRoutes.jsx` using `createBrowserRouter`
- Defined routes:
  - `/` → redirects to `/signup`
  - `/signup` → `<SignupPage />`
  - `/login` → `<LoginPage />`
- Wrapped app with `<RouterProvider router={router}>` in `main.jsx`

### ✅ Environment Variables
- Created `.env` file:
  - `VITE_API_URL=https://snapshare-4qm6.onrender.com` (backend URL)

### ✅ Provider Hierarchy in main.jsx
```
<StrictMode>
  <Provider store={store}>           ← Redux
    <QueryClientProvider client={queryClient}> ← TanStack Query
      <RouterProvider router={router}>         ← React Router
        <Toaster />                             ← React Hot Toast
      </RouterProvider>
    </QueryClientProvider>
  </Provider>
</StrictMode>
```

### ✅ Component Stubs Created
- `features/auth/SignupPage.jsx` (minimal stub)
- `features/auth/LoginPage.jsx` (minimal stub)
- `features/auth/SignupCompletePage.jsx` (empty)
- `components/Input.jsx` (empty)
- `components/Button.jsx` (empty)

---

## Phase 2: Feature Development (In Progress)

### ✅ Signup Page - Form Validation
- Created Zod validation schema in `SignupPage.jsx`:
  - `username`: 3-20 chars, alphanumeric + underscore only
  - `email`: valid email format
  - `displayName`: 3-20 chars
  - `password`: minimum 6 characters
- Integrated react-hook-form with Zod using `zodResolver`:
  ```jsx
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(SignupSchema)
  })
  ```
- Form fields connected with `{...register('fieldName')}`
- Error messages display inline from Zod validation
- Submit button disabled during submission (`isSubmitting` state)

### ✅ Signup Page - Layout & Styling
- Implemented full-screen centered layout using Tailwind:
  - `flex items-center justify-center min-h-screen` for perfect centering
  - Created Logo component import
- Created `tailwindNotes.md` to document all Tailwind utilities used
  - Tracks each class with CSS equivalent and usage context
  - Explains common patterns (flex centering vs margin auto vs grid)

### ✅ SignupCompletePage - Profile Completion (Step 2)
- Created profile completion page with shadcn/ui components
- Features implemented:
  - Avatar upload with live preview (FileReader API)
  - Optional bio textarea
  - Optional website URL input
  - "Skip" button to bypass profile completion
  - "Save & Continue" button with gradient styling
- Layout: Centered card design matching SignupPage aesthetic
- **Form Handling:** Uses react-hook-form for consistency
  - File input managed via `setValue` and manual `onChange`
  - FormData automatically created with avatar file + text fields
  - Single API call to `PUT /users/complete-profile/:id`
- **Backend Integration:** Fully connected
  - Sends multipart/form-data with all optional fields
  - Updates Redux store with returned user data
  - Toast notifications for success/error
  - Navigation: Both actions route to `/feed` after completion
- Status: ✅ Complete and functional

### 🔄 Next Steps
- [ ] Implement LoginPage with Zod validation (similar to SignupPage)
- [ ] Add protected routes (redirect to /login if not authenticated)
- [ ] Add session persistence (check for existing auth cookie on app load)
- [ ] Build Feed page structure
- [ ] Create Post components and features
- [ ] Build reusable Input and Button components (extract patterns from SignupPage)
- [ ] Add profile page and edit functionality
- [ ] Test complete signup flow end-to-end with live backend

---

## 📜 Detailed Work Log (errors, causes, fixes)

This section records the exact step-by-step events, the runtime or build errors encountered during development, the cause analysis, and the resolution applied.

- Nov 4, 2025 — Implemented `SignupPage.jsx` with initial form fields and attempted to wire react-hook-form. Immediate error: "Invalid hook call. Hooks can only be called inside the body of a function component." Cause: `useForm()` was invoked at module top-level. Fix: moved `useForm()` inside the `SignupPage` component function. Result: hook error resolved and HMR continued.

- Nov 4, 2025 — After adding routes, visiting `/` produced an import error. Error: "SignupPage is not exported". Cause: `SignupPage.jsx` used a named export (`export const SignupPage`) while `AppRoutes.jsx` imported a default. Fix: changed `SignupPage.jsx` to `export default SignupPage`. Result: route mounts and page renders.

- Nov 4, 2025 — App crashed during route resolving. Cause: `LoginPage.jsx` file was empty and the router attempted to import it. Fix: add minimal default export for `LoginPage` (stub) so the router can load. Result: router stabilized.

- Nov 4, 2025 — Toasts were not appearing. Investigation: `<Toaster />` was nested inside `<RouterProvider>` which sometimes caused portal mounting issues. Fix: moved `<Toaster />` out of the router and placed it alongside providers in `main.jsx`. Result: toasts render reliably on signup success/failure.

- Nov 4, 2025 — Typo: button disabled logic used `!isValide`. Cause: simple misspelling. Fix: change to `!isValid` (from `formState`). Result: submit button enabling logic correct.

- Nov 4, 2025 — Zod schema runtime error. Cause: `confirmPassword` typed with `z.string.min(...)` (missing parentheses). Fix: update to `z.string().min(...)`. Also added `.refine()` to validate password equality and provide a clear message on `confirmPassword`. Result: client-side validation robust and clear.

- Nov 4–5, 2025 — Backend call returned user payload at `res.data.user`. Initial code dispatched `setUser({res})` (wrapped object). Fix: change to `dispatch(setUser(res.data.user))`. Result: Redux store now holds the correct user object.

- Nov 5, 2025 — Console logging was noisy in dev output (form data, full response, errors). Action: wrapped logs in `if (import.meta.env.DEV) { ... }` to limit to development builds. Result: logs retained for debugging, removed from production bundle.

- Nov 5, 2025 — UX improvement: avoid sending `confirmPassword` to backend. Implementation: destructure `const { confirmPassword, ...dataToSend } = formData;` and post `dataToSend` to `/register`.

- Nov 5, 2025 — After successful registration, dispatch the user to Redux and `navigate('/signup/complete')` (or application-chosen landing). Implementation included `useNavigate()` and calling `navigate` after dispatch.

- Nov 5, 2025 — **Color Scheme Redesign:** Replaced initial orange/amber color palette with modern indigo-to-purple gradient theme for better visual hierarchy and professional appearance. Changes:
  - Background: Subtle gradient `bg-linear-to-br from-indigo-50 via-white to-purple-50` (Tailwind v4 syntax)
  - Card shadow: Enhanced with `shadow-2xl shadow-indigo-200` for depth
  - Heading: Changed to `text-indigo-600` with larger `text-2xl` size, updated text to "Create your account"
  - Labels: Updated to `text-gray-700 font-medium` for better hierarchy
  - Inputs: Added `bg-gray-50` background, `rounded-lg` corners, `focus:ring-indigo-500 focus:border-indigo-500` for cohesive focus states
  - Button: Gradient background `bg-linear-to-r from-indigo-600 to-purple-600` with hover state `hover:from-indigo-700 hover:to-purple-700`, added `shadow-lg shadow-indigo-500/50` for glow effect, increased padding to `py-3`
  - Logo panel: Gradient `bg-linear-to-br from-indigo-600 to-purple-700`
  - Result: Cohesive modern design with better contrast, clear visual hierarchy, and smooth transitions

- Nov 5, 2025 — **Border-radius fix for logo panel:** Added `rounded-r-2xl` to the right panel (logo section). Cause: Child elements with their own backgrounds don't inherit parent border-radius. The gradient background was covering the card's rounded corners. Fix: Apply `rounded-r-2xl` specifically to round only the top-right and bottom-right corners of the logo panel. Result: Logo panel now matches the card's rounded appearance.

- Nov 5, 2025 — **SignupCompletePage Implementation:** Built the second step of signup flow for optional profile completion. Features:
  - Avatar upload with preview using FileReader API
  - Bio text area (optional)
  - Website URL input (optional)
  - "Skip" and "Save & Continue" buttons
  - Uses shadcn/ui components (Card, Avatar, Input, Textarea, Button)
  - Gradient button matching SignupPage theme (`bg-linear-to-r from-[#3B82F6] to-[#8B5CF6]`)
  - Navigation to `/feed` on completion or skip
  - **Refactored with react-hook-form:** Integrated react-hook-form for consistent form handling
  - Single FormData request to backend with avatar + bio + website
  - Gets user ID from Redux state
  - Updates Redux with new user data after successful profile update

- Nov 5, 2025 — **Backend Enhancement:** Added combined profile completion endpoint to handle avatar upload + optional fields in one request:
  - New route: `PUT /api/users/complete-profile/:id` (accepts multipart/form-data via multer)
  - Enhanced `updateUser` controller to handle optional avatar file via multer middleware
  - Added `website` field to User model schema
  - Automatically deletes old avatar from Cloudinary when uploading new one
  - Controller now handles: displayName, bio, website, username, avatar (all optional)
  - Validates at least one field is present before updating

- Nov 6, 2025 — **Cookie CORS Fix & NODE_ENV Configuration:** Fixed "no access token" error for cross-origin requests. Issue: Cookies weren't being sent from frontend (localhost) to backend (render.com) because `sameSite` attribute was missing AND `NODE_ENV` was set to development on Render. Solution implemented in two parts:
  
  **Part 1 - Code Changes:**
  - Added `sameSite` attribute to cookie configuration in register.js and login.js
  - Production: `sameSite: 'none'` with `secure: true` (required for cross-origin HTTPS)
  - Development: `sameSite: 'lax'` (works for same-origin localhost)
  - Applied to both accessToken and refreshToken cookies
  - Code: `sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'`
  
  **Part 2 - Render Configuration:**
  - Added `NODE_ENV=production` environment variable in Render dashboard
  - This ensures the production cookie settings (`sameSite: 'none'`) are used on deployed backend
  - Without this, backend defaults to development mode even on Render
  
  **Result:** Cross-origin authentication now works correctly. Cookies are set with proper attributes and sent with requests from localhost to render.com domain.

- Nov 5, 2025 — **Routes Configuration:** Updated `AppRoutes.jsx` to include `/signup/complete` route pointing to `<SignupCompletePage/>`. Full routing structure:
  - `/` → redirects to `/signup`
  - `/signup` → SignupPage (fully functional)
  - `/signup/complete` → SignupCompletePage (UI complete)
  - `/login` → LoginPage (stub only)

**Notes:** entries above are recorded in the order encountered; each list item includes the observed error/message, root cause, and the fix applied so a future developer can trace what was changed and why.

---

## 📝 Technical Notes & Concepts

### FileReader API

**What is FileReader?**
- Built-in browser API for reading file contents asynchronously
- Part of the File API specification (not React-specific)
- Allows JavaScript to read files selected by the user via `<input type="file">`

**Why do we use it?**
In `SignupCompletePage`, we use FileReader to create a **preview** of the selected avatar image before uploading to the server. This provides instant visual feedback to the user.

**How it works:**
```javascript
const reader = new FileReader()
reader.onloadend = () => setAvatarPreview(reader.result) // Callback when reading is complete
reader.readAsDataURL(file) // Reads file as base64-encoded data URL
```

**Key Methods:**
- `readAsDataURL(file)` - Reads file as base64 string (e.g., `data:image/png;base64,iVBORw0KG...`)
- `readAsText(file)` - Reads file as plain text
- `readAsArrayBuffer(file)` - Reads file as binary data
- `readAsBinaryString(file)` - Reads file as raw binary string

**Important Distinction:**
- **FileReader output** (base64 string): Used for **preview only** in the UI
- **File object**: The actual file sent to the backend via FormData
- We store both separately:
  ```javascript
  setValue("avatar", file) // File object → sent to backend (multer needs this)
  setAvatarPreview(reader.result) // Base64 string → shown in <img> tag
  ```

**Why not send the base64 to backend?**
- Base64 encoding increases file size by ~33%
- Multer expects actual File objects in multipart/form-data
- FormData automatically handles File objects correctly
- Cloudinary uploads work directly with File objects

**Browser Support:** All modern browsers (IE10+)

---

### Cookie SameSite Attribute

**What is SameSite?**
- A cookie attribute that controls when browsers send cookies with cross-origin requests
- Security feature to prevent CSRF (Cross-Site Request Forgery) attacks
- Required for modern web applications with frontend/backend on different domains

**Why do we need it?**
In SnapShare, the frontend (localhost:5173) and backend (snapshare-4qm6.onrender.com) are on **different origins**. By default, browsers won't send cookies in cross-origin requests without proper configuration.

**SameSite Values:**

1. **`SameSite=Strict`**
   - **Most restrictive**
   - Cookies are ONLY sent with same-site requests (same domain)
   - Example: Cookie from example.com is ONLY sent to example.com
   - Use case: Banking sites, high-security applications
   - ❌ Won't work for our app (frontend and backend are different domains)

2. **`SameSite=Lax`** (browser default)
   - **Moderately restrictive**
   - Cookies sent with same-site requests AND top-level navigation (like clicking links)
   - Blocks cookies in cross-origin POST/PUT/DELETE requests
   - Use case: Same-origin apps (frontend and backend on same domain)
   - ✅ Perfect for **development** (localhost → localhost)
   - ❌ Won't work for **production** (localhost → render.com)

3. **`SameSite=None`**
   - **Least restrictive**
   - Cookies sent with ALL requests (same-site and cross-site)
   - **Requires `Secure=true`** (must use HTTPS)
   - Use case: Cross-origin authentication, embedded widgets, third-party integrations
   - ✅ Required for **production** (localhost → render.com)
   - ⚠️ More vulnerable to CSRF (mitigated by httpOnly and CORS config)

**Our Configuration:**
```javascript
res.cookie("accessToken", token, {
  httpOnly: true,  // ← Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === 'production',  // ← HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // ← Key setting
  maxAge: 24*60*60*1000  // ← 1 day expiration
});
```

**Why Dynamic sameSite?**
- **Development (localhost:5173 → localhost:3000)**: `sameSite: 'lax'` works fine because both frontend and backend are on localhost (same-site)
- **Production (localhost:5173 → snapshare-4qm6.onrender.com)**: `sameSite: 'none'` required because domains are different (cross-origin)

**Common Pitfalls:**
1. ❌ Setting `sameSite: 'none'` without `secure: true` → Browser rejects cookie
2. ❌ Using HTTP in production with `sameSite: 'none'` → Requires HTTPS
3. ❌ Forgetting `withCredentials: true` in axios → Cookies not sent even with correct sameSite
4. ❌ Setting `NODE_ENV=development` on production server → Uses `sameSite: 'lax'` which breaks cross-origin

**Security Considerations:**
- `httpOnly: true` prevents XSS attacks (JavaScript can't access cookie)
- `secure: true` prevents man-in-the-middle attacks (HTTPS only)
- `sameSite: 'none'` opens CSRF vulnerability, but we mitigate with:
  - CORS configuration (only allow specific origins)
  - Token verification middleware
  - Short token expiration times

**Testing sameSite:**
- Chrome DevTools → Application → Cookies → Check "SameSite" column
- Network tab → Check if cookies are sent with request headers
- Console: `document.cookie` won't show httpOnly cookies (expected behavior)

**Resources:**
- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [OWASP: SameSite Cookie Attribute](https://owasp.org/www-community/SameSite)

---

## Decisions & Architecture

### State Management Strategy
- **Redux Toolkit**: Client/UI state (current user, auth status, modals, theme)
- **TanStack Query**: Server state (posts, comments, likes, user profiles)

### Why This Split?
- User login/signup: one-time action → store result in Redux
- Posts/comments/likes: frequently changing server data → cache with TanStack Query
- Avoids N+1 queries, automatic refetching, optimistic updates

### Router Choice
- Using `createBrowserRouter` (React Router v6.4+)
- No shared layout wrapper (each route isolated)
- Can add data loaders/actions later if needed

### Component Library
- Using **shadcn/ui** components (Radix UI + Tailwind)
- Components: Card, Avatar, Input, Textarea, Button, Dialog, Dropdown, etc.
- Installed via `components.json` configuration
- Benefits: Accessible, customizable, copy-paste approach (not npm package)

### Current Routes
```
/ → redirects to /signup
/signup → SignupPage (functional with validation)
/signup/complete → SignupCompletePage (UI complete)
/login → LoginPage (stub)
```

---

## 📊 Frontend Review Summary (November 5, 2025)

### ✅ Completed & Working
1. **Core Setup**: Vite, React 19, all dependencies installed
2. **State Management**: Redux store + authSlice operational
3. **Server State**: TanStack Query client configured
4. **HTTP Client**: Axios instance with credentials support
5. **Routing**: createBrowserRouter with 4 routes configured
6. **SignupPage (Step 1)**: Fully functional
   - Zod validation schema (5 fields + password matching)
   - react-hook-form integration
   - API integration with error handling
   - Redux dispatch on success
   - Navigation to `/signup/complete`
   - Modern indigo-purple gradient design
   - Responsive layout (mobile/desktop)
7. **SignupCompletePage (Step 2)**: ✅ Fully functional
   - Avatar upload with preview (FileReader + FormData)
   - Optional bio and website fields
   - react-hook-form integration
   - Single multipart/form-data request to backend
   - Redux update with new user data
   - Skip/Save actions with loading states
   - Toast notifications
   - Matches design system
8. **Backend Profile Endpoint**: Enhanced updateUser controller
   - New route: `PUT /users/complete-profile/:id`
   - Handles avatar upload via multer + optional text fields
   - Cloudinary integration for avatar storage
   - Old avatar cleanup before new upload
9. **Design System**: Consistent indigo-purple gradient theme across pages

### ⚠️ Known Issues
- **CSS Warnings** in `index.css`: Unknown at-rules `@custom-variant`, `@theme`, `@apply` (Tailwind v4 + shadcn setup - these are expected and don't affect functionality)

### 🔄 In Progress / Pending
- **LoginPage**: Stub only, needs full implementation with Zod
- **Protected Routes**: Not implemented yet
- **Session Persistence**: Not checking for existing cookies on app load
- **Feed/Posts**: Not started
- **Reusable Components**: Input/Button stubs exist but unused

### 📈 Progress: ~75% of Auth Flow Complete
- ✅ User registration (Step 1) - Fully functional
- ✅ Profile completion (Step 2) - Fully functional with backend integration
- ✅ Backend endpoints - Complete profile route added
- ⏳ Login page - Needs implementation
- ⏳ Protected routes - Needs implementation
- ⏳ Session persistence - Needs implementation

---

**Last Updated:** November 5, 2025
