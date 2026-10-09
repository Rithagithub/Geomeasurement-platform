package com.learningagency.analytics.dto;

import lombok.Data;

@Data
public class AgencyMetrics {

    /*
     * Input Metrics
     */

    private double activityScore;

    private double engagementScore;

    private double quizScore;

    private double completionScore;

    private double collaborationScore;

    private double consistencyScore;

    /*
     * AI Dependency
     * Higher value means learner relies more on AI.
     */
    private double aiDependency;

    /*
     * Calculated Metrics
     */

    private double agencyScore;

    private double improvement;

    private double agencyPreservationIndex;

    private double dynamicLearningBetweenness;

}