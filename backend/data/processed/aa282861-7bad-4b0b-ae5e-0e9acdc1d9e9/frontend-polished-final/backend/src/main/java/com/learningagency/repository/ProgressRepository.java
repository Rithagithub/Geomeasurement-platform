package com.learningagency.repository;

import com.learningagency.entity.Course;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {

    List<Progress> findByUser(User user);

    Optional<Progress> findByUserAndCourse(User user, Course course);

    boolean existsByUserAndCourse(User user, Course course);

    long countByUser(User user);

    long countByUserAndCompletedTrue(User user);

}