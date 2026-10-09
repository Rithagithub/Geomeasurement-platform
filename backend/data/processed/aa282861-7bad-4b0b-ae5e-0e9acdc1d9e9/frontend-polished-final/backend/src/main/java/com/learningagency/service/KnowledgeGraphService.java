package com.learningagency.service;

import com.learningagency.dto.KnowledgeGraphResponse;

public interface KnowledgeGraphService {

    KnowledgeGraphResponse getKnowledgeGraph(String email);

}