package com.learningagency.controller;

import com.learningagency.dto.ProgressResponse;
import com.learningagency.entity.User;
import com.learningagency.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService service;

    @GetMapping
    public List<ProgressResponse> getProgress(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return service.getProgress(user.getEmail());

    }

}