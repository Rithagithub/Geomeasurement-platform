interface PageHeaderProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
}

export default function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-9">
      {eyebrow && <p className="eyebrow mb-2 text-thread-600">{eyebrow}</p>}
      <h1 className="font-display text-[2.35rem] font-semibold leading-tight text-ink-900">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-[15px] text-ink-400">{subtitle}</p>
    </div>
  );
}
