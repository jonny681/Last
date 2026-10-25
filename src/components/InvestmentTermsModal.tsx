import React, { useState, useEffect } from 'react';
import { CountryCode, InvestmentSubmission } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  X,
  TrendingUp,
  ShieldCheck,
  Building,
  CreditCard,
  User,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Lock,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { INVESTMENT_TIERS, InvestmentTierConfig, calculateTierYield } from '../data/investmentPlans';
import { SubmissionsStore } from '../data/submissionsStore';
import { FirebaseService } from '../services/firebaseService';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface InvestmentTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
  selectedTierPrice?: number;
  initialMode?: 'terms' | 'request';
  onOpenDashboard?: () => void;
}

export const InvestmentTermsModal: React.FC<InvestmentTermsModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  selectedTierPrice = 25000,
  initialMode = 'request',
  onOpenDashboard,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [activeView, setActiveView] = useState<'terms' | 'request'>(initialMode);
  const [price, setPrice] = useState<10000 | 25000 | 50000 | 100000>(
    ([10000, 25000, 50000, 100000].includes(selectedTierPrice)
      ? selectedTierPrice
      : 25000) as 10000 | 25000 | 50000 | 100000
  );

  // Term duration: User requested 6 Months BEFORE 12 Months
  const [months, setMonths] = useState<6 | 12>(6);

  // Investor Information Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Universal Clean Banking Fields (Clean format for all countries)
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [reinvestmentPlan, setReinvestmentPlan] = useState<'monthly_payout' | 'retirement'>('monthly_payout');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefId, setSubmittedRefId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedTierPrice && [10000, 25000, 50000, 100000].includes(selectedTierPrice)) {
      setPrice(selectedTierPrice as any);
    }
    setActiveView(initialMode);
  }, [selectedTierPrice, initialMode, isOpen]);

  // Prepopulate if user is already logged in
  useEffect(() => {
    const cur = SubmissionsStore.getCurrentUser();
    if (cur) {
      if (cur.name && !fullName) setFullName(cur.name);
      if (cur.email && !email) setEmail(cur.email);
      if (cur.phone && !phone) setPhone(cur.phone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTier: InvestmentTierConfig =
    INVESTMENT_TIERS.find((t) => t.price === price) || INVESTMENT_TIERS[1];
  const calculation = calculateTierYield(price, months);

  const formatCurrency = (val: number) => {
    return formatCurrencyCached(
      val,
      country.locale || (currentCountry === 'DE' ? 'de-DE' : 'en-US'),
      country.currencyCode || 'USD',
      0
    );
  };

  // Build clean universal bank string
  const getCompiledBankDetails = () => {
    return `Bank: ${bankName} | Bank Code: ${bankCode} | Account: ${accountNumber}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = 'Full legal name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid direct email address is required';
    if (!bankName.trim()) errs.bankName = 'Receiving financial institution name is required';
    if (!bankCode.trim()) errs.bankCode = 'Bank code / sort code / routing is required';
    if (!accountNumber.trim()) errs.accountNumber = 'Account number / IBAN is required';
    if (!termsAccepted) errs.terms = 'You must confirm the investment requirements and terms';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const ref = `AUR-INV-${currentCountry}-${Date.now().toString(36).toUpperCase()}`;
    setSubmittedRefId(ref);

    const compiledBank = getCompiledBankDetails();

    const submission: InvestmentSubmission = {
      id: ref,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      tierId: currentTier.id,
      tierName: currentTier.name,
      principalAmount: price,
      durationMonths: months,
      ratePercent: calculation.ratePercent,
      totalYield: calculation.totalReturn,
      gain: calculation.totalInterest,
      monthlyPayout: calculation.monthlyPayout,
      fullName,
      email,
      phone,
      bankName,
      accountNumber: compiledBank,
      status: 'Under Review — Status Sent to Email',
      reinvestmentPlan,
    };

    SubmissionsStore.addInvestmentSubmission(submission);
    FirebaseService.saveInvestment(submission);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                Asset-Backed Private Lending Facility
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {activeView === 'terms' ? 'Investment Terms & Legal Safeguards' : 'Investment Allocation & Requirements'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('terms')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeView === 'terms' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => setActiveView('request')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeView === 'request' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Request
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* IMAGE 1 FIX: COMPLETION / SUBMITTED SCREEN */}
          {isSubmitted ? (
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-widest">
                  Allocation Request Submitted
                </span>
                {/* Specific phrase requested by User (Image 1 fix) */}
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
                  Investment allocation will be processed shortly
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  Further instructions, custody certificates, and bank clearing documentation will be sent to your email (<strong className="text-blue-900">{email}</strong>).
                </p>
              </div>

              {/* Status and Payout Details Card */}
              <div className="max-w-lg mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-300 text-left font-mono text-xs space-y-2.5 shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Reference ID:</span>
                  <span className="text-blue-900 font-bold bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200 text-xs">
                    {submittedRefId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Status:</span>
                  <span className="text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                    Under Review — Status Sent to Email
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Investor Name:</span>
                  <span className="text-slate-900 font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Principal Allocation:</span>
                  <span className="text-slate-900 font-bold">{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Duration:</span>
                  <span className="text-slate-900 font-bold">{months} Months Term</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Monthly Passive Earnings:</span>
                  <span className="text-blue-700 font-bold">
                    {formatCurrency(calculation.monthlyPayout)} / month
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 font-sans font-semibold">Total Guaranteed Payout:</span>
                  <span className="text-emerald-700 font-bold text-sm">
                    {formatCurrency(calculation.totalReturn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans font-semibold">Receiving Payout Destination:</span>
                  <span className="text-slate-900 font-bold truncate max-w-[220px]">{bankName}</span>
                </div>
              </div>

              {/* Requirement 9: Final click brings Track Status in Dashboard */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenDashboard) onOpenDashboard();
                  }}
                  className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Track Status in Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-1/3 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : activeView === 'terms' ? (
            /* INVESTMENT TERMS VIEW (Requirement 7 Button 1) */
            <div className="space-y-6">
              {/* Selected Tier Banner */}
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-blue-700 font-bold uppercase">
                    Selected Allocation Tier
                  </div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-0.5">
                    {currentTier.tier.split('·')[0]} — {formatCurrency(price)}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {currentTier.name} · {currentTier.collateralBacking}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
                    100% Asset-Backed
                  </span>
                </div>
              </div>

              {/* Terms Overview Cards */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Official Investment Terms & Security Protocols
                </h4>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>150% Physical Asset Title Over-Collateralization</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every dollar, pound, or euro allocated is backed by registered legal mortgages and physical ownership titles on high-value residential homes and exotic vehicles in our sovereign lending portfolio. In the event of borrower default, Aureus balance sheet retains first-lien liquidation priority.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Fixed Guaranteed Yield Rate & Duration Flexibility</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Choose between a 6-Month liquidity facility or 12-Month maximum-yield tier. Your returns are locked in upon contract execution, unaffected by market volatility or public equities fluctuations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                    <span>Zero Management or Custody Fees</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    100% of your principal earns yield directly. We do not charge subscription, origination, or annual performance fees. Monthly payouts are transferred directly to your designated bank account.
                  </p>
                </div>
              </div>

              {/* Proceed to Request Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveView('request')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Investment Request & Bank Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* INVESTMENT REQUEST VIEW (Requirement 3 & 7):
               No 4-tier cards re-displayed!
               6 Month term shown BEFORE 12 Month term!
               Dynamic bank details based on country!
            */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Selected Tier Header Box (Image 3 fix: Only shows the clicked tier, NOT the 4 cards again) */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border-2 border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase text-blue-700 font-bold">
                    Allocating To
                  </span>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                    {currentTier.tier.split('·')[0]} — {formatCurrency(price)}
                  </div>
                  <div className="text-xs text-slate-600">
                    {currentTier.name} · {currentTier.collateralBacking}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                    Guaranteed Return
                  </span>
                </div>
              </div>

              {/* Requirement 3: 6 MONTHS TERM BEFORE 12 MONTHS TERM */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2 font-mono">
                  Select Investment Duration (6 Months First, then 12 Months) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: 6 MONTHS TERM */}
                  <button
                    type="button"
                    onClick={() => setMonths(6)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      months === 6
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">6 Months Term</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Accelerated Liquidity
                      </span>
                    </div>
                    <div className="text-xl font-serif font-bold text-blue-700">
                      {formatCurrency(currentTier.rates[6].yieldTotal)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 font-mono">
                      Net Profit: <strong className="text-emerald-700 font-bold">+{formatCurrency(currentTier.rates[6].gain)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Monthly Payout: {formatCurrency(currentTier.rates[6].monthlyPayout)}/mo
                    </div>
                  </button>

                  {/* Option 2: 12 MONTHS TERM */}
                  <button
                    type="button"
                    onClick={() => setMonths(12)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      months === 12
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">12 Months Term</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Maximum APY
                      </span>
                    </div>
                    <div className="text-xl font-serif font-bold text-blue-700">
                      {formatCurrency(currentTier.rates[12].yieldTotal)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 font-mono">
                      Net Profit: <strong className="text-emerald-700 font-bold">+{formatCurrency(currentTier.rates[12].gain)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Monthly Payout: {formatCurrency(currentTier.rates[12].monthlyPayout)}/mo
                    </div>
                  </button>
                </div>
              </div>

              {/* Investor Personal Details */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                  Investor Legal Identification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Eleanor Sinclair"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@sinclair-family.co.uk"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Contact Telephone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 20 7946 0912"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement 7: COUNTRY-SPECIFIC BANKING FORMAT */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                    Receiving Bank Account for Monthly Payouts
                  </h4>
                  <span className="text-[11px] font-semibold text-blue-700 font-mono">
                    {country.name} ({country.currencyCode}) Format
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Financial Institution / Bank Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder={
                        currentCountry === 'UK'
                          ? 'e.g. Barclays, HSBC, Lloyds, Coutts'
                          : currentCountry === 'CA'
                          ? 'e.g. RBC Royal Bank, TD Canada Trust, Scotiabank'
                          : currentCountry === 'AU'
                          ? 'e.g. Commonwealth Bank, ANZ, Westpac'
                          : 'z.B. Deutsche Bank, Commerzbank, Sparkasse'
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  {errors.bankName && <p className="text-xs text-rose-500 mt-1">{errors.bankName}</p>}
                </div>

                {/* Universal Clean Bank Inputs (No complicated Canadian 3-part format) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Code / Sort Code / BSB / Routing *
                    </label>
                    <input
                      type="text"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      placeholder={currentCountry === 'UK' ? 'e.g. 20-00-00' : 'e.g. Bank/Routing Code'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-blue-600 bg-white"
                    />
                    {errors.bankCode && <p className="text-xs text-rose-500 mt-1">{errors.bankCode}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bank Account Number / IBAN *
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 12345678 or IBAN"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-blue-600 bg-white"
                    />
                    {errors.accountNumber && <p className="text-xs text-rose-500 mt-1">{errors.accountNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Yield Distribution Strategy */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider font-mono">
                  Yield Distribution Strategy *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReinvestmentPlan('monthly_payout')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      reinvestmentPlan === 'monthly_payout'
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">
                      Earn While You Sleep (Monthly Payout)
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Direct automated monthly deposit of {formatCurrency(calculation.monthlyPayout)} into your designated bank account.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReinvestmentPlan('retirement')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      reinvestmentPlan === 'retirement'
                        ? 'bg-blue-50 border-2 border-blue-600 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">
                      Private Retirement Structuring
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Compound yield into a dedicated private capital annuity for long-term retirement planning.
                    </div>
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I confirm my allocation request of <strong>{formatCurrency(price)}</strong> for a <strong>{months}-Month Term</strong>. I acknowledge that all funds are 100% backed by physical real estate deeds and luxury performance car titles held in sovereign balance sheet custody.
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-rose-500">{errors.terms}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Processing Allocation...' : `Lock In ${formatCurrency(price)} Investment Allocation`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
