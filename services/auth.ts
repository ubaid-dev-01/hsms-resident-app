import api from "./api";
import * as SecureStore from "expo-secure-store";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) {
      await SecureStore.setItemAsync("auth_token", data.token);
    }
    return data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout API errors
    } finally {
      await SecureStore.deleteItemAsync("auth_token");
    }
  },

  async getProfile() {
    const { data } = await api.get("/auth/profile");
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
};
