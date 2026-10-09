package com.learningagency.service;

import com.learningagency.dto.request.ChatRequest;
import com.learningagency.dto.response.ChatResponse;
import com.learningagency.entity.ChatMessage;

import java.util.List;

public interface ChatService {

    ChatResponse ask(ChatRequest request);

    List<ChatMessage> getHistory();
}