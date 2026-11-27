import {
  AlertTriangle,
  BookmarkCheck,
  BookmarkPlus,
  CheckCircle2,
  Edit3,
  Info,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import MetricsRadarChart from '@/src/components/charts/MetricsRadarChart';
import SuccessGaugeChart from '@/src/components/charts/SuccessGaugeChart';
import type { PageId } from '@/src/components/Navbar';
import {
  COMPETITOR_OPTIONS,
  type DiagnosisResult,
  formatManwon,
  INDUSTRY_PROFILES,
  LOCATION_TYPES,
  type RiskGrade,
} from '@/src/data/bizscoreData';

interface ResultDashboardPageProps {
  result: DiagnosisResult | null;
  savedScenarios: DiagnosisResult[];
  onSaveScenario: (result: DiagnosisResult) => void;
  onDeleteScenario: (id: string) => void;
  onClearScenarios: () => void;
  onSelectScenario: (result: DiagnosisResult) => void;
  onEditInputs: () => void;
  onNavigate: (page: PageId) => void;
  onLoadSampleDiagnosis: () => void;
}

const GRADE_STYLE: Record<
  RiskGrade,
  {
    bg: string;
    text: string;
    border: string;
    label: string;
    summary: string;
    icon: typeof ShieldCheck;
  }
> = {
  안전: {
    bg: 'bg-emerald-50',
    text: 'text-[#047857]',
    border: 'border-emerald-200',
    label: '안전 (우수한 생존 안정성)',
    summary:
      '자본·임대료·상권 균형이 양호하여 초기 안착 가능성이 높은 조건입니다.',
    icon: ShieldCheck,
  },
  보통: {
    bg: 'bg-slate-100',
    text: 'text-[#1E293B]',
    border: 'border-slate-300',
    label: '보통 (표준 안정권)',
    summary:
      '전반적인 조건은 평균 수준이나 취약 지표 1~2개를 보완하면 생존율이 개선됩니다.',
    icon: CheckCircle2,
  },
  주의: {
    bg: 'bg-amber-50',
    text: 'text-[#B45309]',
    border: 'border-amber-200',
    label: '주의 (리스크 관리 필요)',
    summary:
      '고정비 부담 또는 상권 경쟁 강도가 높아 계약 전 조건 조정이 권장됩니다.',
    icon: AlertTriangle,
  },
  위험: {
    bg: 'bg-red-50',
    text: 'text-[#B91C1C]',
    border: 'border-red-200',
    label: '위험 (고위험 창업 구조)',
    summary:
      '초기 폐업 위험이 높게 나타났습니다. 하단 개선 가이드를 반드시 검토하세요.',
    icon: ShieldAlert,
  },
};

export default function ResultDashboardPage({
  result,
  savedScenarios,
  onSaveScenario,
  onDeleteScenario,
  onClearScenarios,
  onSelectScenario,
  onEditInputs,
  onNavigate,
  onLoadSampleDiagnosis,
}: ResultDashboardPageProps) {
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-12">
          <h1 className="text-xl font-bold text-[#0F172A] sm:text-2xl">
            아직 생성된 사업 성공률 진단 리포트가 없습니다
          </h1>
          <p className="mx-auto mt-2.5 max-w-lg text-sm leading-relaxed text-[#475569]">
            업종, 상권 입지, 초기 자본금과 월 임대료를 입력하면 예상 성공률과
            5대 핵심 지표 리포트를 즉시 확인할 수 있습니다.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('diagnosis')}
              className="cursor-pointer rounded-lg bg-[#1E293B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F172A]"
            >
              새 사업 성공률 진단하기
            </button>
            <button
              type="button"
              onClick={onLoadSampleDiagnosis}
              className="cursor-pointer rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-slate-50"
            >
              예시 리포트(마포구 카페) 미리보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const industry = INDUSTRY_PROFILES[result.input.industry];
  const locationLabel =
    LOCATION_TYPES.find((l) => l.id === result.input.locationType)?.label ?? '';
  const competitorLabel =
    COMPETITOR_OPTIONS.find((c) => c.id === result.input.competitorLevel)
      ?.label ?? '';
  const gradeInfo = GRADE_STYLE[result.grade];
  const GradeIcon = gradeInfo.icon;

  const isAlreadySaved = savedScenarios.some((s) => s.id === result.id);

  const handleSaveClick = () => {
    onSaveScenario(result);
    setJustSavedId(result.id);
  };

  const metricRows = [
    { label: '자본 안정성', score: result.dimensions.capitalStability },
    { label: '고정비(임대료) 부담도', score: result.dimensions.fixedCostBurden },
    { label: '상권 경쟁 강도', score: result.dimensions.competitionIntensity },
    { label: '업종 평균 생존율', score: result.dimensions.industrySurvival },
    { label: '창업 준비도', score: result.dimensions.readiness },
  ];

  const getMetricStatusText = (score: number) => {
    if (score >= 70) return { label: '양호', cls: 'text-[#047857]' };
    if (score >= 50) return { label: '보통', cls: 'text-[#1E293B]' };
    return { label: '취약', cls: 'text-[#B91C1C]' };
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Summary & Actions */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#047857]">
            사업 성공률 진단 리포트
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {industry.name} 창업 리스크 분석 결과
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#475569]">
            <span>{result.input.region}</span>
            <span aria-hidden="true">·</span>
            <span>{locationLabel}</span>
            <span aria-hidden="true">·</span>
            <span>경쟁업체 {competitorLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              초기자본 {formatManwon(result.input.initialCapital)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              월세 {formatManwon(result.input.monthlyRent)}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {result.input.hasExperience === 'yes' ? '유경험' : '무경험'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onEditInputs}
            className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#1E293B] transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B]"
          >
            <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>조건 수정하기</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isAlreadySaved}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
              isAlreadySaved
                ? 'cursor-default border border-emerald-200 bg-emerald-50 text-[#047857]'
                : 'cursor-pointer bg-[#1E293B] text-white hover:bg-[#0F172A]'
            }`}
          >
            {isAlreadySaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {justSavedId === result.id
                    ? '비교함에 저장됨'
                    : '저장 완료'}
                </span>
              </>
            ) : (
              <>
                <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>현재 결과 저장하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Charts Row: Gauge + 5-Axis Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Overall Score Doughnut Gauge */}
        <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              종합 사업 성공률 지수
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              업종 생존율 및 입력된 자본·상권 조건 가중 산출
            </p>
          </div>

          <div className="my-4">
            <SuccessGaugeChart
              score={result.overallScore}
              grade={result.grade}
            />
          </div>

          <div className="space-y-3">
            <div
              className={`rounded-lg border px-4 py-3 ${gradeInfo.bg} ${gradeInfo.border}`}
            >
              <div className={`flex items-center gap-2 text-xs font-bold ${gradeInfo.text}`}>
                <GradeIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{gradeInfo.label}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#334155]">
                {gradeInfo.summary}
              </p>
            </div>

            <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-[#F8FAFC] py-2.5 text-center">
              <div className="px-2">
                <span className="block text-[11px] text-[#64748B]">
                  자본 대비 월세
                </span>
                <span className="mt-0.5 block font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                  {result.rentToCapitalRatio}%
                </span>
              </div>
              <div className="px-2">
                <span className="block text-[11px] text-[#64748B]">
                  예상 손익분기
                </span>
                <span className="mt-0.5 block font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                  {result.estimatedBreakEvenMonths}개월
                </span>
              </div>
              <div className="px-2">
                <span className="block text-[11px] text-[#64748B]">
                  업종 3년 생존
                </span>
                <span className="mt-0.5 block font-mono text-sm font-bold text-[#0F172A] tabular-nums">
                  {industry.survival3Yr}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: 5-Core Metrics Radar Chart & Score Breakdown */}
        <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                5대 핵심 지표 레이더 분석
              </h2>
              <p className="mt-1 text-xs text-[#64748B]">
                각 축은 100점 만점 기준이며 50점 미만 지표는 우선 보완 대상으로 분류됩니다.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <MetricsRadarChart
                dimensions={result.dimensions}
                industryName={industry.name}
              />
            </div>

            <div className="md:col-span-5">
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-[#F8FAFC]">
                {metricRows.map((row) => {
                  const status = getMetricStatusText(row.score);
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs"
                    >
                      <span className="font-medium text-[#334155]">
                        {row.label}
                      </span>
                      <div className="flex items-center gap-2 font-mono tabular-nums">
                        <span className="font-bold text-[#0F172A]">
                          {row.score}점
                        </span>
                        <span className={`font-sans font-semibold ${status.cls}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-[#64748B]">
                고정비(임대료) 부담도 점수는 임대료 부담이 적고 건전할수록 100점에 가깝습니다.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Row: Dynamic Risk Improvement Guides */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              맞춤형 리스크 개선 가이드
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              50점 미만의 취약 지표를 자동 감지하여 구체적인 실행 솔루션을 제시합니다.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold text-[#475569] tabular-nums">
            감지된 안내 {result.guides.length}건
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {result.guides.map((guide) => {
            const isCritical = guide.severity === 'critical';
            const isWarning = guide.severity === 'warning';
            const badgeColor = isCritical
              ? 'text-[#B91C1C] bg-red-50 border-red-200'
              : isWarning
              ? 'text-[#B45309] bg-amber-50 border-amber-200'
              : 'text-[#047857] bg-emerald-50 border-emerald-200';
            const SeverityIcon = isCritical
              ? ShieldAlert
              : isWarning
              ? AlertTriangle
              : Info;
            const severityText = isCritical
              ? '긴급 보완 필요'
              : isWarning
              ? '주의 점검 필요'
              : '최적화 권장';

            return (
              <article
                key={guide.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${badgeColor}`}
                    >
                      <SeverityIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{severityText}</span>
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#475569] tabular-nums">
                      {guide.metricName} · {guide.score}점
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#0F172A]">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-semibold text-[#1E293B]">
                    권장 개선 액션
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#334155]">
                    {guide.actionStep}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bottom Row: Scenario Comparison Table (localStorage) */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              저장된 시나리오 비교 ({savedScenarios.length} / 6)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              브라우저 로컬 스토리지에 저장된 이전 진단 결과와 현재 시나리오를 나란히 비교할 수 있습니다.
            </p>
          </div>
          {savedScenarios.length > 0 && (
            <button
              type="button"
              onClick={onClearScenarios}
              className="inline-flex cursor-pointer items-center gap-1.5 self-start whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-[#64748B] hover:border-red-200 hover:bg-red-50 hover:text-[#B91C1C] sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>전체 비우기</span>
            </button>
          )}
        </div>

        {savedScenarios.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-[#F8FAFC] p-8 text-center">
            <p className="text-sm font-semibold text-[#1E293B]">
              저장된 비교 시나리오가 없습니다
            </p>
            <p className="mt-1 text-xs text-[#64748B]">
              상단의 &apos;현재 결과 저장하기&apos; 버튼을 누른 뒤 임대료나 입지 조건을 바꿔 재진단해 보세요.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B]">
                  <th className="py-2.5 pr-4 font-semibold">업종 · 상권</th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    초기자본 / 월세
                  </th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    예상 성공률
                  </th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    현재 대비
                  </th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    자본
                  </th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    고정비
                  </th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    경쟁력
                  </th>
                  <th className="py-2.5 pl-3 text-right font-semibold">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedScenarios.map((scenario) => {
                  const indName = INDUSTRY_PROFILES[scenario.input.industry].name;
                  const locName =
                    LOCATION_TYPES.find(
                      (l) => l.id === scenario.input.locationType
                    )?.label ?? '';
                  const isCurrent = scenario.id === result.id;
                  const diff = result.overallScore - scenario.overallScore;

                  return (
                    <tr
                      key={scenario.id}
                      className={`transition-colors ${
                        isCurrent ? 'bg-slate-50/90' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#0F172A]">
                            {indName}
                          </span>
                          {isCurrent && (
                            <span className="font-mono text-[11px] font-semibold text-[#047857]">
                              (현재 보기)
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#64748B]">
                          {scenario.input.region} · {locName}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[#334155] tabular-nums">
                        {formatManwon(scenario.input.initialCapital)} /{' '}
                        {scenario.input.monthlyRent.toLocaleString('ko-KR')}만
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">
                        <span className="font-bold text-[#0F172A]">
                          {scenario.overallScore}%
                        </span>{' '}
                        <span className="text-[11px] text-[#64748B]">
                          ({scenario.grade})
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">
                        {isCurrent ? (
                          <span className="text-[#64748B]">—</span>
                        ) : diff > 0 ? (
                          <span className="font-semibold text-[#047857]">
                            +{diff}%p
                          </span>
                        ) : diff < 0 ? (
                          <span className="font-semibold text-[#B91C1C]">
                            {diff}%p
                          </span>
                        ) : (
                          <span className="text-[#64748B]">0%p</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[#334155] tabular-nums">
                        {scenario.dimensions.capitalStability}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[#334155] tabular-nums">
                        {scenario.dimensions.fixedCostBurden}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-[#334155] tabular-nums">
                        {scenario.dimensions.competitionIntensity}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => onSelectScenario(scenario)}
                              className="cursor-pointer whitespace-nowrap font-semibold text-[#1E293B] hover:underline"
                            >
                              불러오기
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteScenario(scenario.id)}
                            aria-label={`${indName} 시나리오 삭제`}
                            className="cursor-pointer p-1 text-[#64748B] hover:text-[#B91C1C]"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
