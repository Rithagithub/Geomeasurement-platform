package com.learningagency.service.impl;

import com.learningagency.dto.ProgressResponse;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressServiceImpl implements ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Override
    public List<ProgressResponse> getProgress(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return progressRepository.findByUser(user)
                .stream()
                .map(progress -> ProgressResponse.builder()
                        .courseId(progress.getCourse().getId())
                        .courseTitle(progress.getCourse().getTitle())
                        .completion(progress.getCompletion())
                        .completedLessons(progress.getCompletedLessons())
                        .totalLessons(progress.getTotalLessons())
                        .hoursSpent(progress.getHoursSpent())
                        .build())
                .toList();
    }
}