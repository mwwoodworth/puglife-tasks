"use client";

import { motion } from "framer-motion";
import { WeightEntry, WeightGoalData } from "@/lib/types";
import { prepareChartData } from "@/lib/weight-utils";

interface WeightChartProps {
  entries: WeightEntry[];
  goal: WeightGoalData | null;
}

export default function WeightChart({ entries, goal }: WeightChartProps) {
  const { points, minW, maxW, goalW } = prepareChartData(entries, goal);

  if (points.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <span className="text-4xl mb-2 block">📊</span>
        <p className="text-purple-400 font-medium text-sm">Log some weights to see your chart!</p>
      </div>
    );
  }

  const padding = 40;
  const width = 320;
  const height = 180;
  const chartW = width - padding * 2;
  const chartH = height - padding * 1.5;
  const range = maxW - minW || 1;

  const scaledPoints = points.map((p) => ({
    x: padding + (p.x / 100) * chartW,
    y: padding * 0.5 + ((maxW - p.weight) / range) * chartH,
    weight: p.weight,
    date: p.date,
  }));

  const linePath = scaledPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const goalY = goalW ? padding * 0.5 + ((maxW - goalW) / range) * chartH : null;
  const ySteps = 5;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => Math.round(maxW - (range / ySteps) * i));

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
        <span>📈</span> Weight Journey
      </h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 280 }}>
          {yLabels.map((label, i) => {
            const y = padding * 0.5 + (i / ySteps) * chartH;
            return (
              <g key={label}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(139,92,246,0.2)" strokeWidth={0.5} />
                <text x={padding - 6} y={y + 3} textAnchor="end" fontSize={8} fill="#a78bfa" fontWeight={600}>{label}</text>
              </g>
            );
          })}

          {goalY !== null && goalY >= padding * 0.5 && goalY <= padding * 0.5 + chartH && (
            <>
              <line x1={padding} y1={goalY} x2={width - padding} y2={goalY} stroke="#ec4899" strokeWidth={1} strokeDasharray="4,3" />
              <text x={width - padding + 4} y={goalY + 3} fontSize={7} fill="#ec4899" fontWeight={700}>Goal</text>
            </>
          )}

          <motion.path
            d={`${linePath} L${scaledPoints[scaledPoints.length - 1].x},${padding * 0.5 + chartH} L${scaledPoints[0].x},${padding * 0.5 + chartH} Z`}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1 }}
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {scaledPoints.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill="#2e1065"
              stroke="#a855f7"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}

          {scaledPoints.length > 0 && (
            <text
              x={scaledPoints[scaledPoints.length - 1].x}
              y={scaledPoints[scaledPoints.length - 1].y - 10}
              textAnchor="middle"
              fontSize={9}
              fill="#d8b4fe"
              fontWeight={800}
            >
              {scaledPoints[scaledPoints.length - 1].weight}
            </text>
          )}

          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#2e1065" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
