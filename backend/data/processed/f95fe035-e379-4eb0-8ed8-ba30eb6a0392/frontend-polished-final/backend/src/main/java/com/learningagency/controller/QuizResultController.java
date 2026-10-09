package com.learningagency.controller;

import com.learningagency.dto.QuizSubmissionRequest;
import com.learningagency.dto.QuizSubmissionResponse;
import com.learningagency.entity.User;
import com.learningagency.service.QuizResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizResultController {

    private final QuizResultService service;

    @PostMapping("/submit")
    public QuizSubmissionResponse submit(

            Authentication authentication,

            @RequestBody QuizSubmissionRequest request){

        User user=(User)authentication.getPrincipal();

        return service.submitQuiz(

                user.getEmail(),

                request

        );

    }

}