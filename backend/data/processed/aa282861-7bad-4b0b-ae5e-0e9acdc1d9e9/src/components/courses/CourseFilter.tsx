import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CourseFilter({ value, onChange }: Props) {
  return (
    <div className="relative mb-8 max-w-md">
      <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
      <input
        placeholder="Search by title or category…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-11"
      />
    </div>
  );
}
