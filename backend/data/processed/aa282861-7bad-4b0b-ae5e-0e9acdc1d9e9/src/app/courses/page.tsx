"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import CourseGrid from "@/components/courses/CourseGrid";
import CourseFilter from "@/components/courses/CourseFilter";
import courseService from "@/services/courseService";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const data = await courseService.getCourses();
      setCourses(data);
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
