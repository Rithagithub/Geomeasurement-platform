const concepts = [
  { name: "Machine Learning", value: 92 },
  { name: "Data Structures", value: 76 },
  { name: "Operating Systems", value: 63 },
  { name: "Database Systems", value: 88 },
];

export default function LearningProgress() {
  return (
    <div className="card h-full p-6">
      <h2 className="font-display text-xl font-semibold text-ink-900">Concept mastery</h2>

      <div className="mt-6 space-y-5">
        {concepts.map((item) => (
          <div key={item.name}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-ink-700">{item.name}</span>
              <span className="font-mono text-ink-400">{item.value}%</span>
            </div>

            <div className="thread-track">
              <span style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
