package com.learningagency.service;

import com.learningagency.dto.QuizResponse;

public interface QuizService {

    QuizResponse getQuizByCourse(Long courseId);

}