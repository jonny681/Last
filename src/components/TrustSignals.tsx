import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES, PARTNERS_BY_COUNTRY, TESTIMONIALS_BY_COUNTRY, UI_TEXT } from '../data/translations';
import { Shield, Lock, Award, Building, Star, CheckCircle } from 'lucide-react';

interface TrustSignalsProps {
  currentCountry: CountryCode;
}

export const TrustSignals: React.FC<TrustSignalsProps> = ({ currentCountry }) => {
  const country = COUNTRIES[currentCountry];
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;
  const partners = PARTNERS_BY_COUNTRY[currentCountry];
  const testimonials = TESTIMONIALS_BY_COUNTRY[currentCountry];

  const pillarIcons = [Lock, Shield, Award, Building];

  return (
    <section id="trust" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-blue-600 uppercase mb-3">
            <span className="w-5 h-[1px] bg-blue-600" />
            <span>{t.trust.sectionKicker}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {t.trust.sectionTitle}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            {t.trust.sectionSubtitle}
          </p>
        </div>

        {/* Security Badges Grid (4 Pillars) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {t.trust.securityPillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-semibold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Partner Lenders Strip */}
        <div className="mb-24 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              {t.trust.lendersHeading} {country.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors flex flex-col items-center justify-center text-center group"
              >
                {/* Stylized Emblem */}
                <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-serif font-bold text-sm tracking-wider mb-2.5 group-hover:scale-105 transition-all">
                  {partner.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {partner.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {partner.tier}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-slate-600 font-normal">
            <span>{country.regulatorText}</span>
          </div>
        </div>

        {/* Testimonials Showcase (3 Cards) */}
        <div>
          <div className="max-w-3xl mb-12">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {t.trust.reviewsHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Loan Type */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-blue-500">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-blue-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-blue-800 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {test.amount} · {test.rate}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed italic mb-6">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                {/* Attributable Client Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-serif font-bold text-slate-900">
                      {test.name}
                    </div>
                    <div className="text-xs text-slate-600 font-normal">
                      {test.role} · {test.location}
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
