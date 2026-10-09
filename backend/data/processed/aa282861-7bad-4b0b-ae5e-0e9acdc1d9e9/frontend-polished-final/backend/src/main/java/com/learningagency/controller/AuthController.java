package com.learningagency.controller;

import com.learningagency.dto.request.LoginRequest;
import com.learningagency.dto.request.RegisterRequest;
import com.learningagency.dto.response.AuthResponse;
import com.learningagency.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @Valid
            @RequestBody RegisterRequest request){

        return authService.register(request);
        
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody LoginRequest request){

        return authService.login(request);

    }

}