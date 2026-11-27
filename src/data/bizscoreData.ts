export type IndustryId =
  | 'cafe'
  | 'korean_food'
  | 'convenience'
  | 'beauty'
  | 'ecommerce';

export type LocationTypeId = 'station' | 'university' | 'residential' | 'office';

export type CompetitorLevel = 'low' | 'medium' | 'high';

export type ExperienceOption = 'yes' | 'no';

export interface IndustryProfile {
  id: IndustryId;
  name: string;
  standardCode: string; // 공공데이터포털 상권정보 표준 업종 소분류 코드 기반
  categoryPath: string; // 대분류 > 중분류
  description: string;
  avgStartupCostManwon: number; // 평균 초기 투자금 (만원)
  recommendedWorkingCapitalRatio: number; // 권장 운전자금 비율
  safeRentToCapitalRatio: number; // 초기자본 대비 월 임대료 권장 상한(%)
  avgMonthlyRevenueManwon: number; // 업종 평균 월 매출 (만원)
  survival1Yr: number; // 1년차 생존율 (%)
  survival3Yr: number; // 3년차 생존율 (%)
  survival5Yr: number; // 5년차 생존율 (%)
  earlyClosureRate: number; // 1년 이내 초기 폐업률 (%)
  yearlySurvivalTrend: {
    years: string[];
    rates: number[];
  };
  closureReasons: {
    label: string;
    ratio: number;
  }[];
  locationSynergy: Record<LocationTypeId, number>; // -15 ~ +15 보정치
}

export interface RegionProfile {
  id: string;
  name: string;
  rentPressureIndex: number; // 0.8 (낮음) ~ 1.35 (매우 높음)
  competitionBaseline: number; // 기본 경쟁 밀집도 (0~100)
  demandScore: number; // 배후 유동/소비 수요 지수 (0~100)
  avgMonthlyRentManwon: number; // 평균 소형 점포 월 임대료 (만원)
}

export interface MarketBubblePoint {
  name: string;
  industryId: IndustryId;
  avgMonthlyRevenueManwon: number; // x
  survival3Yr: number; // y
  storeDensityRadius: number; // r (시각화 반경)
  storeCount: number; // 실제 표시용 점포 수 지표
  tier: 'stable_growth' | 'high_competition' | 'risk_watch';
}

