package com.learningagency.controller;

import com.learningagency.dto.request.ChatRequest;
import com.learningagency.dto.response.ChatResponse;
import com.learningagency.entity.ChatMessage;
import com.learningagency.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ChatResponse ask(@RequestBody ChatRequest request) {

        return chatService.ask(request);
    }

    @GetMapping("/history")
    public List<ChatMessage> history() {

        return chatService.getHistory();
    }
}