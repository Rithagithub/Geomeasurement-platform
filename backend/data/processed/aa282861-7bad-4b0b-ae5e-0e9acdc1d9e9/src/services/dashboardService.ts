import api from "./api";
import { DashboardResponse } from "@/types/dashboard";

const getDashboard = async (): Promise<DashboardResponse> => {

    const response = await api.get("/dashboard");

    return response.data;

};

export default {

    getDashboard

};