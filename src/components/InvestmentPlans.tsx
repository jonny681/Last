import React, { useState } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  INVESTMENT_TIERS,
  InvestmentTierConfig,
  calculateTierYield,
} from '../data/investmentPlans';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Home,
  Car,
  Lock,
} from 'lucide-react';
import { InvestmentTermsModal } from './InvestmentTermsModal';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface InvestmentPlansProps {
  currentCountry: CountryCode;
  onOpenDashboard?: () => void;
  onOpenTermsModal?: (price: number) => void;
}

export const InvestmentPlans: React.FC<InvestmentPlansProps> = ({
  currentCountry,
  onOpenDashboard,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [selectedDuration, setSelectedDuration] = useState<6 | 12>(12);
  const [selectedPrice, setSelectedPrice] = useState<10000 | 25000 | 50000 | 100000>(25000);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [modalTierPrice, setModalTierPrice] = useState<number>(25000);
  const [modalMode, setModalMode] = useState<'terms' | 'request'>('terms');

  const formatCurrency = (val: number) => {
    return formatCurrencyCached(
      val,
      country.locale || (currentCountry === 'DE' ? 'de-DE' : 'en-US'),
      country.currencyCode || 'USD',
      0
    );
  };

  const handleOpenInvestmentTerms = (tierPrice: number) => {
    setModalTierPrice(tierPrice);
    setModalMode('terms');
    setIsTermsModalOpen(true);
  };

  const handleOpenInvestmentRequest = (tierPrice: number) => {
    setModalTierPrice(tierPrice);
    setModalMode('request');
    setIsTermsModalOpen(true);
  };

  return (
    <section id="investment-plans" className="py-20 sm:py-24 bg-white border-b border-slate-200 relative overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Prompt Copy */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <span>High-Yield Private Liquidity & Retirement</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-4">
            You want to earn while you sleep?{' '}
            <span className="text-slate-900 font-bold italic block sm:inline">
              Invest in our homes and cars.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            {isGerman
              ? 'Möchten Sie im Schlaf passiv verdienen? Investieren Sie in unsere kuratierten Immobilien und Luxusautos – oder lassen Sie uns Ihre private Altersvorsorge strukturiert und besichert planen.'
              : 'Or do you want us to plan your retirement? Deploy capital directly into our asset-backed loan facilities secured 100% by physical title liens on luxury properties and high-performance vehicles across 4 sovereign nations.'}
          </p>

          {/* Duration Switcher (12 Months vs 6 Months) */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Yield Horizon:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedDuration(12)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedDuration === 12
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                12 Months Facility (Max Yield)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration(6)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedDuration === 6
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                6 Months Facility (Faster Liquidity)
              </button>
            </div>
            <span className="text-xs font-mono text-slate-800 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              4 Prices: $10k · $25k · $50k · $100k
            </span>
          </div>
        </div>

        {/* 4 Investment Price Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {INVESTMENT_TIERS.map((tier) => {
            const isSelected = selectedPrice === tier.price;
            const rateData = tier.rates[selectedDuration];
            const yieldTotal = rateData.yieldTotal;
            const gain = rateData.gain;
            const ratePercent = rateData.ratePercent;
            const monthlyPayout = rateData.monthlyPayout;

            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPrice(tier.price)}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-50 border-2 border-slate-900 shadow-md scale-[1.02] ring-2 ring-slate-400/20'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-400 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Badge & Tier Label */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-800 font-mono">
                      {tier.tier.split('·')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {tier.badge.split(' ')[0]}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {formatCurrency(tier.price)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {tier.name}
                  </div>

                  {/* Guaranteed Total Yield Box */}
                  <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-slate-500">
                      {selectedDuration}-Month Guaranteed Return:
                    </div>
                    <div className="text-3xl font-serif font-bold text-slate-900 tabular-nums">
                      {formatCurrency(yieldTotal)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-200 font-medium">
                      <span>Net Profit:</span>
                      <span className="text-emerald-700 font-bold font-mono">+{formatCurrency(gain)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                      <span>Yield Rate:</span>
                      <span className="text-slate-900 font-bold font-mono">{ratePercent.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-800 font-medium pt-1">
                      <span>Monthly Payout:</span>
                      <span className="font-bold font-mono">{formatCurrency(monthlyPayout)}/mo</span>
                    </div>
                  </div>

                  {/* Collateral Tag */}
                  <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-start gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>100% Backed by Physical Title to Prime Homes & Luxury Cars</span>
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-1.5 mb-6 text-xs text-slate-600">
                    {tier.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Buttons: Button 1 = Investment Terms, Button 2 = Investment Request */}
                <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInvestmentTerms(tier.price);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                    <span>Investment Terms</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInvestmentRequest(tier.price);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Investment Request & Requirements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Investment Terms Summary Banner */}
        <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Official Aureus Investment Terms & Collateral Safeguards
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              All 4 investment facilities ($10,000, $25,000, $50,000, and $100,000) are backed by physical first liens and titles to registered homes and vehicles in our portfolio. Choose passive monthly yield direct to your bank account or structured private retirement wealth accumulation.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenInvestmentRequest(selectedPrice)}
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>Invest with Guaranteed Terms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Investment Terms & Allocation Modal */}
      <InvestmentTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        currentCountry={currentCountry}
        selectedTierPrice={modalTierPrice}
        initialMode={modalMode}
        onOpenDashboard={onOpenDashboard}
      />
    </section>
  );
};
