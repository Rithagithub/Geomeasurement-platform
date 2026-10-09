package com.learningagency.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningagency.service.ai.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Override
    public String askAI(String prompt) {

        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String enhancedPrompt = """
You are an expert AI Learning Tutor for the Learning Agency Platform.

Your goal is to teach students clearly and accurately.

Always follow these rules:

1. Start with a short definition.
2. Explain the concept in simple language.
3. Give a real-world example.
4. If the topic involves programming, include a code example.
5. Mention common mistakes students make.
6. Provide 3 interview questions (if applicable).
7. End with a short summary.

Format your response using Markdown headings and bullet points.

Student Question:

""" + prompt;
 Map<String, Object> body = Map.of(
                    "contents",
                    new Object[]{
                            Map.of(
                                    "parts",
                                    new Object[]{
                                            Map.of("text", enhancedPrompt)
                                    }
                            )
                    }
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            apiUrl + "?key=" + apiKey,
                            HttpMethod.POST,
                            entity,
                            String.class
                    );

            JsonNode root =
                    objectMapper.readTree(response.getBody());

            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {

            return "Gemini Error : " + e.getMessage();

        }

    }

}