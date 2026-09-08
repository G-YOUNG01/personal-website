import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import PostForm from "@/components/workspace/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/workspace/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-5">新建文章</h1>
      <PostForm csrfToken={session.csrfToken || ""} />
    </div>
  );
}
