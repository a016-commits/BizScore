import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export type PageId = 'home' | 'diagnosis' | 'report' | 'insights';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  hasResult: boolean;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'diagnosis', label: '성공률 진단' },
  { id: 'report', label: '진단 리포트' },
  { id: 'insights', label: '상권 트렌드' },
];

export default function Navbar({
  activePage,
  onNavigate,
  hasResult,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (single clean text element) */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          className="cursor-pointer whitespace-nowrap shrink-0 text-left text-xl font-bold tracking-tight text-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2 rounded-sm"
        >
          BizScore
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="주요 메뉴"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-4 rounded-sm ${
                  isActive
                    ? 'font-semibold text-[#0F172A]'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-[1.15rem] h-0.5 bg-[#1E293B]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('diagnosis')}
            className="hidden sm:inline-flex cursor-pointer items-center justify-center whitespace-nowrap shrink-0 rounded-lg bg-[#1E293B] px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#0F172A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2"
          >
            무료 진단 시작
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden cursor-pointer items-center justify-center rounded-lg border border-slate-200 p-2 text-[#1E293B] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B]"
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav aria-label="모바일 메뉴" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-slate-100 font-semibold text-[#0F172A]'
                      : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleSelect('diagnosis')}
                className="w-full cursor-pointer rounded-lg bg-[#1E293B] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0F172A]"
              >
                무료 진단 시작
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
