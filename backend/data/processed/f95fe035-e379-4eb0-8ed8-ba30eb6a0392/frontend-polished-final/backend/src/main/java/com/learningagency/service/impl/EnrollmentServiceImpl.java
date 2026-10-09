package com.learningagency.service.impl;

import com.learningagency.dto.EnrollmentResponse;
import com.learningagency.entity.Course;
import com.learningagency.entity.Enrollment;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import com.learningagency.repository.CourseRepository;
import com.learningagency.repository.EnrollmentRepository;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;

    @Override
    public void enroll(String email, Long courseId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByUserAndCourse(user, course)) {
            return;
        }

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        if (!progressRepository.existsByUserAndCourse(user, course)) {

            Progress progress = Progress.builder()
                    .user(user)
                    .course(course)
                    .completion(0)
                    .completedLessons(0)
                    .totalLessons(10)
                    .hoursSpent(0.0)
                    .build();

            try {

    Progress saved = progressRepository.save(progress);

    System.out.println("==================================");
    System.out.println("Progress saved successfully");
    System.out.println("Progress ID = " + saved.getId());
    System.out.println("==================================");

} catch (Exception e) {

    System.out.println("==================================");
    System.out.println("FAILED TO SAVE PROGRESS");
    e.printStackTrace();
    System.out.println("==================================");

}
        }
    }

    @Override
    public List<EnrollmentResponse> myCourses(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return enrollmentRepository.findByUser(user)
                .stream()
                .map(e -> EnrollmentResponse.builder()
                        .id(e.getCourse().getId())
                        .courseTitle(e.getCourse().getTitle())
                        .category(e.getCourse().getCategory())
                        .level(e.getCourse().getLevel())
                        .duration(e.getCourse().getDuration())
                        .build())
                .toList();
    }
}