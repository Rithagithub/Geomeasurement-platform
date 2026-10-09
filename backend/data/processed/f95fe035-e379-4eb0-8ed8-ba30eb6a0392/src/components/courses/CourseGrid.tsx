import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

interface Props {
  courses: Course[];
}

export default function CourseGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-16 text-center">
        <span className="node-dot" />
        <p className="mt-2 font-display text-lg font-semibold text-ink-900">No courses match yet</p>
        <p className="text-sm text-ink-400">Try a different search term, or check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
