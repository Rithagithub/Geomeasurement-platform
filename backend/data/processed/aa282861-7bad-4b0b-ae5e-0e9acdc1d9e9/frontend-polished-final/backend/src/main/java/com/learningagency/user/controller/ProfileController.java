package com.learningagency.controller;

import com.learningagency.dto.ProfileResponse;
import com.learningagency.entity.User;
import com.learningagency.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return profileService.getProfile(user.getEmail());
    }

}