export const INDUSTRY_PROFILES: Record<IndustryId, IndustryProfile> = {
  cafe: {
    id: 'cafe',
    name: '카페/디저트',
    standardCode: 'I21201',
    categoryPath: '음식 > 비알코올 > 커피 전문점',
    description: '진입 장벽이 낮아 신규 창업이 활발하지만, 1~3년 내 경쟁 과열로 폐업 비중이 높은 업종입니다.',
    avgStartupCostManwon: 9500,
    recommendedWorkingCapitalRatio: 0.25,
    safeRentToCapitalRatio: 3.2,
    avgMonthlyRevenueManwon: 2450,
    survival1Yr: 78.4,
    survival3Yr: 51.2,
    survival5Yr: 36.8,
    earlyClosureRate: 21.6,
    yearlySurvivalTrend: {
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      rates: [54.8, 53.5, 52.1, 51.6, 51.4, 51.2],
    },
    closureReasons: [
      { label: '동종 경쟁 심화', ratio: 38 },
      { label: '임대료·고정비 부담', ratio: 27 },
      { label: '원두·원재료 원가 상승', ratio: 21 },
      { label: '유동인구·상권 변화', ratio: 14 },
    ],
    locationSynergy: {
      station: 12,
      office: 10,
      university: 6,
      residential: -4,
    },
  },
  korean_food: {
    id: 'korean_food',
    name: '한식/외식',
    standardCode: 'I20101',
    categoryPath: '음식 > 한식 > 백반·한정식',
    description: '안정적인 식사 수요가 있으나 식자재 원가와 인건비 변동에 민감해 수익성 관리가 핵심입니다.',
    avgStartupCostManwon: 11000,
    recommendedWorkingCapitalRatio: 0.28,
    safeRentToCapitalRatio: 2.8,
    avgMonthlyRevenueManwon: 3200,
    survival1Yr: 75.2,
    survival3Yr: 48.6,
    survival5Yr: 33.5,
    earlyClosureRate: 24.8,
    yearlySurvivalTrend: {
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      rates: [52.1, 50.4, 49.5, 49.0, 48.8, 48.6],
    },
    closureReasons: [
      { label: '식자재비 상승·수익성 악화', ratio: 34 },
      { label: '동종·인접 업종 경쟁', ratio: 29 },
      { label: '인건비·인력 운영난', ratio: 22 },
      { label: '임대료 및 권리금 부담', ratio: 15 },
    ],
    locationSynergy: {
      office: 11,
      residential: 9,
      station: 7,
      university: 2,
    },
  },
  convenience: {
    id: 'convenience',
    name: '편의점/소매',
    standardCode: 'G20404',
    categoryPath: '소매 > 종합소매 > 편의점·생활잡화',
    description: '생활 필수 수요 덕분에 초기 생존율이 높지만, 야간 인건비와 근접 출점 경쟁이 수익성을 좌우합니다.',
    avgStartupCostManwon: 13500,
    recommendedWorkingCapitalRatio: 0.22,
    safeRentToCapitalRatio: 2.4,
    avgMonthlyRevenueManwon: 4650,
    survival1Yr: 86.1,
    survival3Yr: 64.5,
    survival5Yr: 49.2,
    earlyClosureRate: 13.9,
    yearlySurvivalTrend: {
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      rates: [66.2, 65.8, 65.1, 64.9, 64.6, 64.5],
    },
    closureReasons: [
      { label: '인건비·가맹 수수료 부담', ratio: 36 },
      { label: '반경 내 근접 출점 경쟁', ratio: 31 },
      { label: '임대료 재계약 상승', ratio: 20 },
      { label: '객단가 정체 및 심야 적자', ratio: 13 },
    ],
    locationSynergy: {
      residential: 13,
      station: 9,
      university: 8,
      office: 5,
    },
  },
  beauty: {
    id: 'beauty',
    name: '미용/서비스',
    standardCode: 'S20701',
    categoryPath: '수리·개인 > 이용·미용 > 두발·피부미용',
    description: '단골 고객 확보 시 장기 생존율이 가장 높은 업종이나, 초기 고객 유입과 인력 유지 전략이 필수입니다.',
    avgStartupCostManwon: 7500,
    recommendedWorkingCapitalRatio: 0.24,
    safeRentToCapitalRatio: 3.5,
    avgMonthlyRevenueManwon: 2150,
    survival1Yr: 84.8,
    survival3Yr: 66.3,
    survival5Yr: 52.4,
    earlyClosureRate: 15.2,
    yearlySurvivalTrend: {
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      rates: [64.0, 64.8, 65.2, 65.9, 66.1, 66.3],
    },
    closureReasons: [
      { label: '신규 유입·재방문율 저조', ratio: 35 },
      { label: '숙련 인력 이탈·구인난', ratio: 28 },
      { label: '가격 할인 경쟁 심화', ratio: 23 },
      { label: '고정 임대료 부담', ratio: 14 },
    ],
    locationSynergy: {
      residential: 12,
      station: 8,
      university: 5,
      office: -2,
    },
  },
  ecommerce: {
    id: 'ecommerce',
    name: '온라인 커머스',
    standardCode: 'G20901',
    categoryPath: '소매 > 무점포소매 > 전자상거래 소매업',
    description: '오프라인 임차 자본 부담은 낮지만, 광고비 효율 저하와 최저가 경쟁으로 초기 안착 난이도가 높습니다.',
    avgStartupCostManwon: 3200,
    recommendedWorkingCapitalRatio: 0.4,
    safeRentToCapitalRatio: 2.2,
    avgMonthlyRevenueManwon: 2850,
    survival1Yr: 72.5,
    survival3Yr: 44.9,
    survival5Yr: 31.4,
    earlyClosureRate: 27.5,
    yearlySurvivalTrend: {
      years: ['2020', '2021', '2022', '2023', '2024', '2025'],
      rates: [49.2, 48.0, 46.8, 45.7, 45.2, 44.9],
    },
    closureReasons: [
      { label: '광고비·마케팅 효율 저하', ratio: 42 },
      { label: '저가 경쟁·마진율 축소', ratio: 31 },
      { label: '악성 재고·물류 비용', ratio: 16 },
      { label: '플랫폼 수수료·정산 지연', ratio: 11 },
    ],
    locationSynergy: {
      office: 8,
      residential: 6,
      station: 0,
      university: 2,
    },
  },
};

