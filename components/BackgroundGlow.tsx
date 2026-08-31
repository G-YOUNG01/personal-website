/**
 * 站点背景 - 高级磨砂玻璃质感
 * fixed 固定定位：页面滚动时背景固定，动效全程一致。
 * 柔和大面积浅色渐变 + 多层柔和光斑（模拟 iOS 壁纸景深）+ 细腻噪点颗粒（磨砂玻璃感）。
 * 动画由 CSS keyframes 驱动（定义见 globals.css）。
 */
export default function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        background:
          "radial-gradient(120% 120% at 12% 8%, #eef6ff 0%, #f0f4ff 38%, #f5f1ff 68%, #fbf3ff 100%)",
      }}
    >
      {/* 主光斑 - 柔和蓝 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(circle at 35% 35%, rgba(96,165,250,0.38) 0%, rgba(96,165,250,0.13) 45%, rgba(96,165,250,0) 70%)",
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
          background:
            "radial-gradient(circle at 60% 30%, rgba(45,212,191,0.30) 0%, rgba(45,212,191,0.10) 45%, rgba(45,212,191,0) 70%)",
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
          background:
            "radial-gradient(circle at 50% 40%, rgba(167,139,250,0.34) 0%, rgba(167,139,250,0.12) 45%, rgba(167,139,250,0) 70%)",
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
          background:
            "radial-gradient(circle at 50% 40%, rgba(244,114,182,0.26) 0%, rgba(244,114,182,0.09) 45%, rgba(244,114,182,0) 70%)",
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
          background:
            "radial-gradient(circle at 50% 40%, rgba(56,189,248,0.28) 0%, rgba(56,189,248,0.10) 45%, rgba(56,189,248,0) 70%)",
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
          background:
            "radial-gradient(circle at 50% 40%, rgba(253,186,116,0.26) 0%, rgba(253,186,116,0.08) 45%, rgba(253,186,116,0) 70%)",
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
          background:
            "conic-gradient(from 0deg at 40% 40%, rgba(96,165,250,0.20), rgba(167,139,250,0.14), rgba(45,212,191,0.16), rgba(96,165,250,0.20))",
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
          background:
            "conic-gradient(from 180deg at 60% 60%, rgba(139,92,246,0.16), rgba(56,189,248,0.16), rgba(244,114,182,0.12), rgba(139,92,246,0.16))",
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
