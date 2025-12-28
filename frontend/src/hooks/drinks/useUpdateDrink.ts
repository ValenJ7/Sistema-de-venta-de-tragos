// src/hooks/drinks/useUpdateDrink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDrink } from "../../services/drinks";
import { useAppStore } from "../../store/useAppStore";

type UpdateArgs = {
  id: number;
  data: {
    name: string;
    category: string;
    price: string;
    is_alcoholic: boolean;
    ingredients?: string;
    instructions?: string;
  };
};

export function useUpdateDrink() {
  const queryClient = useQueryClient();
  const showNotification = useAppStore((s) => s.showNotification);

  return useMutation({
    mutationFn: ({ id, data }: UpdateArgs) => updateDrink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drinks"] });
      showNotification({ text: "Trago actualizado correctamente", error: false });
    },
    onError: () => {
      showNotification({ text: "Error al actualizar el trago", error: true });
    },
  });
}