export const INDUSTRY_LIST: IndustryProfile[] = Object.values(INDUSTRY_PROFILES);

export const NATIONAL_AVG_SURVIVAL_TREND = {
  years: ['2020', '2021', '2022', '2023', '2024', '2025'],
  rates: [56.9, 56.2, 55.5, 55.1, 54.9, 55.0],
};

export const REGION_PROFILES: RegionProfile[] = [
  {
    id: 'seoul_gangnam',
    name: '서울 강남구',
    rentPressureIndex: 1.35,
    competitionBaseline: 84,
    demandScore: 94,
    avgMonthlyRentManwon: 420,
  },
  {
    id: 'seoul_mapo',
    name: '서울 마포구',
    rentPressureIndex: 1.22,
    competitionBaseline: 78,
    demandScore: 89,
    avgMonthlyRentManwon: 320,
  },
  {
    id: 'seoul_seongdong',
    name: '서울 성동구',
    rentPressureIndex: 1.24,
    competitionBaseline: 74,
    demandScore: 87,
    avgMonthlyRentManwon: 335,
  },
  {
    id: 'seoul_songpa',
    name: '서울 송파구',
    rentPressureIndex: 1.15,
    competitionBaseline: 70,
    demandScore: 85,
    avgMonthlyRentManwon: 285,
  },
  {
    id: 'seoul_gwanak',
    name: '서울 관악구',
    rentPressureIndex: 0.96,
    competitionBaseline: 68,
    demandScore: 79,
    avgMonthlyRentManwon: 195,
  },
  {
    id: 'gyeonggi_bundang',
    name: '경기 성남시 분당구',
    rentPressureIndex: 1.12,
    competitionBaseline: 65,
    demandScore: 84,
    avgMonthlyRentManwon: 270,
  },
  {
    id: 'gyeonggi_suwon',
    name: '경기 수원시 영통구',
    rentPressureIndex: 0.94,
    competitionBaseline: 61,
    demandScore: 78,
    avgMonthlyRentManwon: 185,
  },
  {
    id: 'incheon_yeonsu',
    name: '인천 연수구 송도',
    rentPressureIndex: 1.02,
    competitionBaseline: 59,
    demandScore: 76,
    avgMonthlyRentManwon: 210,
  },
  {
    id: 'busan_haeundae',
    name: '부산 해운대구',
    rentPressureIndex: 1.05,
    competitionBaseline: 67,
    demandScore: 81,
    avgMonthlyRentManwon: 225,
  },
  {
    id: 'daegu_suseong',
    name: '대구 수성구',
    rentPressureIndex: 0.91,
    competitionBaseline: 58,
    demandScore: 74,
    avgMonthlyRentManwon: 170,
  },
  {
    id: 'nationwide_online',
    name: '전국 평균 (공유오피스/무점포)',
    rentPressureIndex: 0.72,
    competitionBaseline: 62,
    demandScore: 77,
    avgMonthlyRentManwon: 55,
  },
];

export const LOCATION_TYPES: {
  id: LocationTypeId;
  label: string;
  summary: string;
}[] = [
  {
    id: 'station',
    label: '역세권',
    summary: '유동인구 회전이 빠르고 가시성이 높으나 권리금·임대료 변동이 큼',
  },
  {
    id: 'university',
    label: '대학가',
    summary: '10~20대 객단가 민감도가 높고 방학 기간 매출 편차가 발생함',
  },
  {
    id: 'residential',
    label: '주거밀집',
    summary: '단골 재방문 기반의 안정적 수요가 강점이나 신규 유입 한계가 있음',
  },
  {
    id: 'office',
    label: '오피스',
    summary: '평일 점심·출퇴근 수요가 집중되며 주말 공동화 대비가 필요함',
  },
];

