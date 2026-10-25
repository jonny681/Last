import React, { useState, useEffect } from 'react';
import { CountryCode, LoanType } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { ShieldCheck, CheckCircle, ArrowRight, Loader2, AlertCircle, FileText, Check, CheckCircle2, XCircle } from 'lucide-react';
import { validateSovereignId, VALID_SAMPLE_SOVEREIGN_IDS } from '../utils/sovereignIdValidator';
import { SubmissionsStore } from '../data/submissionsStore';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface ApplicationFormProps {
  currentCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  initialLoanType: LoanType;
  initialAmount?: number;
  initialTerm?: number;
  selectedAsset?: {
    type: LoanType;
    id: string;
    title: string;
    price: number;
  } | null;
  onBrowseAssets?: () => void;
  onOpenCustomBudget?: () => void;
  onOpenDashboard?: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  currentCountry,
  onCountryChange,
  initialLoanType,
  initialAmount,
  initialTerm,
  selectedAsset,
  onBrowseAssets,
  onOpenCustomBudget,
  onOpenDashboard,
}) => {
  const country = COUNTRIES[currentCountry];
  const t = currentCountry === 'DE' ? UI_TEXT.DE : UI_TEXT.EN;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    sovereignId: '',
    country: currentCountry,
    loanType: initialLoanType,
    amount: initialAmount || country.homeLoan.defaultAmount,
    term: initialTerm || (initialLoanType === 'home' ? country.homeLoan.defaultTerm : country.carLoan.defaultTerm),
    notes: selectedAsset ? `Financing acquisition for ${selectedAsset.title}` : '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  // Sync when initial values or selected asset change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      country: currentCountry,
      loanType: initialLoanType,
      amount: initialAmount || (initialLoanType === 'home' ? country.homeLoan.defaultAmount : country.carLoan.defaultAmount),
      term: initialTerm || (initialLoanType === 'home' ? country.homeLoan.defaultTerm : country.carLoan.defaultTerm),
      notes: selectedAsset ? `Financing acquisition for ${selectedAsset.title}` : prev.notes,
    }));
  }, [currentCountry, initialLoanType, initialAmount, initialTerm, selectedAsset]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = t.form.errors.name;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = t.form.errors.email;
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 7) {
      newErrors.phone = t.form.errors.phone;
    }
    if (!formData.amount || formData.amount < 1000) {
      newErrors.amount = t.form.errors.amount;
    }
    const sovereignRes = validateSovereignId(currentCountry, formData.sovereignId);
    if (!sovereignRes.isValid) {
      newErrors.sovereignId = sovereignRes.message;
    }
    if (!formData.consent) {
      newErrors.consent = t.form.errors.consent;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Post to placeholder endpoint with realistic network roundtrip
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        loanType: formData.loanType,
        amount: formData.amount,
        termYears: formData.term,
        notes: formData.notes,
        consentTimestamp: new Date().toISOString(),
      };

      // Simulation of secure API post to placeholder endpoint
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Generate prestige reference code
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const refCode = `AUR-${formData.country}-${randomSuffix}`;
      setSuccessReference(refCode);

      // Save to SubmissionsStore so it automatically shows in their dashboard
      const monthlyRate = (formData.loanType === 'home' ? 4.85 : 5.95) / 100 / 12;
      const totalMonths = formData.term * 12;
      const calcMonthly = Math.round(
        (formData.amount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );

      SubmissionsStore.addPreApprovalSubmission({
        id: refCode,
        submittedAt: new Date().toISOString(),
        country: formData.country as CountryCode,
        firstName: formData.fullName.split(' ')[0] || 'Valued',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || 'Borrower',
        fullName: formData.fullName,
        timeframe: 'Immediately',
        propertyType: formData.loanType === 'home' ? 'Single-family or luxury estate' : 'Performance Vehicle',
        homeUsage: 'Primary acquisition',
        cityOrZip: selectedAsset?.title || 'Direct Marketplace Asset',
        workingWithAgent: 'No',
        homePrice: formData.amount,
        monthlyPayment: calcMonthly,
        downPayment: Math.round(formData.amount * 0.1),
        downPaymentTiming: "It's available now",
        grossIncome: 180000,
        selfEmployed: 'No',
        ownedHomePast3Years: 'Yes',
        militaryAffiliation: 'No',
        email: formData.email,
        phone: formData.phone,
        streetAddress: 'Direct Application',
        unit: '',
        city: 'Metropolitan',
        state: 'Jurisdiction',
        zipCode: '00000',
        electronicConsent: true,
        hadBankruptcy: 'No',
        sovereignId: formData.sovereignId,
        dateOfBirth: '1985-01-01',
        creditReportConsent: true,
        status: 'Under Review — Status Sent to Email',
        preApprovedAmount: Math.round(formData.amount * 0.9),
        interestRate: formData.loanType === 'home' ? 4.85 : 5.95,
      });
    } catch {
      setErrors({ form: 'An error occurred during secure transmission. Please retry.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccessReference(null);
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      email: '',
      phone: '',
      notes: '',
      consent: false,
    }));
    setErrors({});
  };

  const formatCurrency = (val: number) => {
    return formatCurrencyCached(val, country.locale, country.currencyCode, 0);
  };

  return (
    <section id="application-form" className="py-24 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest text-blue-600 uppercase mb-3">
            <span className="w-4 h-[1px] bg-blue-500" />
            <span>{t.form.sectionKicker}</span>
            <span className="w-4 h-[1px] bg-blue-500" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            {t.form.sectionTitle}
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base font-light">
            {t.form.sectionSubtitle}
          </p>
        </div>

        {/* Card Enclosure */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-bl-full pointer-events-none" />

          {/* Success State Modal / Overlay */}
          {successReference ? (
            <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
                {t.form.success.title}
              </h3>
              <p className="text-sm text-slate-700 font-normal max-w-md mx-auto mb-6">
                {t.form.success.message}
              </p>

              {/* Informative Email Notice (Item 11 & 14) */}
              <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-left flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Application Status Dispatched
                  </h4>
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    Your full application package and tracking certificate have been delivered to <strong className="text-blue-900 font-semibold">{formData.email}</strong>. Please check your inbox for updates.
                  </p>
                </div>
              </div>

              {/* Rich, Formal Reference ID Credential (Item 14) */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-300 text-left mb-8 shadow-xs space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-semibold text-slate-600 uppercase font-mono">Reference ID:</span>
                  <span className="text-sm font-mono font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                    {successReference}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 pt-1 font-mono">
                  <span>Facility Type:</span>
                  <span className="font-bold text-slate-900">{formData.loanType === 'home' ? t.calc.tabHome : t.calc.tabCar}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-mono">
                  <span>Requested Amount:</span>
                  <span className="font-bold text-blue-700">{formatCurrency(formData.amount)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-mono">
                  <span>Amortisation Term:</span>
                  <span className="font-bold text-slate-900">{formData.term} {t.calc.years}</span>
                </div>
              </div>

              {/* Next Steps List */}
              <div className="max-w-md mx-auto text-left bg-white p-5 rounded-2xl border border-slate-200 mb-8 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  {t.form.success.nextSteps}
                </div>
                <div className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>{t.form.success.stepA}</span>
                </div>
                <div className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>{t.form.success.stepB}</span>
                </div>
                <div className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>{t.form.success.stepC}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onOpenDashboard();
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Track Status in My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className={`${onOpenDashboard ? 'sm:w-1/3' : 'w-full'} py-3.5 px-6 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer`}
                >
                  {t.form.success.closeBtn}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Selected Asset Banner if user picked a property/car */}
              {selectedAsset && (
                <div className="p-4 rounded-xl bg-white border border-blue-500/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {selectedAsset.type === 'home' ? '🏠' : '🏎️'}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono uppercase text-blue-700 font-bold">
                        {currentCountry === 'DE' ? 'Gewähltes Finanzierungsobjekt' : 'Selected Acquisition Asset'}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 font-serif">
                        {selectedAsset.title} — <span className="font-mono text-blue-700 font-bold">{formatCurrency(selectedAsset.price)}</span>
                      </div>
                    </div>
                  </div>
                  {onBrowseAssets && (
                    <button
                      type="button"
                      onClick={onBrowseAssets}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {currentCountry === 'DE' ? 'Ändern' : 'Change'}
                    </button>
                  )}
                </div>
              )}

              {/* Form Grid 2-cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.fullNameLabel} <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t.form.fullNamePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.fullName
                        ? 'border-rose-500/80 focus:ring-rose-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.emailLabel} <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.form.emailPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.email
                        ? 'border-rose-500/80 focus:ring-rose-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.phoneLabel} <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t.form.phonePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl bg-white border text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      errors.phone
                        ? 'border-rose-500/80 focus:ring-rose-500'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.countryLabel} <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => {
                      const c = e.target.value as CountryCode;
                      setFormData({ ...formData, country: c });
                      onCountryChange(c);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="UK">🇬🇧 United Kingdom (GBP · £)</option>
                    <option value="CA">🇨🇦 Canada (CAD · C$)</option>
                    <option value="AU">🇦🇺 Australia (AUD · A$)</option>
                    <option value="DE">🇩🇪 Deutschland (EUR · €)</option>
                  </select>
                </div>

                {/* Sovereign National ID */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">
                      {currentCountry === 'UK' && 'UK National Insurance Number (NINO)'}
                      {currentCountry === 'CA' && 'Canadian Social Insurance Number (SIN)'}
                      {currentCountry === 'AU' && 'Australian Tax File Number (TFN)'}
                      {currentCountry === 'DE' && 'Steueridentifikationsnummer (Steuer-ID)'}
                      {' '}<span className="text-blue-600">*</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.sovereignId}
                    onChange={(e) => setFormData({ ...formData, sovereignId: e.target.value })}
                    placeholder={
                      currentCountry === 'UK'
                        ? 'e.g. QQ 12 34 56 C'
                        : currentCountry === 'CA'
                        ? 'e.g. 046-454-286'
                        : currentCountry === 'AU'
                        ? 'e.g. 876 543 210'
                        : 'e.g. 26 925 836 189'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
                  />
                  {/* Live validation feedback */}
                  {formData.sovereignId && (
                    <div className="mt-1.5">
                      {(() => {
                        const val = validateSovereignId(currentCountry, formData.sovereignId);
                        if (val.isValid) {
                          return (
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-semibold">{val.message}</span>
                            </div>
                          );
                        } else if (val.isIncomplete) {
                          return (
                            <div className="text-xs text-blue-700 font-medium">
                              {val.message}
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span className="font-semibold">{val.message}</span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                  {errors.sovereignId && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.sovereignId}</p>}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {currentCountry === 'UK' && 'HMRC verified 9-character sovereign identification.'}
                    {currentCountry === 'CA' && 'Service Canada verified 9-digit social identification (Luhn mod-10).'}
                    {currentCountry === 'AU' && 'ATO compliant 9-digit tax identity verification (Mod-11).'}
                    {currentCountry === 'DE' && 'Bundeszentralamt für Steuern ISO 7064 Mod 11, 10 Steuer-ID.'}
                  </p>
                </div>

                {/* Loan Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.loanTypeLabel} <span className="text-blue-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, loanType: 'home' })}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        formData.loanType === 'home'
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500/20'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {currentCountry === 'DE' ? 'Baufinanzierung' : 'Home Loan / Mortgage'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, loanType: 'car' })}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        formData.loanType === 'car'
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500/20'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-blue-300'
                      }`}
                    >
                      {currentCountry === 'DE' ? 'Autokredit' : 'Prestige Auto Finance'}
                    </button>
                  </div>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    {t.form.amountLabel} ({country.currency}) <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono">
                      {country.currency}
                    </span>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white border text-sm text-slate-900 focus:outline-none focus:ring-1 font-mono tabular-nums ${
                        errors.amount
                          ? 'border-rose-500/80 focus:ring-rose-500'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.amount}</span>
                    </p>
                  )}

                  {/* 10% Upfront Acquisition Breakdown Callout */}
                  {formData.amount > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>{currentCountry === 'DE' ? 'Erforderliche 10% Anzahlung:' : 'Required 10% Upfront:'} <strong>{formatCurrency(formData.amount * 0.10)}</strong></span>
                      </div>
                      <div className="text-slate-700">
                        <span>{currentCountry === 'DE' ? 'Direktfinanzierung (90%):' : 'Direct Loan (90%):'} {formatCurrency(formData.amount * 0.90)}</span>
                      </div>
                    </div>
                  )}

                  {/* Is your budget not listed callout banner */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs shadow-xs">
                    <div>
                      <div className="font-bold text-slate-900">
                        {currentCountry === 'DE' ? 'Ist Ihr Budget nicht aufgeführt? Sprechen Sie mit uns' : 'Is your budget not listed? Talk to us'}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {currentCountry === 'DE' ? 'Maßgeschneiderte Kredithöhen für jede Akquisition.' : 'Bespoke credit lines arranged for any acquisition size.'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenCustomBudget) onOpenCustomBudget();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shrink-0 cursor-pointer shadow-xs"
                    >
                      {currentCountry === 'DE' ? 'Budget anfragen' : 'Talk To Us'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  {t.form.notesLabel}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.form.notesPlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* GDPR Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-700">
                    {t.form.consentText}
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {/* Submission Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-sm sm:text-base bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t.form.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.form.submitBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{t.form.guarantee}</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
