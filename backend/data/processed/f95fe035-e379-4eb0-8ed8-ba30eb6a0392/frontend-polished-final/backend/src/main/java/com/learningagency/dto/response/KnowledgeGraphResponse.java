package com.learningagency.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeGraphResponse {

    private List<KnowledgeGraphNode> nodes;
    private List<KnowledgeGraphEdge> edges;
}