export const COMPETITOR_OPTIONS: {
  id: CompetitorLevel;
  label: string;
  countRange: string;
  description: string;
}[] = [
  {
    id: 'low',
    label: '적음',
    countRange: '반경 500m 내 0~4곳',
    description: '초기 시장 선점 여력이 충분한 저밀집 구간',
  },
  {
    id: 'medium',
    label: '보통',
    countRange: '반경 500m 내 5~11곳',
    description: '상권 수요가 검증되었으나 차별화 전략이 필요한 구간',
  },
  {
    id: 'high',
    label: '많음',
    countRange: '반경 500m 내 12곳 이상',
    description: '출혈 경쟁 및 고객 이탈 위험이 높은 고포화 구간',
  },
];

// 3차원 버블 차트용 주요 업종·상권 클러스터 데이터 (x: 월 평균 매출액, y: 3년 생존율, r: 밀집도)
export const MARKET_BUBBLE_POINTS: MarketBubblePoint[] = [
  {
    name: '미용/서비스 · 주거밀집',
    industryId: 'beauty',
    avgMonthlyRevenueManwon: 2350,
    survival3Yr: 69.2,
    storeDensityRadius: 15,
    storeCount: 4120,
    tier: 'stable_growth',
  },
  {
    name: '편의점/소매 · 주거밀집',
    industryId: 'convenience',
    avgMonthlyRevenueManwon: 4400,
    survival3Yr: 67.8,
    storeDensityRadius: 17,
    storeCount: 5380,
    tier: 'stable_growth',
  },
  {
    name: '미용/서비스 · 역세권',
    industryId: 'beauty',
    avgMonthlyRevenueManwon: 2950,
    survival3Yr: 63.4,
    storeDensityRadius: 13,
    storeCount: 2840,
    tier: 'stable_growth',
  },
  {
    name: '편의점/소매 · 오피스',
    industryId: 'convenience',
    avgMonthlyRevenueManwon: 4850,
    survival3Yr: 61.5,
    storeDensityRadius: 14,
    storeCount: 3190,
    tier: 'high_competition',
  },
  {
    name: '한식/외식 · 오피스',
    industryId: 'korean_food',
    avgMonthlyRevenueManwon: 3850,
    survival3Yr: 53.8,
    storeDensityRadius: 20,
    storeCount: 6420,
    tier: 'high_competition',
  },
  {
    name: '카페/디저트 · 역세권',
    industryId: 'cafe',
    avgMonthlyRevenueManwon: 3150,
    survival3Yr: 52.6,
    storeDensityRadius: 23,
    storeCount: 8240,
    tier: 'high_competition',
  },
  {
    name: '카페/디저트 · 대학가',
    industryId: 'cafe',
    avgMonthlyRevenueManwon: 2100,
    survival3Yr: 46.2,
    storeDensityRadius: 19,
    storeCount: 4950,
    tier: 'risk_watch',
  },
  {
    name: '한식/외식 · 대학가',
    industryId: 'korean_food',
    avgMonthlyRevenueManwon: 2550,
    survival3Yr: 44.1,
    storeDensityRadius: 18,
    storeCount: 4680,
    tier: 'risk_watch',
  },
  {
    name: '온라인 커머스 · 초기 셀러',
    industryId: 'ecommerce',
    avgMonthlyRevenueManwon: 2650,
    survival3Yr: 44.9,
    storeDensityRadius: 22,
    storeCount: 7910,
    tier: 'risk_watch',
  },
];

export interface DiagnosisInput {
  industry: IndustryId;
  region: string;
  locationType: LocationTypeId;
  competitorLevel: CompetitorLevel;
  initialCapital: number; // 만원
  monthlyRent: number; // 만원
  hasExperience: ExperienceOption;
}

