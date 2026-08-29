import type { Metadata } from "next";
import { db } from "@/lib/db";
import { timelines } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "时间线",
  description: "个人成长与项目经历时间线",
};

const iconMap: Record<string, string> = {
  rocket: "🚀",
  star: "⭐",
  brain: "🧠",
  globe: "🌐",
  code: "💻",
  book: "📚",
  trophy: "🏆",
  briefcase: "💼",
};

export default async function TimelinePage() {
  const items = await db.select().from(timelines).orderBy(asc(timelines.sortOrder)).all();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">时间线</span>
        </h1>
        <p className="text-muted">记录成长路上的每一个里程碑</p>
      </div>

      <div className="relative pl-8">
        <div className="timeline-line" />

        {items.length === 0 ? (
          <p className="text-muted text-center py-10">暂无时间线记录</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="relative mb-10 last:mb-0">
              <div className="timeline-dot" style={{ top: "0.5rem" }} />
              <div className="card p-5 ml-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{iconMap[item.iconType || ""] || "📌"}</span>
                  <span className="text-primary-light font-bold text-lg">{item.year}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                {item.description && <p className="text-muted text-sm leading-relaxed">{item.description}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
