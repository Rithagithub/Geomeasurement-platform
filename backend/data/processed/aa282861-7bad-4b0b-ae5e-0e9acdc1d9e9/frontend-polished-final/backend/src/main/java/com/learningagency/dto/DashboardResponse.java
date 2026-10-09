package com.learningagency.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private String fullName;

    private int enrolledCourses;

    private int completedCourses;

    private double averageQuizScore;

    private double overallProgress;

    private int certificatesEarned;

    private int learningHours;

}