export type RiskGrade = '안전' | '보통' | '주의' | '위험';

export interface RadarDimensions {
  capitalStability: number; // 자본 안정성
  fixedCostBurden: number; // 고정비(임대료) 부담도 (높을수록 부담 적고 건전함)
  competitionIntensity: number; // 상권 경쟁 강도 (높을수록 경쟁 우위)
  industrySurvival: number; // 업종 평균 생존율
  readiness: number; // 창업 준비도
}

export interface ImprovementGuide {
  id: string;
  metricName: string;
  score: number;
  severity: 'critical' | 'warning' | 'advice';
  title: string;
  description: string;
  actionStep: string;
}

export interface DiagnosisResult {
  id: string;
  createdAt: string;
  input: DiagnosisInput;
  overallScore: number; // 0~100
  grade: RiskGrade;
  rentToCapitalRatio: number; // 초기 자본 대비 월 임대료 비중 (%)
  estimatedBreakEvenMonths: number; // 예상 손익분기 도달 개월 수
  dimensions: RadarDimensions;
  guides: ImprovementGuide[];
}

export function clampScore(val: number): number {
  return Math.max(8, Math.min(98, Math.round(val)));
}

export function getGradeFromScore(score: number): RiskGrade {
  if (score >= 75) return '안전';
  if (score >= 60) return '보통';
  if (score >= 45) return '주의';
  return '위험';
}

export function formatManwon(manwon: number): string {
  if (!Number.isFinite(manwon) || manwon <= 0) return '0만원';
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    return rest > 0
      ? `${eok}억 ${rest.toLocaleString('ko-KR')}만원`
      : `${eok}억원`;
  }
  return `${manwon.toLocaleString('ko-KR')}만원`;
}

