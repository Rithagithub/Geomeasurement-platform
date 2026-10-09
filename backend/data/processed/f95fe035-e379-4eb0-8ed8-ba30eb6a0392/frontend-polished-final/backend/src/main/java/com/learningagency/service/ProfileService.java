package com.learningagency.service;

import com.learningagency.dto.ProfileResponse;

public interface ProfileService {

    ProfileResponse getProfile(String email);

}