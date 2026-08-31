import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import TechStack from "@/components/TechStack";
import TimelineSection from "@/components/TimelineSection";
import LatestBlog from "@/components/LatestBlog";
import { db } from "@/lib/db";
import { profile, timelines, posts } from "@/lib/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { fetchUserRepos, type GitHubRepo } from "@/lib/github";

// 首页含 GitHub 数据，5 分钟重新验证（与 GitHub 缓存一致）
export const revalidate = 300;

export default async function HomePage() {
  const profileData = await db.select().from(profile).where(eq(profile.id, 1)).get();

  const defaultProfile = {
    name: "G-YOUNG",
    bio: "AI 程序员，专注于全栈开发与人工智能应用。热爱开源，相信技术改变世界。",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "Python", "AI/ML", "Docker"],
    contacts: { github: "https://github.com/G-YOUNG01", email: "hello@gyoung.xyz" },
  };

  const data = profileData || defaultProfile;

  // 解析技能/联系方式（数据库存 JSON 字符串）
  let skills: string[] = data.skills || defaultProfile.skills;
  if (typeof skills === "string") {
    try {
      skills = JSON.parse(skills as unknown as string);
    } catch {
      skills = defaultProfile.skills;
    }
  }
  let contacts: Record<string, string> = data.contacts || defaultProfile.contacts;
  if (typeof contacts === "string") {
    try {
      contacts = JSON.parse(contacts as unknown as string);
    } catch {
      contacts = defaultProfile.contacts;
    }
  }

  // GitHub 精选项目
  let repos: GitHubRepo[] = [];
  try {
    repos = await fetchUserRepos();
  } catch {
    repos = [];
  }

  // 时间线
  const timelineItems = await db
    .select({
      id: timelines.id,
      year: timelines.year,
      title: timelines.title,
      description: timelines.description,
      iconType: timelines.iconType,
    })
    .from(timelines)
    .orderBy(desc(timelines.sortOrder))
    .all();

  // 最新博客（已发布）
  const postCount = await db
    .select({ count: count() })
    .from(posts)
    .where(eq(posts.published, true))
    .get();
  const latestPosts = postCount?.count
    ? await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          tags: posts.tags,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt))
        .limit(2)
        .all()
    : [];

  return (
    <div className="relative">
      <Hero name={data.name} bio={data.bio || ""} skills={skills} contacts={contacts} />
      <FeaturedProjects repos={repos} />
      <TechStack skills={skills} />
      <TimelineSection items={timelineItems} />
      <LatestBlog posts={latestPosts} />
    </div>
  );
}
