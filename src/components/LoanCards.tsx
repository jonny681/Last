import React from 'react';
import { CountryCode, LoanType } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { Home, Car, Check, ArrowRight, Sparkles } from 'lucide-react';
import homeCardImg from '../assets/images/card_home_loan_1791145368362.jpg';
import carCardImg from '../assets/images/card_car_loan_1791145379615.jpg';

interface LoanCardsProps {
  currentCountry: CountryCode;
  onSelectLoanForCalculator: (type: LoanType) => void;
  onSelectLoanForForm: (type: LoanType) => void;
}

export const LoanCards: React.FC<LoanCardsProps> = ({
  currentCountry,
  onSelectLoanForCalculator,
  onSelectLoanForForm,
}) => {
  const country = COUNTRIES[currentCountry];
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;

  return (
    <section id="solutions" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-slate-900 uppercase mb-3">
            <span className="w-5 h-[1px] bg-slate-900" />
            <span>{t.cards.sectionTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {currentCountry === 'DE'
              ? 'Direkte Bilanzfinanzierung für Immobilien und Automobile'
              : 'Direct Balance Sheet Financing for Homes and Prestige Vehicles'}
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg font-light leading-relaxed">
            {t.cards.sectionSubtitle}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <span>{currentCountry === 'DE' ? 'Standardanforderung: Nur 10% Anzahlung für den Vermögenserwerb' : 'Standard Requirement: Only 10% upfront payment required to acquire'}</span>
          </div>
        </div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Home Loans */}
          <div className="group rounded-3xl bg-white border border-slate-200 hover:border-slate-400 transition-all duration-300 overflow-hidden shadow-lg flex flex-col justify-between">
            {/* Visual Aspect 16:9 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={homeCardImg}
                alt="Luxury architectural residence for prime home financing"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-medium text-slate-900 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Home className="w-3.5 h-3.5 text-slate-800" />
                  <span>{currentCountry === 'DE' ? 'Immobilien & Neubau' : 'Residential & Portfolio'}</span>
                </span>
                <span className="font-mono text-slate-900 font-bold">{country.homeLoan.badge}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
                  {t.cards.homeTitle}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  {t.cards.homeDesc}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  {t.cards.homeBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-slate-900" />
                      </div>
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onSelectLoanForCalculator('home')}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all text-center cursor-pointer"
                >
                  {t.cards.calculateBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLoanForForm('home')}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.cards.applyBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Car Loans */}
          <div className="group rounded-3xl bg-white border border-slate-200 hover:border-slate-400 transition-all duration-300 overflow-hidden shadow-lg flex flex-col justify-between">
            {/* Visual Aspect 16:9 */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
              <img
                src={carCardImg}
                alt="Luxury performance sports vehicle for auto loan comparison"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-medium text-slate-900 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Car className="w-3.5 h-3.5 text-slate-800" />
                  <span>{currentCountry === 'DE' ? 'Sportwagen & Fuhrpark' : 'Prestige & Performance'}</span>
                </span>
                <span className="font-mono text-slate-900 font-bold">{country.carLoan.badge}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
                  {t.cards.carTitle}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  {t.cards.carDesc}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  {t.cards.carBenefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-slate-900" />
                      </div>
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onSelectLoanForCalculator('car')}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all text-center cursor-pointer"
                >
                  {t.cards.calculateBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLoanForForm('car')}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.cards.applyBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
