import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  Scissors,
  ShoppingBag,
  Store,
  Utensils,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/FormPrimitives';
import {
  COMPETITOR_OPTIONS,
  formatManwon,
  INDUSTRY_LIST,
  INDUSTRY_PROFILES,
  type IndustryId,
  LOCATION_TYPES,
  REGION_PROFILES,
} from '@/src/data/bizscoreData';
import {
  loadFormDraft,
  loadRecentRegions,
  recordRecentRegion,
  saveFormDraft,
} from '@/src/lib/storage';
import {
  diagnosisFormSchema,
  type DiagnosisFormValues,
  STEP_FIELD_MAP,
} from '@/src/schemas/diagnosisSchema';

interface DiagnosisPageProps {
  initialValues?: DiagnosisFormValues | null;
  onComplete: (values: DiagnosisFormValues) => void;
}

const STEP_META = [
  { step: 1, title: '업종 선택', subtitle: '창업 예정 업종군을 선택하세요' },
  { step: 2, title: '상권/입지', subtitle: '지역·입지·경쟁 강도를 설정하세요' },
  { step: 3, title: '자본/비용', subtitle: '초기 자본과 고정비 구조를 입력하세요' },
];

const INDUSTRY_ICON_MAP: Record<IndustryId, typeof Coffee> = {
  cafe: Coffee,
  korean_food: Utensils,
  convenience: Store,
  beauty: Scissors,
  ecommerce: ShoppingBag,
};

