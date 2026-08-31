import Hero from "@/components/Hero";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// profile 数据几乎不变，静态化缓存 1 小时，减少逐请求读 SQLite
export const revalidate = 3600;

export default async function HomePage() {
  const profileData = await db.select().from(profile).where(eq(profile.id, 1)).get();

  const defaultProfile = {
    name: "G-YOUNG",
    bio: "AI 程序员，专注于全栈开发与人工智能应用。热爱开源，相信技术改变世界。",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "AI/ML"],
    contacts: { github: "https://github.com/G-YOUNG01" },
  };

  const data = profileData || defaultProfile;

  return (
    <Hero name={data.name} bio={data.bio || ""} skills={data.skills || []} contacts={data.contacts || {}} />
  );
}
