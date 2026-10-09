package com.learningagency.service.impl;

import com.learningagency.analytics.dto.AgencyMetrics;
import com.learningagency.analytics.service.LearningAgencyScoreService;
import com.learningagency.dto.AnalyticsResponse;
import com.learningagency.entity.User;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final LearningAgencyScoreService learningAgencyScoreService;

    @Override
    public AnalyticsResponse getAnalytics(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AgencyMetrics metrics = learningAgencyScoreService.calculate(user);

return AnalyticsResponse.builder()
        .agencyScore(metrics.getAgencyScore())
        .improvement(metrics.getImprovement())
        .agencyPreservationIndex(metrics.getAgencyPreservationIndex())
        .dynamicLearningBetweenness(metrics.getDynamicLearningBetweenness())
        .aiDependency(metrics.getAiDependency())
        .collaborationScore(metrics.getCollaborationScore())

        .learningTime(0)
        .conceptsMastered(/* calculate from completed concepts */0)
        .sessions(/* calculate from session history */0)

        .build();
    }
}