package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private String fullName;

    private String email;

    private String role;

    private Integer agencyScore;

    private Integer learningTime;

    private Integer conceptsMastered;

    private Integer sessions;

}