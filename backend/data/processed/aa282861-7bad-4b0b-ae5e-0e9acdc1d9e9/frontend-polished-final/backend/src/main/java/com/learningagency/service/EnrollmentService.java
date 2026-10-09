package com.learningagency.service;

import com.learningagency.dto.EnrollmentResponse;

import java.util.List;

public interface EnrollmentService {

    void enroll(String email,Long courseId);

    List<EnrollmentResponse> myCourses(String email);

}