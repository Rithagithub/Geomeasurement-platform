package com.learningagency.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerRequest {

    private Long questionId;

    /*
        A
        B
        C
        D
     */

    private String selectedOption;

}