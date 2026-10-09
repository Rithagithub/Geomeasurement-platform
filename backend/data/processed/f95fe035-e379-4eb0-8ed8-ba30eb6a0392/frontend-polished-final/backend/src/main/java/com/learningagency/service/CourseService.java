package com.learningagency.service;

import com.learningagency.dto.CourseResponse;

import java.util.List;

public interface CourseService {

    List<CourseResponse> getAllCourses();

    List<CourseResponse> getCoursesByCategory(String category);

    List<CourseResponse> getCoursesByLevel(String level);

}