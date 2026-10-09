package com.learningagency.service;

import com.learningagency.dto.KnowledgeGraphEdge;
import com.learningagency.dto.KnowledgeGraphNode;
import com.learningagency.dto.KnowledgeGraphResponse;
import com.learningagency.entity.Certificate;
import com.learningagency.entity.Enrollment;
import com.learningagency.entity.Progress;
import com.learningagency.entity.User;
import com.learningagency.repository.CertificateRepository;
import com.learningagency.repository.EnrollmentRepository;
import com.learningagency.repository.ProgressRepository;
import com.learningagency.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KnowledgeGraphServiceImpl implements KnowledgeGraphService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CertificateRepository certificateRepository;

    @Override
    public KnowledgeGraphResponse getKnowledgeGraph(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<KnowledgeGraphNode> nodes = new ArrayList<>();
        List<KnowledgeGraphEdge> edges = new ArrayList<>();

        // User node
        nodes.add(
                KnowledgeGraphNode.builder()
                        .id("user")
                        .label(user.getFullName())
                        .type("USER")
                        .completion(100)
                        .build()
        );

        List<Enrollment> enrollments = enrollmentRepository.findByUser(user);

        for (Enrollment enrollment : enrollments) {

            Long courseId = enrollment.getCourse().getId();

            int completion = 0;

            Progress progress = progressRepository
                    .findByUserAndCourse(user, enrollment.getCourse())
                    .orElse(null);

            if (progress != null) {
                completion = progress.getCompletion();
            }

            String courseNodeId = "course-" + courseId;

            nodes.add(
                    KnowledgeGraphNode.builder()
                            .id(courseNodeId)
                            .label(enrollment.getCourse().getTitle())
                            .type("COURSE")
                            .completion(completion)
                            .build()
            );

            edges.add(
                    KnowledgeGraphEdge.builder()
                            .source("user")
                            .target(courseNodeId)
                            .build()
            );

            Certificate certificate = certificateRepository
                    .findByUserAndCourse(user, enrollment.getCourse())
                    .orElse(null);

            if (certificate != null) {

                String certificateNodeId = "certificate-" + certificate.getId();

                nodes.add(
                        KnowledgeGraphNode.builder()
                                .id(certificateNodeId)
                                .label("Certificate")
                                .type("CERTIFICATE")
                                .completion(100)
                                .build()
                );

                edges.add(
                        KnowledgeGraphEdge.builder()
                                .source(courseNodeId)
                                .target(certificateNodeId)
                                .build()
                );
            }
        }

        return KnowledgeGraphResponse.builder()
                .nodes(nodes)
                .edges(edges)
                .build();
    }
}