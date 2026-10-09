package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionResponse {

    private int totalQuestions;

    private int correctAnswers;

    private int wrongAnswers;

    private double percentage;

    private boolean passed;

}