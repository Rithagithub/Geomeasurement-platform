export interface AnswerRequest {

    questionId: number;

    selectedOption: string;

}

export interface QuizSubmissionRequest {

    quizId: number;

    answers: AnswerRequest[];

}

export interface QuizSubmissionResponse {

    totalQuestions: number;

    correctAnswers: number;

    wrongAnswers: number;

    percentage: number;

    passed: boolean;

}