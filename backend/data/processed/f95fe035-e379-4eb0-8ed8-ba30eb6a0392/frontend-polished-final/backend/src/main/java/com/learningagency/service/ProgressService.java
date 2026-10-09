package com.learningagency.service;

import com.learningagency.dto.ProgressResponse;

import java.util.List;

public interface ProgressService {

    List<ProgressResponse> getProgress(String email);

}