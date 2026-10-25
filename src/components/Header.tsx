import React, { useState, useEffect, useRef } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import { ChevronDown, Check, ShieldCheck, User, Lock, Wallet } from 'lucide-react';
import { SubmissionsStore } from '../data/submissionsStore';

interface HeaderProps {
  currentCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  onNavigateToForm: () => void;
  onOpenDashboard?: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCountry,
  onSelectCountry,
  onNavigateToForm,
  onOpenDashboard,
  onOpenAdmin,
  onOpenAuth,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const country = COUNTRIES[currentCountry];
  const currentUser = SubmissionsStore.getCurrentUser();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const countryKeys: CountryCode[] = ['UK', 'CA', 'AU', 'DE'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      {/* 4 Sovereign Nations Jurisdiction Announcement Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">
              4 Nations:
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {countryKeys.map((cCode) => {
                const c = COUNTRIES[cCode];
                const isActive = cCode === currentCountry;
                return (
                  <button
                    key={cCode}
                    type="button"
                    onClick={() => onSelectCountry(cCode)}
                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-700 text-white font-bold shadow-xs'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={`Switch active jurisdiction to ${c.name} (${c.currency})`}
                  >
                    <span>{c.flag}</span>
                    <span className="font-medium">{c.code}</span>
                    <span className="text-[9px] sm:text-[10px] opacity-80">({c.currency})</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
            <span>Direct Sovereign Financing · Prime Residences & Prestige Vehicles</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              10% Down Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-colors duration-200 py-2.5 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Wordmark */}
            <a
              href="#"
              className="text-lg sm:text-xl font-serif tracking-[0.18em] uppercase font-bold text-slate-900 hover:text-slate-700 transition-colors flex items-center gap-2 group"
              aria-label="Aureus Prestige Home"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-xs group-hover:scale-125 transition-transform" />
              <span className="font-bold tracking-wider text-slate-900">
                AUREUS <span className="text-slate-900 font-semibold">PRESTIGE</span>
              </span>
            </a>

            {/* Navigation links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 tracking-wide">
              <a
                href="#asset-selection"
                className="hover:text-slate-900 transition-colors"
              >
                {currentCountry === 'DE' ? 'Immobilien & Autokredite' : 'Homes & Car Loans'}
              </a>
              <a
                href="#calculator"
                className="hover:text-slate-900 transition-colors"
              >
                {currentCountry === 'DE' ? '10% Darlehensrechner' : '10% Loan Modeler'}
              </a>
              <a
                href="#investment-plans"
                className="hover:text-slate-900 transition-colors"
              >
                {currentCountry === 'DE' ? 'Anlagepläne' : 'Investment Plans'}
              </a>
              <a
                href="#application-form"
                className="hover:text-slate-900 transition-colors"
              >
                {currentCountry === 'DE' ? 'Antrag stellen' : 'Apply to Acquire'}
              </a>

              {/* Aureus Direct Navigation */}
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800"
                >
                  <Wallet className="w-3.5 h-3.5 text-slate-900" />
                  <span>{currentCountry === 'DE' ? 'Aureus' : 'Aureus'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}
            </nav>

            {/* Actions: Country selector + User Auth/Dashboard + Admin + Pre-Approval CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Country Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 hover:border-slate-400 hover:bg-slate-100 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                  aria-expanded={dropdownOpen}
                  aria-label="Select Country"
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="hidden sm:inline font-semibold">{country.name}</span>
                  <span className="sm:hidden font-semibold">{country.code}</span>
                  <span className="text-slate-500 font-mono text-xs">({country.currency})</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      dropdownOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>4 Licensed Jurisdictions</span>
                      <span className="text-slate-900 font-semibold text-[10px]">Select Active</span>
                    </div>
                    {countryKeys.map((cCode) => {
                      const c = COUNTRIES[cCode];
                      const isSelected = cCode === currentCountry;
                      return (
                        <button
                          key={cCode}
                          type="button"
                          onClick={() => {
                            onSelectCountry(cCode);
                            setDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-100 transition-colors cursor-pointer ${
                            isSelected ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{c.flag}</span>
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{c.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {c.currency} ({c.currencyCode}) {cCode === 'DE' ? '· Deutsch' : '· English'}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                        </button>
                      );
                    })}
                    <div className="px-3 py-2 mt-1 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span className="truncate">{country.regulatorBadge}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Aureus Access Button */}
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                  title="Launch Aureus Capital"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aureus</span>
                </button>
              )}

              {/* User Sign In Button */}
              <button
                type="button"
                onClick={() => {
                  if (currentUser && onOpenDashboard) {
                    onOpenDashboard();
                  } else if (onOpenAuth) {
                    onOpenAuth();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                title={currentUser ? 'Sign In / My Loan Dashboard' : 'Sign In to Your Account'}
              >
                <User className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Sign In</span>
              </button>

              {/* Admin Dashboard Quick Access */}
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer shadow-xs shrink-0"
                  title="Admin Dashboard (Manage all loan applications, statuses, & chat support)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
