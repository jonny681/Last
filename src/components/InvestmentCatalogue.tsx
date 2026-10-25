import React, { useState } from 'react';
import { CountryCode, InvestmentPlan } from '../types';
import { COUNTRIES } from '../data/translations';
import { INVESTMENT_TIERS } from '../data/investmentPlans';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Lock,
  Building,
  Car,
  PieChart,
  Sliders,
  FileText,
} from 'lucide-react';
import { InvestmentTermsModal } from './InvestmentTermsModal';

interface InvestmentCatalogueProps {
  currentCountry: CountryCode;
  onOpenDashboard?: () => void;
  onApplyForPlan?: (planTitle: string, amount: number) => void;
}

export const InvestmentCatalogue: React.FC<InvestmentCatalogueProps> = ({
  currentCountry,
  onOpenDashboard,
  onApplyForPlan,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [selectedDuration, setSelectedDuration] = useState<6 | 12>(12);
  const [selectedCapital, setSelectedCapital] = useState<number>(25000);
  const [payoutMode, setPayoutMode] = useState<'monthly' | 'compounding'>('monthly');

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

  // APY rate based on capital tier
  const getAPY = (amount: number, duration: 6 | 12) => {
    let baseRate = 8.4;
    if (amount >= 100000) baseRate = 14.8;
    else if (amount >= 50000) baseRate = 12.6;
    else if (amount >= 25000) baseRate = 11.2;
    else baseRate = 8.4;

    return duration === 12 ? baseRate : baseRate - 1.2;
  };

  const currentAPY = getAPY(selectedCapital, selectedDuration);
  const annualYield = selectedCapital * (currentAPY / 100);
  const netGain = Math.round(annualYield * (selectedDuration / 12));
  const totalReturn = selectedCapital + netGain;
  const monthlyPayout = Math.round(annualYield / 12);

  const handleOpenTerms = (price: number) => {
    setModalTierPrice(price);
    setModalMode('terms');
    setIsTermsModalOpen(true);
  };

  const handleOpenRequest = (price: number) => {
    setModalTierPrice(price);
    setModalMode('request');
    setIsTermsModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50/50 py-10 sm:py-16 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Block: Framer / Land-book standard */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-blue-600 uppercase">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>{isGerman ? 'Vermögensverwaltung & Zinsertrag' : 'Institutional Wealth & Yield Desk'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">
                {isGerman ? '100% Sachwertbesichert' : '100% Asset-Backed'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-950 tracking-tight">
              {isGerman
                ? 'Passives Einkommen erzielen im Schlaf'
                : 'Earn Passive Yield While You Sleep'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isGerman
                ? 'Investieren Sie in unsere besicherten Kreditfazilitäten für Luxusimmobilien und Sportwagen. Feste Zinsen von 8,4% bis 15,6% p.a. mit monatlicher Ausschüttung direkt auf Ihr Bankkonto.'
                : 'Deploy capital directly into asset-backed credit facilities secured 100% by physical title liens on prime residences and luxury vehicles. Fixed yields from 8.4% to 15.6% APY with monthly distribution.'}
            </p>
          </div>

          {/* Quick Security Badge */}
          <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">First-Priority Physical Liens</div>
              <div className="text-[11px] text-slate-500 font-mono">Real Estate & Supercar Deeds</div>
            </div>
          </div>
        </div>

        {/* Live Interactive In-App Yield Modeler */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Live Yield Calculator & Distribution Modeler
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Calculate expected passive interest income based on your deployment tier and duration.
              </p>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedDuration(12)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDuration === 12
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                12-Month Facility (Max APY)
              </button>
              <button
                type="button"
                onClick={() => setSelectedDuration(6)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDuration === 6
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                6-Month Facility (Fast Liquidity)
              </button>
            </div>
          </div>

          {/* Capital Slider and Presets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Capital Deployment Amount
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-blue-700 font-mono">
                {formatCurrency(selectedCapital)}
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={10000}
              max={250000}
              step={5000}
              value={selectedCapital}
              onChange={(e) => setSelectedCapital(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              {[10000, 25000, 50000, 100000, 250000].map((amt) => {
                const isSelected = selectedCapital === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedCapital(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Calculation Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Fixed APY Rate</div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {currentAPY.toFixed(1)}% <span className="text-xs font-normal text-slate-600">p.a.</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Guaranteed by physical lien</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Monthly Cash Payout</div>
              <div className="text-2xl font-serif font-bold text-blue-700 mt-1">
                {formatCurrency(monthlyPayout)}
                <span className="text-xs font-normal text-slate-600">/mo</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Direct to your bank account</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Net Yield Gain</div>
              <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">
                +{formatCurrency(netGain)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Over {selectedDuration} months</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Total Return (Principal + Profit)</div>
              <div className="text-2xl font-serif font-bold text-slate-900 mt-1">
                {formatCurrency(totalReturn)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Returned at facility maturity</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero management fees · Instant automated contract issuance · 30-day early liquidity option</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleOpenTerms(selectedCapital)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                View Terms Sheet
              </button>
              <button
                type="button"
                onClick={() => handleOpenRequest(selectedCapital)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Allocate Capital</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* The 4 Institutional Vault Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Institutional Vault Classes
            </h3>
            <span className="text-xs font-mono text-slate-500">4 Capital Tranches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INVESTMENT_TIERS.map((tier) => {
              const rateData = tier.rates[selectedDuration];
              const isSelected = selectedCapital === tier.price;

              return (
                <div
                  key={tier.id}
                  className={`group rounded-3xl bg-white border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200/90 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold">
                        {tier.tier.split('·')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {rateData.ratePercent.toFixed(1)}% APY
                      </span>
                    </div>

                    {/* Capital Price */}
                    <div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-slate-950">
                        {formatCurrency(tier.price)}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-medium">
                        {tier.name}
                      </div>
                    </div>

                    {/* Return Highlights Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Monthly Payout:</span>
                        <span className="font-mono font-bold text-blue-700">
                          {formatCurrency(rateData.monthlyPayout)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Net Profit:</span>
                        <span className="font-mono font-bold text-emerald-700">
                          +{formatCurrency(rateData.gain)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200">
                        <span className="text-slate-900 font-bold">Total Return:</span>
                        <span className="font-mono font-bold text-slate-900">
                          {formatCurrency(rateData.yieldTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="space-y-2 text-xs text-slate-600">
                      {tier.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col gap-2 mt-5">
                    <button
                      type="button"
                      onClick={() => handleOpenTerms(tier.price)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Legal Terms
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenRequest(tier.price)}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Allocate {formatCurrency(tier.price)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal for Terms and Capital Allocation */}
        <InvestmentTermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          currentCountry={currentCountry}
          selectedTierPrice={modalTierPrice}
          initialMode={modalMode}
          onOpenDashboard={onOpenDashboard}
        />
      </div>
    </div>
  );
};
