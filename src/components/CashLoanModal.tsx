import React, { useState } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  X,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Zap,
  CreditCard,
  Building,
  User,
  Mail,
  Phone,
  Check,
} from 'lucide-react';
import { validateSovereignId } from '../utils/sovereignIdValidator';
import { SubmissionsStore } from '../data/submissionsStore';

interface CashLoanModalProps {
  isOpen: boolean;
  currentCountry: CountryCode;
  onClose: () => void;
  onOpenInbox?: () => void;
  onOpenCustomBudget?: () => void;
  onOpenAdmin?: () => void;
  onOpenDashboard?: () => void;
}

export const CashLoanModal: React.FC<CashLoanModalProps> = ({
  isOpen,
  currentCountry,
  onClose,
  onOpenCustomBudget,
  onOpenDashboard,
}) => {
  const isGerman = currentCountry === 'DE';
  const country = COUNTRIES[currentCountry];

  // Steps: 1 = Configure Amount & Term, 2 = Purpose & Urgency, 3 = Disbursement Account, 4 = Borrower Details & Sovereign ID, 5 = Instant Letter Celebration
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Loan parameters
  const minCash = country.currency === '£' ? 10000 : country.currency === '€' ? 12000 : 15000;
  const maxCash = country.currency === '£' ? 250000 : country.currency === '€' ? 350000 : 400000;
  const defaultCash = country.currency === '£' ? 75000 : country.currency === '€' ? 90000 : 100000;

  const [amount, setAmount] = useState<number>(defaultCash);
  const [termMonths, setTermMonths] = useState<number>(36);
  const interestRate = 4.95; // 4.95% APR

  // Step 2: Purpose & Urgency
  const [purpose, setPurpose] = useState<string>('Business Capital Expansion');
  const [urgency, setUrgency] = useState<string>('Within 24 Hours');

  // Step 3: Disbursement Account & Courier Cheque Options (Requirement 8)
  const [disbursementMethod, setDisbursementMethod] = useState<string>('Direct Wire Transfer');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  // Courier Cheque fields
  const [chequePayeeName, setChequePayeeName] = useState<string>('');
  const [chequeDeliveryAddress, setChequeDeliveryAddress] = useState<string>('');
  const [chequeCity, setChequeCity] = useState<string>('');
  const [chequeState, setChequeState] = useState<string>('');
  const [chequeZip, setChequeZip] = useState<string>('');
  const [chequeInstructions, setChequeInstructions] = useState<string>('Signature required upon direct courier delivery');

  // Step 4: Borrower Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('Business Owner / Partner');
  const [sovereignId, setSovereignId] = useState<string>('');

  // Status & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRefId, setSubmittedRefId] = useState<string>('');

  // Calculations
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = Math.round(
    (amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = totalRepayment - amount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.locale || (currentCountry === 'DE' ? 'de-DE' : 'en-US'), {
      style: 'currency',
      currency: country.currencyCode || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNextFromStep2 = () => {
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    const errs: Record<string, string> = {};
    if (disbursementMethod === 'Official Cheque by Courier') {
      if (!chequePayeeName.trim()) {
        errs.chequePayeeName = 'Please enter payee full legal name to print on the official bank cheque';
      }
      if (!chequeDeliveryAddress.trim()) {
        errs.chequeDeliveryAddress = 'Please provide physical street delivery address for courier';
      }
      if (!chequeCity.trim()) {
        errs.chequeCity = 'Delivery city is required';
      }
      if (!chequeZip.trim()) {
        errs.chequeZip = 'Postal code / Zip code is required';
      }
    } else {
      if (!bankName.trim()) {
        errs.bankName = isGerman ? 'Bitte geben Sie Ihre Empfängerbank an' : 'Please provide your bank name';
      }
      if (!accountNumber.trim()) {
        errs.accountNumber = isGerman ? 'Bitte geben Sie Ihre Kontonummer/IBAN an' : 'Please provide account number, IBAN or sort code';
      }
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(4);
  };

  const handleSubmitCashLoan = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = isGerman ? 'Bitte geben Sie Ihren vollständigen Namen an' : 'Full name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = isGerman ? 'Bitte gültige E-Mail-Adresse angeben' : 'Valid email is required';
    }
    if (!phone.trim()) {
      errs.phone = isGerman ? 'Telefonnummer erforderlich' : 'Phone number is required';
    }

    const validation = validateSovereignId(currentCountry, sovereignId);
    if (!validation.isValid) {
      errs.sovereignId = validation.message;
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const ref = `AUR-CASH-${currentCountry}-${Date.now().toString(36).toUpperCase()}`;
    setSubmittedRefId(ref);

    SubmissionsStore.addCashLoanSubmission({
      id: ref,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      amount,
      termMonths,
      monthlyPayment,
      purpose,
      urgency,
      disbursementMethod,
      bankName: disbursementMethod === 'Official Cheque by Courier' ? 'Official Bank Cashier Cheque' : bankName,
      accountNumber: disbursementMethod === 'Official Cheque by Courier' ? `Payee: ${chequePayeeName} | Address: ${chequeDeliveryAddress}, ${chequeCity}` : accountNumber,
      chequePayeeName,
      chequeDeliveryAddress,
      chequeCity,
      chequeState,
      chequeZip,
      chequeInstructions,
      fullName,
      email,
      phone,
      monthlyIncome: 12500,
      employmentStatus,
      sovereignId,
      status: 'Under Review — Status Sent to Email',
    });

    setIsSubmitting(false);
    setStep(5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step > 1 && step < 5 && (
              <button
                type="button"
                onClick={() => setStep((prev) => ((prev - 1) as any))}
                className="p-1.5 rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 mr-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                  {isGerman ? 'Direkter Barkredit' : 'Direct Cash Loan'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 border border-blue-200 text-blue-800">
                  {isGerman ? 'Bietet Barkredite' : 'Offers Cash Loan'}
                </span>
                {step < 5 && (
                  <span className="text-[10px] font-mono text-slate-500">
                    · {isGerman ? `Schritt ${step} von 4` : `Step ${step} of 4`}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {step === 1 && (isGerman ? 'Aureus Express Barkredit-Rechner' : 'Aureus Express Cash Loan Facility')}
                {step === 2 && (isGerman ? 'Verwendungszweck & Dringlichkeit' : 'Loan Purpose & Payout Urgency')}
                {step === 3 && (isGerman ? 'Auszahlungskonto & Bankdaten' : 'Disbursement Method & Bank Account')}
                {step === 4 && (isGerman ? 'Antragsteller & Identifikation' : 'Borrower Verification')}
                {step === 5 && (isGerman ? 'Sofortige Barkredit-Vorabzusage Status' : 'Instant Cash Loan Pre-Approval Letter Status')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="w-full bg-slate-100 h-1 flex">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* STEP 1: CONFIGURE AMOUNT & TERM */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{isGerman ? 'Auszahlung in < 24h' : 'Under 24h Payout'}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{isGerman ? 'Direkt auf Ihr Referenzkonto' : 'Direct wire to your bank'}</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{isGerman ? 'Fester Zinssatz 4,95%' : 'Fixed 4.95% APR'}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{isGerman ? 'Keine versteckten Gebühren' : 'Transparent monthly terms'}</div>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{isGerman ? 'Ausschließlich Barkredit' : 'Cash Facility Only'}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{isGerman ? 'Keine Immobilie/Auto nötig' : 'No collateral pledge required'}</div>
                  </div>
                </div>
              </div>

              {/* Calculator Panel */}
              <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-slate-700 tracking-wider">
                    {isGerman ? 'Gewünschter Barkreditbetrag' : 'Requested Cash Facility'}
                  </span>
                  <span className="text-xl font-serif font-bold text-blue-700 font-mono">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <input
                  type="range"
                  min={minCash}
                  max={maxCash}
                  step={5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono font-medium">
                  <span>Min: {formatCurrency(minCash)}</span>
                  <span>Max: {formatCurrency(maxCash)}</span>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
                    {isGerman ? 'Laufzeit in Monaten' : 'Repayment Term (Months)'}
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {[12, 24, 36, 48, 60].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTermMonths(m)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          termMonths === m
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculations Breakdown */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">{isGerman ? 'Monatliche Rate' : 'Monthly Payment'}</div>
                    <div className="text-lg font-serif font-bold text-blue-700">{formatCurrency(monthlyPayment)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">{isGerman ? 'Fester Zinssatz' : 'Fixed Interest'}</div>
                    <div className="text-lg font-serif font-bold text-slate-900">{interestRate}%</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-mono text-slate-500 font-semibold">{isGerman ? 'Gesamte Zinsen' : 'Total Interest'}</div>
                    <div className="text-lg font-serif font-bold text-slate-700">{formatCurrency(totalInterest)}</div>
                  </div>
                </div>
              </div>

              {/* Is your budget not listed callout banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="font-bold text-blue-950 text-xs">
                    {isGerman ? 'Benötigen Sie mehr als 350.000 €? Sprechen Sie mit uns' : 'Need more than standard limits? Talk to us'}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {isGerman ? 'Maßgeschneiderte Kredithöhen für Privatkunden – direkt über unser Beratungsteam.' : 'Bespoke high-volume credit facilities tailored to your requirements.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCustomBudget) onOpenCustomBudget();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  {isGerman ? 'Budget anfragen' : 'Talk To Us'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isGerman ? 'Barkredit jetzt beantragen' : 'Apply for Cash Loan (Continue)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PURPOSE & URGENCY */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
                  {isGerman ? 'Verwendungszweck des Barkredits' : 'Primary Purpose for Cash Loan'} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Business Capital Expansion',
                    'Personal Liquidity & Lifestyle',
                    'Bridge Financing / Fast Closing',
                    'Debt Consolidation & Restructuring',
                    'Urgent Emergency Cash Reserve',
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPurpose(p)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                        purpose === p
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p}</span>
                        {purpose === p && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
                  {isGerman ? 'Wie schnell benötigen Sie die Auszahlung?' : 'How soon do you need funds disbursed?'} *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'Within 24 Hours', label: isGerman ? 'Binnen 24 Std. (Sofort)' : 'Within 24h (Immediate)' },
                    { id: 'This Week', label: isGerman ? 'Diese Woche' : 'This Week' },
                    { id: 'Within 30 Days', label: isGerman ? 'Binnen 30 Tagen' : 'Within 30 Days' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        urgency === u.id
                          ? 'bg-blue-600 text-white shadow-xs border-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center justify-between">
                <span>{isGerman ? 'Ausgewählter Barkredit:' : 'Target Cash Facility:'}</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{formatCurrency(amount)} ({termMonths}m)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  {isGerman ? 'Zurück' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <span>{isGerman ? 'Weiter zu Bankdaten' : 'Next: Disbursement Method'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DISBURSEMENT METHOD & BANK DETAILS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
                  {isGerman ? 'Auszahlungsmethode' : 'Disbursement Channel'} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Direct Wire Transfer',
                    'Official Cheque by Courier',
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDisbursementMethod(m)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        disbursementMethod === m
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {disbursementMethod === 'Official Cheque by Courier' ? (
                /* OFFICIAL CHEQUE BY COURIER FORM (Requirement 8 fix) */
                <div className="space-y-3.5 bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Courier Cheque Delivery Parameters</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payee Full Legal Name (To Print on Cheque) *
                    </label>
                    <input
                      type="text"
                      value={chequePayeeName}
                      onChange={(e) => setChequePayeeName(e.target.value)}
                      placeholder={fullName || 'e.g. Lord Alexander Montgomery'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                    {errors.chequePayeeName && <p className="text-xs text-rose-500 mt-1">{errors.chequePayeeName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Courier Delivery Physical Street Address *
                    </label>
                    <input
                      type="text"
                      value={chequeDeliveryAddress}
                      onChange={(e) => setChequeDeliveryAddress(e.target.value)}
                      placeholder="e.g. 14 Chesterfield Hill, Mayfair"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                    {errors.chequeDeliveryAddress && <p className="text-xs text-rose-500 mt-1">{errors.chequeDeliveryAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        value={chequeCity}
                        onChange={(e) => setChequeCity(e.target.value)}
                        placeholder="e.g. London / Toronto"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                      />
                      {errors.chequeCity && <p className="text-xs text-rose-500 mt-1">{errors.chequeCity}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Postal Code / Zip Code *
                      </label>
                      <input
                        type="text"
                        value={chequeZip}
                        onChange={(e) => setChequeZip(e.target.value)}
                        placeholder="e.g. W1J 5BG / M5J 2S1"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                      />
                      {errors.chequeZip && <p className="text-xs text-rose-500 mt-1">{errors.chequeZip}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Courier Delivery Instructions
                    </label>
                    <input
                      type="text"
                      value={chequeInstructions}
                      onChange={(e) => setChequeInstructions(e.target.value)}
                      placeholder="e.g. Leave with concierge or require personal photo ID & signature"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Dispatched in sealed institutional security pouch via priority courier within 24–48 hours of pre-approval.</span>
                  </div>
                </div>
              ) : (
                /* DIRECT WIRE TRANSFER FORM */
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                      {isGerman ? 'Name der Empfängerbank' : 'Receiving Institution / Bank Name'} *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder={
                          currentCountry === 'UK'
                            ? 'e.g. Barclays, HSBC, Coutts'
                            : currentCountry === 'CA'
                            ? 'e.g. RBC Royal Bank, TD Canada Trust'
                            : currentCountry === 'AU'
                            ? 'e.g. Commonwealth Bank, Westpac'
                            : 'z.B. Deutsche Bank, Commerzbank'
                        }
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.bankName && <p className="text-xs text-rose-500 mt-1">{errors.bankName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                      {isGerman ? 'IBAN / Kontonummer' : 'Account Number / IBAN / Sort Code'} *
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder={
                          currentCountry === 'DE'
                            ? 'z.B. DE89 3704 0044 0532 0130 00'
                            : currentCountry === 'UK'
                            ? 'e.g. 20-00-00 / 12345678'
                            : 'e.g. 0123-456789-01'
                        }
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {errors.accountNumber && <p className="text-xs text-rose-500 mt-1">{errors.accountNumber}</p>}
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      {isGerman
                        ? 'Nach der Genehmigung erfolgt die Auszahlung verschlüsselt an diese Bankverbindung.'
                        : 'Funds will be securely wired directly to this destination upon instant pre-approval.'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  {isGerman ? 'Zurück' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  <span>{isGerman ? 'Weiter zu Antragsteller-Info' : 'Next: Borrower Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: BORROWER DETAILS & SOVEREIGN ID */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'Vollständiger Name' : 'Full Legal Name'} *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Julian Sterling"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {errors.fullName && <p className="text-xs text-rose-500 mt-0.5">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'E-Mail-Adresse' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="julian@sterling.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'Telefonnummer' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 20 7946 0912"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-rose-500 mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'Beruflicher Status' : 'Employment Status'}
                  </label>
                  <select
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Business Owner / Partner">Business Owner / Partner</option>
                    <option value="Salaried Executive / Professional">Salaried Executive / Professional</option>
                    <option value="High-Net-Worth Private Investor">Private Investor / Family Office</option>
                    <option value="Self-Employed / Independent">Self-Employed / Independent</option>
                  </select>
                </div>
              </div>

              {/* Sovereign ID Field with algorithmic validation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-800">
                    {currentCountry === 'UK' && 'UK National Insurance Number (NINO)'}
                    {currentCountry === 'CA' && 'Canadian Social Insurance Number (SIN)'}
                    {currentCountry === 'AU' && 'Australian Tax File Number (TFN)'}
                    {currentCountry === 'DE' && 'Steueridentifikationsnummer (Steuer-ID / IdNr)'}
                    {' '}<span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={sovereignId}
                    onChange={(e) => setSovereignId(e.target.value)}
                    placeholder={
                      currentCountry === 'UK'
                        ? 'e.g. QQ 12 34 56 C'
                        : currentCountry === 'CA'
                        ? 'e.g. 046-454-286'
                        : currentCountry === 'AU'
                        ? 'e.g. 876 543 210'
                        : 'z.B. 26 925 836 189'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
                  />
                </div>
                {/* Live validation feedback */}
                {sovereignId && (
                  <div className="mt-1.5">
                    {(() => {
                      const val = validateSovereignId(currentCountry, sovereignId);
                      if (val.isValid) {
                        return (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-2 shadow-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">{val.message}</span>
                              <div className="text-[11px] text-emerald-700">{val.algorithmNotes}</div>
                            </div>
                          </div>
                        );
                      } else if (val.isIncomplete) {
                        return (
                          <div className="text-xs text-blue-700 font-medium px-1">
                            {val.message}
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2 shadow-xs">
                            <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">{val.message}</span>
                              <div className="text-[11px] text-rose-700">{val.algorithmNotes}</div>
                            </div>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
                {errors.sovereignId && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.sovereignId}</p>}
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {isGerman
                    ? 'Wird ausschließlich für die geschützte Identitäts- und Bonitätsprüfung verwendet.'
                    : 'Encrypted and used solely for sovereign identity verification and institutional clearing.'}
                </span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                >
                  {isGerman ? 'Zurück' : 'Back'}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitCashLoan}
                  className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <span>{isGerman ? 'Wird geprüft...' : 'Underwriting Decisioning...'}</span>
                  ) : (
                    <>
                      <span>{isGerman ? 'Barkredit sofort freigeben' : 'Submit for Instant Cash Pre-Approval'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CASH LOAN APPLICATION UNDER REVIEW */}
          {step === 5 && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 text-blue-600 flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-blue-700 uppercase tracking-widest font-bold">
                  {isGerman ? 'Barkredit-Status: In Senior-Prüfung' : 'Cash Loan Status: Under Senior Review'}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                  {formatCurrency(amount)} {isGerman ? 'Barkredit-Antrag erfolgreich eingereicht' : 'Cash Facility Application Submitted'}
                </h3>
              </div>

              {/* Informative notice showing status will be sent to email */}
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-left flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    {isGerman ? 'Status wird an Ihre E-Mail gesendet' : 'Status Will Be Sent to Your Email'}
                  </h4>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {isGerman
                      ? `Ihr Antrag wird derzeit von unserer Kreditabteilung geprüft. Ihr offizieller Statusbescheid wird an `
                      : `The cash loan status will be sent to your email (`}
                    <strong className="text-blue-900 font-semibold">{email}</strong>
                    {isGerman
                      ? ` gesendet. Nach der Bewilligung erfolgt die Auszahlung garantiert innerhalb von 24 Stunden direkt auf Ihr Bankkonto.`
                      : `). Once your pre-approval is granted, fund disbursement will take place within 24 hours directly to your designated receiving bank.`}
                  </p>
                </div>
              </div>

              {/* Official Cash Loan Pre-Approval Letter Status Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-300 text-left space-y-3 font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[11px] font-mono uppercase text-blue-700 font-bold">
                    {isGerman ? 'Offizieller Vorabzusage-Brief Status' : 'Official Pre-Approval Letter Status'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {isGerman ? 'In Prüfung' : 'Pending Review'}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Reference Identification:</span>
                  <span className="text-blue-900 font-bold bg-blue-100 px-2.5 py-0.5 rounded text-xs border border-blue-200">
                    {submittedRefId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Borrower:</span>
                  <span className="text-slate-900 font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Receiving Bank:</span>
                  <span className="text-slate-900 font-bold">{bankName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Disbursement Window:</span>
                  <span className="text-blue-700 font-bold">Guaranteed within 24 Hours upon grant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans font-semibold">Monthly Payment:</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(monthlyPayment)} / month ({termMonths}m)</span>
                </div>
              </div>

              {/* Action buttons: Track in Dashboard + Return */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDashboard();
                    }}
                    className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{isGerman ? 'Im Dashboard verfolgen' : 'Track Status in My Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={`${onOpenDashboard ? 'sm:w-1/3' : 'w-full'} py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all`}
                >
                  {isGerman ? 'Schließen & Fertig' : 'Done / Return'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
