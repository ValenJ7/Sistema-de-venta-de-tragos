import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Bypass total: Redirección de juguete según el nombre de usuario
    if (username === "admin") {
      navigate("/admin");
    } else if (username === "caja") {
      navigate("/pos");
    } else {
      navigate("/");
    }
  }

  return (
    <section className="max-w-md mx-auto mt-10 bg-white rounded-xl border p-6 shadow-sm">
      <h1 className="text-2xl font-black">Iniciar sesión (Demo)</h1>
      <p className="text-sm text-gray-600 mt-1">
        Escribí "admin" o "caja" para ver las distintas secciones.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Usuario</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin / caja"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Contraseña</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lo que sea funciona"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-500 text-white font-bold py-2 hover:bg-orange-600 transition-colors"
        >
          Ingresar
        </button>
      </form>
    </section>
  );
}