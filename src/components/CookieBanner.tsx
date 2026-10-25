import React, { useState, useEffect } from 'react';
import { CountryCode } from '../types';
import { UI_TEXT } from '../data/translations';
import { Cookie, X, ShieldCheck } from 'lucide-react';

interface CookieBannerProps {
  currentCountry: CountryCode;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  currentCountry,
  forceOpen = false,
  onCloseForceOpen,
}) => {
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('aureus_cookie_consent');
    } catch {
      // Storage access blocked in sandboxed iframe
    }
    if (!saved || forceOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [forceOpen]);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('aureus_cookie_consent', 'all');
    } catch {
      // Ignore
    }
    setVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('aureus_cookie_consent', 'essential');
    } catch {
      // Ignore
    }
    setVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 rounded-2xl bg-white/95 border-2 border-blue-200 shadow-2xl backdrop-blur-xl text-slate-900">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Cookie className="w-4 h-4 text-blue-600" />
            </div>
            <span>{t.cookie.title}</span>
          </div>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
          {t.cookie.desc}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all text-center whitespace-nowrap shadow-sm cursor-pointer"
          >
            {t.cookie.acceptAll}
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.cookie.essentialOnly}
          </button>
        </div>
      </div>
    </div>
  );
};
