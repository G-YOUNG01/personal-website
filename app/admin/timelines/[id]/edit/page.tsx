import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { timelines } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import TimelineForm from "@/components/admin/TimelineForm";

export const dynamic = "force-dynamic";

export default async function EditTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  const { id } = await params;
  const row = await db
    .select()
    .from(timelines)
    .where(eq(timelines.id, Number(id)))
    .get();
  if (!row) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />
      <h1 className="text-2xl font-bold mb-5">编辑时间线</h1>
      <TimelineForm
        csrfToken={session.csrfToken || ""}
        initial={{
          id: row.id,
          slug: row.slug,
          year: row.year,
          title: row.title,
          description: row.description,
          iconType: row.iconType,
          sortOrder: row.sortOrder,
        }}
      />
    </div>
  );
}
