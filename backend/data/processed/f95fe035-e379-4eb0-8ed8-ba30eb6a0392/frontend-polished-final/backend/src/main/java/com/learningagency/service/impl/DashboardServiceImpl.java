package com.learningagency.service.impl;

import com.learningagency.dto.DashboardResponse;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.QuizResultRepository;
import com.learningagency.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ProgressRepository progressRepository;
    private final QuizResultRepository quizResultRepository;

    @Override
    public DashboardResponse getDashboard(User user) {

        List<Progress> progressList = progressRepository.findByUser(user);

        int enrolledCourses = progressList.size();

        int completedCourses = (int) progressList.stream()
                .filter(p -> p.getCompletion() >= 100)
                .count();

        double overallProgress = progressList.stream()
                .mapToInt(Progress::getCompletion)
                .average()
                .orElse(0);

        double averageQuizScore = quizResultRepository.findByUser(user)
                .stream()
                .mapToDouble(r -> r.getPercentage())
                .average()
                .orElse(0);

        int learningHours = (int) progressList.stream()
        .mapToDouble(Progress::getHoursSpent)
        .sum();

        return DashboardResponse.builder()
                .fullName(user.getFullName())
                .enrolledCourses(enrolledCourses)
                .completedCourses(completedCourses)
                .overallProgress(Math.round(overallProgress * 100.0) / 100.0)
                .averageQuizScore(Math.round(averageQuizScore * 100.0) / 100.0)
                .certificatesEarned(completedCourses)
                .learningHours(learningHours)
                .build();
    }
}