const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function getBackendImageUrl(path: string | null) {
  if (!path) return "/placeholder-drink.jpg";

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${BACKEND_URL}/${normalized}`;
}
