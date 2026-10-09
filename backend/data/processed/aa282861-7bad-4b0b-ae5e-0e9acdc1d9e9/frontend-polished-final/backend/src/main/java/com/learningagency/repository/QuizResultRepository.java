package com.learningagency.repository;

import com.learningagency.entity.QuizResult;
import com.learningagency.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizResultRepository
        extends JpaRepository<QuizResult,Long>{

    List<QuizResult> findByUser(User user);

}