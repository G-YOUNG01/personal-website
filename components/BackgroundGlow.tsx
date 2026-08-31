/**
 * 站点背景光晕
 * 大尺寸高饱和度彩色光斑缓慢漂浮，配合毛玻璃卡片效果。
 * 动画由 CSS keyframes 驱动（定义见 globals.css）。
 */
export default function BackgroundGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "linear-gradient(135deg, #fef3e2 0%, #fce7f3 50%, #f3e8ff 100%)" }}
    >
      {/* 主光晕 - 橙色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, rgba(251, 146, 60, 0) 70%)",
          filter: "blur(80px)",
          top: "-15%",
          left: "-10%",
          animation: "float1 18s ease-in-out infinite",
        }}
      />

      {/* 第二光晕 - 粉色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(244, 114, 182, 0.45) 0%, rgba(244, 114, 182, 0) 70%)",
          filter: "blur(80px)",
          top: "10%",
          right: "-15%",
          animation: "float2 22s ease-in-out infinite",
        }}
      />

      {/* 第三光晕 - 紫色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "650px",
          height: "650px",
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.45) 0%, rgba(167, 139, 250, 0) 70%)",
          filter: "blur(80px)",
          bottom: "-20%",
          left: "15%",
          animation: "float3 20s ease-in-out infinite",
        }}
      />

      {/* 第四光晕 - 黄色 - 点缀 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(253, 224, 71, 0.4) 0%, rgba(253, 224, 71, 0) 70%)",
          filter: "blur(70px)",
          top: "45%",
          left: "35%",
          animation: "float4 16s ease-in-out infinite",
        }}
      />

      {/* 第五光晕 - 青色 - 点缀 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(94, 234, 212, 0.35) 0%, rgba(94, 234, 212, 0) 70%)",
          filter: "blur(70px)",
          bottom: "5%",
          right: "10%",
          animation: "float5 24s ease-in-out infinite",
        }}
      />
    </div>
  );
}
