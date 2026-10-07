import api from "./api";

export interface PreApproveVisitorData {
  visitorName: string;
  visitorPhone: string;
  purpose: string;
  expectedDate: string;
}

export interface VisitorParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const visitorsService = {
  async preApproveVisitor(payload: PreApproveVisitorData) {
    const { data } = await api.post("/visitors/pre-approve", payload);
    return data;
  },

  async getMyVisitors(params?: VisitorParams) {
    const { data } = await api.get("/visitors/my", { params });
    return data;
  },

  async cancelPreApproval(id: string) {
    const { data } = await api.delete(`/visitors/pre-approve/${id}`);
    return data;
  },
};
