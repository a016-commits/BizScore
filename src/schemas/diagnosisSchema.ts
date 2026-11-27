import { z } from 'zod';

export const diagnosisFormSchema = z
  .object({
    industry: z.enum(
      ['cafe', 'korean_food', 'convenience', 'beauty', 'ecommerce'],
      {
        message: '창업 희망 업종을 선택해 주세요.',
      }
    ),
    region: z
      .string()
      .trim()
      .min(1, '희망 상권 지역을 선택해 주세요.'),
    locationType: z.enum(['station', 'university', 'residential', 'office'], {
      message: '입지 유형을 선택해 주세요.',
    }),
    competitorLevel: z.enum(['low', 'medium', 'high'], {
      message: '반경 500m 내 경쟁업체 수준을 선택해 주세요.',
    }),
    initialCapital: z
      .number({
        message: '초기 투자 자본금을 숫자로 입력해 주세요.',
      })
      .refine((v) => !Number.isNaN(v), '초기 투자 자본금을 입력해 주세요.')
      .refine((v) => v > 0, '초기 투자 자본금은 0보다 큰 값이어야 합니다.')
      .refine((v) => v <= 500000, '입력 가능한 최대 자본금 범위(50억원)를 초과했습니다.'),
    monthlyRent: z
      .number({
        message: '예상 월 임대료를 숫자로 입력해 주세요.',
      })
      .refine((v) => !Number.isNaN(v), '예상 월 임대료를 입력해 주세요.')
      .refine((v) => v > 0, '예상 월 임대료는 0보다 큰 값이어야 합니다.')
      .refine((v) => v <= 50000, '입력 가능한 최대 월 임대료 범위를 초과했습니다.'),
    hasExperience: z.enum(['yes', 'no'], {
      message: '관련 업종 경험 유무를 선택해 주세요.',
    }),
  })
  .refine((data) => data.monthlyRent < data.initialCapital, {
    message: '예상 월 임대료는 초기 투자 자본금보다 작아야 합니다.',
    path: ['monthlyRent'],
  });

export type DiagnosisFormValues = z.infer<typeof diagnosisFormSchema>;

export const STEP_FIELD_MAP: Record<number, (keyof DiagnosisFormValues)[]> = {
  1: ['industry'],
  2: ['region', 'locationType', 'competitorLevel'],
  3: ['initialCapital', 'monthlyRent', 'hasExperience'],
};
