package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {

    private Long id;

    private String courseTitle;

    private String category;

    private String level;

    private Integer duration;

}