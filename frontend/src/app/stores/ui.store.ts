import type { StateCreator } from "zustand";

export const createNotificationSlice: StateCreator<any> = (set, get) => ({
  notification: {
    text: "",
    error: false,
    show: false,
  },

  showNotification: (payload: any) => {
    set({
      notification: {
        text: payload.text,
        error: payload.error,
        show: true,
      },
    });

    setTimeout(() => {
      get().hideNotification();
    }, 3000);
  },

  hideNotification: () => {
    set({
      notification: {
        text: "",
        error: false,
        show: false,
      },
    });
  },
});