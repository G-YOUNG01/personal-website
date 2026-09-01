import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />
      <h1 className="text-2xl font-bold mb-5">新建文章</h1>
      <PostForm csrfToken={session.csrfToken || ""} />
    </div>
  );
}
