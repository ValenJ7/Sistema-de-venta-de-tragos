import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDrink, type UpdateDrinkInput } from "../../services/drinks";
import { useAppStore } from "../../store/useAppStore";

type UpdateArgs = {
  id: number;
  data: UpdateDrinkInput;
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
