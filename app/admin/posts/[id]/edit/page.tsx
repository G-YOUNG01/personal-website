import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  const { id } = await params;
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get();
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />
      <h1 className="text-2xl font-bold mb-5">编辑文章</h1>
      <PostForm
        csrfToken={session.csrfToken || ""}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          coverImage: post.coverImage,
          tags: post.tags || [],
          published: post.published,
        }}
      />
    </div>
  );
}
