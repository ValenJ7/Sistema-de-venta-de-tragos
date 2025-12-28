import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/auth/useLogin";
import { useAppStore } from "../store/useAppStore";

export function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useLogin();
  const user = useAppStore((s) => s.user);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await mutateAsync({ username, password });

    // redirección básica según rol
    if (res.user.role === "admin") navigate("/admin");
    else if (res.user.role === "caja") navigate("/pos"); // la creamos después
    else navigate("/");
  }

  return (
    <section className="max-w-md mx-auto mt-10 bg-white rounded-xl border p-6 shadow-sm">
      <h1 className="text-2xl font-black">Iniciar sesión</h1>
      <p className="text-sm text-gray-600 mt-1">
        Entrá con tu usuario y contraseña.
      </p>

      {user && (
        <div className="mt-4 rounded-lg border p-3 text-sm">
          Ya estás logueado como <b>{user.username}</b> ({user.role})
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Usuario</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin / caja1 / user"
            autoComplete="username"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold">Contraseña</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123 / caja123 / user123"
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <div className="text-sm text-red-600">
            Credenciales inválidas o error de servidor.
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-orange-500 text-white font-bold py-2 hover:bg-orange-600 disabled:opacity-60"
        >
          {isPending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </section>
  );
}
