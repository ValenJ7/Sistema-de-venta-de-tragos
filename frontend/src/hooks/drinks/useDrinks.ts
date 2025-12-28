// src/hooks/drinks/useDrinks.ts
import { useQuery } from "@tanstack/react-query";
import { getDrinks, type DrinkDTO } from "../../services/drinks";

export function useDrinks() {
  return useQuery<DrinkDTO[]>({
    queryKey: ["drinks"],
    queryFn: getDrinks,
  });
}
