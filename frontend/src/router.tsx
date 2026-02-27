import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

import { Layout } from "./layout/Layout";
import { HomePage } from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
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
      { index: true, element: <HomePage /> },
      { path: "favoritos", element: <FavoritesPage /> },

      // Rutas de Administración (Ahora públicas)
      { path: "admin", element: <AdminDrinksPage /> },
      { path: "admin/dashboard", element: <AdminDashboardPage /> },
      { path: "admin/caja/:cashierUserId", element: <AdminCashierShiftPage /> },

      // Ruta de Caja/POS (Ahora pública)
      { path: "pos", element: <PosPage /> },

      // Login (Opcional, podrías incluso borrarlo después)
      { path: "login", element: <LoginPage /> },
    ],
  },
]);