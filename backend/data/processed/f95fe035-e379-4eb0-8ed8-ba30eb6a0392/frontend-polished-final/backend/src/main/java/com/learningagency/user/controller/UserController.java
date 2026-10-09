package com.learningagency.user.controller;

import com.learningagency.user.dto.UserResponse;
import com.learningagency.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getUsers(){

        return userService.getAllUsers();

    }

}