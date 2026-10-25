import React, { useState } from 'react';
import { CountryCode } from '../types';
import { FAQ_EN, FAQ_DE, UI_TEXT } from '../data/translations';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQProps {
  currentCountry: CountryCode;
}

export const FAQ: React.FC<FAQProps> = ({ currentCountry }) => {
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;
  const faqList = currentCountry === 'DE' ? FAQ_DE : FAQ_EN;

  const [openId, setOpenId] = useState<string | null>(faqList[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.faq.sectionKicker}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {t.faq.sectionTitle}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            {t.faq.sectionSubtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqList.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-slate-900 pr-4 leading-snug">
                    <span className="text-blue-600 font-mono mr-2.5 text-xs font-semibold">
                      0{index + 1}.
                    </span>
                    {item.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 transition-transform duration-200 shadow-xs ${
                      isOpen ? 'rotate-180 bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm font-normal leading-relaxed border-t border-slate-200/60 bg-white">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
