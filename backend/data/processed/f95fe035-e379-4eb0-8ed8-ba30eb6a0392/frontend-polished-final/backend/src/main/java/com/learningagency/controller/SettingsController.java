package com.learningagency.controller;

import com.learningagency.dto.ChangePasswordRequest;
import com.learningagency.dto.UpdateProfileRequest;
import com.learningagency.entity.User;
import com.learningagency.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService settingsService;

    @PutMapping("/profile")
    public String updateProfile(
            org.springframework.security.core.Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {

        User user = (User) authentication.getPrincipal();

        settingsService.updateProfile(user.getEmail(), request);

        return "Profile updated successfully";
    }

    @PutMapping("/password")
    public String changePassword(
            org.springframework.security.core.Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {

        User user = (User) authentication.getPrincipal();

        settingsService.changePassword(user.getEmail(), request);

        return "Password changed successfully";
    }
}