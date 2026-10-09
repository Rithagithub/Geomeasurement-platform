package com.learningagency.controller;

import com.learningagency.dto.EnrollmentResponse;
import com.learningagency.entity.User;
import com.learningagency.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService service;

    @PostMapping("/{courseId}")

    public void enroll(

            Authentication authentication,

            @PathVariable Long courseId){

        User user=(User)authentication.getPrincipal();

        service.enroll(user.getEmail(),courseId);

    }

    @GetMapping

    public List<EnrollmentResponse> myCourses(

            Authentication authentication){

        User user=(User)authentication.getPrincipal();

        return service.myCourses(user.getEmail());

    }

}