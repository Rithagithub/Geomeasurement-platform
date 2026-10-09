package com.learningagency.service;

import com.learningagency.dto.request.LoginRequest;
import com.learningagency.dto.request.RegisterRequest;
import com.learningagency.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}