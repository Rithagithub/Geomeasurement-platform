package com.learningagency.service;

import com.learningagency.dto.ChangePasswordRequest;
import com.learningagency.dto.UpdateProfileRequest;

public interface SettingsService {

    void updateProfile(String email, UpdateProfileRequest request);

    void changePassword(String email, ChangePasswordRequest request);

}