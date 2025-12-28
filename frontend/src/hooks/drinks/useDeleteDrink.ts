// src/hooks/drinks/useDeleteDrink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDrink } from "../../services/drinks";
import { useAppStore } from "../../store/useAppStore";

export function useDeleteDrink() {
  const queryClient = useQueryClient();
  const showNotification = useAppStore((s) => s.showNotification);

  return useMutation({
    mutationFn: deleteDrink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drinks"] });
      showNotification({ text: "Trago eliminado correctamente", error: false });
    },
    onError: () => {
      showNotification({ text: "Error al eliminar el trago", error: true });
    },
  });
}
