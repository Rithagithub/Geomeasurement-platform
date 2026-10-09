import api from "./api";

const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

export default {
    getProfile,
};