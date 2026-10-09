import api from "./api";

export interface AnalyticsResponse {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificatesEarned: number;
  averageQuizScore: number;
  learningHours: number;
}

const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await api.get("/analytics");
  return response.data;
};

export default {
  getAnalytics,
};