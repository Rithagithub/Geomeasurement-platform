package com.learningagency.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatHistoryResponse {

    private String prompt;

    private String response;

    private LocalDateTime createdAt;

}