import api from "./api";

export interface UpdateProfileRequest {
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await api.put("/settings/profile", data);
  return response.data;
};

const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.put("/settings/password", data);
  return response.data;
};

export default {
  updateProfile,
  changePassword,
};