package com.learningagency.analytics.service;

import com.learningagency.analytics.dto.AgencyMetrics;
import com.learningagency.entity.Progress;
import com.learningagency.entity.QuizResult;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningAgencyScoreService {

    private final ProgressRepository progressRepository;
    private final QuizResultRepository quizResultRepository;

    /**
     * Main method used by AnalyticsServiceImpl
     */
    public AgencyMetrics calculate(User user) {

        List<Progress> progressList = progressRepository.findByUser(user);
        List<QuizResult> quizResults = quizResultRepository.findByUser(user);

        double completionScore = progressList.stream()
                .mapToInt(Progress::getCompletion)
                .average()
                .orElse(0.0);

        double averageQuizScore = quizResults.stream()
                .mapToDouble(QuizResult::getPercentage)
                .average()
                .orElse(0.0);

        int completedCourses = (int) progressList.stream()
                .filter(progress -> progress.getCompletion() >= 100)
                .count();

        int totalCourses = progressList.size();
        double courseCompletionRatio = totalCourses == 0 ? 0 : (completedCourses * 100.0) / totalCourses;
        double totalLearningHours = progressList.stream()
                .mapToDouble(Progress::getHoursSpent)
                .sum();

        double activityScore = clamp(20 + completionScore * 0.55 + Math.min(totalLearningHours, 15) * 2.5, 0, 100);
        double engagementScore = clamp(25 + courseCompletionRatio * 0.7 + completionScore * 0.35, 0, 100);
        double collaborationScore = clamp(30 + courseCompletionRatio * 0.8 + Math.min(totalCourses, 5) * 6, 0, 100);
        double consistencyScore = clamp(20 + completionScore * 0.5 + averageQuizScore * 0.5, 0, 100);

        AgencyMetrics metrics = new AgencyMetrics();
        metrics.setActivityScore(activityScore);
        metrics.setEngagementScore(engagementScore);
        metrics.setQuizScore(averageQuizScore);
        metrics.setCompletionScore(completionScore);
        metrics.setCollaborationScore(collaborationScore);
        metrics.setConsistencyScore(consistencyScore);
        metrics.setAiDependency(100 - consistencyScore * 0.55);

        double agencyScore = calculateAgencyScore(metrics);
        double api = calculateAPI(metrics);
        double improvement = calculateImprovement(
                Math.max(0, agencyScore - 8),
                agencyScore
        );

        metrics.setAgencyScore(agencyScore);
        metrics.setImprovement(improvement);
        metrics.setAgencyPreservationIndex(api);
        metrics.setDynamicLearningBetweenness(round(Math.min(1.0, 0.3 + (completionScore / 100.0) * 0.7)));

        return metrics;
    }

    /**
     * Calculates Learning Agency Score
     */

    public double calculateAgencyScore(
            AgencyMetrics metrics
    ) {

        double activity =
                normalize(metrics.getActivityScore());

        double engagement =
                normalize(metrics.getEngagementScore());

        double quiz =
                normalize(metrics.getQuizScore());

        double completion =
                normalize(metrics.getCompletionScore());

        double collaboration =
                normalize(metrics.getCollaborationScore());

        double consistency =
                normalize(metrics.getConsistencyScore());

        double score =
                activity * 0.20 +
                engagement * 0.20 +
                quiz * 0.20 +
                completion * 0.15 +
                collaboration * 0.15 +
                consistency * 0.10;

        return round(score * 100);
    }

    /**
     * Agency Preservation Index
     */

    public double calculateAPI(
            AgencyMetrics metrics
    ) {

        double agency =
                calculateAgencyScore(metrics);

        double aiDependency =
                normalize(metrics.getAiDependency());

        double api =
                agency -
                (aiDependency * 15);

        if (api < 0) {
            api = 0;
        }

        if (api > 100) {
            api = 100;
        }

        return round(api);
    }

    /**
     * Improvement Score
     */

    public double calculateImprovement(
            double previous,
            double current
    ) {

        return round(current - previous);

    }

    /**
     * Normalize value between 0 and 1
     */

    private double normalize(
            double value
    ) {

        return Math.max(
                0,
                Math.min(
                        value / 100.0,
                        1.0
                )
        );

    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(value, max));
    }

    /**
     * Round to 2 decimal places
     */

    private double round(
            double value
    ) {

        return Math.round(
                value * 100.0
        ) / 100.0;

    }

}