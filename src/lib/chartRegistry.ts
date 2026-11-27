import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
  type Plugin,
} from 'chart.js';

// 명세서 3장 트리쉐이킹 지침: chart.js/auto 대신 필요한 컨트롤러·엘리먼트·스케일만 명시적 등록
let isRegistered = false;

export function registerBizScoreCharts(): void {
  if (isRegistered) return;
  ChartJS.register(
    ArcElement,
    BarController,
    BarElement,
    BubbleController,
    CategoryScale,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    RadarController,
    RadialLinearScale,
    Tooltip
  );
  isRegistered = true;
}

export interface ChartAreaBorderOptions {
  borderColor?: string;
  borderWidth?: number;
  borderDash?: number[];
  borderDashOffset?: number;
}

// 명세서 2.3 커스텀 차트 플러그인 패턴: beforeDraw 라이프사이클 훅 + ctx.save/restore
export const chartAreaBorderPlugin: Plugin = {
  id: 'chartAreaBorder',
  beforeDraw(chart, _args, pluginOptions: ChartAreaBorderOptions) {
    if (!pluginOptions || !chart.chartArea) return;
    const {
      ctx,
      chartArea: { left, top, width, height },
    } = chart;
    ctx.save();
    ctx.strokeStyle = pluginOptions.borderColor ?? '#CBD5E1';
    ctx.lineWidth = pluginOptions.borderWidth ?? 1;
    ctx.setLineDash(pluginOptions.borderDash ?? []);
    ctx.lineDashOffset = pluginOptions.borderDashOffset ?? 0;
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
  },
};
