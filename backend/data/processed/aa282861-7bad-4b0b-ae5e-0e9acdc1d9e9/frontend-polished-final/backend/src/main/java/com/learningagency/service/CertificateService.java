package com.learningagency.service;

import com.learningagency.dto.CertificateResponse;
import com.learningagency.entity.Course;
import com.learningagency.entity.User;

import java.util.List;

public interface CertificateService {

    void generateCertificate(User user, Course course);

    List<CertificateResponse> getCertificates(String email);

    byte[] downloadCertificate(Long certificateId, String email);

}