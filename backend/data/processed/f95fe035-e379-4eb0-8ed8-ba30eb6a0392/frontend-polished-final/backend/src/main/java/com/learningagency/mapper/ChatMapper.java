package com.learningagency.mapper;

import com.learningagency.dto.response.ChatHistoryResponse;
import com.learningagency.entity.ChatMessage;

public class ChatMapper {

    public static ChatHistoryResponse toResponse(ChatMessage chat) {

        return ChatHistoryResponse.builder()
                .prompt(chat.getPrompt())
                .response(chat.getResponse())
                .createdAt(chat.getCreatedAt())
                .build();

    }

}