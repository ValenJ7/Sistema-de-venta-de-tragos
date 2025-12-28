import { useMutation } from "@tanstack/react-query";
import { login, type LoginInput } from "../../services/auth";
import { useAppStore } from "../../store/useAppStore";

export function useLogin() {
  const setSession = useAppStore((s) => s.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      setSession({ user: data.user, accessToken: data.accessToken });
    },
  });
}
