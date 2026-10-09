package com.learningagency.controller;

import com.learningagency.dto.DashboardResponse;
import com.learningagency.entity.User;
import com.learningagency.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return dashboardService.getDashboard(user);

    }

}