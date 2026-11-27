import { ArrowRight, BarChart3, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { PageId } from '@/src/components/Navbar';
import { INDUSTRY_PROFILES } from '@/src/data/bizscoreData';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const WORKFLOW_STEPS = [
  {
    step: '01. 창업 조건 입력',
    title: '업종·상권·자본금 3단계 입력',
    description:
      '희망 업종, 입지 유형(역세권·대학가·주거·오피스), 반경 500m 내 경쟁 밀집도, 초기 투자금과 월 임대료를 입력합니다.',
  },
  {
    step: '02. 상권·폐업률 데이터 매칭',
    title: '생존율 통계 및 고정비 가중 연산',
    description:
      '소상공인 표준 업종별 1·3·5년차 생존율 추이와 지역 임대료 압력, 자본 대비 고정비 비중을 교차 분석합니다.',
  },
  {
    step: '03. 리스크 진단 리포트',
    title: '5대 핵심 지표 및 보완 솔루션 도출',
    description:
      '종합 성공률 게이지와 5각 레이더 차트로 취약 지점을 시각화하고, 시나리오별 수치를 저장해 나란히 비교합니다.',
  },
];

const KEY_STATS = [
  {
    label: '카페/디저트 3년 생존율',
    value: `${INDUSTRY_PROFILES.cafe.survival3Yr}%`,
    subtext: '5년 생존율 36.8% · 경쟁 심화 비중 38%',
    accent: 'text-[#B45309]',
    icon: ShieldAlert,
  },
  {
    label: '한식/외식 1년 내 폐업률',
    value: `${INDUSTRY_PROFILES.korean_food.earlyClosureRate}%`,
    subtext: '식자재 원가·고정비 관리가 핵심 변수',
    accent: 'text-[#B91C1C]',
    icon: BarChart3,
  },
  {
    label: '미용/서비스 3년 생존율',
    value: `${INDUSTRY_PROFILES.beauty.survival3Yr}%`,
    subtext: '주요 5대 업종 중 장기 생존율 최상위',
    accent: 'text-[#047857]',
    icon: CheckCircle2,
  },
  {
    label: '초기자본 대비 월세 권장 상한',
    value: '3.2% 이하',
    subtext: '자본 1억 기준 월 임대료 320만원 이내 권장',
    accent: 'text-[#1E293B]',
    icon: TrendingUp,
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            {/* Left Copy & Primary CTA */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="text-xs font-semibold tracking-wide text-[#047857]">
                소상공인 상권·폐업률 데이터 기반 창업 진단
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl lg:text-[2.75rem]">
                데이터로 먼저 검증하는
                <br className="hidden sm:inline" /> 내 가게 생존율
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#475569]">
                감에 의존한 상권 선택과 과도한 고정비 부담은 초기 폐업의 가장 큰
                원인입니다. 비즈스코어(BizScore)는 업종별 폐업률 통계와 입지·자본
                구조를 결합해 창업 전 성공률과 취약 리스크를 수치로 진단합니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('diagnosis')}
                  className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-[#1E293B] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2"
                >
                  <span>무료 사업 성공률 진단하기</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('insights')}
                  className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#1E293B] transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2"
                >
                  업종별 상권 트렌드 보기
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-xs text-[#64748B]">
                <span>5대 주요 창업 업종 지원</span>
                <span aria-hidden="true">·</span>
                <span>5가지 핵심 지표 레이더 분석</span>
                <span aria-hidden="true">·</span>
                <span>시나리오별 결과 저장 및 비교</span>
              </div>
            </div>

            {/* Right Visual Anchor */}
            <div className="lg:col-span-5">
              <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-80 lg:h-full lg:min-h-[360px]">
                {!imgError ? (
                  <img
                    src="/src/assets/images/hero_retail_district_1795763051405.jpg"
                    alt="서울 도심 상권의 카페와 소매 매장 거리 전경"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center text-white">
                    <BarChart3 className="h-10 w-10 text-emerald-400" />
                    <p className="mt-3 text-sm font-semibold">
                      BizScore 상권 데이터 리스크 엔진
                    </p>
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 via-[#0F172A]/20 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-medium text-emerald-300">
                    사전 리스크 시뮬레이션
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug">
                    자본 안정성 · 임대료 비중 · 경쟁 밀집도 · 업종 생존율 통합 분석
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Summary */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
              비즈스코어 진단 프로세스
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              약 1분 내외의 조건 입력만으로 객관적인 창업 리스크 리포트를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {WORKFLOW_STEPS.map((item) => (
            <article
              key={item.step}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-[#047857]">
                  {item.step}
                </p>
                <h3 className="mt-2.5 text-lg font-bold text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Key Statistics Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] sm:text-xl">
                주요 업종 생존율 및 상권 핵심 지표 요약
              </h2>
              <p className="mt-1 text-xs text-[#64748B]">
                대한민국 소상공인 상권·폐업률 통계 경향을 반영한 업종별 기준 지표입니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('insights')}
              className="inline-flex cursor-pointer items-center gap-1.5 self-start whitespace-nowrap text-xs font-semibold text-[#1E293B] hover:underline sm:self-auto"
            >
              <span>상세 통계 차트 보기</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KEY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col justify-between rounded-lg border border-slate-100 bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#475569]">
                      {stat.label}
                    </span>
                    <Icon
                      className={`h-4 w-4 shrink-0 ${stat.accent}`}
                      aria-hidden="true"
                    />
                  </div>
                  <p
                    className={`mt-3 font-mono text-2xl font-bold tracking-tight tabular-nums ${stat.accent}`}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-xs leading-snug text-[#64748B]">
                    {stat.subtext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
