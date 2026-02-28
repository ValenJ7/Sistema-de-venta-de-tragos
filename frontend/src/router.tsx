import { createBrowserRouter, ScrollRestoration, Navigate } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { AdminDrinksPage } from "./pages/AdminDrinksPage";
import { LoginPage } from "./pages/LoginPage";
import { PosPage } from "./pages/PosPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminCashierShiftPage } from "./pages/AdminCashierShiftPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      // Ahora la raíz es el Login
      { index: true, element: <LoginPage /> },
      
      // Rutas de Administración
      { path: "admin", element: <AdminDrinksPage /> },
      { path: "admin/dashboard", element: <AdminDashboardPage /> },
      { path: "admin/caja/:cashierUserId", element: <AdminCashierShiftPage /> },

      // POS
      { path: "pos", element: <PosPage /> },

      // Redirección por si alguien intenta entrar a /login manualmente
      { path: "login", element: <Navigate to="/" replace /> },
    ],
  },
]);