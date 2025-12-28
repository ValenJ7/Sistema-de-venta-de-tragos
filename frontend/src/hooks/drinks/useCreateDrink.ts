// src/hooks/drinks/useCreateDrink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDrink } from "../../services/drinks";
import { useAppStore } from "../../store/useAppStore";

export function useCreateDrink() {
  const queryClient = useQueryClient();
  const showNotification = useAppStore((s) => s.showNotification);

  return useMutation({
    mutationFn: createDrink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drinks"] });
      showNotification({ text: "Trago creado correctamente", error: false });
    },
    onError: () => {
      showNotification({ text: "Error al crear el trago", error: true });
    },
  });
}
