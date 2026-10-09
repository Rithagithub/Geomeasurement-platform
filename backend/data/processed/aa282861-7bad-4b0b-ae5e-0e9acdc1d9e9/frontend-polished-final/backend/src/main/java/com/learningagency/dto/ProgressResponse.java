package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponse {

    private Long courseId;

    private String courseTitle;

    private Integer completion;

    private Integer completedLessons;

    private Integer totalLessons;

    private Double hoursSpent;

}