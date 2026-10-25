import React, { useState, useEffect } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { ArrowRight } from 'lucide-react';

interface StickyMobileCTAProps {
  currentCountry: CountryCode;
  onOpenForm: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  currentCountry,
  onOpenForm,
}) => {
  const [show, setShow] = useState(false);
  const isGerman = currentCountry === 'DE';
  const t = isGerman ? UI_TEXT.DE : UI_TEXT.EN;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 350;
          setShow((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <aside
      aria-label="Quick rate enquiry bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200"
      style={{ maxHeight: '60px' }}
    >
      <div className="flex flex-col truncate">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">
          {isGerman ? '10% Anzahlung · Direktzins' : '10% Down · Direct Rates'}
        </span>
        <span className="text-xs font-bold text-slate-900 font-mono truncate">
          {currentCountry === 'DE' ? 'ab 3,19% eff. p.a.' : currentCountry === 'UK' ? 'from 4.19% APR' : currentCountry === 'CA' ? 'from 4.49% Fixed' : 'from 5.39% p.a.'}
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenForm}
        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
      >
        <span>{t.stickyCta.button}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
