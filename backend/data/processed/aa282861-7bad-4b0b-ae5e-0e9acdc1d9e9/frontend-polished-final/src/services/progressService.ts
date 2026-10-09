import api from "./api";
import { Progress } from "@/types/progress";

const getProgress = async (): Promise<Progress[]> => {

    const response = await api.get("/progress");

    return response.data;

};

export default {

    getProgress

};