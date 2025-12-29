import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = useMemo(() => pathname === "/", [pathname]);

  const user = useAppStore((s) => s.user);
  const clearSession = useAppStore((s) => s.clearSession);

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-orange-500 uppercase font-bold" : "text-white uppercase font-bold";

  return (
    <header className={isHome ? "bg-[url(/bg.jpg)] bg-center bg-cover" : "bg-slate-800"}>
      <div className="mx-auto container px-5 py-16">
        {/* Navbar */}
        <div className="flex justify-between items-center">
          <div>
            <img src="/logo.svg" alt="logotipo" className="w-32" />
          </div>

          <nav className="flex gap-4 items-center">
            <NavLink to="/" className={linkClass}>
              Inicio
            </NavLink>

            <NavLink to="/favoritos" className={linkClass}>
              Favoritos
            </NavLink>

            {/* ✅ Caja solo si role === "caja" */}
            {user?.role === "caja" ? (
              <NavLink to="/pos" className={linkClass}>
                Caja
              </NavLink>
            ) : null}

            {/* ✅ Admin: Productos + Dashboard */}
            {user?.role === "admin" ? (
              <>
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>

                <NavLink to="/admin/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
              </>
            ) : null}

            {/* ✅ Badge: mostrar quién está logueado */}
            {user?.role === "caja" ? (
              <span className="ml-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs uppercase">
                Caja: {user.username}
              </span>
            ) : null}

            {user?.role === "admin" ? (
              <span className="ml-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs uppercase">
                Admin: {user.username}
              </span>
            ) : null}

            {/* ✅ Auth actions */}
            {!user ? (
              <NavLink
                to="/login"
                className="ml-4 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg uppercase"
              >
                Iniciar sesión
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-4 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-lg uppercase"
              >
                Salir
              </button>
            )}
          </nav>
        </div>

        {/* Hero SOLO Home */}
        {isHome && (
          <div className="md:w-1/2 2xl:w-1/3 my-32">
            <h1 className="text-white uppercase font-extrabold text-4xl md:text-5xl leading-tight">
              ¡ Bienvenidos a la página oficial de <span className="text-orange-400">Cocktail</span> !
            </h1>
          </div>
        )}

      </div>
    </header>
  );
}
