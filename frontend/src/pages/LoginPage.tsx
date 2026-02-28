import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAppStore((s) => s.setSession);
  const [username, setUsername] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos login de admin
    setSession({ id: 1, username: username || "Admin", role: "admin" });
    // DIRECCIÓN AL DASHBOARD
    navigate("/admin/dashboard");
  };

  return (
    <section className="max-w-md mx-auto mt-20 p-10 bg-white rounded-2xl border shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-slate-800 italic">COCKTAIL</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Management System</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <input
          type="text"
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500 outline-none transition"
          placeholder="Contraseña"
        />
        <button className="w-full bg-orange-500 hover:bg-orange-600 py-4 rounded-xl text-white font-black uppercase shadow-lg shadow-orange-200 transition-all">
          Entrar al Dashboard
        </button>
      </form>
    </section>
  );
}