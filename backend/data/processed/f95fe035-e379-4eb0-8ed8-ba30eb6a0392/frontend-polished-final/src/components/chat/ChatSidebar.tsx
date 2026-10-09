import { Plus } from "lucide-react";

const conversations = [
  "Introduction to AI",
  "Machine Learning Basics",
  "Decision Trees",
  "Neural Networks",
];

export default function ChatSidebar() {
  return (
    <div className="card w-72 p-5">
      <button className="btn-signal w-full">
        <Plus size={16} /> New chat
      </button>

      <h2 className="eyebrow mb-3 mt-6 text-ink-400">Recent chats</h2>

      <div className="space-y-2">
        {conversations.map((chat) => (
          <div
            key={chat}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink-900/[0.06] p-3 text-sm text-ink-700 transition hover:border-thread-500/30 hover:bg-thread-500/[0.05]"
          >
            <span className="node-dot h-1.5 w-1.5" />
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
}
