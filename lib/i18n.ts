export type Lang = "zh" | "en";

export interface Dict {
  nav: {
    home: string;
    works: string;
    blog: string;
    timeline: string;
    about: string;
    contact: string;
    menu: string;
  };
  hero: {
    tagline: string;
    viewWorks: string;
    readBlog: string;
    bioFallback: string;
    bioEn: string;
    developerTs: string;
  };
  featured: {
    title: string;
    viewAll: string;
    noDesc: string;
  };
  techstack: {
    title: string;
    subtitle: string;
  };
  timeline: {
    title: string;
    viewAll: string;
  };
  latestBlog: {
    title: string;
    viewAll: string;
    empty: string;
    readMore: string;
  };
  footer: {
    tagline: string;
    blog: string;
    works: string;
    timeline: string;
    builtWith: string;
  };
}

export const translations: Record<Lang, Dict> = {
  zh: {
    nav: {
      home: "首页",
      works: "作品集",
      blog: "技术博客",
      timeline: "成长时间线",
      about: "关于我",
      contact: "联系我",
      menu: "菜单",
    },
    hero: {
      tagline: "AI 程序员 / 全栈开发者 / 开源爱好者",
      viewWorks: "查看我的作品",
      readBlog: "阅读技术博客",
      bioFallback: "AI 程序员，专注于全栈开发与人工智能应用。热爱开源，相信技术改变世界。",
      bioEn:
        "AI programmer focused on full-stack development and AI applications. Open-source enthusiast, believing code changes the world.",
      developerTs: "developer.ts",
    },
    featured: {
      title: "精选项目",
      viewAll: "查看全部项目 →",
      noDesc: "暂无描述",
    },
    techstack: {
      title: "技术栈",
      subtitle: "持续探索与使用中的技术",
    },
    timeline: {
      title: "成长时间线",
      viewAll: "查看完整历程 →",
    },
    latestBlog: {
      title: "最新博客",
      viewAll: "查看全部文章 →",
      empty: "暂无文章，敬请期待",
      readMore: "阅读全文 →",
    },
    footer: {
      tagline: "AI 程序员 · 全栈开发 · 开源爱好者",
      blog: "博客",
      works: "作品",
      timeline: "时间线",
      builtWith: "Built with Next.js.",
    },
  },
  en: {
    nav: {
      home: "Home",
      works: "Works",
      blog: "Blog",
      timeline: "Timeline",
      about: "About",
      contact: "Contact",
      menu: "Menu",
    },
    hero: {
      tagline: "AI Programmer / Full-Stack Dev / OSS Enthusiast",
      viewWorks: "View My Works",
      readBlog: "Read Blog",
      bioFallback:
        "AI programmer focused on full-stack development and AI applications. Open-source enthusiast, believing code changes the world.",
      bioEn:
        "AI programmer focused on full-stack development and AI applications. Open-source enthusiast, believing code changes the world.",
      developerTs: "developer.ts",
    },
    featured: {
      title: "Featured Projects",
      viewAll: "View all projects →",
      noDesc: "No description",
    },
    techstack: {
      title: "Tech Stack",
      subtitle: "Technologies I explore and use",
    },
    timeline: {
      title: "Growth Timeline",
      viewAll: "View full journey →",
    },
    latestBlog: {
      title: "Latest Posts",
      viewAll: "View all posts →",
      empty: "No posts yet, stay tuned",
      readMore: "Read more →",
    },
    footer: {
      tagline: "AI Programmer · Full-Stack Dev · OSS Enthusiast",
      blog: "Blog",
      works: "Works",
      timeline: "Timeline",
      builtWith: "Built with Next.js.",
    },
  },
};
