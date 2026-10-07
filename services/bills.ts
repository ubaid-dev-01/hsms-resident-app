import api from "./api";

export interface BillParams {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export const billsService = {
  async getBills(params?: BillParams) {
    const { data } = await api.get("/bills", { params });
    return data;
  },

  async getBillById(id: string) {
    const { data } = await api.get(`/bills/${id}`);
    return data;
  },

  async getInstallments(params?: { page?: number; limit?: number }) {
    const { data } = await api.get("/bills/installments", { params });
    return data;
  },

  async downloadInvoice(id: string) {
    const { data } = await api.get(`/bills/${id}/invoice`, {
      responseType: "blob",
    });
    return data;
  },

  async payBill(id: string, paymentMethod?: string) {
    const { data } = await api.post(`/bills/${id}/pay`, { paymentMethod });
    return data;
  },
};
