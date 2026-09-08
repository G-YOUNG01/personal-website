import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import TimelineForm from "@/components/workspace/TimelineForm";

export const dynamic = "force-dynamic";

export default async function NewTimelinePage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/workspace/login");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-5">添加时间线</h1>
      <TimelineForm csrfToken={session.csrfToken || ""} />
    </div>
  );
}
