package com.learningagency.controller;

import com.learningagency.dto.CertificateResponse;
import com.learningagency.entity.User;
import com.learningagency.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping
    public List<CertificateResponse> getCertificates(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return certificateService.getCertificates(user.getEmail());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        byte[] pdf = certificateService.downloadCertificate(id, user.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=certificate-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}