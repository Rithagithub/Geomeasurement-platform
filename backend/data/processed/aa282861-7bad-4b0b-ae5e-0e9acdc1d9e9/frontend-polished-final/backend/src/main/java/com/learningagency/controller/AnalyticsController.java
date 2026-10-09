package com.learningagency.controller;

import com.learningagency.dto.AnalyticsResponse;
import com.learningagency.entity.User;
import com.learningagency.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public AnalyticsResponse getAnalytics(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return analyticsService.getAnalytics(user.getEmail());

    }
}