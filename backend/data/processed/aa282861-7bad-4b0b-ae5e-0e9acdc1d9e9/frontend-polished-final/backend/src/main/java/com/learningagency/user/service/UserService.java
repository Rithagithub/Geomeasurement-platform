package com.learningagency.user.service;

import com.learningagency.user.dto.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

}