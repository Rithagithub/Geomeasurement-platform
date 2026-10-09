package com.learningagency.controller;

import com.learningagency.dto.CourseResponse;
import com.learningagency.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService service;

    @GetMapping
    public List<CourseResponse> getCourses() {

        return service.getAllCourses();

    }

    @GetMapping("/category/{category}")
    public List<CourseResponse> byCategory(
            @PathVariable String category) {

        return service.getCoursesByCategory(category);

    }

    @GetMapping("/level/{level}")
    public List<CourseResponse> byLevel(
            @PathVariable String level) {

        return service.getCoursesByLevel(level);

    }

}