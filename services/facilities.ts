import api from "./api";

export interface FacilityParams {
  page?: number;
  limit?: number;
  type?: string;
}

export interface CreateBookingData {
  facilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export const facilitiesService = {
  async getFacilities(params?: FacilityParams) {
    const { data } = await api.get("/facilities", { params });
    return data;
  },

  async createBooking(payload: CreateBookingData) {
    const { data } = await api.post("/facilities/bookings", payload);
    return data;
  },

  async getMyBookings(params?: { page?: number; limit?: number }) {
    const { data } = await api.get("/facilities/bookings/my", { params });
    return data;
  },
};
