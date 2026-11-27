import type { ChartOptions, TooltipItem } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  INDUSTRY_PROFILES,
  type IndustryId,
} from '@/src/data/bizscoreData';
import {
  chartAreaBorderPlugin,
  registerBizScoreCharts,
} from '@/src/lib/chartRegistry';

registerBizScoreCharts();

interface ClosureReasonBarChartProps {
  selectedIndustry: IndustryId | 'all';
}

const ALL_REASONS = [
  { label: '동종·인접 경쟁 심화', ratio: 33 },
  { label: '원재료·광고비 등 수익성 악화', ratio: 28 },
  { label: '임대료·인건비 고정비 부담', ratio: 24 },
  { label: '상권 변화·재방문 저조', ratio: 15 },
];

export default function ClosureReasonBarChart({
  selectedIndustry,
}: ClosureReasonBarChartProps) {
  const reasons =
    selectedIndustry === 'all'
      ? ALL_REASONS
      : INDUSTRY_PROFILES[selectedIndustry].closureReasons;

  const data = {
    labels: reasons.map((r) => r.label),
    datasets: [
      {
        label: '폐업 주요 원인 비중 (%)',
        data: reasons.map((r) => r.ratio),
        backgroundColor: ['#EF4444', '#F97316', '#1E293B', '#64748B'],
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 50,
        grid: {
          color: '#E2E8F0',
        },
        ticks: {
          stepSize: 10,
          color: '#64748B',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
          callback: (value: string | number) => `${value}%`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#334155',
          font: {
            size: 11.5,
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) =>
            ` 폐업 사유 비중: ${ctx.parsed.y ?? 0}%`,
        },
      },
    },
  };

  // chartAreaBorder 커스텀 플러그인 옵션 주입
  const optionsWithPlugin = {
    ...options,
    plugins: {
      ...options.plugins,
      chartAreaBorder: {
        borderColor: '#CBD5E1',
        borderWidth: 1,
        borderDash: [4, 4],
        borderDashOffset: 0,
      },
    },
  } as ChartOptions<'bar'>;

  return (
    <div className="h-[280px] w-full">
      <Bar
        data={data}
        options={optionsWithPlugin}
        plugins={[chartAreaBorderPlugin]}
      />
    </div>
  );
}
