package com.learningagency.service.impl;

import com.learningagency.dto.request.ChatRequest;
import com.learningagency.dto.response.ChatResponse;
import com.learningagency.entity.ChatMessage;
import com.learningagency.entity.Enrollment;
import com.learningagency.entity.User;
import com.learningagency.repository.ChatRepository;
import com.learningagency.repository.EnrollmentRepository;
import com.learningagency.service.ChatService;
import com.learningagency.service.ai.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository repository;
    private final AIService aiService;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public ChatResponse ask(ChatRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
                || !(authentication.getPrincipal() instanceof User user)) {

            throw new RuntimeException("User is not authenticated.");
        }

        List<Enrollment> enrollments =
                enrollmentRepository.findByUser(user);

        String enrolledCourses = enrollments.stream()
                .map(e -> e.getCourse().getTitle())
                .collect(Collectors.joining(", "));

        String enhancedPrompt = """
You are an expert AI Tutor for the Learning Agency Platform.

The student is currently enrolled in the following courses:

%s

Instructions:

- Answer like an experienced teacher.
- Keep explanations simple.
- Use examples related to the student's enrolled courses whenever possible.
- Use Markdown headings and bullet points.
- If programming is involved, include code examples.
- End with a short summary.

Student Question:

%s
""".formatted(
                enrolledCourses.isBlank()
                        ? "No enrolled courses"
                        : enrolledCourses,
                request.getPrompt()
        );

        String answer = aiService.askAI(enhancedPrompt);

        ChatMessage message = ChatMessage.builder()
                .userEmail(user.getEmail())
                .prompt(request.getPrompt())
                .response(answer)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(message);

        return ChatResponse.builder()
                .answer(answer)
                .build();
    }

    @Override
    public List<ChatMessage> getHistory() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
                || !(authentication.getPrincipal() instanceof User user)) {

            throw new RuntimeException("User is not authenticated.");
        }

        return repository.findByUserEmailOrderByCreatedAtDesc(
                user.getEmail()
        );
    }
}