package com.learningagency.service.impl;

import com.learningagency.dto.CourseResponse;
import com.learningagency.entity.Course;
import com.learningagency.repository.CourseRepository;
import com.learningagency.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository repository;

    private CourseResponse map(Course course) {

        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .level(course.getLevel())
                .duration(course.getDuration())
                .thumbnail(course.getThumbnail())
                .build();

    }

    @Override
    public List<CourseResponse> getAllCourses() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    @Override
    public List<CourseResponse> getCoursesByCategory(String category) {

        return repository.findByCategory(category)
                .stream()
                .map(this::map)
                .toList();

    }

    @Override
    public List<CourseResponse> getCoursesByLevel(String level) {

        return repository.findByLevel(level)
                .stream()
                .map(this::map)
                .toList();

    }

}