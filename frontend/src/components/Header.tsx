import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = useMemo(() => pathname === "/", [pathname]);

  const user = useAppStore((s) => s.user);
  const clearSession = useAppStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase font-bold transition ${isActive ? "text-orange-400" : "text-white hover:text-orange-200"}`;

  return (
    <header className={isHome ? "bg-slate-900 bg-[url(/bg.jpg)] bg-center bg-cover" : "bg-slate-800"}>
      <div className="mx-auto container px-5 py-10">
        <div className="flex justify-between items-center">
          <img src="/logo.svg" alt="logo" className="w-24" />
          <nav className="flex gap-6 items-center">
            <NavLink to="/" className={linkClass}>Inicio</NavLink>
            <NavLink to="/favoritos" className={linkClass}>Favoritos</NavLink>
            {user?.role === "caja" && <NavLink to="/pos" className={linkClass}>Caja</NavLink>}
            {user?.role === "admin" && (
              <>
                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
              </>
            )}
            {!user ? (
              <NavLink to="/login" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">Entrar</NavLink>
            ) : (
              <button onClick={handleLogout} className="text-white bg-white/10 px-4 py-2 rounded-lg font-bold">Salir</button>
            )}
          </nav>
        </div>
        {isHome && (
          <div className="my-20 md:w-1/2">
            <h1 className="text-white text-5xl font-extrabold uppercase leading-tight">
              ¡ Bienvenidos a <span className="text-orange-400">Cocktail</span> !
            </h1>
          </div>
        )}
      </div>
    </header>
  );
}