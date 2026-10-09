package com.learningagency.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private Long id;

    private String certificateNumber;

    private String studentName;

    private String courseTitle;

    private LocalDateTime issuedAt;

}