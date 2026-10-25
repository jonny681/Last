import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import { X, ArrowLeft, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

interface SampleLoanTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
  onGetPreApproved: () => void;
  selectedProduct?: string;
}

export const SampleLoanTermsModal: React.FC<SampleLoanTermsModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  onGetPreApproved,
  selectedProduct = '30-Year Fixed',
}) => {
  if (!isOpen) return null;

  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const sampleLoanAmount = 450000;
  const downPayment = Math.round(sampleLoanAmount * 0.10); // 10%
  const financedAmount = sampleLoanAmount - downPayment;

  // Monthly calculation helpers
  const calcMonthly = (principal: number, ratePercent: number, years: number) => {
    const monthlyRate = ratePercent / 100 / 12;
    const totalMonths = years * 12;
    const m = (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(m);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] text-slate-900">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isGerman ? 'Zurück' : 'Back'}</span>
          </button>

          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{isGerman ? 'Muster-Kreditkonditionen' : 'Sample Loan Terms'}</span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Regulatory Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>{isGerman ? 'Wichtige gesetzliche Beispielangaben' : 'Standard Representative APR Disclosure'}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {isGerman
                ? 'Ihr effektiver Jahreszins und die Konditionen hängen von den spezifischen Merkmalen Ihrer Transaktion sowie Ihrer individuellen Bonitätshistorie ab. Diese Zahlen dienen ausschließlich Schätzungszwecken und stellen keine rechtsverbindliche Kreditzusage dar.'
                : "Your loan's interest rate and APR will depend upon the specific characteristics of your transaction and your individual credit history. These figures are for estimation purposes only and may not reflect the exact terms of your loan. This is not a commitment to lend."}
            </p>
            <div className="font-mono text-[11px] text-blue-700 font-semibold">
              {isGerman ? 'Zinssätze aktuell zum:' : 'Rates current as of:'} 10/8/2026.
            </div>
          </div>

          {/* Example 1: 30-Year Fixed Loan */}
          <div className={`p-5 rounded-2xl border transition-all ${selectedProduct.includes('30-Year') ? 'bg-blue-50/70 border-2 border-blue-600 shadow-xs' : 'bg-white border-2 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? '30 Jahre Festzins Darlehen' : '30-Year Fixed Rate Conventional Loan Example'}
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {isGerman ? 'Sehr beliebt' : 'Most popular'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              {isGerman
                ? `Zinssatz von 4,875% (5,164% eff. Jahreszins) berechnet für ein Immobiliendarlehen von ${formatCurrency(financedAmount)} bei einem Gesamtkaufpreis von ${formatCurrency(sampleLoanAmount)}.`
                : `Interest rate of 5.875% (6.164% APR) calculated for a mortgage loan of ${formatCurrency(financedAmount)} based on a purchase price of ${formatCurrency(sampleLoanAmount)}.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-200 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Monatlich' : 'Monthly Payment'}</div>
                <div className="text-sm font-bold text-blue-700">{formatCurrency(calcMonthly(financedAmount, 5.875, 30))}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? '10% Anzahlung' : '10% Down Payment'}</div>
                <div className="text-sm font-bold text-slate-900">{formatCurrency(downPayment)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Zins / APR' : 'Rate / APR'}</div>
                <div className="text-sm font-bold text-slate-900">5.875% / 6.16%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Laufzeit' : 'Term'}</div>
                <div className="text-sm font-bold text-slate-900">30 Years</div>
              </div>
            </div>
          </div>

          {/* Example 2: 20-Year Fixed Loan */}
          <div className={`p-5 rounded-2xl border transition-all ${selectedProduct.includes('20-Year') ? 'bg-blue-50/70 border-2 border-blue-600 shadow-xs' : 'bg-white border-2 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? '20 Jahre Festzins Darlehen' : '20-Year Fixed Rate Loan Example'}
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {isGerman ? 'Zinsersparnis' : 'Save on interest'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              {isGerman
                ? `Niedrigerer Gesamtzins durch kürzere Laufzeit. Erfordert standardmäßig nur 10% Anzahlung.`
                : `Pay less total interest due to shorter amortization term. Requires only 10% upfront payment.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-200 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Monatlich' : 'Monthly Payment'}</div>
                <div className="text-sm font-bold text-blue-700">{formatCurrency(calcMonthly(financedAmount, 5.625, 20))}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? '10% Anzahlung' : '10% Down Payment'}</div>
                <div className="text-sm font-bold text-slate-900">{formatCurrency(downPayment)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Zins / APR' : 'Rate / APR'}</div>
                <div className="text-sm font-bold text-slate-900">5.625% / 5.84%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Laufzeit' : 'Term'}</div>
                <div className="text-sm font-bold text-slate-900">20 Years</div>
              </div>
            </div>
          </div>

          {/* Example 3: 15-Year Fixed Loan */}
          <div className={`p-5 rounded-2xl border transition-all ${selectedProduct.includes('15-Year') ? 'bg-blue-50/70 border-2 border-blue-600 shadow-xs' : 'bg-white border-2 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? '15 Jahre Festzins Darlehen' : '15-Year Fixed Rate Conventional Loan Example'}
              </h3>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {isGerman ? 'Schnelle Tilgung' : 'Faster payoff'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              {isGerman
                ? `Zinssatz von 5,125% (5,389% APR). Maximal beschleunigter Vermögensaufbau.`
                : `Interest rate of 5.125% (5.389% APR). Fastest equity accumulation and lowest lifetime borrowing cost.`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-200 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Monatlich' : 'Monthly Payment'}</div>
                <div className="text-sm font-bold text-blue-700">{formatCurrency(calcMonthly(financedAmount, 5.125, 15))}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? '10% Anzahlung' : '10% Down Payment'}</div>
                <div className="text-sm font-bold text-slate-900">{formatCurrency(downPayment)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Zins / APR' : 'Rate / APR'}</div>
                <div className="text-sm font-bold text-slate-900">5.125% / 5.39%</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">{isGerman ? 'Laufzeit' : 'Term'}</div>
                <div className="text-sm font-bold text-slate-900">15 Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="px-5 sm:px-7 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{country.regulatorBadge}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 transition-colors cursor-pointer"
            >
              {isGerman ? 'Schließen' : 'Close'}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onGetPreApproved();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isGerman ? 'Jetzt Vorabgenehmigung starten' : 'Get Pre-Approved Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
