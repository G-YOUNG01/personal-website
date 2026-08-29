"use client";

import { useEffect, useRef } from "react";

/**
 * Anthropic 风格的柔和光晕背景
 * 几个大的模糊彩色光斑缓慢漂浮，温暖柔和
 */
export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 纯 CSS 动画，无需 JS 驱动
    // 保留 ref 用于后续可能的交互扩展
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "#faf8f5" }}
    >
      {/* 主光晕 - 橙色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.35) 0%, rgba(251, 146, 60, 0) 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-5%",
          animation: "float1 20s ease-in-out infinite",
        }}
      />

      {/* 第二光晕 - 粉色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, rgba(244, 114, 182, 0) 70%)",
          filter: "blur(60px)",
          top: "20%",
          right: "-10%",
          animation: "float2 25s ease-in-out infinite",
        }}
      />

      {/* 第三光晕 - 紫色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(167, 139, 250, 0.28) 0%, rgba(167, 139, 250, 0) 70%)",
          filter: "blur(60px)",
          bottom: "-15%",
          left: "20%",
          animation: "float3 22s ease-in-out infinite",
        }}
      />

      {/* 第四光晕 - 淡黄色 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(253, 224, 71, 0.25) 0%, rgba(253, 224, 71, 0) 70%)",
          filter: "blur(50px)",
          top: "50%",
          left: "40%",
          animation: "float4 18s ease-in-out infinite",
        }}
      />

      {/* 第五光晕 - 青色点缀 */}
      <div
        className="absolute rounded-full"
        style={{
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(94, 234, 212, 0.2) 0%, rgba(94, 234, 212, 0) 70%)",
          filter: "blur(50px)",
          bottom: "10%",
          right: "15%",
          animation: "float5 23s ease-in-out infinite",
        }}
      />

      {/* 全局动画定义 */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, 60px) scale(1.1); }
          66% { transform: translate(-40px, 100px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, 80px) scale(1.05); }
          50% { transform: translate(-100px, -40px) scale(0.9); }
          75% { transform: translate(-30px, -80px) scale(1.1); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(100px, -60px) scale(1.08); }
          66% { transform: translate(50px, -100px) scale(0.92); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-80px, 60px) scale(1.15); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, -50px) scale(1.1); }
          66% { transform: translate(40px, -80px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
