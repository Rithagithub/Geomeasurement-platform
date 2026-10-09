package com.learningagency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private double agencyScore;

    private double improvement;

    private double agencyPreservationIndex;

    private double dynamicLearningBetweenness;

    private double aiDependency;

    private double collaborationScore;
    private int learningTime;

    private int conceptsMastered;
    
    private int sessions;
}