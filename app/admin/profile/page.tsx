import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  const row = await db.select().from(profile).where(eq(profile.id, 1)).get();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />
      <h1 className="text-2xl font-bold mb-5">个人简介设置</h1>
      <ProfileForm
        csrfToken={session.csrfToken || ""}
        initial={
          row
            ? {
                name: row.name,
                avatarUrl: row.avatarUrl,
                bio: row.bio,
                skills: row.skills || [],
                contacts: row.contacts || {},
              }
            : undefined
        }
      />
      <p className="mt-4 text-sm text-muted">
        保存后首页实时生效：名字、简介、技能标签、GitHub 等联系方式都会同步更新。
      </p>
    </div>
  );
}
