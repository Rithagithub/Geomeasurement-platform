import api from "./api";
import { ProfileResponse } from "@/types/profile";

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get("/profile");
  return response.data;
};

export default {
  getProfile,
};