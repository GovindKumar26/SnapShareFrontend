import { createBrowserRouter, Navigate } from "react-router-dom";
import SignupPage from "../features/auth/SignupPage";
import LoginPage from "../features/auth/LoginPage";
import SignupCompletePage from "../features/auth/SignupCompletePage";

const router = createBrowserRouter([
  { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Navigate to="/signup" replace /> },
  { path: "/signup/complete", element: <SignupCompletePage/>}
]);

export default router;
