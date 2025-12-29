import api from "./api";

export type DrinkDTO = {
  id: number;
  name: string;
  category: string | null;
  is_alcoholic: boolean;
  price: string | number;
  ingredients: string | null;
  instructions: string | null;
  image_path: string | null;
};

export async function getDrinks() {
  const res = await api.get<any[]>("/drinks/");

  return res.data.map((drink) => ({
    ...drink,
    is_alcoholic: Boolean(drink.is_alcoholic),
  })) as DrinkDTO[];
}

export type CreateDrinkInput = {
  name: string;
  category: string;
  price: number; // ✅ number
  is_alcoholic: boolean;
  ingredients?: string;
  instructions?: string;
  image?: File | null;
};

export async function deleteDrink(id: number) {
  const res = await api.delete(`/drinks/?id=${id}`);
  return res.data;
}

export type UpdateDrinkInput = {
  name: string;
  category: string;
  price: number; // ✅ number
  is_alcoholic: boolean;
  ingredients?: string;
  instructions?: string;
};

export async function updateDrink(id: number, input: UpdateDrinkInput) {
  const form = new URLSearchParams();
  form.append("name", input.name);
  form.append("category", input.category);
  form.append("price", String(input.price)); // ✅ convertimos acá
  form.append("is_alcoholic", input.is_alcoholic ? "1" : "0");

  if (input.ingredients !== undefined) {
    form.append("ingredients", input.ingredients);
  }

  if (input.instructions !== undefined) {
    form.append("instructions", input.instructions);
  }

  const res = await api.put(`/drinks/?id=${id}`, form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
}

export async function createDrink(input: CreateDrinkInput) {
  const form = new FormData();
  form.append("name", input.name);
  form.append("category", input.category);
  form.append("price", String(input.price)); // ✅ convertimos acá
  form.append("is_alcoholic", input.is_alcoholic ? "1" : "0");

  if (input.ingredients) {
    form.append("ingredients", input.ingredients);
  }

  if (input.instructions) {
    form.append("instructions", input.instructions);
  }

  if (input.image) {
    form.append("image", input.image);
  }

  const res = await api.post("/drinks/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

export async function updateDrinkImage(id: number, file: File) {
  const form = new FormData();
  form.append("id", String(id));
  form.append("image", file);

  const { data } = await api.post("/drinks/update-image.php", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data as { success: boolean; image_path: string };
}
