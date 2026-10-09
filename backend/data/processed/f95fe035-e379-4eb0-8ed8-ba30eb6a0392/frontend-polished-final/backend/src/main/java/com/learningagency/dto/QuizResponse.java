package com.learningagency.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponse {

    private Long id;

    private String title;

    private String description;

    private String courseTitle;

    private List<QuestionResponse> questions;

}