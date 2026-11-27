import { Doughnut } from 'react-chartjs-2';
import type { RiskGrade } from '@/src/data/bizscoreData';
import { registerBizScoreCharts } from '@/src/lib/chartRegistry';

registerBizScoreCharts();

interface SuccessGaugeChartProps {
  score: number;
  grade: RiskGrade;
}

const GRADE_COLOR_MAP: Record<RiskGrade, string> = {
  안전: '#10B981',
  보통: '#1E293B',
  주의: '#D97706',
  위험: '#EF4444',
};

export default function SuccessGaugeChart({
  score,
  grade,
}: SuccessGaugeChartProps) {
  const activeColor = GRADE_COLOR_MAP[grade];
  const remaining = Math.max(0, 100 - score);

  const data = {
    labels: ['예상 성공률', '잠재 리스크 비중'],
    datasets: [
      {
        label: '사업 성공률 지수',
        data: [score, remaining],
        backgroundColor: [activeColor, '#E2E8F0'],
        borderColor: ['#FFFFFF', '#FFFFFF'],
        borderWidth: 2,
        borderRadius: 8,
        hoverOffset: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '74%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 16,
          color: '#475569',
          font: {
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label?: string; parsed: number }) =>
            ` ${ctx.label ?? ''}: ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="relative mx-auto h-64 w-full max-w-[280px]">
      <Doughnut data={data} options={options} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
        <span className="text-xs font-medium text-[#64748B]">종합 성공률</span>
        <span
          className="mt-0.5 font-mono text-4xl font-bold tracking-tight tabular-nums"
          style={{ color: activeColor }}
        >
          {score}
          <span className="text-xl font-semibold">%</span>
        </span>
        <span className="mt-1 text-xs font-semibold text-[#1E293B]">
          등급: {grade}
        </span>
      </div>
    </div>
  );
}
