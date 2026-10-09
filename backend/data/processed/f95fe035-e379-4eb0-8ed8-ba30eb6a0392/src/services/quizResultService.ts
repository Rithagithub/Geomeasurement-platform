import api from "./api";

import {
    QuizSubmissionRequest,
    QuizSubmissionResponse
} from "@/types/quizResult";

const submitQuiz = async (
    request: QuizSubmissionRequest
): Promise<QuizSubmissionResponse> => {

    const response = await api.post(
        "/quiz/submit",
        request
    );

    return response.data;

};

export default {

    submitQuiz

};