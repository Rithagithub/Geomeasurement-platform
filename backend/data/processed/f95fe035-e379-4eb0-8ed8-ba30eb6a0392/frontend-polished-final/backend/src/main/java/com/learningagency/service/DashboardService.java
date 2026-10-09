package com.learningagency.service;

import com.learningagency.dto.DashboardResponse;
import com.learningagency.entity.User;

public interface DashboardService {

    DashboardResponse getDashboard(User user);

}