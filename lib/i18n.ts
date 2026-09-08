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
  workspace: {
    title: string;
    overview: string;
    posts: string;
    timelines: string;
    profile: string;
    analytics: string;
    github: string;
    todos: string;
    system: string;
    server: string;
    account: string;
    logout: string;
    backToSite: string;
    welcome: string;
    quickActions: string;
    newPost: string;
    newTimeline: string;
    editProfile: string;
    totalViews: string;
    uniqueVisitors: string;
    topPages: string;
    recentPosts: string;
    allPosts: string;
    noPosts: string;
    published: string;
    draft: string;
    edit: string;
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
    workspace: {
      title: "个人工作台",
      overview: "概览",
      posts: "文章管理",
      timelines: "时间线",
      profile: "个人简介",
      analytics: "访客趋势",
      github: "GitHub 状态",
      todos: "待办备忘",
      system: "系统状态",
      server: "服务器信息",
      account: "账号设置",
      logout: "退出登录",
      backToSite: "返回网站",
      welcome: "欢迎回来",
      quickActions: "快捷操作",
      newPost: "新建文章",
      newTimeline: "添加时间线",
      editProfile: "编辑简介",
      totalViews: "总浏览量",
      uniqueVisitors: "独立访客",
      topPages: "热门页面",
      recentPosts: "最近更新",
      allPosts: "全部文章",
      noPosts: "还没有文章",
      published: "已发布",
      draft: "草稿",
      edit: "编辑",
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
    workspace: {
      title: "Workspace",
      overview: "Overview",
      posts: "Posts",
      timelines: "Timeline",
      profile: "Profile",
      analytics: "Analytics",
      github: "GitHub",
      todos: "Todos",
      system: "System",
      server: "Server",
      account: "Account",
      logout: "Logout",
      backToSite: "Back to Site",
      welcome: "Welcome back",
      quickActions: "Quick Actions",
      newPost: "New Post",
      newTimeline: "New Timeline",
      editProfile: "Edit Profile",
      totalViews: "Total Views",
      uniqueVisitors: "Unique Visitors",
      topPages: "Top Pages",
      recentPosts: "Recent Posts",
      allPosts: "All Posts",
      noPosts: "No posts yet",
      published: "Published",
      draft: "Draft",
      edit: "Edit",
    },
  },
};
