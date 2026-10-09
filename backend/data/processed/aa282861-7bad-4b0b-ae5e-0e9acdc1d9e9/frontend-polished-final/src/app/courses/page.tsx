"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseFilter from "@/components/courses/CourseFilter";
import courseService from "@/services/courseService";
import { Course } from "@/types/course";

const fallbackCourses: Course[] = [
  {
    id: 1,
    title: "Java Programming",
    description: "Learn Java fundamentals, object-oriented design, and real-world application building.",
    category: "Programming",
    level: "Beginner",
    duration: 40,
    thumbnail: "java.png",
  },
  {
    id: 2,
    title: "Spring Boot Masterclass",
    description: "Build production-ready REST APIs with Spring Boot, security, and testing best practices.",
    category: "Backend",
    level: "Intermediate",
    duration: 35,
    thumbnail: "spring.png",
  },
  {
    id: 3,
    title: "React & Next.js",
    description: "Create polished user interfaces and modern full-stack web experiences with React and Next.js.",
    category: "Frontend",
    level: "Intermediate",
    duration: 30,
    thumbnail: "react.png",
  },
  {
    id: 4,
    title: "Machine Learning",
    description: "Explore core ML concepts, model evaluation, and practical AI workflows for real projects.",
    category: "AI",
    level: "Advanced",
    duration: 55,
    thumbnail: "ml.png",
  },
  {
    id: 5,
    title: "Data Structures & Algorithms",
    description: "Solve complex problems and sharpen interview readiness with algorithmic thinking.",
    category: "Programming",
    level: "Intermediate",
    duration: 50,
    thumbnail: "dsa.png",
  },
  {
    id: 6,
    title: "Distributed Systems Design",
    description: "Design resilient distributed systems with latency, consistency, and fault-tolerance patterns.",
    category: "Architecture",
    level: "Advanced",
    duration: 60,
    thumbnail: "distributed.png",
  },
  {
    id: 7,
    title: "System Design for Engineers",
    description: "Master scalability, API design, caching strategies, and high-performance application architecture.",
    category: "Architecture",
    level: "Advanced",
    duration: 65,
    thumbnail: "system-design.png",
  },
  {
    id: 8,
    title: "DevOps & Cloud Infrastructure",
    description: "Deploy applications with CI/CD, Docker, Kubernetes, and production-grade infrastructure automation.",
    category: "Cloud",
    level: "Advanced",
    duration: 58,
    thumbnail: "devops.png",
  },
  {
    id: 9,
    title: "Cybersecurity Fundamentals",
    description: "Learn secure coding, threat modeling, authentication, and defensive engineering for modern apps.",
    category: "Security",
    level: "Advanced",
    duration: 52,
    thumbnail: "security.png",
  },
  {
    id: 10,
    title: "Data Engineering with Python",
    description: "Build pipelines, data warehouses, and reliable ETL workflows for analytics-driven products.",
    category: "Data",
    level: "Advanced",
    duration: 62,
    thumbnail: "data-engineering.png",
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await courseService.getCourses();
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(fallbackCourses);
        }
      } catch (error) {
        console.error("Failed to load courses, using fallback data:", error);
        setCourses(fallbackCourses);
      }
    }

    load();
  }, []);

  const filtered = courses.filter((c) =>
    `${c.title} ${c.category}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        eyebrow={`${courses.length} available`}
        title="Courses"
        subtitle="Every course you complete becomes a node on your knowledge graph."
      />

      <CourseFilter value={query} onChange={setQuery} />
      <CourseGrid courses={filtered} />
    </MainLayout>
  );
}
