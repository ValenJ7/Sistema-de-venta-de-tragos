import { createBrowserRouter, ScrollRestoration, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { DrinksPage as AdminDrinksPage } from "../features/admin/views/DrinksPage";
import { LoginPage } from "../features/auth/views/LoginPage";
import { PosPage } from "../features/pos/views/PosPage";
import { DashboardPage as AdminDashboardPage } from "../features/admin/views/DashboardPage";
import { ShiftsPage as AdminCashierShiftPage } from "../features/admin/views/ShiftsPage";

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