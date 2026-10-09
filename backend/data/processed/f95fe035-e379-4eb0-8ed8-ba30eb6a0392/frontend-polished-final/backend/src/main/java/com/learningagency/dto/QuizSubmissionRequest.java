package com.learningagency.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionRequest {

    private Long quizId;

    private List<AnswerRequest> answers;

}