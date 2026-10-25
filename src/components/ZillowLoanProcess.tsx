import React, { useState } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  FileText,
  Flag,
  Landmark,
  Home,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

interface ZillowLoanProcessProps {
  currentCountry: CountryCode;
  onOpenPreApproval: (product?: string) => void;
  onOpenSampleTerms: (product?: string) => void;
  onOpenCustomBudget?: () => void;
}

export const ZillowLoanProcess: React.FC<ZillowLoanProcessProps> = ({
  currentCountry,
  onOpenPreApproval,
  onOpenSampleTerms,
  onOpenCustomBudget,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const loanProducts = [
    {
      id: '30-year-fixed',
      title: isGerman ? '30 Jahre Festzins' : '30-Year Fixed',
      badge: isGerman ? 'Sehr beliebt' : 'Most popular',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      rate: '5.875%',
      apr: '6.164%',
      points: '1.483 ($4,078.25)',
      bullets: [
        isGerman ? '10% Mindestanzahlung zum Erwerb' : '10% min down payment to acquire',
        isGerman ? 'Feste Zinssätze über die gesamte Laufzeit' : 'Predictable monthly principal & interest',
        isGerman ? 'Keine versteckten Gebühren oder Vorfälligkeitsstrafen' : 'No hidden fees or prepayment penalties',
      ],
    },
    {
      id: '20-year-fixed',
      title: isGerman ? '20 Jahre Festzins' : '20-Year Fixed',
      badge: isGerman ? 'Zinsersparnis' : 'Save on interest',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rate: '5.625%',
      apr: '5.839%',
      points: '1.250 ($3,450.00)',
      bullets: [
        isGerman ? 'Schneller Vermögensaufbau' : 'Pay off your balance faster',
        isGerman ? 'Attraktiverer Zinssatz als bei 30 Jahren' : 'Lower interest rate than 30-year fixed',
        isGerman ? '10% Anzahlung sofort verfügbar' : '10% down payment standard',
      ],
    },
    {
      id: '15-year-fixed',
      title: isGerman ? '15 Jahre Festzins' : '15-Year Fixed',
      badge: isGerman ? 'Schnellste Tilgung' : 'Fastest payoff',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      rate: '5.125%',
      apr: '5.412%',
      points: '1.120 ($3,120.00)',
      bullets: [
        isGerman ? 'Niedrigster Festzins' : 'Lowest fixed interest rate',
        isGerman ? 'Halbierung der Laufzeit' : 'Own your residence outright in 15 years',
        isGerman ? 'Massive Zinsersparnis' : 'Save tens of thousands in lifetime interest',
      ],
    },
    {
      id: '7-1-arm',
      title: isGerman ? '7/1 Fest-Variabel' : '7/1 ARM Adjustable',
      badge: isGerman ? 'Flexibel' : 'Flexibility',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      rate: '5.250%',
      apr: '6.420%',
      points: '1.050 ($2,890.00)',
      bullets: [
        isGerman ? '7 Jahre fester Zinssatz' : 'Fixed initial rate for first 7 years',
        isGerman ? 'Geringere Anfangsraten' : 'Lower initial monthly payments',
        isGerman ? 'Ideal bei geplantem Verkauf nach 5-7 Jahren' : 'Ideal for short-to-medium term plans',
      ],
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* SECTION 1: HEADER & GET PRE-APPROVED CALLOUT */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <span>Direct Lending Facility</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {isGerman
              ? 'Erhalten Sie ein Darlehen bei Aureus Loans'
              : 'Get a loan with Aureus Home & Auto Loans'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {isGerman
              ? 'Transparente Zinsen, keine versteckten Gebühren und kompetente Betreuung bei jedem Schritt.'
              : 'Competitive rates, no hidden fees, and guidance at every step across 4 sovereign jurisdictions so you can acquire with confidence.'}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenPreApproval()}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{isGerman ? 'Vorabgenehmigung einholen (Jetzt)' : 'Get pre-approved (Now)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECTION 2: HOW TO GET A MORTGAGE WITH 4-STEP CONTAINER */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {isGerman ? 'Wie Sie ein Darlehen erhalten' : 'How to get a mortgage with Aureus Loans'}
            </h3>
            <p className="text-slate-600 text-sm mt-1.5">
              {isGerman
                ? 'Geben Sie souverän starke Angebote mit einem verifizierten Vorabgenehmigungsschreiben ab.'
                : 'Confidently make strong offers with a verified pre-approval letter.'}
            </p>
          </div>

          {/* 4-Step Container */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-blue-50/50 border-2 border-blue-200 p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isGerman ? '1. Vorabgenehmigung (Jetzt)' : '1. Get pre-approved (Now)'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isGerman
                      ? 'Geben Sie starke Kaufangebote mit unserem verifizierten Vorabgenehmigungsbrief ab.'
                      : 'Make strong offers on homes and cars with a Verified Pre-approval letter from us.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Flag className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isGerman ? '2. Angebot abgeben' : '2. Make an offer'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isGerman
                      ? 'Prüfen Sie, ob das Wunschobjekt in Ihr Budget passt, und legen Sie den optimalen Kaufpreis fest.'
                      : 'Confirm that a home fits your budget with us and determine a fair offer price.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isGerman ? '3. Kredit beantragen' : '3. Apply for a mortgage'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isGerman
                      ? 'Sobald Ihr Angebot angenommen wurde, schließen Sie den finalen Kreditantrag bei uns ab.'
                      : 'After your offer is accepted, complete your full loan application with us.'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-white text-slate-900 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isGerman ? '4. Abschluss & Übergabe' : '4. Close on your home'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isGerman
                      ? 'Herzlichen Glückwunsch! Unterzeichnen Sie die Unterlagen, und wir finalisieren die Auszahlung.'
                      : "Congrats, owner! Sign the closing paperwork and we'll finalize the financing."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => onOpenPreApproval()}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{isGerman ? 'Jetzt Vorabgenehmigung starten (Schritte 1-4)' : 'Start 4-Step Pre-Approval (Now)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: WHY CHOOSE AUREUS HOME LOANS */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {isGerman ? 'Warum Aureus Loans wählen?' : 'Why choose Aureus Home Loans?'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {isGerman ? 'Attraktive Konditionen' : 'Competitive rates'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
                {isGerman
                  ? 'Führende Zinssätze, keine versteckten Gebühren und absolute Transparenz.'
                  : 'Institutional benchmark rates, no hidden fees, and total transparency.'}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {isGerman ? 'Nur 10% Anzahlung erforderlich' : 'Low down payment options'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
                {isGerman
                  ? 'Wir bieten maßgeschneiderte Finanzierungsoptionen mit nur 10% Anzahlung.'
                  : 'Acquire high-value residences and performance vehicles with only 10% upfront payment.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: FIND THE RIGHT MORTGAGE CARDS */}
        <div className="space-y-8" id="rates-comparison">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {isGerman ? 'Finden Sie den passenden Kredit' : 'Find the right mortgage with Aureus Loans'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
              {isGerman
                ? 'Vergleichen Sie Konditionen für exklusive Immobilien und Fahrzeuge.'
                : 'Compare financing options across our premier residences and prestige vehicles.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-blue-400 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-900">{prod.title}</h4>
                  <span className={`inline-block text-[11px] font-mono font-semibold px-2 py-0.5 rounded border mt-1.5 mb-4 ${prod.badgeColor}`}>
                    {prod.badge}
                  </span>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-mono">{isGerman ? 'Zinssatz' : 'Rate'}</div>
                        <div className="text-lg font-bold text-blue-700">{prod.rate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">{isGerman ? 'Eff. Zins' : 'APR'}</div>
                        <div className="text-lg font-bold text-slate-900">{prod.apr}</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                      <span>{isGerman ? 'Kosten/Punkte:' : 'Points (cost):'}</span> {prod.points}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 text-xs text-slate-600">
                    {prod.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action: Item (29) removed 'See sample loan terms' at the down part */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenPreApproval(prod.title)}
                    className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{isGerman ? 'Vorabgenehmigung (Jetzt)' : 'Get Pre-Approved Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
