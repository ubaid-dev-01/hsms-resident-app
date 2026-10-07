import api from "./api";

export interface TriggerAlertData {
  type: string;
  description?: string;
  location?: { latitude: number; longitude: number };
}

export interface MedicalProfileData {
  bloodGroup?: string;
  allergies?: string[];
  medications?: string[];
  emergencyContact?: { name: string; phone: string; relation: string };
}

export const emergencyService = {
  async triggerAlert(payload: TriggerAlertData) {
    const { data } = await api.post("/emergency/alert", payload);
    return data;
  },

  async getActiveAlerts() {
    const { data } = await api.get("/emergency/alerts/active");
    return data;
  },

  async getMedicalProfile() {
    const { data } = await api.get("/emergency/medical-profile");
    return data;
  },

  async updateMedicalProfile(payload: MedicalProfileData) {
    const { data } = await api.put("/emergency/medical-profile", payload);
    return data;
  },
};
