package com.learningagency.service.impl;

import com.learningagency.dto.ProfileResponse;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.QuizResultRepository;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final QuizResultRepository quizResultRepository;

    @Override
    public ProfileResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Progress> progressList = progressRepository.findByUser(user);

        // Total learning hours
        int learningTime = (int) progressList.stream()
                .mapToDouble(Progress::getHoursSpent)
                .sum();

        // Number of completed concepts/courses
        int conceptsMastered = (int) progressList.stream()
        .filter(progress -> Boolean.TRUE.equals(progress.getCompleted()))
        .count();

        // Number of quiz attempts (used as learning sessions)
        int sessions = quizResultRepository.findByUser(user).size();

        return ProfileResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())

                // Agency score now comes from the analytics endpoint,
                // so this value is no longer used by the frontend.
                .agencyScore(0)

                .learningTime(learningTime)
                .conceptsMastered(conceptsMastered)
                .sessions(sessions)
                .build();
    }
}