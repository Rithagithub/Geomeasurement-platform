const activities = [
  { text: "Completed Neural Networks lesson", time: "2h ago" },
  { text: "Asked AI tutor about Decision Trees", time: "5h ago" },
  { text: "Mastered Graph Theory", time: "Yesterday" },
  { text: "Agency score increased by 4%", time: "Yesterday" },
];

export default function RecentActivity() {
  return (
    <div className="card p-6">
      <h2 className="font-display text-xl font-semibold text-ink-900">Recent activity</h2>

      <ul className="mt-5 space-y-1">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex items-center gap-4 border-t border-ink-900/[0.06] py-3 first:border-t-0"
          >
            <span className="node-dot" />
            <span className="flex-1 text-sm text-ink-700">{activity.text}</span>
            <span className="font-mono text-xs text-ink-300">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