export function calculateBizScore(input: DiagnosisInput): DiagnosisResult {
  const industry = INDUSTRY_PROFILES[input.industry];
  const region =
    REGION_PROFILES.find((r) => r.name === input.region) ?? REGION_PROFILES[0];

  // 1. 자본 안정성 (0~100)
  // 업종 평균 창업비용 * 지역 임대압력 보정치 대비 보유 자본금 비율
  const adjustedRecommendedCapital =
    industry.avgStartupCostManwon * (0.65 + region.rentPressureIndex * 0.35);
  const capitalRatio = input.initialCapital / adjustedRecommendedCapital;
  let capitalScore = 45 + (capitalRatio - 0.7) * 48;
  if (capitalRatio < 0.5) capitalScore -= 14;
  if (capitalRatio > 1.35) capitalScore = Math.min(96, capitalScore + 6);
  const capitalStability = clampScore(capitalScore);

  // 2. 고정비(임대료) 부담도 건전성 (0~100, 높을수록 임대료 부담이 적정함)
  // 초기 자본 대비 월 임대료 비율(%) 및 업종 안전 상한선 비교
  const rentToCapitalRatio = Number(
    ((input.monthlyRent / input.initialCapital) * 100).toFixed(1)
  );
  const ratioOverSafe = rentToCapitalRatio / industry.safeRentToCapitalRatio;
  // ratioOverSafe === 1.0 -> 약 72점, <= 0.6 -> 92점, >= 1.8 -> 25점
  let rentSafetyScore = 96 - ratioOverSafe * 34;
  // 지역 평균 임대료 대비 절대 금액 패널티/보너스
  if (input.monthlyRent > region.avgMonthlyRentManwon * 1.35) {
    rentSafetyScore -= 8;
  } else if (input.monthlyRent <= region.avgMonthlyRentManwon * 0.85) {
    rentSafetyScore += 6;
  }
  const fixedCostBurden = clampScore(rentSafetyScore);

  // 3. 상권 경쟁 강도 대응력 (0~100, 높을수록 경쟁 압력이 낮고 유리함)
  const competitorBaseMap: Record<CompetitorLevel, number> = {
    low: 88,
    medium: 62,
    high: 34,
  };
  const synergy = industry.locationSynergy[input.locationType];
  const regionCompetitionPenalty = (region.competitionBaseline - 65) * 0.25;
  const competitionIntensity = clampScore(
    competitorBaseMap[input.competitorLevel] +
      synergy * 0.8 -
      regionCompetitionPenalty
  );

  // 4. 업종 평균 생존율 점수 (0~100)
  // 1년차/3년차 통계 + 입지 시너지
  const baseSurvivalScore =
    industry.survival1Yr * 0.42 + industry.survival3Yr * 0.58;
  const industrySurvival = clampScore(baseSurvivalScore + synergy * 0.7);

  // 5. 창업 준비도 (0~100)
  const experienceBase = input.hasExperience === 'yes' ? 82 : 44;
  const bufferBonus =
    capitalRatio >= 1.0 ? 10 : capitalRatio >= 0.8 ? 4 : -8;
  const demandFit = (region.demandScore - 75) * 0.35 + synergy * 0.6;
  const readiness = clampScore(experienceBase + bufferBonus + demandFit);

  const dimensions: RadarDimensions = {
    capitalStability,
    fixedCostBurden,
    competitionIntensity,
    industrySurvival,
    readiness,
  };

  // 가중치 기반 종합 성공률 계산
  const weightedTotal =
    capitalStability * 0.24 +
    fixedCostBurden * 0.24 +
    competitionIntensity * 0.2 +
    industrySurvival * 0.16 +
    readiness * 0.16;

  const overallScore = clampScore(weightedTotal);
  const grade = getGradeFromScore(overallScore);

  // 손익분기 예상 기간 (개월)
  const monthlyMarginEstimate = Math.max(
    180,
    industry.avgMonthlyRevenueManwon * 0.24 - input.monthlyRent * 0.45
  );
  const estimatedBreakEvenMonths = Math.max(
    6,
    Math.min(
      48,
      Math.round(input.initialCapital / monthlyMarginEstimate)
    )
  );

  // 취약 항목(< 50점) 자동 감지 및 맞춤형 보완 가이드 생성
  const guides: ImprovementGuide[] = [];

  if (fixedCostBurden < 50) {
    const recommendedMaxRent = Math.round(
      (input.initialCapital * industry.safeRentToCapitalRatio) / 100
    );
    guides.push({
      id: 'guide-rent',
      metricName: '고정비(임대료) 부담도',
      score: fixedCostBurden,
      severity: fixedCostBurden < 35 ? 'critical' : 'warning',
      title: '초기 자본 대비 월 임대료 비중이 과도합니다',
      description: `현재 월 임대료가 초기 투자금의 ${rentToCapitalRatio}%에 달해(${industry.name} 권장 상한 ${industry.safeRentToCapitalRatio}%), 매출 변동 시 고정비 압박이 빠르게 누적됩니다.`,
      actionStep: `월 임대료를 ${formatManwon(recommendedMaxRent)} 이하로 조정하거나, 보증금·임대료 비율 재협상(렌트프리 1~2개월 포함)을 권장합니다.`,
    });
  }

  if (capitalStability < 50) {
    const shortfall = Math.max(
      500,
      Math.round(adjustedRecommendedCapital - input.initialCapital)
    );
    guides.push({
      id: 'guide-capital',
      metricName: '자본 안정성',
      score: capitalStability,
      severity: capitalStability < 35 ? 'critical' : 'warning',
      title: '초기 투자 및 운전자금 버퍼가 부족합니다',
      description: `${region.name} 기준 ${industry.name} 권장 자본(${formatManwon(Math.round(adjustedRecommendedCapital))}) 대비 약 ${formatManwon(shortfall)}이 부족하여 오픈 직후 운전자금 고갈 위험이 있습니다.`,
      actionStep: `최소 6개월치 고정비(임대료+관리비)를 예비 운전자금으로 별도 분리하고, 인테리어·초기 설비 투자 규모를 15~20% 축소하세요.`,
    });
  }

  if (competitionIntensity < 50) {
    guides.push({
      id: 'guide-competition',
      metricName: '상권 경쟁 강도',
      score: competitionIntensity,
      severity: competitionIntensity < 35 ? 'critical' : 'warning',
      title: '반경 500m 내 동종 경쟁 밀집도가 매우 높습니다',
      description: `동종 매장이 밀집한 상권에서는 오픈 초기 마케팅 비용 상승과 단골 확보 지연이 폐업 원인의 30% 이상을 차지합니다.`,
      actionStep: `주력 메뉴·가격대의 명확한 차별화 포인트를 설정하고, 배후 ${LOCATION_TYPES.find((l) => l.id === input.locationType)?.label ?? '상권'} 타깃 시간대 프로모션을 우선 설계하세요.`,
    });
  }

  if (industrySurvival < 50) {
    guides.push({
      id: 'guide-survival',
      metricName: '업종 평균 생존율',
      score: industrySurvival,
      severity: 'warning',
      title: '초기 1~3년차 폐업률이 높은 업종·입지 조합입니다',
      description: `${industry.name} 업종은 3년 생존율이 ${industry.survival3Yr}% 수준으로, 초기 12개월 내 매출 안착 실패 시 손실이 커집니다.`,
      actionStep: `초기 손익분기점 도달 기간(${estimatedBreakEvenMonths}개월 예상)을 단축하기 위해 배달·테이크아웃 등 다각화 채널을 오픈 전 미리 구축하세요.`,
    });
  }

  if (readiness < 50) {
    guides.push({
      id: 'guide-readiness',
      metricName: '창업 준비도',
      score: readiness,
      severity: 'warning',
      title: '관련 업종 실무 경험 보완이 필요합니다',
      description: `유사 업종 운영 경험 없이 진입할 경우 초기 발주·재고 로스 및 인력 관리 시행착오로 수익성이 평균 대비 낮아질 수 있습니다.`,
      actionStep: `개업 전 최소 2~4주 이상 동종 매장 현장 근무 또는 소상공인시장진흥공단 창업 교육 이수를 통해 원가·발주 프로세스를 먼저 검증하세요.`,
    });
  }

  // 모든 항목이 50점 이상일 경우, 가장 점수가 낮은 항목 기반의 고도화 가이드 제공
  if (guides.length === 0) {
    const entries: { key: keyof RadarDimensions; label: string; score: number }[] = [
      { key: 'capitalStability', label: '자본 안정성', score: capitalStability },
      { key: 'fixedCostBurden', label: '고정비(임대료) 부담도', score: fixedCostBurden },
      { key: 'competitionIntensity', label: '상권 경쟁 강도', score: competitionIntensity },
      { key: 'industrySurvival', label: '업종 평균 생존율', score: industrySurvival },
      { key: 'readiness', label: '창업 준비도', score: readiness },
    ];
    entries.sort((a, b) => a.score - b.score);
    const lowest = entries[0];

    guides.push({
      id: 'guide-optimize',
      metricName: lowest.label,
      score: lowest.score,
      severity: 'advice',
      title: `전반적으로 안정적이나 '${lowest.label}' 추가 보완 시 생존력이 극대화됩니다`,
      description: `5대 핵심 지표가 모두 기준치(50점)를 상회합니다. 상대적으로 여력이 적은 ${lowest.label}(${lowest.score}점) 영역을 선제 관리하면 장기 생존 가능성이 더욱 높아집니다.`,
      actionStep: `분기별 매출 대비 고정비 비중을 ${industry.safeRentToCapitalRatio}% 내외로 점검하고, 초기 6개월간 예비 운전자금 유동성을 유지하세요.`,
    });
  }

  return {
    id: `diag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    input,
    overallScore,
    grade,
    rentToCapitalRatio,
    estimatedBreakEvenMonths,
    dimensions,
    guides,
  };
}

export interface ChecklistItem {
  id: string;
  category: '인허가' | '상권분석' | '임대차·자금' | '운영준비';
  title: string;
  detail: string;
}

export const PRE_LAUNCH_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: '인허가',
    title: '건축물대장 용도 확인 및 영업신고(위생교육) 사전 검토',
    detail: '근린생활시설 1·2종 구분 및 정화조 용량이 해당 업종(휴게·일반음식점 등) 인허가 기준에 부합하는지 계약 전 확인합니다.',
  },
  {
    id: 'chk-2',
    category: '상권분석',
    title: '평일·주말 및 시간대별 실제 유동인구 실사 (최소 3회)',
    detail: '지도 데이터 외에 점심(12~14시), 퇴근(18~20시), 주말 오후의 주 고객층 동선과 맞은편 상권 단절 여부를 직접 측정합니다.',
  },
  {
    id: 'chk-3',
    category: '임대차·자금',
    title: '상가임대차보호법 환산보증금 및 계약갱신청구권 검토',
    detail: '권리금 회수 기회 보호 조항, 원상복구 범위 특약, 렌트프리(인테리어 기간 무상 임대) 조건을 임대차 계약서에 명시합니다.',
  },
  {
    id: 'chk-4',
    category: '임대차·자금',
    title: '초기 자본과 별도로 6개월분 운전자금(비상금) 분리 확보',
    detail: '개업 초기 3~6개월간의 적자 구간을 버틸 수 있도록 임대료·인건비·식자재비 현금 유동성을 별도 계좌로 확보합니다.',
  },
  {
    id: 'chk-5',
    category: '운영준비',
    title: '목표 객단가 기반 일일 손익분기(BEP) 판매량 산출',
    detail: '월 고정비(임대료+인건비+공과금) ÷ 공헌이익률 계산을 통해 하루 최소 목표 매출과 회전율을 사전에 확정합니다.',
  },
  {
    id: 'chk-6',
    category: '인허가',
    title: '사업자등록 및 업종별 필수 보험(배상책임·화재보험) 가입',
    detail: '일반과세자 vs 간이과세자 유리 여부를 세무 상담 후 결정하고, 다중이용업소 해당 시 안전시설 완비증명서를 준비합니다.',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const MARKET_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '비즈스코어의 사업 성공률과 5대 지표는 어떤 데이터에 기반하나요?',
    answer:
      '공공데이터포털 소상공인시장진흥공단 상가(상권)정보 표준 업종 분류 체계(대·중·소분류)와 국세청·통계청의 최근 업종별 1·3·5년차 생존율 통계 경향을 기반으로, 초기 자본금 대비 임대료 비중, 반경 500m 경쟁 밀집도, 입지 시너지를 가중 산출하여 계산합니다.',
  },
  {
    id: 'faq-2',
    question: '초기 투자 자본금 대비 월 임대료 비중은 몇 % 이내가 안전한가요?',
    answer:
      '일반적으로 초기 투자금 대비 월 임대료가 2.5%~3.5%를 초과하면(예: 자본금 1억 원에 월세 400만 원 이상) 오픈 초기 매출 정체 시 현금 흐름이 급격히 악화됩니다. 예상 월 매출 기준으로는 매출의 10~12% 이내를 유지하는 것이 안전합니다.',
  },
  {
    id: 'faq-3',
    question: '진단 결과를 저장하고 여러 후보 입지를 비교할 수 있나요?',
    answer:
      '네. 진단 결과 페이지에서 "현재 결과 저장하기" 버튼을 누르면 브라우저 로컬 스토리지(localStorage)에 시나리오가 안전하게 저장됩니다. 동일 업종으로 지역이나 임대료 조건만 바꿔 재진단한 뒤 수치를 나란히 비교할 수 있습니다.',
  },
  {
    id: 'faq-4',
    question: '점수가 "주의" 또는 "위험"으로 나오면 창업을 포기해야 하나요?',
    answer:
      '그렇지 않습니다. 비즈스코어는 창업을 막기 위한 도구가 아니라 실패 확률이 높은 원인을 사전에 수치로 드러내는 시뮬레이터입니다. 리포트의 "맞춤형 리스크 개선 가이드"에 따라 임대료 조건 재협상, 입지 변경, 또는 운전자금 증액을 적용해 재진단하면 점수가 개선되는 지점을 확인할 수 있습니다.',
  },
];
