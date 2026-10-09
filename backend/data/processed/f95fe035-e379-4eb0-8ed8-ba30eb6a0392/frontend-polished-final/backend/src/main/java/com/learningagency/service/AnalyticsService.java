package com.learningagency.service;

import com.learningagency.dto.AnalyticsResponse;

public interface AnalyticsService {

    AnalyticsResponse getAnalytics(String email);

}