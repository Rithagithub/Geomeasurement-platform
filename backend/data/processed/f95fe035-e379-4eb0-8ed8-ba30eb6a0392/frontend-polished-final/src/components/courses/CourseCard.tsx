"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ArrowRight } from "lucide-react";

import { Course } from "@/types/course";
import courseService from "@/services/courseService";

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await courseService.enroll(course.id);
      router.push(`/quiz/${course.id}`);
    } catch (error) {
      console.error(error);
      alert("Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lifted">
      <p className="eyebrow text-thread-600">{course.category}</p>

      <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">{course.title}</h2>

      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-400">{course.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-ink-900/[0.06] pt-4">
        <span className="badge">{course.level}</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-ink-400">
          <Clock size={12} />
          {course.duration} hrs
        </span>
      </div>

      <button onClick={handleEnroll} disabled={loading} className="btn-primary mt-5 w-full">
        {loading ? "Enrolling…" : "Enroll & start quiz"}
        {!loading && <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />}
      </button>
    </div>
  );
}
