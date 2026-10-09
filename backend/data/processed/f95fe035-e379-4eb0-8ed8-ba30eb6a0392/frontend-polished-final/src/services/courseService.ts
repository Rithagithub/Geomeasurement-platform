import api from "./api";
import { Course } from "@/types/course";

const getCourses = async (): Promise<Course[]> => {

    const response = await api.get("/courses");

    return response.data;

};

const enroll = async (courseId: number): Promise<void> => {

    await api.post(`/enrollments/${courseId}`);

};

export default {

    getCourses,

    enroll,

};