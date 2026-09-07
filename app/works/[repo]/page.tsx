import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { fetchRepoDetail, fetchRepoLanguages, fetchRepoReadme, languageColors } from "@/lib/github";
import { renderMarkdownHtml, rewriteGithubUrls } from "@/lib/readme";
import ViewCounter from "@/components/ViewCounter";

export const revalidate = 300; // 5 分钟重新验证

interface RepoDetailPageProps {
  params: Promise<{ repo: string }>;
}

export async function generateMetadata({ params }: RepoDetailPageProps): Promise<Metadata> {
  const { repo } = await params;
  try {
    const detail = await fetchRepoDetail(repo);
    return {
      title: detail.name,
      description: detail.description || `${detail.name} 项目详情`,
    };
  } catch {
    return { title: "作品" };
  }
}

export default async function RepoDetailPage({ params }: RepoDetailPageProps) {
  const { repo } = await params;

  let detail;
  try {
    detail = await fetchRepoDetail(repo);
  } catch {
    notFound();
  }
  if (detail.fork) notFound();

  const [langs, readme] = await Promise.all([
    fetchRepoLanguages(repo).catch(() => ({})),
    fetchRepoReadme(repo).catch(() => null),
  ]);

  const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0);
  const langList =
    totalBytes > 0
      ? Object.entries(langs)
          .sort((a, b) => b[1] - a[1])
          .map(([name, bytes]) => ({
            name,
            pct: Math.round((bytes / totalBytes) * 1000) / 10,
          }))
      : [];

  let readmeHtml = "";
  if (readme) {
    const rendered = await renderMarkdownHtml(readme);
    readmeHtml = rewriteGithubUrls(
      rendered,
      env.GITHUB_USERNAME,
      detail.name,
      detail.default_branch,
    );
  }

  const statItems = [
    { label: "Stars", value: detail.stargazers_count },
    { label: "Forks", value: detail.forks_count },
    { label: "Issues", value: detail.open_issues_count },
    { label: "Watchers", value: detail.watchers_count },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/works" className="text-sm text-primary-light hover:underline mb-6 inline-block">
        ← 返回作品集
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-bold">{detail.name}</h1>
          <a
            href={detail.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline !py-1.5 !px-3 text-sm"
          >
            GitHub ↗
          </a>
        </div>
        {detail.description && <p className="text-muted mt-2">{detail.description}</p>}
        {detail.homepage && (
          <a
            href={detail.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-light hover:underline mt-1 inline-block"
          >
            🔗 {detail.homepage}
          </a>
        )}
        <ViewCounter
          path={`/works/${detail.name}`}
          className="flex items-center gap-1 text-xs text-muted mt-2"
        />
      </header>

      {/* 统计卡 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statItems.map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{s.value.toLocaleString()}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 语言占比 */}
      {langList.length > 0 && (
        <section className="card p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">技术栈</h2>
          <div className="flex h-3 rounded-full overflow-hidden mb-4">
            {langList.map((l) => (
              <div
                key={l.name}
                style={{
                  width: `${l.pct}%`,
                  backgroundColor: languageColors[l.name] || "#8b8b9e",
                }}
                title={`${l.name} ${l.pct}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            {langList.map((l) => (
              <span key={l.name} className="flex items-center gap-1.5 text-muted">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColors[l.name] || "#8b8b9e" }}
                />
                {l.name} {l.pct}%
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      {detail.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {detail.topics.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* README */}
      <section>
        {readmeHtml ? (
          <div
            className="prose-content card p-6 sm:p-8"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        ) : (
          <div className="text-center py-16 text-muted">该仓库暂无 README</div>
        )}
      </section>
    </article>
  );
}
