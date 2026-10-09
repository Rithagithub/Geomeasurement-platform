package com.learningagency.service.impl;

import com.learningagency.dto.CertificateResponse;
import com.learningagency.entity.Certificate;
import com.learningagency.entity.Course;
import com.learningagency.entity.User;
import com.learningagency.repository.CertificateRepository;
import com.learningagency.repository.UserRepository;
import com.learningagency.service.CertificateService;
import com.learningagency.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    @Override
    public void generateCertificate(User user, Course course) {

        if (certificateRepository.existsByUserAndCourse(user, course)) {
            return;
        }

        Certificate certificate = Certificate.builder()
                .user(user)
                .course(course)
                .certificateNumber(
                        UUID.randomUUID()
                                .toString()
                                .replace("-", "")
                                .substring(0, 12)
                                .toUpperCase()
                )
                .issuedAt(LocalDateTime.now())
                .build();

        certificateRepository.save(certificate);
    }

    @Override
    public List<CertificateResponse> getCertificates(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("==================================");
        System.out.println("Email : " + email);
        System.out.println("User ID : " + user.getId());

        List<Certificate> certificates = certificateRepository.findByUser(user);

        System.out.println("Certificates Found : " + certificates.size());

        for (Certificate c : certificates) {
            System.out.println("Certificate ID : " + c.getId());
            System.out.println("Certificate User ID : " + c.getUser().getId());
            System.out.println("Course : " + c.getCourse().getTitle());
        }

        return certificates.stream()
                .map(certificate -> CertificateResponse.builder()
                        .id(certificate.getId())
                        .certificateNumber(certificate.getCertificateNumber())
                        .studentName(certificate.getUser().getFullName())
                        .courseTitle(certificate.getCourse().getTitle())
                        .issuedAt(certificate.getIssuedAt())
                        .build())
                .toList();
    }

    @Override
    public byte[] downloadCertificate(Long certificateId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (!certificate.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        CertificateResponse response = CertificateResponse.builder()
                .id(certificate.getId())
                .certificateNumber(certificate.getCertificateNumber())
                .studentName(certificate.getUser().getFullName())
                .courseTitle(certificate.getCourse().getTitle())
                .issuedAt(certificate.getIssuedAt())
                .build();

        return PdfGenerator.generateCertificate(response);
    }
}