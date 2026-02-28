import { NavLink, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export function Header() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const clearSession = useAppStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `uppercase font-bold transition ${isActive ? "text-orange-400" : "text-white hover:text-orange-200"}`;

  return (
    <header className="bg-slate-800 shadow-md">
      <div className="mx-auto container px-5 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="logo" className="w-12" />
            <span className="text-white font-black text-xl tracking-tighter">COCKTAIL ADMIN</span>
          </div>

          <nav className="flex gap-6 items-center">
            {user && (
              <>
                <NavLink to="/admin" className={linkClass} end>Productos</NavLink>
                <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/pos" className={linkClass}>Caja</NavLink>
                
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-bold transition text-xs uppercase"
                >
                  Salir
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}