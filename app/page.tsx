import Hero from "@/components/Hero";
import ParticleBackground from "@/components/ParticleBackground";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    <>
      <ParticleBackground />
      <div className="bg-gradient-hero">
        <Hero name={data.name} bio={data.bio || ""} skills={data.skills || []} contacts={data.contacts || {}} />
      </div>
    </>
  );
}
