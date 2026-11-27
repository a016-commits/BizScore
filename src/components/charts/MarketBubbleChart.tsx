import type { ChartOptions, TooltipItem } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import {
  type IndustryId,
  MARKET_BUBBLE_POINTS,
} from '@/src/data/bizscoreData';
import {
  chartAreaBorderPlugin,
  registerBizScoreCharts,
} from '@/src/lib/chartRegistry';

registerBizScoreCharts();

interface MarketBubbleChartProps {
  selectedIndustry: IndustryId | 'all';
}

interface CustomBubbleDatum {
  x: number;
  y: number;
  r: number;
  metaName: string;
  storeCount: number;
}

export default function MarketBubbleChart({
  selectedIndustry,
}: MarketBubbleChartProps) {
  const filteredPoints =
    selectedIndustry === 'all'
      ? MARKET_BUBBLE_POINTS
      : MARKET_BUBBLE_POINTS.filter((p) => p.industryId === selectedIndustry);

  const toBubbleDatum = (
    item: (typeof MARKET_BUBBLE_POINTS)[number]
  ): CustomBubbleDatum => ({
    x: item.avgMonthlyRevenueManwon,
    y: item.survival3Yr,
    r: item.storeDensityRadius,
    metaName: item.name,
    storeCount: item.storeCount,
  });

  // 명세서 2.2 조건별 다중 데이터셋 분할 파이프라인 적용
  const datasets = [
    {
      label: '안정 성장형 (생존율 60% 이상)',
      data: filteredPoints
        .filter((row) => row.tier === 'stable_growth')
        .map(toBubbleDatum),
      backgroundColor: 'rgba(16, 185, 129, 0.55)',
      borderColor: '#059669',
      borderWidth: 1.5,
    },
    {
      label: '고매출·고경쟁형',
      data: filteredPoints
        .filter((row) => row.tier === 'high_competition')
        .map(toBubbleDatum),
      backgroundColor: 'rgba(30, 41, 59, 0.55)',
      borderColor: '#1E293B',
      borderWidth: 1.5,
    },
    {
      label: '초기 리스크 주의형 (생존율 50% 미만)',
      data: filteredPoints
        .filter((row) => row.tier === 'risk_watch')
        .map(toBubbleDatum),
      backgroundColor: 'rgba(239, 68, 68, 0.52)',
      borderColor: '#DC2626',
      borderWidth: 1.5,
    },
  ].filter((ds) => ds.data.length > 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 1500,
        max: 5500,
        title: {
          display: true,
          text: '평균 월 매출액 (만원)',
          color: '#475569',
          font: {
            size: 11.5,
            weight: 600,
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
          },
        },
        grid: {
          color: '#E2E8F0',
        },
        ticks: {
          color: '#64748B',
          font: {
            family: "'JetBrains Mono', monospace",
            size: 11,
          },
          callback: (value: string | number) =>
            `${Number(value).toLocaleString('ko-KR')}`,
        },
      },
      y: {
        min: 38,
        max: 76,
        title: {
          display: true,
          text: '3년차 생존율 (%)',
          color: '#475569',
          font: {
            size: 11.5,
            weight: 600,
            family: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
          },
        },
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
      chartAreaBorder: {
        borderColor: '#CBD5E1',
        borderWidth: 1,
        borderDash: [4, 4],
        borderDashOffset: 0,
      },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: TooltipItem<'bubble'>) => {
            const raw = ctx.raw as CustomBubbleDatum;
            return [
              ` ${raw.metaName ?? ''}`,
              ` 월 평균 매출: ${raw.x.toLocaleString('ko-KR')}만원`,
              ` 3년 생존율: ${raw.y}% · 표본 점포 ${(raw.storeCount ?? 0).toLocaleString('ko-KR')}개`,
            ];
          },
        },
      },
    },
  } as ChartOptions<'bubble'>;

  return (
    <div className="h-[320px] w-full">
      <Bubble
        data={{ datasets }}
        options={options}
        plugins={[chartAreaBorderPlugin]}
      />
    </div>
  );
}
