import api from "./api";

export interface ListingParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
}

export const marketplaceService = {
  async getListings(params?: ListingParams) {
    const { data } = await api.get("/marketplace/listings", { params });
    return data;
  },

  async createListing(payload: CreateListingData) {
    const { data } = await api.post("/marketplace/listings", payload);
    return data;
  },

  async getMyListings() {
    const { data } = await api.get("/marketplace/listings/my");
    return data;
  },

  async toggleFavorite(id: string) {
    const { data } = await api.post(`/marketplace/listings/${id}/favorite`);
    return data;
  },
};
