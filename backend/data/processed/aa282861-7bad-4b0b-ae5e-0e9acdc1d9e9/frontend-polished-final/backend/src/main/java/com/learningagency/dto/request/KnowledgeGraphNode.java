package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeGraphNode {

    private String id;
    private String label;
    private String type;
    private Integer completion;
}