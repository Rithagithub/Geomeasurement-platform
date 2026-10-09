package com.learningagency.controller;

import com.learningagency.dto.KnowledgeGraphResponse;
import com.learningagency.entity.User;
import com.learningagency.service.KnowledgeGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/knowledge-graph")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnowledgeGraphController {

    private final KnowledgeGraphService knowledgeGraphService;

    @GetMapping
    public KnowledgeGraphResponse getKnowledgeGraph(
            org.springframework.security.core.Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return knowledgeGraphService.getKnowledgeGraph(user.getEmail());

    }

}