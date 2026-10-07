import api from "./api";

export interface ComplaintParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export interface CreateComplaintData {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export const complaintsService = {
  async getComplaints(params?: ComplaintParams) {
    const { data } = await api.get("/complaints", { params });
    return data;
  },

  async createComplaint(payload: CreateComplaintData) {
    const { data } = await api.post("/complaints", payload);
    return data;
  },

  async getComplaintById(id: string) {
    const { data } = await api.get(`/complaints/${id}`);
    return data;
  },
};
