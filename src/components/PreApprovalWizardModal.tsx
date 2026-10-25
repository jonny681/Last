import React, { useState, useEffect } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import { SubmissionsStore } from '../data/submissionsStore';
import { CustomBudgetModal } from './CustomBudgetModal';
import { validateSovereignId } from '../utils/sovereignIdValidator';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Check,
  Building,
  Sparkles,
  FileText,
  Lock,
  Mail,
  Info,
  Clock,
} from 'lucide-react';

interface PreApprovalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
  initialAsset?: any;
  onApplicationCompleted?: (data: any) => void;
  onNavigateToInbox?: () => void;
  onOpenAdmin?: () => void;
  onOpenDashboard?: () => void;
}

export const PreApprovalWizardModal: React.FC<PreApprovalWizardModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  initialAsset,
  onApplicationCompleted,
  onNavigateToInbox,
  onOpenDashboard,
}) => {
  // Country selection state - initialized to currentCountry, but selectable before step 1 (Item 15 & 17)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(currentCountry);
  const country = COUNTRIES[selectedCountry];
  const isGerman = selectedCountry === 'DE';
  const currencySymbol = country.currency;

  // Step counter: 0 is Country Selection, 1 to 19 are wizard steps, 20 is completion
  const [currentStep, setCurrentStep] = useState<number>(0);

  // STEP 1: When are you looking to buy?
  const [timeframe, setTimeframe] = useState<string>('Within 3 months');

  // STEP 2: What kind of property do you plan to buy?
  const [propertyType, setPropertyType] = useState<string>('Single-family or townhome');

  // STEP 3: How will you use your home?
  const [homeUsage, setHomeUsage] = useState<string>('Primary residence');

  // STEP 4: What city or ZIP code do you want to buy in?
  const [cityOrZip, setCityOrZip] = useState<string>(
    selectedCountry === 'UK'
      ? 'SW1A 1AA London'
      : selectedCountry === 'CA'
      ? 'V6B 1A1 Vancouver'
      : selectedCountry === 'AU'
      ? '2000 Sydney'
      : '80331 München'
  );

  // STEP 5: Are you working with a real estate agent?
  const [workingWithAgent, setWorkingWithAgent] = useState<'Yes' | 'No'>('No');

  // STEP 6: What home price are you considering?
  const defaultPrice = initialAsset?.price || (selectedCountry === 'UK' ? 850000 : selectedCountry === 'DE' ? 780000 : 900000);
  const [homePrice, setHomePrice] = useState<number>(defaultPrice);

  // STEP 7: What monthly payment are you comfortable with?
  const [monthlyComfortPayment, setMonthlyComfortPayment] = useState<number>(3500);

  // STEP 8: How much cash can you put down up front, including closing costs?
  const [cashDown, setCashDown] = useState<number>(Math.round(defaultPrice * 0.1));

  // STEP 9: When will you have money to cover down payment and closing costs?
  const [downPaymentTiming, setDownPaymentTiming] = useState<string>("It's available now");

  // STEP 10: What’s your gross (pre-tax) annual income?
  const [grossAnnualIncome, setGrossAnnualIncome] = useState<number>(175000);

  // STEP 11: Is any of your income from self-employment?
  const [isSelfEmployed, setIsSelfEmployed] = useState<'Yes' | 'No'>('No');

  // STEP 12: Have you owned a home in the past 3 years?
  const [ownedHomePast3Years, setOwnedHomePast3Years] = useState<'Yes' | 'No'>('Yes');

  // STEP 13: Do you or your spouse have a military affiliation?
  const [militaryAffiliation, setMilitaryAffiliation] = useState<'Yes' | 'No'>('No');

  // STEP 14: Contact information (Item 13: removed 'optional' and 'email of course')
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // STEP 15: Current physical address
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [stateRegion, setStateRegion] = useState<string>(
    selectedCountry === 'UK'
      ? 'Greater London'
      : selectedCountry === 'CA'
      ? 'British Columbia'
      : selectedCountry === 'AU'
      ? 'New South Wales'
      : 'Bayern'
  );
  const [zipCode, setZipCode] = useState<string>('');

  // STEP 16: Electronic documents consent
  const [electronicConsent, setElectronicConsent] = useState<boolean>(true);

  // STEP 18: Bankruptcy in past 7 years?
  const [hadBankruptcy, setHadBankruptcy] = useState<'Yes' | 'No'>('No');

  // STEP 19: Soft credit check & sovereign ID
  const [sovereignId, setSovereignId] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('1985-06-15');
  const [creditReportConsent, setCreditReportConsent] = useState<boolean>(true);

  // STEP 20: Completion result
  const [completedRefId, setCompletedRefId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Help tooltip modal & Legal Popups (Items 6, 9, 16)
  const [activeLegalPopup, setActiveLegalPopup] = useState<string | null>(null);
  const [activeHelpTopic, setActiveHelpTopic] = useState<string | null>(null);

  // Custom budget modal toggle
  const [showCustomBudgetModal, setShowCustomBudgetModal] = useState<boolean>(false);

  // Sync city & state whenever selectedCountry changes
  useEffect(() => {
    if (selectedCountry === 'UK') {
      setCityOrZip('SW1A 1AA London');
      setStateRegion('Greater London');
    } else if (selectedCountry === 'CA') {
      setCityOrZip('V6B 1A1 Vancouver');
      setStateRegion('British Columbia');
    } else if (selectedCountry === 'AU') {
      setCityOrZip('2000 Sydney');
      setStateRegion('New South Wales');
    } else {
      setCityOrZip('80331 München');
      setStateRegion('Bayern');
    }
  }, [selectedCountry]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNext = () => {
    const errs: Record<string, string> = {};

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 4 && !cityOrZip.trim()) {
      errs.cityOrZip = 'Please enter a city or ZIP code.';
    }

    if (currentStep === 14) {
      if (!firstName.trim()) errs.firstName = 'Legal first name is required.';
      if (!lastName.trim()) errs.lastName = 'Legal last name is required.';
      if (!phone.trim()) errs.phone = 'Phone number is required.';
      if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required.';
    }

    if (currentStep === 15) {
      if (!streetAddress.trim()) errs.streetAddress = 'Street address is required.';
      if (!city.trim()) errs.city = 'City is required.';
      if (!zipCode.trim()) errs.zipCode = 'ZIP / Postal code is required.';
    }

    if (currentStep === 16 && !electronicConsent) {
      errs.electronicConsent = 'Please agree to receive disclosures electronically to proceed.';
    }

    if (currentStep === 19) {
      const sovereignRes = validateSovereignId(selectedCountry, sovereignId);
      if (!sovereignRes.isValid) {
        errs.sovereignId = sovereignRes.message;
      }
      if (!dateOfBirth) {
        errs.dateOfBirth = 'Date of birth is required.';
      }
      if (!creditReportConsent) {
        errs.creditReportConsent = 'Authorization for soft credit check is required.';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    if (currentStep === 19) {
      handleSubmitPreApproval();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitPreApproval = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const ref = `AUR-PREAPP-${selectedCountry}-${Math.floor(100000 + Math.random() * 900000)}`;
    setCompletedRefId(ref);

    const preApprovedAmount = Math.round(homePrice * 0.9);
    const calculatedRate = selectedCountry === 'UK' ? 4.85 : selectedCountry === 'CA' ? 5.10 : selectedCountry === 'AU' ? 5.45 : 3.95;
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Verified Applicant';

    const submissionData: import('../types').PreApprovalSubmission = {
      id: ref,
      submittedAt: new Date().toISOString(),
      country: selectedCountry,
      firstName: firstName.trim() || 'Verified',
      lastName: lastName.trim() || 'Applicant',
      fullName,
      timeframe,
      propertyType,
      homeUsage,
      cityOrZip,
      workingWithAgent,
      homePrice,
      monthlyPayment: monthlyComfortPayment,
      downPayment: cashDown,
      downPaymentTiming,
      grossIncome: grossAnnualIncome,
      selfEmployed: isSelfEmployed,
      ownedHomePast3Years,
      militaryAffiliation,
      email,
      phone,
      streetAddress,
      unit,
      city,
      state: stateRegion,
      zipCode,
      electronicConsent,
      hadBankruptcy,
      sovereignId,
      dateOfBirth,
      creditReportConsent,
      status: 'Under Review — Status Sent to Email',
      preApprovedAmount,
      interestRate: calculatedRate,
    };

    SubmissionsStore.addPreApprovalSubmission(submissionData);

    if (onApplicationCompleted) {
      onApplicationCompleted({
        id: ref,
        assetTitle: initialAsset?.title || `${propertyType} in ${cityOrZip}`,
        assetType: 'home',
        assetPrice: homePrice,
        downPayment: cashDown,
        financedAmount: preApprovedAmount,
        termYears: 30,
        rate: calculatedRate,
        monthlyPayment: monthlyComfortPayment,
        borrowerName: fullName,
        borrowerEmail: email,
        borrowerPhone: phone,
        submittedAt: new Date().toISOString(),
        status: 'Under Review — Status Sent to Email',
      });
    }

    setIsSubmitting(false);
    setCurrentStep(20);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto min-h-[580px] max-h-[95vh] text-slate-900">
          {/* Top Header bar with branding & Close button */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-xs sm:text-sm font-serif font-bold text-slate-900 tracking-tight">
                {isGerman ? 'Aureus Baufinanzierung Vorabgenehmigung' : 'Aureus Home Loans'}
              </span>
            </div>

            <div className="w-8 h-8 flex items-center justify-center font-mono text-[10px] text-blue-600 font-bold">
              {currentStep === 0 ? 'Start' : currentStep <= 19 ? `${currentStep}/19` : '✓'}
            </div>
          </div>

          {/* Stepper Progress Bar across top */}
          <div className="w-full bg-slate-200 h-1">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: currentStep === 0 ? '5%' : `${(Math.min(currentStep, 19) / 19) * 100}%` }}
            />
          </div>

          {/* Step Form Body */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto text-slate-900">
            {/* STEP 0: COUNTRY SELECTION (Items 15, 17, 18) */}
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Select your country for home /car loans
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Choose the sovereign jurisdiction for your pre-approval application. All currency amounts, regulatory checks, and identity validations will be tailored directly to your chosen country.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {[
                    { code: 'UK' as CountryCode, name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP (£)' },
                    { code: 'CA' as CountryCode, name: 'Canada', flag: '🇨🇦', currency: 'CAD ($)' },
                    { code: 'AU' as CountryCode, name: 'Australia', flag: '🇦🇺', currency: 'AUD ($)' },
                    { code: 'DE' as CountryCode, name: 'Germany', flag: '🇩🇪', currency: 'EUR (€)' },
                  ].map((c) => {
                    const isSelected = selectedCountry === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setSelectedCountry(c.code)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/40 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{c.flag}</span>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{c.name}</div>
                            <div className="text-xs font-mono font-semibold text-blue-700">{c.currency}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1: When are you looking to buy? */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    When are you looking to buy?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="space-y-3">
                  {['Within 3 months', '3 to 6 months', '6 or more months'].map((opt) => {
                    const isSelected = timeframe === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTimeframe(opt)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: What kind of property do you plan to buy? */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What kind of property do you plan to buy?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="space-y-3">
                  {[
                    'Single-family or townhome',
                    'Condominium or loft',
                    'Multi-family (2-4 units)',
                    'Manufactured or modular',
                  ].map((opt) => {
                    const isSelected = propertyType === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPropertyType(opt)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: How will you use your home? */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    How will you use your home?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="space-y-3">
                  {[
                    'Primary residence',
                    'Secondary / Vacation residence',
                    'Investment property',
                  ].map((opt) => {
                    const isSelected = homeUsage === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHomeUsage(opt)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: What city or ZIP code do you want to buy in? */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What city or postal code do you want to buy in?
                  </h2>
                  <p className="text-xs text-slate-600">
                    Enter the jurisdiction area within {country.name}.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    City or Postal Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cityOrZip}
                    onChange={(e) => setCityOrZip(e.target.value)}
                    placeholder="e.g. London SW1 or Vancouver"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.cityOrZip && (
                    <p className="text-xs text-rose-500 mt-1">{errors.cityOrZip}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Working with an agent */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Are you working with a real estate agent?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isSelected = workingWithAgent === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWorkingWithAgent(opt)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span className="text-base">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: Home price */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What home price are you considering?
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Estimated Purchase Price <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-mono font-bold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step={10000}
                      value={homePrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHomePrice(val);
                        setCashDown(Math.round(val * 0.1));
                      }}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-lg font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-right text-xs text-blue-700 font-mono mt-1.5 font-bold">
                    {formatCurrency(homePrice)}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Comfortable Monthly Payment */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What monthly payment are you comfortable with?
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Target Monthly Payment <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-mono font-bold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step={250}
                      value={monthlyComfortPayment}
                      onChange={(e) => setMonthlyComfortPayment(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-lg font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-right text-xs text-blue-700 font-mono mt-1.5 font-bold">
                    {formatCurrency(monthlyComfortPayment)} / month
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Cash down payment */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    How much cash can you put down up front, including closing costs?
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Enter down payment amount <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-mono font-bold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step={5000}
                      value={cashDown}
                      onChange={(e) => setCashDown(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-lg font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1.5 font-mono">
                    <span className="text-slate-600">
                      Standard Down Payment: {Math.round((cashDown / homePrice) * 100)}% of Purchase Price
                    </span>
                    <span className="text-blue-700 font-bold">{formatCurrency(cashDown)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Down payment timing */}
            {currentStep === 9 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    When will you have money to cover down payment and closing costs?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="space-y-3">
                  {[
                    "It's available now",
                    'Within 30 days',
                    'In 1 to 3 months',
                    'Waiting on home sale or equity',
                  ].map((opt) => {
                    const isSelected = downPaymentTiming === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDownPaymentTiming(opt)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold text-sm transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 10: Gross annual income (Item 10: clean white & blue theme, no odd faded gold/grey) */}
            {currentStep === 10 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What’s your gross (pre-tax) annual income?
                  </h2>
                  <p className="text-xs text-slate-600">
                    This includes all wages, bonuses, and verified executive compensation.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                    Gross Annual Income <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700 font-mono font-bold text-lg">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      step={5000}
                      value={grossAnnualIncome}
                      onChange={(e) => setGrossAnnualIncome(Number(e.target.value))}
                      className="w-full pl-10 pr-20 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-lg font-mono font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-sans text-xs">
                      / year
                    </span>
                  </div>
                  <div className="text-right text-xs text-blue-700 font-mono mt-1.5 font-bold">
                    {formatCurrency(grossAnnualIncome)} / year
                  </div>
                </div>
              </div>
            )}

            {/* STEP 11: Self-employment */}
            {currentStep === 11 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Is any of your income from self-employment?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isSelected = isSelfEmployed === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setIsSelfEmployed(opt)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span className="text-base">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 12: Owned home past 3 years */}
            {currentStep === 12 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Have you owned a home in the past 3 years?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isSelected = ownedHomePast3Years === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setOwnedHomePast3Years(opt)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span className="text-base">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 13: Military affiliation */}
            {currentStep === 13 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Do you or your spouse have a military affiliation?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isSelected = militaryAffiliation === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMilitaryAffiliation(opt)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span className="text-base">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 14: Contact information (Item 13: removed 'optional' in phone and 'email of course') */}
            {currentStep === 14 && (
              <div className="space-y-4 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Thanks! Now we need some basic contact information.
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Legal first name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alexander"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.firstName && <p className="text-xs text-rose-500 mt-0.5">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Legal last name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sterling"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.lastName && <p className="text-xs text-rose-500 mt-0.5">{errors.lastName}</p>}
                </div>

                <div>
                  {/* Item (13): Removed '(Optional)' */}
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Phone number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7911 123456"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-xs text-rose-500 mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  {/* Item (13): Removed 'email of course' */}
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Email address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@prestige-holdings.com"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-xs text-rose-500 mt-0.5">{errors.email}</p>}
                </div>

                {/* Item (6): Terms of service & privacy notice popup triggers */}
                <div className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  Your information will be processed subject to our{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalPopup('terms')}
                    className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer"
                  >
                    Terms of Service (TOS)
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setActiveLegalPopup('privacy')}
                    className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer"
                  >
                    Privacy Notice
                  </button>
                  . By selecting "Next" I authorize Aureus Home Loans to deliver pre-approval correspondence.
                </div>
              </div>
            )}

            {/* STEP 15: Current physical address */}
            {currentStep === 15 && (
              <div className="space-y-3.5 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    What's your current address?
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Street address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="123 Luxury Boulevard"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.streetAddress && <p className="text-xs text-rose-500 mt-0.5">{errors.streetAddress}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Unit, Apt, Suite
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Suite 400"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.city && <p className="text-xs text-rose-500 mt-0.5">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      State / Region / Province
                    </label>
                    <input
                      type="text"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Postal / ZIP code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.zipCode && <p className="text-xs text-rose-500 mt-0.5">{errors.zipCode}</p>}
                </div>
              </div>
            )}

            {/* STEP 16: Electronic documents consent (Items 9 & 28: white and blue card, responsive popups for consent, TOS, privacy) */}
            {currentStep === 16 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-3 font-sans">
                    Agree to receive documents electronically
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                    To apply online, you’ll need to agree to receive documents electronically. This allows us to deliver important loan information quickly and securely.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If you’d rather not receive electronic documents, you can still apply through private banking concierge.
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-800 mb-3">Please read and agree to the following:</p>
                  <label className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 cursor-pointer shadow-xs">
                    <input
                      type="checkbox"
                      checked={electronicConsent}
                      onChange={(e) => setElectronicConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-blue-600 rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-800 leading-relaxed">
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveLegalPopup('electronic');
                        }}
                        className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer"
                      >
                        Consent to Electronic Communications
                      </button>{' '}
                      for receiving disclosures and other information electronically. I also acknowledge receipt of the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveLegalPopup('terms');
                        }}
                        className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer"
                      >
                        Terms of Service (TOS)
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveLegalPopup('privacy');
                        }}
                        className="text-blue-700 underline font-bold hover:text-blue-900 cursor-pointer"
                      >
                        Privacy Notice
                      </button>
                      .
                    </span>
                  </label>
                  {errors.electronicConsent && (
                    <p className="text-xs text-rose-500 mt-2 font-medium">{errors.electronicConsent}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 17: Credit history intro screen (Clean white and blue) */}
            {currentStep === 17 && (
              <div className="space-y-6 text-center animate-in fade-in duration-150 flex-1 py-4">
                <div className="w-20 h-20 rounded-3xl bg-blue-100 border border-blue-200 flex items-center justify-center mx-auto shadow-md text-blue-600">
                  <ShieldCheck className="w-10 h-10 text-blue-600" />
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                    Next, we’ll ask about your credit history.
                  </h2>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    This includes a soft credit check that is free and won’t affect your credit score in any way.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 18: Bankruptcy */}
            {currentStep === 18 && (
              <div className="space-y-6 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
                    Have you had a bankruptcy, foreclosure, or short sale in the past 7 years?
                  </h2>
                  <p className="text-xs text-rose-500 font-medium">Select an answer *</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(['Yes', 'No'] as const).map((opt) => {
                    const isSelected = hadBankruptcy === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setHadBankruptcy(opt)}
                        className={`p-6 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                          isSelected
                            ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 shadow-xs'
                        }`}
                      >
                        <span className="text-base">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 19: Soft credit check & sovereign ID tailored to chosen country (Items 5, 7, 16, 17, 28) */}
            {currentStep === 19 && (
              <div className="space-y-4 animate-in fade-in duration-150 flex-1">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5 font-sans">
                    Last step — a quick soft credit check
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    The soft credit check is free and <strong className="text-blue-900 font-bold">won’t affect your credit score</strong>.{' '}
                    <button
                      type="button"
                      onClick={() => setActiveLegalPopup('credit-check')}
                      className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer"
                    >
                      Learn more
                    </button>
                  </p>
                </div>

                {/* Sovereign National ID - Clean fresh interface, NO sample suggestions (Item 5, 7, 17) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    {selectedCountry === 'UK' && 'UK National Insurance Number (NINO)'}
                    {selectedCountry === 'CA' && 'Canadian Social Insurance Number (SIN)'}
                    {selectedCountry === 'AU' && 'Australian Tax File Number (TFN)'}
                    {selectedCountry === 'DE' && 'Steueridentifikationsnummer (Steuer-ID / IdNr)'}
                    {' '}<span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sovereignId}
                    onChange={(e) => setSovereignId(e.target.value)}
                    placeholder={
                      selectedCountry === 'UK'
                        ? 'e.g. QQ 12 34 56 C'
                        : selectedCountry === 'CA'
                        ? 'e.g. 046-454-286'
                        : selectedCountry === 'AU'
                        ? 'e.g. 876 543 210'
                        : 'e.g. 26 925 836 189'
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
                  />
                  {/* Live algorithmic validation feedback (Item 5: figures wrong number) */}
                  {sovereignId && (
                    <div className="mt-1.5">
                      {(() => {
                        const val = validateSovereignId(selectedCountry, sovereignId);
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
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
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
                  {errors.sovereignId && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.sovereignId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Date of birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
                  />
                  {errors.dateOfBirth && <p className="text-xs text-rose-500 mt-1">{errors.dateOfBirth}</p>}
                </div>

                {/* Consent checkbox (white & blue theme, Item 28) */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 cursor-pointer shadow-xs">
                  <input
                    type="checkbox"
                    checked={creditReportConsent}
                    onChange={(e) => setCreditReportConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700 leading-relaxed">
                    I provide written authorization under applicable credit reporting regulations for Aureus Private Credit to obtain my consumer credit report for this pre-approval.
                  </span>
                </label>
                {errors.creditReportConsent && (
                  <p className="text-xs text-rose-500">{errors.creditReportConsent}</p>
                )}
              </div>
            )}

            {/* STEP 20: Pre-Approval Submission Status (Not yet granted · Sent to Email · 24h disbursement) */}
            {currentStep === 20 && (
              <div className="space-y-5 text-center animate-in zoom-in-95 duration-200 flex-1 py-2">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-500 text-blue-600 flex items-center justify-center mx-auto shadow-md">
                  <Clock className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div>
                  <span className="text-[11px] font-mono text-blue-700 uppercase tracking-widest font-bold">
                    Official Pre-Approval Status
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                    Application Submitted · Pending Review
                  </h3>
                </div>

                {/* Status notice showing loan status sent to email and 24h disbursement upon grant */}
                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-300 text-left flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Status Dispatched to Your Email
                    </h4>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                      The loan status will be sent to your email (<strong className="text-blue-900 font-semibold">{email}</strong>). After pre-approval is granted, fund disbursement will take place within 24 hours.
                    </p>
                  </div>
                </div>

                {/* Card where it says Pre-Approved Letter, add Status after the letter */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 text-left space-y-2.5 font-mono text-xs shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-mono uppercase text-blue-700 font-bold">
                      Pre-Approved Letter Status
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      Pending Review
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Reference Identification:</span>
                    <span className="text-blue-900 font-bold bg-blue-100 px-2.5 py-0.5 rounded text-xs border border-blue-200">
                      {completedRefId}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Borrower Name:</span>
                    <span className="text-slate-900 font-bold">{firstName} {lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Jurisdiction:</span>
                    <span className="text-blue-800 font-bold">{country.name} ({country.currency})</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Requested Purchase Price:</span>
                    <span className="text-blue-700 font-bold">{formatCurrency(homePrice)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Financed Balance (90%):</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(Math.round(homePrice * 0.9))}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-600 font-sans font-semibold">Disbursement Window:</span>
                    <span className="text-blue-700 font-bold">Within 24 Hours upon grant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-sans font-semibold">Required Down Payment (10%):</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(cashDown)}</span>
                  </div>
                </div>

                {/* Action Buttons: Track in Dashboard + Return */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {onOpenDashboard && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDashboard();
                      }}
                      className="flex-1 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Track Status in My Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className={`${onOpenDashboard ? 'sm:w-1/3' : 'w-full'} py-3.5 px-6 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all`}
                  >
                    Done / Return
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar (Back & Next Buttons) */}
            {currentStep <= 19 && (
              <div className="flex items-center gap-3 pt-5 border-t border-slate-200 mt-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Sovereign Application...</span>
                  ) : currentStep === 0 ? (
                    <>
                      <span>Continue with {country.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : currentStep === 19 ? (
                    <>
                      <span>Submit for Verified Pre-Approval</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODALS FOR TERMS, PRIVACY, ELECTRONIC CONSENT & LEARN MORE (Items 6, 9, 16) */}
      {activeLegalPopup && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border-2 border-blue-200 max-w-lg w-full p-6 shadow-2xl relative text-slate-900 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2 text-blue-900 font-serif font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>
                  {activeLegalPopup === 'terms' && 'Terms of Service (TOS)'}
                  {activeLegalPopup === 'privacy' && 'Privacy Notice'}
                  {activeLegalPopup === 'electronic' && 'Consent to Electronic Communications'}
                  {activeLegalPopup === 'credit-check' && 'About Soft Credit Checks'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveLegalPopup(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 text-xs text-slate-700 space-y-3 leading-relaxed flex-1">
              {activeLegalPopup === 'terms' && (
                <>
                  <p>
                    These Terms of Service govern your use of the Aureus Private Credit pre-approval and institutional balance sheet lending facilities.
                  </p>
                  <p>
                    All facilities are originated by licensed banking and credit entities adhering strictly to domestic regulators: FCA principles in the UK, OSFI & FINTRAC in Canada, ASIC standards in Australia, and BaFin-aligned private credit directives in Germany.
                  </p>
                  <p>
                    A pre-approval does not constitute a final binding commitment until collateral appraisal and legal title validation have completed.
                  </p>
                </>
              )}

              {activeLegalPopup === 'privacy' && (
                <>
                  <p>
                    Aureus respects your confidential financial data. Information provided through this wizard is encrypted using 256-bit SSL/TLS and stored in protected domestic data centers.
                  </p>
                  <p>
                    We never sell personal information to third-party telemarketers. Your sovereign ID and income documents are utilized exclusively for underwriting eligibility and fraud prevention.
                  </p>
                </>
              )}

              {activeLegalPopup === 'electronic' && (
                <>
                  <p>
                    By consenting to electronic communications, you agree to receive all legal disclosures, initial pre-approval certificates, and regulatory loan documentation via secure electronic delivery.
                  </p>
                  <p>
                    You retain the right to withdraw this consent or request paper copies at any time by contacting your assigned loan officer.
                  </p>
                </>
              )}

              {activeLegalPopup === 'credit-check' && (
                <>
                  <p>
                    A soft credit check is an inquiry that does not affect your credit score. Unlike a hard pull performed when formal closing takes place, a soft inquiry is only visible to you.
                  </p>
                  <p>
                    It enables our automated underwriting algorithms to calibrate benchmark pricing and confirm identity without creating any negative marks on your credit profile.
                  </p>
                </>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalPopup(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Budget Modal */}
      {showCustomBudgetModal && (
        <CustomBudgetModal
          isOpen={showCustomBudgetModal}
          onClose={() => setShowCustomBudgetModal(false)}
          currentCountry={selectedCountry}
        />
      )}
    </>
  );
};
