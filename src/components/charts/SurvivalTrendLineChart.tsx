import type { ChartOptions, TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  INDUSTRY_PROFILES,
  type IndustryId,
  NATIONAL_AVG_SURVIVAL_TREND,
} from '@/src/data/bizscoreData';
import { registerBizScoreCharts } from '@/src/lib/chartRegistry';

registerBizScoreCharts();

interface SurvivalTrendLineChartProps {
  selectedIndustry: IndustryId | 'all';
}

export default function SurvivalTrendLineChart({
  selectedIndustry,
}: SurvivalTrendLineChartProps) {
  const years = NATIONAL_AVG_SURVIVAL_TREND.years;

  const datasets =
    selectedIndustry === 'all'
      ? [
          {
            label: '전 업종 평균 (3년 생존율)',
            data: NATIONAL_AVG_SURVIVAL_TREND.rates,
            borderColor: '#1E293B',
            backgroundColor: 'rgba(30, 41, 59, 0.08)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#1E293B',
          },
          {
            label: '미용/서비스',
            data: INDUSTRY_PROFILES.beauty.yearlySurvivalTrend.rates,
            borderColor: '#10B981',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#10B981',
          },
          {
            label: '카페/디저트',
            data: INDUSTRY_PROFILES.cafe.yearlySurvivalTrend.rates,
            borderColor: '#F59E0B',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#F59E0B',
          },
          {
            label: '온라인 커머스',
            data: INDUSTRY_PROFILES.ecommerce.yearlySurvivalTrend.rates,
            borderColor: '#EF4444',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#EF4444',
          },
        ]
      : [
          {
            label: `${INDUSTRY_PROFILES[selectedIndustry].name} (3년 생존율)`,
            data: INDUSTRY_PROFILES[selectedIndustry].yearlySurvivalTrend.rates,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointRadius: 4.5,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 1.5,
          },
          {
            label: '자영업 전체 평균',
            data: NATIONAL_AVG_SURVIVAL_TREND.rates,
            borderColor: '#94A3B8',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: '#94A3B8',
          },
        ];

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        min: 35,
        max: 75,
        grid: {
          color: '#E2E8F0',
        },
        ticks: {
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
          color: '#475569',
          font: {
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
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
          label: (ctx: TooltipItem<'line'>) =>
            ` ${ctx.dataset.label ?? ''}: ${ctx.parsed.y ?? 0}%`,
        },
      },
    },
  };

  return (
    <div className="h-[280px] w-full">
      <Line data={{ labels: years, datasets }} options={options} />
    </div>
  );
}
