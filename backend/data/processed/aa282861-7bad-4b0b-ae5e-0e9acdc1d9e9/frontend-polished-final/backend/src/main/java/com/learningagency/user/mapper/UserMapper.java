package com.learningagency.user.mapper;

import com.learningagency.entity.User;
import com.learningagency.user.dto.UserResponse;

public class UserMapper {

    public static UserResponse toResponse(User user){

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

    }

}