import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundGlow from "@/components/BackgroundGlow";
import { LanguageProvider } from "@/components/LanguageProvider";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: "GYOUNG个人网站",
    template: "%s | GYOUNG个人网站",
  },
  description: "AI 程序员个人网站 - 全栈开发、开源项目、技术博客与成长记录",
  keywords: ["AI 程序员", "全栈开发", "Next.js", "开源", "技术博客", "G-YOUNG"],
  authors: [{ name: "G-YOUNG", url: env.SITE_URL }],
  creator: "G-YOUNG",
  metadataBase: new URL(env.SITE_URL),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: env.SITE_URL,
    title: "GYOUNG个人网站",
    description: "AI 程序员个人网站 - 全栈开发、开源项目、技术博客与成长记录",
    siteName: "GYOUNG个人网站",
  },
  twitter: {
    card: "summary_large_image",
    title: "GYOUNG个人网站",
    description: "AI 程序员个人网站 - 全栈开发、开源项目、技术博客与成长记录",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "G-YOUNG",
  url: env.SITE_URL,
  jobTitle: "AI 程序员",
  sameAs: ["https://github.com/G-YOUNG01"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LanguageProvider>
          <BackgroundGlow />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
