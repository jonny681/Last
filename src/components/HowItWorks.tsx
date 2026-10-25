import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { Sliders, Scale, Building2, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  currentCountry: CountryCode;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ currentCountry }) => {
  const country = COUNTRIES[currentCountry];
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;

  const steps = [
    {
      num: '01',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: Sliders,
      highlight: currentCountry === 'DE' ? 'In unter 90 Sekunden' : 'Takes < 90 seconds',
    },
    {
      num: '02',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: Scale,
      highlight: currentCountry === 'DE' ? 'Volle Zinstransparenz' : '100% Transparent APRs',
    },
    {
      num: '03',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: Building2,
      highlight: currentCountry === 'DE' ? 'Direkter Bankkontakt' : 'Senior Underwriter Match',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-blue-600 uppercase mb-3">
            <span className="w-5 h-[1px] bg-blue-600" />
            <span>{t.howItWorks.sectionKicker}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {t.howItWorks.sectionTitle}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            {t.howItWorks.sectionSubtitle}
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:border-blue-400 transition-all duration-300 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {/* Step Editorial Numbering & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-blue-700">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                    {step.title.replace(/^\d+\.\s*/, '')}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
