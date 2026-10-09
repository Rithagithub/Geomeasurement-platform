package com.learningagency.service.impl;

import com.learningagency.dto.request.LoginRequest;
import com.learningagency.dto.request.RegisterRequest;
import com.learningagency.dto.response.AuthResponse;
import com.learningagency.entity.User;
import com.learningagency.repository.UserRepository;
import com.learningagency.security.jwt.JwtTokenProvider;
import com.learningagency.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if(repository.existsByEmail(request.getEmail())){
            return AuthResponse.builder()
                    .message("Email already exists")
                    .build();
        }

        User user = User.builder()
        .fullName(request.getFullName())
        .email(request.getEmail())
        .password(encoder.encode(request.getPassword()))
        .role("ROLE_USER")
        .build();

        repository.save(user);

        String token =
                jwtProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Registration Successful")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = repository.findByEmail(request.getEmail())
                .orElse(null);

        if(user==null){
            return AuthResponse.builder()
                    .message("User not found")
                    .build();
        }

        if(!encoder.matches(
                request.getPassword(),
                user.getPassword()
        )){
            return AuthResponse.builder()
                    .message("Invalid Password")
                    .build();
        }

        String token =
                jwtProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .message("Login Successful")
                .build();
    }
}