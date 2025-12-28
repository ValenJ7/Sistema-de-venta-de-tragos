const BACKEND_ROOT = "http://localhost/ej-front-3/backend";
const FAVORITES_URL = `${BACKEND_ROOT}/api/favorites/`;


export type FavoritesResponse = { favoriteIds: number[] };

async function parseError(res: Response) {
  try {
    const data = await res.json();
    return data?.message || data?.error || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

/** GET: trae ids favoritos del usuario logueado */
export async function getFavorites(accessToken: string): Promise<FavoritesResponse> {
  const res = await fetch(FAVORITES_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as FavoritesResponse;
}

/** POST: agrega favorito (drink_id) */
export async function addFavorite(accessToken: string, drinkId: number): Promise<void> {
  const res = await fetch(FAVORITES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ drink_id: drinkId }),
  });

  if (!res.ok) throw new Error(await parseError(res));
}

/** DELETE: elimina favorito (query param drink_id) */
export async function removeFavorite(accessToken: string, drinkId: number): Promise<void> {
  const url = `${FAVORITES_URL}?drink_id=${encodeURIComponent(String(drinkId))}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error(await parseError(res));
}
