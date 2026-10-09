package com.learningagency.config;

import com.learningagency.entity.Course;
import com.learningagency.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CourseDataLoader implements CommandLineRunner {

    private final CourseRepository repository;

    @Override
    public void run(String... args) {

        List<Course> seedCourses = List.of(
                Course.builder()
                        .title("Java Programming")
                        .description("Learn Java from beginner to advanced.")
                        .category("Programming")
                        .level("Beginner")
                        .duration(40)
                        .thumbnail("java.png")
                        .build(),
                Course.builder()
                        .title("Spring Boot Masterclass")
                        .description("Develop REST APIs using Spring Boot.")
                        .category("Backend")
                        .level("Intermediate")
                        .duration(35)
                        .thumbnail("spring.png")
                        .build(),
                Course.builder()
                        .title("React & Next.js")
                        .description("Modern frontend development.")
                        .category("Frontend")
                        .level("Intermediate")
                        .duration(30)
                        .thumbnail("react.png")
                        .build(),
                Course.builder()
                        .title("Machine Learning")
                        .description("Introduction to AI and ML.")
                        .category("AI")
                        .level("Advanced")
                        .duration(55)
                        .thumbnail("ml.png")
                        .build(),
                Course.builder()
                        .title("Data Structures & Algorithms")
                        .description("Ace coding interviews.")
                        .category("Programming")
                        .level("Intermediate")
                        .duration(50)
                        .thumbnail("dsa.png")
                        .build(),
                Course.builder()
                        .title("Distributed Systems Design")
                        .description("Design resilient distributed systems with latency, consistency, and fault-tolerance patterns.")
                        .category("Architecture")
                        .level("Advanced")
                        .duration(60)
                        .thumbnail("distributed.png")
                        .build(),
                Course.builder()
                        .title("System Design for Engineers")
                        .description("Master scalability, API design, caching strategies, and high-performance application architecture.")
                        .category("Architecture")
                        .level("Advanced")
                        .duration(65)
                        .thumbnail("system-design.png")
                        .build(),
                Course.builder()
                        .title("DevOps & Cloud Infrastructure")
                        .description("Deploy applications with CI/CD, Docker, Kubernetes, and production-grade infrastructure automation.")
                        .category("Cloud")
                        .level("Advanced")
                        .duration(58)
                        .thumbnail("devops.png")
                        .build(),
                Course.builder()
                        .title("Cybersecurity Fundamentals")
                        .description("Learn secure coding, threat modeling, authentication, and defensive engineering for modern apps.")
                        .category("Security")
                        .level("Advanced")
                        .duration(52)
                        .thumbnail("security.png")
                        .build(),
                Course.builder()
                        .title("Data Engineering with Python")
                        .description("Build pipelines, data warehouses, and reliable ETL workflows for analytics-driven products.")
                        .category("Data")
                        .level("Advanced")
                        .duration(62)
                        .thumbnail("data-engineering.png")
                        .build()
        );

        for (Course course : seedCourses) {
            boolean exists = repository.findAll().stream()
                    .anyMatch(existing -> existing.getTitle().equalsIgnoreCase(course.getTitle()));

            if (!exists) {
                repository.save(course);
            }
        }
    }
}