import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import App from "./App";
import store from "./app/store";
import queryClient from "./app/queryClient";
import AuthProvider from "./features/auth/AuthProvider";
import "./index.css";
import router from "./routes/AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
