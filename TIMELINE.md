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

- Nov 6, 2025 — **LoginPage Implementation:** Built the login page with username/email + password authentication. Features:
  - Single `identifier` field accepts both username OR email
  - Zod validation (simple required field validation)
  - react-hook-form integration
  - Transforms `identifier` into both `username` and `email` before sending to backend (backend's `$or` query matches whichever is correct)
  - API call to `POST /login`
  - Redux dispatch on success
  - Navigation to `/feed` after successful login
  - Toast notifications for success/error
  - Loading state on button ("Logging in..." text)
  - Link to signup page for new users
  - Matches indigo-purple gradient design system
  - Status: ✅ Complete and functional

- Nov 6, 2025 — **Session Persistence Implementation:** Added automatic session restoration when app loads/refreshes. Without this, Redux state resets on refresh even though cookies persist, making users appear logged out. Solution:
  
  **Backend Changes:**
  - Created `controller/getCurrentUser.js` - Returns current user based on JWT cookie
  - Added route: `GET /api/auth/me` with `verifyToken` middleware
  - Endpoint verifies cookie, fetches user from database, returns user data (without password)
  
  **Frontend Changes:**
  - Created `features/auth/AuthProvider.jsx` component
  - On mount, calls `/api/auth/me` to check for existing session
  - If valid cookie exists → dispatches user to Redux
  - If no cookie/invalid → leaves Redux empty (user stays null)
  - Shows loading spinner during auth check (better UX than flash of logged-out state)
  - Wraps entire app in `main.jsx` to run before routes render
  
  **Updated Provider Hierarchy:**
  ```jsx
  <Provider store={store}>           // Redux
    <QueryClientProvider>            // TanStack Query
      <AuthProvider>                 // Session check (NEW)
        <RouterProvider>             // Routes
          <Toaster />                // Notifications
        </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
  ```
  
  **How It Works:**
  - First visit: User logs in → cookies set → Redux updated
  - After refresh: AuthProvider calls `/api/auth/me` → backend verifies cookie → returns user → Redux restored
  - Cookie expired/logged out: API returns 401 → AuthProvider does nothing → Redux stays empty
  - **Result:** One API call per page load (~100-200ms) to verify session and restore state. Cookies persist in browser, this just syncs Redux with cookie state.

- Nov 7, 2025 — **Protected Routes Implementation:** Added client-side route protection to prevent unauthorized access to authenticated pages. Without this, users could navigate to protected pages and see errors when API calls fail. Solution:
  
  **Frontend Changes:**
  - Created `components/ProtectedRoute.jsx` component
  - Uses Redux selector to check if user exists
  - If no user → instant redirect to `/login` (before page renders)
  - If user exists → renders the protected page (children)
  - Uses `replace` prop to prevent back button from returning to protected page
  
  **Protected Routes:**
  - `/feed` - Main feed page (wrapped in ProtectedRoute)
  - `/signup/complete` - Profile completion page (wrapped in ProtectedRoute)
  - Future: `/profile/:username`, `/settings`, `/post/create`, etc.
  
  **Public Routes (no protection):**
  - `/signup` - Anyone can sign up
  - `/login` - Anyone can log in
  - `/` - Redirects to signup (public landing)
  
  **Usage Pattern:**
  ```jsx
  // In AppRoutes.jsx
  { 
    path: "/feed", 
    element: (
      <ProtectedRoute>
        <FeedPage />
      </ProtectedRoute>
    )
  }
  ```
  
  **How It Works:**
  1. User navigates to protected route (e.g., `/feed`)
  2. AuthProvider has already restored Redux state (if valid session exists)
  3. ProtectedRoute checks Redux for user
  4. No user? → Redirect to `/login` instantly (page never renders)
  5. User exists? → Render the protected page
  
  **Created FeedPage Stub:**
  - Simple page displaying logged-in user's name
  - Placeholder for future feed content
  - Demonstrates protected route working correctly
  
  **Result:** Clean UX with instant redirects, no wasted API calls, no flash of unauthorized content.

- Nov 7, 2025 — **Logout Functionality Implementation:** Added complete logout flow to clear session and redirect users. Solution:
  
  **Frontend Changes:**
  - Added logout button to FeedPage (red button in top-right corner)
  - Implemented `handleLogout` function that:
    1. Calls backend `POST /logout` to clear cookies
    2. Dispatches `logout()` action to clear Redux state
    3. Shows success toast notification
    4. Redirects to `/login` page
  - Error handling: Even if backend call fails, clears local state and redirects
  
  **Backend Fix - Cookie Clearing Issue:**
  - **Problem Discovered:** `res.clearCookie()` was missing the same options used when setting cookies
  - Browser requires **exact same options** (httpOnly, secure, sameSite) to recognize and delete the cookie
  - Without matching options, cookies weren't being cleared, causing session to restore on refresh
  
  **Backend Solution:**
  - Updated `controller/logout.js` to include cookie options:
    ```javascript
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    ```
  - Options now match those used in `register.js` and `login.js`
  
  **How It Works:**
  1. User clicks Logout button
  2. Backend clears cookies with correct options → Cookies deleted
  3. Redux state cleared
  4. User redirected to `/login`
  5. On refresh: AuthProvider finds no cookies → Session NOT restored
  6. User stays logged out correctly
  
  **Result:** Logout now works properly - cookies cleared, session ended, no auto-restore on refresh.

- Nov 7, 2025 — **Auth Page Redirect Logic:** Added automatic redirect for logged-in users trying to access login/signup pages. Prevents confusion when authenticated users navigate to auth pages.
  
  **Frontend Changes:**
  - Added useEffect to `LoginPage.jsx` and `SignupPage.jsx`
  - Checks Redux for user on component mount
  - If user exists → redirect to `/feed` with `replace: true`
  - Uses `replace` to prevent back button from returning to auth pages
  
  **Code Pattern:**
  ```jsx
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true });
    }
  }, [user, navigate]);
  ```
  
  **Scenarios Handled:**
  1. Logged-in user manually types `/login` in URL → Auto-redirect to `/feed`
  2. Logged-in user refreshes on `/login` → AuthProvider restores session → Auto-redirect to `/feed`
  3. Logged-out user accesses `/login` → Stays on login page (correct)
  
  **Result:** Logged-in users can't access auth pages, preventing double login attempts and confusion.

- Nov 5, 2025 — **Routes Configuration:** Updated `AppRoutes.jsx` to include `/signup/complete` route pointing to `<SignupCompletePage/>`. Full routing structure:
  - `/` → redirects to `/signup`
  - `/signup` → SignupPage (fully functional)
  - `/signup/complete` → SignupCompletePage (fully functional)
  - `/login` → LoginPage (fully functional)

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

### AuthProvider vs ProtectedRoute

**The Confusion:** Both seem to check authentication. Why do we need both?

**The Answer:** They serve completely different purposes in the auth flow.

#### AuthProvider (`features/auth/AuthProvider.jsx`)

**Purpose:** Restore session state when app loads

**What it does:**
- Wraps entire app ONCE in `main.jsx`
- Runs on app mount (when page first loads or refreshes)
- Calls `/api/auth/me` to check if user has valid session
- If valid cookie exists → dispatches user to Redux
- If no/invalid cookie → does nothing (Redux stays empty)
- Shows loading spinner while checking

**What it does NOT do:**
- ❌ Doesn't prevent route access
- ❌ Doesn't redirect users
- ❌ Doesn't protect pages

**When it runs:**
- On every page load/refresh
- Before routes render

**Wrapping pattern:**
```jsx
// main.jsx - Wraps EVERYTHING once
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

**Example flow:**
1. User refreshes page
2. AuthProvider calls `/api/auth/me`
3. Valid cookie? → Restore user to Redux
4. No cookie? → Redux stays empty
5. Then routes render

---

#### ProtectedRoute (`components/ProtectedRoute.jsx`)

**Purpose:** Guard individual routes from unauthorized access

**What it does:**
- Wraps specific routes individually in `AppRoutes.jsx`
- Checks Redux for user (synchronous, instant)
- If no user → redirects to `/login` (before rendering page)
- If user exists → renders the protected page
- Runs every time you navigate to a protected route

**What it does NOT do:**
- ❌ Doesn't fetch user data
- ❌ Doesn't call APIs
- ❌ Doesn't restore sessions

**When it runs:**
- Every time you navigate to a protected route
- After AuthProvider has already run

**Wrapping pattern:**
```jsx
// AppRoutes.jsx - Wraps EACH protected route
{ 
  path: "/feed", 
  element: <ProtectedRoute><FeedPage /></ProtectedRoute> 
}
{ 
  path: "/profile", 
  element: <ProtectedRoute><ProfilePage /></ProtectedRoute> 
}
// Public routes don't need wrapping
{ path: "/login", element: <LoginPage /> }
```

**Example flow:**
1. User navigates to `/feed`
2. ProtectedRoute checks Redux
3. No user? → Redirect to `/login` instantly
4. Has user? → Render FeedPage

---

#### Side-by-Side Comparison

| Feature | AuthProvider | ProtectedRoute |
|---------|-------------|----------------|
| **Purpose** | Restore session state | Guard routes |
| **Where used** | `main.jsx` (once) | `AppRoutes.jsx` (per route) |
| **Wraps** | Entire app | Individual routes |
| **Runs** | On app load/refresh | On route navigation |
| **API calls** | Yes (`/api/auth/me`) | No |
| **Checks** | Cookie validity | Redux state |
| **Speed** | ~100-200ms (async) | Instant (sync) |
| **Action if no auth** | Does nothing | Redirects to `/login` |
| **Action if authenticated** | Dispatches to Redux | Renders children |
| **Loading state** | Shows spinner | No loading needed |

---

#### Why We Need BOTH

**Without AuthProvider:**
- User refreshes page → Redux resets → appears logged out
- Even though cookies are still valid!
- ProtectedRoute sees no user → redirects to login
- Bad UX: logged-in user forced to log in again

**Without ProtectedRoute:**
- User can navigate to `/feed` without logging in
- Page starts rendering
- API calls fire → backend rejects (401)
- User sees error message
- Bad UX: page loads then errors

**With BOTH:**
1. ✅ AuthProvider restores session on refresh
2. ✅ ProtectedRoute prevents unauthorized page access
3. ✅ Clean UX with instant feedback
4. ✅ No wasted API calls
5. ✅ Sessions persist across refreshes

---

#### The Complete Auth Flow

**Scenario: User refreshes page on `/feed`**

```
1. App loads → AuthProvider wraps everything
   ↓
2. AuthProvider calls /api/auth/me
   ↓ (100-200ms delay)
3a. Valid cookie → Dispatch user to Redux
   ↓
4a. Router navigates to /feed
   ↓
5a. ProtectedRoute checks Redux → User exists ✅
   ↓
6a. FeedPage renders

3b. No/invalid cookie → Redux stays empty
   ↓
4b. Router tries to navigate to /feed
   ↓
5b. ProtectedRoute checks Redux → No user ❌
   ↓
6b. Redirect to /login
```

---

#### Analogy

**AuthProvider** = Security desk at building entrance
- Checks your ID badge when you enter
- Restores your access credentials
- Runs once when you arrive

**ProtectedRoute** = Locked doors throughout building
- Each floor/room checks if you have valid badge
- Instantly denies access if no badge
- Runs every time you try to enter a room

You need both:
- Security desk restores your badge
- Locked doors verify you have it

---

## Decisions & Architecture

### State Management Strategy
- **Redux Toolkit**: Client/UI state (current user, auth status, modals, theme)
- **TanStack Query**: Server state (posts, comments, likes, user profiles)

### Why This Split?
- User login/signup: one-time action → store result in Redux
- Posts/comments/likes: frequently changing server data → cache with TanStack Query
- Avoids N+1 queries, automatic refetching, optimistic updates

### Why Use Redux for User State?

**The Question:** Since backend validates all requests with JWT cookies and protected routes are enforced server-side, why store user in Redux at all?

**The Answer:** Redux is for **frontend convenience and UX**, not security.

#### What Redux Does NOT Provide:
- ❌ API Security (backend handles with cookies + middleware)
- ❌ Data protection (backend is the real gatekeeper)
- ❌ Authorization enforcement (backend rejects unauthorized requests)

#### What Redux DOES Provide:

**1. Prevents Wasted API Calls**
```jsx
// Without Redux: Every component fetches current user
function Navbar() {
  const { data: user } = useQuery('currentUser', fetchMe); // API call
}
function Sidebar() {
  const { data: user } = useQuery('currentUser', fetchMe); // Same call again!
}

// With Redux: Fetch once, use everywhere
function Navbar() {
  const user = useSelector(state => state.auth.user); // Instant, no API call
}
```

**2. Instant Client-Side Route Protection**
```jsx
// Without Redux:
// User navigates to /feed → Page loads → API call fires → Backend rejects (401)
// → Error shown → Redirect to login
// BAD UX: Page flash, wasted request, slow feedback

// With Redux:
// User navigates to /feed → ProtectedRoute checks Redux → No user? Instant redirect
// GOOD UX: No page flash, no wasted API call, instant feedback
```

**3. Conditional UI Rendering**
```jsx
{user ? <CreatePostButton /> : <LoginPrompt />}
{user?.id === post.authorId && <DeleteButton />}
<Avatar src={user?.avatarUrl} />
<span>Welcome, {user?.username}</span>
```

#### Could You Skip Redux?

**Yes!** You could use TanStack Query for user state:
```jsx
const { data: user } = useQuery({
  queryKey: ['currentUser'],
  queryFn: fetchMe,
  staleTime: Infinity, // Cache forever
});
```

TanStack Query caches globally, so you only fetch once. But:
- Still need to handle loading states in every component
- Protected routes would need async checks (slower UX)
- More boilerplate for auth-specific logic

#### Our Approach:
- **Redux for auth state** (simple, synchronous, instant access)
- **TanStack Query for server data** (posts, comments, likes - frequently changing)
- **Backend for security** (real enforcement, Redux is just a UX layer)

**Key Insight:** Redux prevents unnecessary API calls and provides instant feedback. Backend is still the bouncer - Redux is just a faster bouncer at the door.

---

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
/signup → SignupPage (fully functional)
/signup/complete → SignupCompletePage (fully functional)
/login → LoginPage (fully functional)
```

---

## 📊 Frontend Review Summary (November 6, 2025)

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
8. **LoginPage**: ✅ Fully functional
   - Single identifier field (accepts username OR email)
   - Zod validation
   - react-hook-form integration
   - API integration with error handling
   - Redux dispatch on success
   - Navigation to `/feed`
   - Toast notifications
   - Link to signup page
   - Matches design system
9. **Session Persistence**: ✅ Fully functional
   - Backend `/api/auth/me` endpoint
   - AuthProvider component checks auth on app load
   - Restores Redux state from valid cookies
   - Shows loading spinner during check
   - Automatic session restoration after refresh
10. **Protected Routes**: ✅ Fully functional
   - ProtectedRoute component guards authenticated routes
   - Checks Redux for user before rendering
   - Instant redirect to `/login` if unauthorized
   - Wraps `/feed` and `/signup/complete` routes
   - Uses `replace` prop to prevent back button issues
   - Clean UX with no flash of unauthorized content
11. **FeedPage Stub**: ✅ Created
   - Basic feed layout displaying user's name
   - Logout button with proper styling (red, top-right)
   - Placeholder for future feed content
   - Demonstrates protected route working correctly
12. **Logout Functionality**: ✅ Fully functional
   - Backend properly clears cookies with matching options
   - Frontend clears Redux state and redirects
   - Toast notification on successful logout
   - Error handling for failed logout attempts
   - Session correctly ends (no restore on refresh)
13. **Auth Page Redirects**: ✅ Fully functional
   - Logged-in users auto-redirect from `/login` and `/signup` to `/feed`
   - Prevents confusion and double login attempts
   - Works with manual navigation and page refreshes
14. **Backend Profile Endpoint**: Enhanced updateUser controller
   - New route: `PUT /users/complete-profile/:id`
   - Handles avatar upload via multer + optional text fields
   - Cloudinary integration for avatar storage
   - Old avatar cleanup before new upload
15. **Cross-Origin Authentication**: ✅ Working
   - Cookie sameSite configuration (none for production, lax for dev)
   - NODE_ENV properly set on Render
   - Cookies sent with all cross-origin requests
   - Logout properly clears cookies with matching options
16. **Design System**: Consistent indigo-purple gradient theme across all auth pages

### ⚠️ Known Issues
- **CSS Warnings** in `index.css`: Unknown at-rules `@custom-variant`, `@theme`, `@apply` (Tailwind v4 + shadcn setup - these are expected and don't affect functionality)

### 🔄 Next Steps / Pending
- **Feed Page**: Build full feed structure with navbar and posts
- **Posts**: Create Post component and post creation flow
- **Profile Page**: User profile view and edit functionality
- **Reusable Components**: Extract and build shared Input/Button components

### 📈 Progress: 100% of Auth Flow Complete ✅
- ✅ User registration (Step 1) - Fully functional
- ✅ Profile completion (Step 2) - Fully functional
- ✅ Login page - Fully functional
- ✅ Session persistence - Fully functional
- ✅ Protected routes - Fully functional
- ✅ Logout functionality - Fully functional
- ✅ Auth page redirects - Fully functional
- ✅ Cookie-based authentication - Working cross-origin

---

**Last Updated:** November 7, 2025

