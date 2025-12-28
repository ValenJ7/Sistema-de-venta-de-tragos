// src/hooks/drinks/useUpdateDrinkImage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDrinkImage } from "../../services/drinks";
import { useAppStore } from "../../store/useAppStore";

export function useUpdateDrinkImage() {
  const queryClient = useQueryClient();
  const showNotification = useAppStore((s) => s.showNotification);

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      updateDrinkImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drinks"] });
      showNotification({
        text: "Imagen actualizada correctamente",
        error: false,
      });
    },
    onError: () => {
      showNotification({
        text: "Error al actualizar la imagen",
        error: true,
      });
    },
  });
}
