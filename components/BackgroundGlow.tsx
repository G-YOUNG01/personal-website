/**
 * 站点背景 - 高级磨砂玻璃质感（双主题）
 * fixed 固定定位：页面滚动时背景固定，动效全程一致。
 * 背景渐变与各光斑颜色由 globals.css 的 CSS 变量控制（亮/暗主题自动切换）。
 * 动画由 CSS keyframes 驱动（定义见 globals.css）。
 */
export default function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "var(--bg-grad)" }}
    >
      {/* 主光斑 - 柔和蓝 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "900px",
          height: "900px",
          background: "var(--grad-blue)",
          filter: "blur(90px)",
          top: "-20%",
          left: "-12%",
          animation: "float1 26s ease-in-out infinite",
        }}
      />

      {/* 光斑 - 柔青 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "760px",
          height: "760px",
          background: "var(--grad-cyan)",
          filter: "blur(90px)",
          top: "6%",
          right: "-14%",
          animation: "float2 30s ease-in-out infinite",
        }}
      />

      {/* 光斑 - 柔紫 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "820px",
          height: "820px",
          background: "var(--grad-purple)",
          filter: "blur(100px)",
          bottom: "-24%",
          left: "6%",
          animation: "float3 32s ease-in-out infinite",
        }}
      />

      {/* 光斑 - 柔粉 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "560px",
          height: "560px",
          background: "var(--grad-pink)",
          filter: "blur(80px)",
          top: "34%",
          left: "28%",
          animation: "float4 24s ease-in-out infinite",
        }}
      />

      {/* 光斑 - 柔蓝绿 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background: "var(--grad-sky)",
          filter: "blur(85px)",
          bottom: "8%",
          right: "-6%",
          animation: "float5 28s ease-in-out infinite",
        }}
      />

      {/* 光斑 - 暖光点缀 */}
      <div
        className="absolute rounded-full hidden md:block"
        style={{
          width: "420px",
          height: "420px",
          background: "var(--grad-warm)",
          filter: "blur(70px)",
          top: "62%",
          right: "18%",
          animation: "float2 34s ease-in-out infinite",
        }}
      />

      {/* 液态玻璃 - 流动渐变层 1（大幅缓慢流动） */}
      <div
        className="absolute rounded-full"
        style={{
          width: "1100px",
          height: "1100px",
          background: "var(--liquid-grad-a)",
          filter: "blur(120px)",
          top: "-30%",
          left: "-18%",
          animation: "liquid1 44s ease-in-out infinite",
        }}
      />

      {/* 液态玻璃 - 流动渐变层 2（反向流动） */}
      <div
        className="absolute rounded-full hidden md:block"
        style={{
          width: "1000px",
          height: "1000px",
          background: "var(--liquid-grad-b)",
          filter: "blur(130px)",
          bottom: "-35%",
          right: "-20%",
          animation: "liquid2 52s ease-in-out infinite",
        }}
      />

      {/* 磨砂噪点颗粒 - 细腻玻璃质感 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/noise.svg')",
          backgroundSize: "240px 240px",
          opacity: 0.5,
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
