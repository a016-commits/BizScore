import { Radar } from 'react-chartjs-2';
import type { RadarDimensions } from '@/src/data/bizscoreData';
import { registerBizScoreCharts } from '@/src/lib/chartRegistry';

registerBizScoreCharts();

interface MetricsRadarChartProps {
  dimensions: RadarDimensions;
  industryName: string;
}

export default function MetricsRadarChart({
  dimensions,
  industryName,
}: MetricsRadarChartProps) {
  const data = {
    labels: [
      '자본 안정성',
      '고정비(임대료) 부담도',
      '상권 경쟁 강도',
      '업종 평균 생존율',
      '창업 준비도',
    ],
    datasets: [
      {
        label: '내 창업 조건 진단',
        data: [
          dimensions.capitalStability,
          dimensions.fixedCostBurden,
          dimensions.competitionIntensity,
          dimensions.industrySurvival,
          dimensions.readiness,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        borderColor: '#10B981',
        borderWidth: 2,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: `${industryName} 안정 기준선`,
        data: [65, 65, 60, 62, 65],
        backgroundColor: 'rgba(30, 41, 59, 0.06)',
        borderColor: '#94A3B8',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#94A3B8',
        pointRadius: 2.5,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          backdropColor: 'transparent',
          color: '#64748B',
          font: {
            size: 10,
            family: "'JetBrains Mono', monospace",
          },
        },
        grid: {
          color: '#E2E8F0',
        },
        angleLines: {
          color: '#E2E8F0',
        },
        pointLabels: {
          color: '#1E293B',
          font: {
            size: 11.5,
            weight: 600,
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 16,
          color: '#475569',
          font: {
            size: 12,
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { r: number } }) =>
            ` ${ctx.dataset.label ?? ''}: ${ctx.parsed.r}점 / 100점`,
        },
      },
    },
  };

  return (
    <div className="h-[310px] w-full">
      <Radar data={data} options={options} />
    </div>
  );
}
