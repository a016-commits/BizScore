import { CheckSquare, ChevronDown, RotateCcw, Square } from 'lucide-react';
import { useState } from 'react';
import ClosureReasonBarChart from '@/src/components/charts/ClosureReasonBarChart';
import MarketBubbleChart from '@/src/components/charts/MarketBubbleChart';
import SurvivalTrendLineChart from '@/src/components/charts/SurvivalTrendLineChart';
import {
  formatManwon,
  INDUSTRY_LIST,
  INDUSTRY_PROFILES,
  type IndustryId,
  MARKET_FAQS,
  PRE_LAUNCH_CHECKLIST,
} from '@/src/data/bizscoreData';
import { loadChecklistState, saveChecklistState } from '@/src/lib/storage';

const FILTER_OPTIONS: { id: IndustryId | 'all'; label: string }[] = [
  { id: 'all', label: '전체 업종 평균' },
  ...INDUSTRY_LIST.map((ind) => ({ id: ind.id, label: ind.name })),
];

export default function MarketInsightsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | 'all'>(
    'all'
  );
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() =>
    loadChecklistState()
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(MARKET_FAQS[0].id);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecklistState(next);
      return next;
    });
  };

  const resetChecklist = () => {
    saveChecklistState({});
    setChecklist({});
  };

  const completedCount = PRE_LAUNCH_CHECKLIST.filter(
    (item) => checklist[item.id]
  ).length;

  const activeProfile =
    selectedIndustry === 'all' ? null : INDUSTRY_PROFILES[selectedIndustry];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header & Industry Filter */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold text-[#047857]">
            업종별 상권·폐업률 데이터 인사이트
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            업종별 생존율 추이 및 폐업 원인 분석
          </h1>
          <p className="mt-1.5 text-sm text-[#475569]">
            업종 필터를 선택하면 연도별 3년 생존율 추이, 주요 폐업 사유, 상권 포지셔닝 지표가 즉시 연동됩니다.
          </p>
        </div>

        {/* Segmented Industry Filter Buttons */}
        <div
          className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5"
          role="group"
          aria-label="업종 필터"
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = selectedIndustry === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedIndustry(opt.id)}
                className={`cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
                  isActive
                    ? 'bg-[#1E293B] text-white'
                    : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                }`}
                aria-pressed={isActive}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Industry Benchmark Strip */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-4">
        <div>
          <span className="text-xs text-[#64748B]">분석 대상</span>
          <p className="mt-1 text-sm font-bold text-[#0F172A]">
            {activeProfile ? activeProfile.name : '주요 5대 업종 통합'}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-[#64748B]">
            {activeProfile ? `표준코드 ${activeProfile.standardCode}` : '소상공인 표준 분류'}
          </p>
        </div>
        <div>
          <span className="text-xs text-[#64748B]">1년차 평균 생존율</span>
          <p className="mt-1 font-mono text-xl font-bold text-[#0F172A] tabular-nums">
            {activeProfile ? `${activeProfile.survival1Yr}%` : '79.4%'}
          </p>
        </div>
        <div>
          <span className="text-xs text-[#64748B]">3년차 평균 생존율</span>
          <p className="mt-1 font-mono text-xl font-bold text-[#047857] tabular-nums">
            {activeProfile ? `${activeProfile.survival3Yr}%` : '55.0%'}
          </p>
        </div>
        <div>
          <span className="text-xs text-[#64748B]">평균 초기 투자금</span>
          <p className="mt-1 font-mono text-xl font-bold text-[#0F172A] tabular-nums">
            {activeProfile
              ? formatManwon(activeProfile.avgStartupCostManwon)
              : '8,940만원'}
          </p>
        </div>
      </div>

      {/* Charts Grid: Line + Bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#0F172A]">
              연도별 3년 생존율 추이 (2020–2025)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              {activeProfile
                ? `${activeProfile.name} 업종의 연도별 생존율과 자영업 전체 평균 비교`
                : '전체 평균 대비 고생존(미용) 및 고변동(카페·이커머스) 업종 추이'}
            </p>
          </div>
          <SurvivalTrendLineChart selectedIndustry={selectedIndustry} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="mb-4">
            <h2 className="text-base font-bold text-[#0F172A]">
              주요 폐업 사유 비중
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              {activeProfile
                ? `${activeProfile.name} 폐업 점포 실태 기반 주요 원인 분포`
                : '전 업종 평균 폐업 원인별 발생 비중 (%)'}
            </p>
          </div>
          <ClosureReasonBarChart selectedIndustry={selectedIndustry} />
        </section>
      </div>

      {/* 3D Bubble Chart Section */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              업종·상권별 매출 대비 3년 생존율 포지셔닝 (3D 버블 분석)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              X축은 월 평균 매출(만원), Y축은 3년차 생존율(%), 버블 크기는 상권 내 점포 밀집도를 나타냅니다.
            </p>
          </div>
        </div>
        <MarketBubbleChart selectedIndustry={selectedIndustry} />
      </section>

      {/* Bottom Row: Checklist & FAQ Accordion */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Pre-launch Checklist */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                창업 전 필수 점검 체크리스트
              </h2>
              <p className="mt-1 text-xs text-[#64748B]">
                인허가·상권분석·임대차 계약 전 반드시 확인해야 할 항목입니다.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs font-bold text-[#047857] tabular-nums">
                {completedCount} / {PRE_LAUNCH_CHECKLIST.length}
              </span>
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={resetChecklist}
                  title="체크리스트 초기화"
                  className="cursor-pointer rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 hover:text-[#0F172A]"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {PRE_LAUNCH_CHECKLIST.map((item) => {
              const checked = Boolean(checklist[item.id]);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                    checked
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300'
                  }`}
                  aria-pressed={checked}
                >
                  {checked ? (
                    <CheckSquare
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]"
                      aria-hidden="true"
                    />
                  ) : (
                    <Square
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#64748B]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#64748B]">
                        {item.category}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          checked
                            ? 'text-[#047857] line-through'
                            : 'text-[#0F172A]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                      {item.detail}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-[#0F172A]">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              진단 알고리즘 산출 기준과 리포트 해석 방법을 안내합니다.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {MARKET_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-3.5 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] rounded-sm"
                  >
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2.5 text-xs leading-relaxed text-[#475569]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
