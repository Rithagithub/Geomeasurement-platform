package com.learningagency.user.service.impl;

import com.learningagency.repository.UserRepository;
import com.learningagency.user.dto.UserResponse;
import com.learningagency.user.mapper.UserMapper;
import com.learningagency.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;

    @Override
    public List<UserResponse> getAllUsers(){

        return repository.findAll()

                .stream()

                .map(UserMapper::toResponse)

                .toList();

    }

}