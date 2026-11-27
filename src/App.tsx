import { useState } from 'react';
import Navbar, { type PageId } from '@/src/components/Navbar';
import DiagnosisPage from '@/src/components/pages/DiagnosisPage';
import HomePage from '@/src/components/pages/HomePage';
import MarketInsightsPage from '@/src/components/pages/MarketInsightsPage';
import ResultDashboardPage from '@/src/components/pages/ResultDashboardPage';
import {
  calculateBizScore,
  type DiagnosisResult,
} from '@/src/data/bizscoreData';
import {
  clearScenariosFromStorage,
  loadLatestResult,
  loadSavedScenarios,
  removeScenarioFromStorage,
  saveLatestResult,
  saveScenarioToStorage,
} from '@/src/lib/storage';
import type { DiagnosisFormValues } from '@/src/schemas/diagnosisSchema';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(
    () => loadLatestResult()
  );
  const [savedScenarios, setSavedScenarios] = useState<DiagnosisResult[]>(() =>
    loadSavedScenarios()
  );
  const [editingDraft, setEditingDraft] =
    useState<DiagnosisFormValues | null>(null);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDiagnosisComplete = (values: DiagnosisFormValues) => {
    const computed = calculateBizScore(values);
    setCurrentResult(computed);
    setEditingDraft(values);
    saveLatestResult(computed);
    handleNavigate('report');
  };

  const handleSaveScenario = (result: DiagnosisResult) => {
    const updated = saveScenarioToStorage(result);
    setSavedScenarios(updated);
  };

  const handleDeleteScenario = (id: string) => {
    const updated = removeScenarioFromStorage(id);
    setSavedScenarios(updated);
  };

  const handleClearScenarios = () => {
    const updated = clearScenariosFromStorage();
    setSavedScenarios(updated);
  };

  const handleSelectScenario = (scenario: DiagnosisResult) => {
    setCurrentResult(scenario);
    setEditingDraft(scenario.input);
    saveLatestResult(scenario);
  };

  const handleEditInputs = () => {
    if (currentResult) {
      setEditingDraft(currentResult.input);
    }
    handleNavigate('diagnosis');
  };

  const handleLoadSampleDiagnosis = () => {
    const sampleValues: DiagnosisFormValues = {
      industry: 'cafe',
      region: '서울 마포구',
      locationType: 'station',
      competitorLevel: 'high',
      initialCapital: 8000,
      monthlyRent: 340,
      hasExperience: 'no',
    };
    handleDiagnosisComplete(sampleValues);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        hasResult={Boolean(currentResult)}
      />

      <main className="flex-1">
        {activePage === 'home' && <HomePage onNavigate={handleNavigate} />}

        {activePage === 'diagnosis' && (
          <DiagnosisPage
            initialValues={editingDraft}
            onComplete={handleDiagnosisComplete}
          />
        )}

        {activePage === 'report' && (
          <ResultDashboardPage
            result={currentResult}
            savedScenarios={savedScenarios}
            onSaveScenario={handleSaveScenario}
            onDeleteScenario={handleDeleteScenario}
            onClearScenarios={handleClearScenarios}
            onSelectScenario={handleSelectScenario}
            onEditInputs={handleEditInputs}
            onNavigate={handleNavigate}
            onLoadSampleDiagnosis={handleLoadSampleDiagnosis}
          />
        )}

        {activePage === 'insights' && <MarketInsightsPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-[#64748B] sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E293B]">BizScore</span>
            <span aria-hidden="true">·</span>
            <span>소상공인 상권·폐업률 데이터 기반 창업 성공률 진단</span>
          </div>
          <p className="text-center sm:text-right">
            본 진단 결과는 통계 모델 기반 시뮬레이션이며 실제 영업 성과의 참고 자료로 활용하세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
