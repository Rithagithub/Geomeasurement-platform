import api from "./api";
import { Quiz } from "@/types/quiz";
import {
    QuizSubmissionRequest,
    QuizSubmissionResponse,
} from "@/types/quizResult";

const getQuiz = async (courseId: number): Promise<Quiz> => {
    const response = await api.get(`/quiz/course/${courseId}`);
    return response.data;
};

const submitQuiz = async (
    request: QuizSubmissionRequest
): Promise<QuizSubmissionResponse> => {
    const response = await api.post("/quiz/submit", request);
    return response.data;
};

const quizService = {
    getQuiz,
    submitQuiz,
};

export default quizService;