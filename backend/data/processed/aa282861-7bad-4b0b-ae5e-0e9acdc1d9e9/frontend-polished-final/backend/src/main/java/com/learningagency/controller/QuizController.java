package com.learningagency.controller;

import com.learningagency.dto.QuizResponse;
import com.learningagency.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService service;

    @GetMapping("/course/{courseId}")
    public QuizResponse getQuiz(

            @PathVariable Long courseId){

        return service.getQuizByCourse(courseId);

    }

}