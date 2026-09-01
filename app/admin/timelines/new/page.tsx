import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import TimelineForm from "@/components/admin/TimelineForm";

export const dynamic = "force-dynamic";

export default async function NewTimelinePage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />
      <h1 className="text-2xl font-bold mb-5">添加时间线</h1>
      <TimelineForm csrfToken={session.csrfToken || ""} />
    </div>
  );
}
