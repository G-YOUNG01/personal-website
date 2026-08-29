import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Link href="/" className="text-base font-bold tracking-tight">
              G-YOUNG
            </Link>
            <p className="text-sm text-muted mt-1">
              AI 程序员 · 全栈开发 · 开源爱好者
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/G-YOUNG01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
              博客
            </Link>
            <Link href="/works" className="text-sm text-muted hover:text-foreground transition-colors">
              作品
            </Link>
            <Link href="/timeline" className="text-sm text-muted hover:text-foreground transition-colors">
              时间线
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} G-YOUNG. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
