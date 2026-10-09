package com.learningagency.service;

import com.learningagency.dto.QuizSubmissionRequest;
import com.learningagency.dto.QuizSubmissionResponse;

public interface QuizResultService {

    QuizSubmissionResponse submitQuiz(

            String email,

            QuizSubmissionRequest request

    );

}