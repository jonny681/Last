import React, { useState, useEffect, useId } from 'react';
import { CountryCode, LoanType } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { Home, Car, ArrowRight, Info, CheckCircle2, Sparkles, Percent } from 'lucide-react';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface CalculatorProps {
  currentCountry: CountryCode;
  selectedLoanType: LoanType;
  onChangeLoanType: (type: LoanType) => void;
  onApplyWithCalculation: (type: LoanType, amount: number, term: number) => void;
  selectedAsset?: {
    type: LoanType;
    id: string;
    title: string;
    price: number;
  } | null;
  customAmount?: number;
  onClearSelectedAsset?: () => void;
  onBrowseAssets?: () => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currentCountry,
  selectedLoanType,
  onChangeLoanType,
  onApplyWithCalculation,
  selectedAsset,
  customAmount,
  onClearSelectedAsset,
  onBrowseAssets,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';
  const t = isGerman ? UI_TEXT.DE : UI_TEXT.EN;

  const config = selectedLoanType === 'home' ? country.homeLoan : country.carLoan;

  // Asset purchase price
  const [assetPrice, setAssetPrice] = useState<number>(customAmount || config.defaultAmount);
  // Upfront percentage requirement: starts at 10% minimum as required
  const [upfrontPercent, setUpfrontPercent] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(config.defaultRate);
  const [termYears, setTermYears] = useState<number>(config.defaultTerm);

  // Sync state when customAmount changes (e.g. user selected a home or car)
  useEffect(() => {
    if (customAmount && customAmount > 0) {
      setAssetPrice(customAmount);
    }
  }, [customAmount]);

  // Sync state when switching country or loan type (unless customAmount is active for this type)
  useEffect(() => {
    const currentCfg = selectedLoanType === 'home' ? country.homeLoan : country.carLoan;
    if (!customAmount || (selectedAsset && selectedAsset.type !== selectedLoanType)) {
      setAssetPrice(currentCfg.defaultAmount);
    }
    setInterestRate(currentCfg.defaultRate);
    setTermYears(currentCfg.defaultTerm);
  }, [currentCountry, selectedLoanType]);

  // Direct lending math:
  // Upfront payment to acquire asset (minimum 10%)
  const upfrontAmount = Math.round(assetPrice * (upfrontPercent / 100));
  // Net loan balance financed directly by Aureus Capital
  const financedAmount = Math.max(0, assetPrice - upfrontAmount);

  // Standard compound amortisation math on financed balance:
  // M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = termYears * 12;

  let monthlyPayment = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (financedAmount > 0 && totalMonths > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = financedAmount / totalMonths;
    } else {
      monthlyPayment =
        (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    totalRepayment = monthlyPayment * totalMonths;
    totalInterest = Math.max(0, totalRepayment - financedAmount);
  }

  // Format currency helpers
  const formatCurrency = (val: number, decimals: number = 0) => {
    return formatCurrencyCached(val, country.locale, country.currencyCode, decimals);
  };

  const totalCostOverall = upfrontAmount + totalRepayment;
  const upfrontRatio = totalCostOverall > 0 ? (upfrontAmount / totalCostOverall) * 100 : 10;
  const principalRatio = totalCostOverall > 0 ? (financedAmount / totalCostOverall) * 100 : 60;
  const interestRatio = totalCostOverall > 0 ? (totalInterest / totalCostOverall) * 100 : 30;

  const priceSliderId = useId();
  const upfrontSliderId = useId();
  const rateSliderId = useId();
  const termSliderId = useId();

  const upfrontPresets = [10, 15, 20, 25, 30, 40, 50];

  return (
    <section id="calculator" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-blue-600 uppercase mb-3">
            <span className="w-4 h-[1px] bg-blue-500" />
            <span>{t.calc.sectionKicker}</span>
            <span className="w-4 h-[1px] bg-blue-500" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {t.calc.sectionTitle}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light max-w-2xl mx-auto">
            {t.calc.sectionSubtitle}
          </p>

          {/* Badge for 10% Upfront Requirement */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mt-5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>
              {isGerman
                ? 'Anforderung: Nur 10 % Anzahlung erforderlich für den Vermögenserwerb'
                : 'Direct Requirement: Only 10% upfront payment required to acquire your asset'}
            </span>
          </div>

          {/* Active Asset Banner if Selected */}
          {selectedAsset && selectedAsset.type === selectedLoanType && (
            <div className="inline-flex items-center gap-3 px-4 py-2 mt-4 mx-auto rounded-xl bg-white border border-blue-300 text-xs text-slate-800 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>
                {isGerman ? 'Ausgewähltes Objekt:' : 'Financing Asset:'}{' '}
                <strong className="text-blue-900 font-semibold">{selectedAsset.title}</strong> ({formatCurrency(selectedAsset.price)})
              </span>
              {onBrowseAssets && (
                <button
                  type="button"
                  onClick={onBrowseAssets}
                  className="ml-2 underline text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {isGerman ? 'Anderes wählen' : 'Change'}
                </button>
              )}
            </div>
          )}

          {/* Interactive Loan Type Segmented Control */}
          <div className="inline-flex p-1.5 mt-8 rounded-xl bg-slate-200/90 border border-slate-300 shadow-inner">
            <button
              type="button"
              onClick={() => onChangeLoanType('home')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedLoanType === 'home'
                  ? 'bg-slate-900 text-white font-bold shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.calc.tabHome}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeLoanType('car')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedLoanType === 'car'
                  ? 'bg-slate-900 text-white font-bold shadow-md'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{t.calc.tabCar}</span>
            </button>
          </div>
        </div>

        {/* Calculator Grid: Controls on Left (7 cols), Realtime Output on Right (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-7 text-slate-900">
            {/* Control 1: Asset Purchase Price */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor={priceSliderId} className="text-sm font-semibold text-slate-800">
                  {t.calc.assetPriceLabel}
                </label>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 shadow-xs">
                  <span className="font-mono text-sm sm:text-base font-bold text-blue-700 tabular-nums">
                    {formatCurrency(assetPrice)}
                  </span>
                </div>
              </div>
              <input
                id={priceSliderId}
                type="range"
                min={config.min}
                max={config.max}
                step={selectedLoanType === 'home' ? 5000 : 1000}
                value={assetPrice}
                onChange={(e) => setAssetPrice(Number(e.target.value))}
                className="w-full h-2 my-2 cursor-pointer accent-blue-600"
                aria-label="Asset Purchase Price Slider"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1">
                <span>{formatCurrency(config.min)}</span>
                <span>{formatCurrency(config.max)}</span>
              </div>
            </div>

            {/* Control 2: Upfront Payment Percentage (Starts from 10% minimum) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200 relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <label htmlFor={upfrontSliderId} className="text-xs sm:text-sm font-semibold text-slate-800">
                    {t.calc.upfrontPercentLabel}
                  </label>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-blue-300 shadow-xs">
                  <span className="font-mono text-sm sm:text-base font-bold text-blue-700 tabular-nums">
                    {upfrontPercent}%
                  </span>
                  <span className="text-xs font-mono text-slate-600">
                    ({formatCurrency(upfrontAmount)})
                  </span>
                </div>
              </div>

              {/* Slider starting from 10% */}
              <input
                id={upfrontSliderId}
                type="range"
                min={10}
                max={70}
                step={1}
                value={upfrontPercent}
                onChange={(e) => setUpfrontPercent(Number(e.target.value))}
                className="w-full h-2 my-2 cursor-pointer accent-blue-600"
                aria-label="Upfront Payment Percentage Slider"
              />

              {/* Preset buttons */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
                <span className="text-[11px] text-slate-600 mr-1 font-medium">
                  {isGerman ? 'Auswahl:' : 'Quick Select:'}
                </span>
                {upfrontPresets.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setUpfrontPercent(pct)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      upfrontPercent === pct
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {pct}% {pct === 10 ? (isGerman ? '(Min)' : '(Min req.)') : ''}
                  </button>
                ))}
              </div>

              {/* Readout of Split */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-blue-200/60 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-600 block text-[11px] font-medium">
                    {t.calc.upfrontAmountLabel} ({upfrontPercent}%)
                  </span>
                  <span className="font-mono font-bold text-blue-800 text-sm">
                    {formatCurrency(upfrontAmount)}
                  </span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-slate-600 block text-[11px] font-medium">
                    {t.calc.financedAmountLabel} ({100 - upfrontPercent}%)
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(financedAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Control 3: Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor={rateSliderId} className="text-sm font-semibold text-slate-800">
                  {t.calc.interestRateLabel}
                </label>
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 shadow-xs">
                  <span className="font-mono text-sm sm:text-base font-bold text-blue-700 tabular-nums">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
              </div>
              <input
                id={rateSliderId}
                type="range"
                min={1.5}
                max={14.0}
                step={0.05}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 my-2 cursor-pointer accent-blue-600"
                aria-label="Interest Rate Slider"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1">
                <span>1.50%</span>
                <span>14.00%</span>
              </div>
            </div>

            {/* Control 4: Loan Term */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor={termSliderId} className="text-sm font-semibold text-slate-800">
                  {t.calc.termLabel}
                </label>
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 shadow-xs">
                  <span className="font-mono text-sm sm:text-base font-bold text-blue-700 tabular-nums">
                    {termYears} {t.calc.years} ({termYears * 12} {isGerman ? 'Monate' : 'mo'})
                  </span>
                </div>
              </div>
              <input
                id={termSliderId}
                type="range"
                min={config.terms[0]}
                max={config.terms[config.terms.length - 1]}
                step={1}
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full h-2 my-2 cursor-pointer accent-blue-600"
                aria-label="Loan Term Slider"
              />
              {/* Term Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {config.terms.map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTermYears(yr)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                      termYears === yr
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300'
                    }`}
                  >
                    {yr}y
                  </button>
                ))}
              </div>
            </div>

            {/* Live Model Notice */}
            <div className="pt-3 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600 font-light">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{t.calc.liveNotice}</span>
            </div>
          </div>

          {/* Results Summary Card: Crisp White & Blue Theme */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-50/70 via-white to-white p-6 sm:p-8 rounded-3xl border-2 border-blue-200 shadow-xl flex flex-col justify-between relative text-slate-900">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/5 rounded-bl-full pointer-events-none" />

            <div>
              {/* Monthly Repayment Hero */}
              <div className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-1">
                {t.calc.monthlyPayment}
              </div>
              <div className="text-3xl sm:text-5xl font-serif font-bold text-blue-700 tabular-nums tracking-tight my-2">
                {formatCurrency(monthlyPayment, 2)}
                <span className="text-xs sm:text-sm font-sans font-normal text-slate-600 ml-1.5">
                  / {isGerman ? 'Monat' : 'month'}
                </span>
              </div>

              {/* Clear Highlight Card for the 10% Upfront Requirement */}
              <div className="mt-5 p-4 rounded-2xl bg-white border-2 border-blue-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    {isGerman ? 'Anzahlung (Erforderlich):' : 'Upfront Down Payment:'}
                  </span>
                  <span className="font-mono font-bold text-blue-700 text-sm tabular-nums">
                    {formatCurrency(upfrontAmount)} ({upfrontPercent}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">
                    {isGerman ? 'Von Aureus finanziertes Darlehen:' : 'Direct Loan by Aureus:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(financedAmount)} ({100 - upfrontPercent}%)
                  </span>
                </div>
              </div>

              {/* Total Metrics Stack */}
              <div className="mt-6 space-y-3 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600">{t.calc.totalInterest}</span>
                  <span className="font-mono font-semibold text-slate-800 tabular-nums">
                    {formatCurrency(totalInterest, 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600">{t.calc.totalRepayment}</span>
                  <span className="font-mono font-bold text-blue-700 tabular-nums">
                    {formatCurrency(totalRepayment, 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200">
                  <span className="text-slate-800 font-bold">
                    {isGerman ? 'Gesamtaufwand (Anzahlung + Kredit):' : 'Total Acquisition Outlay:'}
                  </span>
                  <span className="font-mono font-bold text-blue-900 tabular-nums text-sm sm:text-base">
                    {formatCurrency(totalCostOverall, 0)}
                  </span>
                </div>
              </div>

              {/* Visual Proportion Breakdown */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-medium">{t.calc.repaymentBreakdown}</span>
                  <span className="font-mono text-slate-700 text-[11px] font-semibold">
                    {upfrontRatio.toFixed(0)}% Down / {principalRatio.toFixed(0)}% Loan / {interestRatio.toFixed(0)}% Int
                  </span>
                </div>

                {/* Triple Segment Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-300">
                  <div
                    style={{ width: `${upfrontRatio}%` }}
                    className="h-full bg-blue-600 rounded-l-full transition-all duration-300"
                    title={`Upfront: ${formatCurrency(upfrontAmount)}`}
                  />
                  <div
                    style={{ width: `${principalRatio}%` }}
                    className="h-full bg-blue-400 transition-all duration-300"
                    title={`Loan: ${formatCurrency(financedAmount)}`}
                  />
                  <div
                    style={{ width: `${interestRatio}%` }}
                    className="h-full bg-slate-300 rounded-r-full transition-all duration-300"
                    title={`Interest: ${formatCurrency(totalInterest)}`}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-600 mt-2 font-mono font-medium">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Down: {formatCurrency(upfrontAmount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Loan: {formatCurrency(financedAmount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Int: {formatCurrency(totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply With Parameters CTA */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => onApplyWithCalculation(selectedLoanType, assetPrice, termYears)}
                className="w-full py-4 px-6 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.calc.applyPrepopBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
