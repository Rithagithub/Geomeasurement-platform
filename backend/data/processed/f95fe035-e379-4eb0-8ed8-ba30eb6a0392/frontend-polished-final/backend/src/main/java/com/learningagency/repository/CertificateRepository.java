package com.learningagency.repository;

import com.learningagency.entity.Certificate;
import com.learningagency.entity.Course;
import com.learningagency.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    List<Certificate> findByUser(User user);

    Optional<Certificate> findByUserAndCourse(User user, Course course);

    boolean existsByUserAndCourse(User user, Course course);

}