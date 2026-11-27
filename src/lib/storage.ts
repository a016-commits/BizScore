import type { DiagnosisResult } from '@/src/data/bizscoreData';
import type { DiagnosisFormValues } from '@/src/schemas/diagnosisSchema';

const KEYS = {
  SAVED_SCENARIOS: 'bizscore_saved_scenarios_v1',
  FORM_DRAFT: 'bizscore_form_draft_v1',
  RECENT_REGIONS: 'bizscore_recent_regions_v1',
  CHECKLIST_STATE: 'bizscore_checklist_v1',
  LATEST_RESULT: 'bizscore_latest_result_v1',
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadSavedScenarios(): DiagnosisResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEYS.SAVED_SCENARIOS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScenarioToStorage(result: DiagnosisResult): DiagnosisResult[] {
  const existing = loadSavedScenarios();
  const filtered = existing.filter((item) => item.id !== result.id);
  const updated = [result, ...filtered].slice(0, 6);
  if (isBrowser()) {
    window.localStorage.setItem(KEYS.SAVED_SCENARIOS, JSON.stringify(updated));
  }
  return updated;
}

export function removeScenarioFromStorage(id: string): DiagnosisResult[] {
  const existing = loadSavedScenarios();
  const updated = existing.filter((item) => item.id !== id);
  if (isBrowser()) {
    window.localStorage.setItem(KEYS.SAVED_SCENARIOS, JSON.stringify(updated));
  }
  return updated;
}

export function clearScenariosFromStorage(): DiagnosisResult[] {
  if (isBrowser()) {
    window.localStorage.removeItem(KEYS.SAVED_SCENARIOS);
  }
  return [];
}

export function loadLatestResult(): DiagnosisResult | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEYS.LATEST_RESULT);
    return raw ? (JSON.parse(raw) as DiagnosisResult) : null;
  } catch {
    return null;
  }
}

export function saveLatestResult(result: DiagnosisResult): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEYS.LATEST_RESULT, JSON.stringify(result));
  } catch {
    // ignore quota error
  }
}

export function loadFormDraft(): Partial<DiagnosisFormValues> | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEYS.FORM_DRAFT);
    return raw ? (JSON.parse(raw) as Partial<DiagnosisFormValues>) : null;
  } catch {
    return null;
  }
}

export function saveFormDraft(values: Partial<DiagnosisFormValues>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEYS.FORM_DRAFT, JSON.stringify(values));
  } catch {
    // ignore quota error
  }
}

export function loadRecentRegions(): string[] {
  if (!isBrowser()) return ['서울 강남구', '서울 마포구', '경기 성남시 분당구'];
  try {
    const raw = window.localStorage.getItem(KEYS.RECENT_REGIONS);
    if (!raw) return ['서울 강남구', '서울 마포구', '경기 성남시 분당구'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : ['서울 강남구', '서울 마포구', '경기 성남시 분당구'];
  } catch {
    return ['서울 강남구', '서울 마포구', '경기 성남시 분당구'];
  }
}

// 명세서 5장 알고리즘 적용: 중복 제거 후 최상단 추가 및 .slice(0, 9) 최대 개수 제한
export function recordRecentRegion(region: string, currentList: string[]): string[] {
  const trimmed = region.trim();
  if (!trimmed) return currentList;
  const updated = [
    trimmed,
    ...currentList.filter((item) => item !== trimmed),
  ].slice(0, 9);
  if (isBrowser()) {
    window.localStorage.setItem(KEYS.RECENT_REGIONS, JSON.stringify(updated));
  }
  return updated;
}

export function loadChecklistState(): Record<string, boolean> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(KEYS.CHECKLIST_STATE);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function saveChecklistState(state: Record<string, boolean>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEYS.CHECKLIST_STATE, JSON.stringify(state));
  } catch {
    // ignore
  }
}