export default function DiagnosisPage({
  initialValues,
  onComplete,
}: DiagnosisPageProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [recentRegions, setRecentRegions] = useState<string[]>(() =>
    loadRecentRegions()
  );

  const savedDraft = typeof window !== 'undefined' ? loadFormDraft() : null;

  const methods = useForm<DiagnosisFormValues>({
    resolver: zodResolver(diagnosisFormSchema),
    mode: 'onTouched',
    defaultValues: initialValues ?? {
      industry: savedDraft?.industry ?? 'cafe',
      region: savedDraft?.region ?? '서울 마포구',
      locationType: savedDraft?.locationType ?? 'station',
      competitorLevel: savedDraft?.competitorLevel ?? 'medium',
      initialCapital:
        typeof savedDraft?.initialCapital === 'number' &&
        savedDraft.initialCapital > 0
          ? savedDraft.initialCapital
          : 9000,
      monthlyRent:
        typeof savedDraft?.monthlyRent === 'number' &&
        savedDraft.monthlyRent > 0
          ? savedDraft.monthlyRent
          : 280,
      hasExperience: savedDraft?.hasExperience ?? 'no',
    },
  });

  const { watch, trigger, handleSubmit, setValue } = methods;

  // 실시간 폼 값 구독 및 localStorage 임시 저장
  const watchedValues = watch();
  const selectedIndustry = watchedValues.industry;
  const selectedRegion = watchedValues.region;
  const initialCapitalVal = watchedValues.initialCapital;
  const monthlyRentVal = watchedValues.monthlyRent;

  useEffect(() => {
    const subscription = watch((vals) => {
      saveFormDraft(vals as Partial<DiagnosisFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const activeRegionProfile = REGION_PROFILES.find(
    (r) => r.name === selectedRegion
  );

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_FIELD_MAP[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    if (currentStep === 2 && selectedRegion) {
      setRecentRegions((prev) => recordRecentRegion(selectedRegion, prev));
    }
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const onValidSubmit = (values: DiagnosisFormValues) => {
    setRecentRegions((prev) => recordRecentRegion(values.region, prev));
    saveFormDraft(values);
    onComplete(values);
  };

  const progressPercent = Math.round((currentStep / 3) * 100);
  const liveRentRatio =
    Number.isFinite(initialCapitalVal) &&
    Number.isFinite(monthlyRentVal) &&
    initialCapitalVal > 0 &&
    monthlyRentVal > 0
      ? ((monthlyRentVal / initialCapitalVal) * 100).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-[680px] px-4 py-10 sm:px-6 sm:py-12">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          사업 성공률 진단
        </h1>
        <p className="mt-1.5 text-sm text-[#475569]">
          3단계 조건 입력을 완료하면 업종별 생존율 및 리스크 리포트를 즉시 계산합니다.
        </p>
      </div>

      {/* Multi-step Progress Bar */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1E293B]">
            진행 단계 ({currentStep} / 3)
          </span>
          <span className="font-mono font-semibold text-[#047857] tabular-nums">
            {progressPercent}%
          </span>
        </div>

        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#1E293B] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {STEP_META.map((item) => {
            const isCurrent = item.step === currentStep;
            const isDone = item.step < currentStep;
            return (
              <div
                key={item.step}
                className={`rounded-lg px-2.5 py-2 text-left transition-colors ${
                  isCurrent
                    ? 'bg-slate-100 text-[#0F172A]'
                    : isDone
                    ? 'text-[#047857]'
                    : 'text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="font-mono tabular-nums">{item.step}.</span>
                  )}
                  <span className="truncate">{item.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FormProvider + Step Card */}
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onValidSubmit)}
          noValidate
          className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          {/* STEP 1: 업종 선택 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  1단계. 창업 희망 업종 선택
                </h2>
                <p className="mt-1 text-xs text-[#64748B]">
                  선택한 업종의 1·3·5년차 생존율 및 권장 임대료 기준이 진단에 반영됩니다.
                </p>
              </div>

              <FormField
                control={methods.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>창업 업종</FormLabel>
                    <div className="grid grid-cols-1 gap-3 pt-1">
                      {INDUSTRY_LIST.map((ind) => {
                        const Icon = INDUSTRY_ICON_MAP[ind.id];
                        const isSelected = field.value === ind.id;
                        return (
                          <button
                            key={ind.id}
                            type="button"
                            onClick={() => field.onChange(ind.id)}
                            className={`flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
                              isSelected
                                ? 'border-[#1E293B] bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                            aria-pressed={isSelected}
                          >
                            <div
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                                isSelected
                                  ? 'border-[#1E293B] bg-[#1E293B] text-white'
                                  : 'border-slate-200 bg-[#F8FAFC] text-[#475569]'
                              }`}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-sm font-bold text-[#0F172A]">
                                  {ind.name}
                                </span>
                                <span className="font-mono text-xs text-[#64748B] tabular-nums">
                                  코드 {ind.standardCode} · 3년 생존율{' '}
                                  <strong className="text-[#0F172A]">
                                    {ind.survival3Yr}%
                                  </strong>
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                                {ind.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 2: 상권 및 입지 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  2단계. 희망 상권 및 입지 조건
                </h2>
                <p className="mt-1 text-xs text-[#64748B]">
                  {INDUSTRY_PROFILES[selectedIndustry].name} 업종과 상권 입지 간
                  시너지 및 경쟁 밀집도를 반영합니다.
                </p>
              </div>

              {/* 희망 지역 */}
              <FormField
                control={methods.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>희망 상권 지역</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:border-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20"
                      >
                        {REGION_PROFILES.map((region) => (
                          <option key={region.id} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      {activeRegionProfile
                        ? `해당 지역 소형 상가 평균 월세 ${formatManwon(activeRegionProfile.avgMonthlyRentManwon)} · 배후 소비수요 지수 ${activeRegionProfile.demandScore}점`
                        : '분석 대상 지역을 선택하세요.'}
                    </FormDescription>
                    {recentRegions.length > 0 && (
                      <div className="pt-1">
                        <span className="mr-2 text-xs text-[#64748B]">
                          최근 선택 지역:
                        </span>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {recentRegions.map((reg) => (
                            <button
                              key={reg}
                              type="button"
                              onClick={() =>
                                setValue('region', reg, { shouldValidate: true })
                              }
                              className={`cursor-pointer whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                                field.value === reg
                                  ? 'border-[#1E293B] bg-[#1E293B] text-white'
                                  : 'border-slate-200 bg-[#F8FAFC] text-[#475569] hover:border-slate-300 hover:text-[#0F172A]'
                              }`}
                            >
                              {reg}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 입지 유형 */}
              <FormField
                control={methods.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>입지 유형</FormLabel>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {LOCATION_TYPES.map((loc) => {
                        const isSelected = field.value === loc.id;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => field.onChange(loc.id)}
                            className={`cursor-pointer rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
                              isSelected
                                ? 'border-[#1E293B] bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                            aria-pressed={isSelected}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-[#0F172A]">
                                {loc.label}
                              </span>
                              {isSelected && (
                                <Check
                                  className="h-4 w-4 text-[#10B981]"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <p className="mt-1 text-xs leading-snug text-[#64748B]">
                              {loc.summary}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 반경 500m 내 동종 경쟁업체 수 */}
              <FormField
                control={methods.control}
                name="competitorLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>반경 500m 내 동종 경쟁업체 수</FormLabel>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {COMPETITOR_OPTIONS.map((comp) => {
                        const isSelected = field.value === comp.id;
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => field.onChange(comp.id)}
                            className={`cursor-pointer rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
                              isSelected
                                ? 'border-[#1E293B] bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                            aria-pressed={isSelected}
                          >
                            <span className="block text-sm font-bold text-[#0F172A]">
                              {comp.label}
                            </span>
                            <span className="mt-0.5 block font-mono text-[11px] font-medium text-[#475569]">
                              {comp.countRange}
                            </span>
                            <span className="mt-1.5 block text-[11px] leading-snug text-[#64748B]">
                              {comp.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 3: 자본 및 비용 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  3단계. 투자 자본 및 고정비 구조
                </h2>
                <p className="mt-1 text-xs text-[#64748B]">
                  {INDUSTRY_PROFILES[selectedIndustry].name} 평균 창업 비용(
                  {formatManwon(
                    INDUSTRY_PROFILES[selectedIndustry].avgStartupCostManwon
                  )}
                  )과 비교해 자본 안정성을 계산합니다.
                </p>
              </div>

              {/* 초기 투자 자본금 */}
              <FormField
                control={methods.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>초기 투자 자본금 (만원)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={100}
                          placeholder="예: 9000"
                          value={
                            Number.isNaN(field.value) || field.value === undefined
                              ? ''
                              : field.value
                          }
                          onChange={(e) => {
                            const raw = e.target.value;
                            field.onChange(raw === '' ? Number.NaN : Number(raw));
                          }}
                          onBlur={field.onBlur}
                          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-14 font-mono text-sm font-semibold text-[#0F172A] tabular-nums focus:border-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-[#64748B]">
                          만원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      보증금, 인테리어, 설비 및 초기 운전자금을 포함한 총 예산
                      {Number.isFinite(field.value) && field.value > 0
                        ? ` (현재 입력: ${formatManwon(field.value)})`
                        : ''}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 예상 월 임대료 */}
              <FormField
                control={methods.control}
                name="monthlyRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>예상 월 임대료 (만원)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={10}
                          placeholder="예: 280"
                          value={
                            Number.isNaN(field.value) || field.value === undefined
                              ? ''
                              : field.value
                          }
                          onChange={(e) => {
                            const raw = e.target.value;
                            field.onChange(raw === '' ? Number.NaN : Number(raw));
                          }}
                          onBlur={field.onBlur}
                          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-3.5 pr-14 font-mono text-sm font-semibold text-[#0F172A] tabular-nums focus:border-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#1E293B]/20"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-xs font-medium text-[#64748B]">
                          만원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      관리비 제외 순수 월 임차료 기준
                      {liveRentRatio !== null &&
                        ` · 초기 자본 대비 월세 비중 ${liveRentRatio}% (권장 상한 ${INDUSTRY_PROFILES[selectedIndustry].safeRentToCapitalRatio}%)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 관련 업종 경험 유무 */}
              <FormField
                control={methods.control}
                name="hasExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>창업자 관련 업종 경험 유무</FormLabel>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        {
                          value: 'yes' as const,
                          title: '관련 업종 경험 있음',
                          desc: '동종·유사 매장 근무 또는 창업 운영 경험 보유',
                        },
                        {
                          value: 'no' as const,
                          title: '관련 업종 경험 없음',
                          desc: '신규 분야 첫 창업 또는 타 업종 전환 준비',
                        },
                      ].map((opt) => {
                        const isSelected = field.value === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`cursor-pointer rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] ${
                              isSelected
                                ? 'border-[#1E293B] bg-slate-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                            aria-pressed={isSelected}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-[#0F172A]">
                                {opt.title}
                              </span>
                              {isSelected && (
                                <Check
                                  className="h-4 w-4 text-[#10B981]"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                            <p className="mt-1 text-xs text-[#64748B]">
                              {opt.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step Navigation Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-[#1E293B] transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>이전 단계</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#1E293B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2"
              >
                <span>다음 단계</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-[#10B981] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#059669] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2"
              >
                <span>사업 성공률 진단 결과 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
