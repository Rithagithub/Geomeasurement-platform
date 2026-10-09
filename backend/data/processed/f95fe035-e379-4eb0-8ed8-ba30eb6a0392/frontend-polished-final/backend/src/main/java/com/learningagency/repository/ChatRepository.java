package com.learningagency.repository;

import com.learningagency.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByUserEmailOrderByCreatedAtDesc(String userEmail);

}