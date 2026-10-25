import React, { useState, useEffect } from 'react';
import {
  CountryCode,
  LoanType,
  PropertyItem,
  VehicleItem,
  FooterModalType,
  InvestmentPlan,
  UserLoan,
  UserInvestment
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoanCards } from './components/LoanCards';
import { AssetSelector } from './components/AssetSelector';
import { ZillowLoanProcess } from './components/ZillowLoanProcess';
import { Calculator } from './components/Calculator';
import { HowItWorks } from './components/HowItWorks';
import { TrustSignals } from './components/TrustSignals';
import { InvestmentPlans } from './components/InvestmentPlans';
import { FAQ } from './components/FAQ';
import { ApplicationForm } from './components/ApplicationForm';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal } from './components/LegalModals';
import { UserDashboard } from './components/UserDashboard';
import { BottomNavBar, BottomNavTab } from './components/BottomNavBar';
import { PreApprovalWizardModal } from './components/PreApprovalWizardModal';
import { FavoritesModal } from './components/FavoritesModal';
import { InboxModal, PreApprovalRecord } from './components/InboxModal';
import { SampleLoanTermsModal } from './components/SampleLoanTermsModal';
import { MessageSquare } from 'lucide-react';
import { CashLoanModal } from './components/CashLoanModal';
import { CustomBudgetModal } from './components/CustomBudgetModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthModal } from './components/AuthModal';
import { SubmissionsStore } from './data/submissionsStore';
import { PROPERTIES_BY_COUNTRY, VEHICLES_BY_COUNTRY } from './data/catalog';

export default function App() {
  // Country state with localStorage persistence
  const [currentCountry, setCurrentCountry] = useState<CountryCode>(() => {
    try {
      const saved = localStorage.getItem('aureus_country');
      if (saved && ['UK', 'CA', 'AU', 'DE'].includes(saved)) {
        return saved as CountryCode;
      }
    } catch {
      // Fallback
    }
    return 'UK';
  });

  // Selected loan type for calculator & form coordination
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType>('home');
  const [formPrepopAmount, setFormPrepopAmount] = useState<number | undefined>(undefined);
  const [formPrepopTerm, setFormPrepopTerm] = useState<number | undefined>(undefined);

  // Selected asset from the 20 homes / 20 cars catalog
  const [selectedAsset, setSelectedAsset] = useState<{
    type: LoanType;
    id: string;
    title: string;
    price: number;
  } | null>(null);

  // User Dashboard State
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Down Navigation State
  const [activeBottomTab, setActiveBottomTab] = useState<BottomNavTab>('home-loans');

  // Favorites State
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<string[]>(['uk-prop-1', 'uk-prop-2']);
  const [favoriteVehicleIds, setFavoriteVehicleIds] = useState<string[]>(['uk-veh-1']);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  // Pre-Approval Wizard (Steps 1 to 4) State
  const [isPreApprovalModalOpen, setIsPreApprovalModalOpen] = useState(false);
  const [preApprovalInitialAsset, setPreApprovalInitialAsset] = useState<{
    type: LoanType;
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
  } | null>(null);

  // Sample Loan Terms Modal State
  const [isSampleTermsModalOpen, setIsSampleTermsModalOpen] = useState(false);
  const [sampleTermsProduct, setSampleTermsProduct] = useState('30-Year Fixed');

  // Cash Loan Modal (Offers Cash Loan) State
  const [isCashLoanModalOpen, setIsCashLoanModalOpen] = useState(false);

  // Custom Budget Modal State
  const [isCustomBudgetModalOpen, setIsCustomBudgetModalOpen] = useState(false);

  // Admin Dashboard Modal State
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Loan Pre-Approval Applications / Inbox State
  const [preApprovalApplications, setPreApprovalApplications] = useState<PreApprovalRecord[]>([
    {
      id: 'PRE-APP-2026-94102',
      assetTitle: 'The St. James Terrace Penthouse',
      assetType: 'home',
      assetPrice: 980000,
      downPayment: 98000,
      financedAmount: 882000,
      termYears: 30,
      rate: 5.85,
      monthlyPayment: 4658,
      borrowerName: 'Alexander Vance',
      borrowerEmail: 'alexander.vance@prestige-holdings.co.uk',
      borrowerPhone: '+44 20 7946 0912',
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'Verified Pre-Approved',
    },
  ]);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);

  // User Investments State
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([
    {
      id: 'INV-7731-PL',
      planId: 'plan-growth-liquidity',
      planName: 'Prestige Automotive Liquidity Pool',
      principalAmount: 75000,
      apy: 11.2,
      termMonths: 12,
      startDate: '2026-04-15',
      accruedYield: 4200,
      nextPayoutDate: '2026-11-01',
      payoutFrequency: 'Monthly',
      autoReinvest: true,
    },
    {
      id: 'INV-4412-TR',
      planId: 'plan-starter-yield',
      planName: 'Prime Asset Yield Note',
      principalAmount: 25000,
      apy: 8.4,
      termMonths: 6,
      startDate: '2026-07-01',
      accruedYield: 1050,
      nextPayoutDate: '2026-10-15',
      payoutFrequency: 'Quarterly',
      autoReinvest: false,
    },
  ]);

  // User Active Loans State
  const [userLoans, setUserLoans] = useState<UserLoan[]>([
    {
      id: 'LN-UK-8492',
      assetTitle: 'The St. James Terrace Penthouse',
      assetType: 'home',
      assetPrice: 980000,
      upfrontPaid: 98000, // 10%
      financedBalance: 882000,
      interestRate: 4.85,
      monthlyPayment: 4658,
      termMonths: 300,
      remainingMonths: 294,
      status: 'Active',
      nextPaymentDate: '2026-11-01',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      propertyRefId: 'uk-prop-1',
    },
    {
      id: 'LN-CAR-3910',
      assetTitle: '2026 Aston Martin Vanquish V12',
      assetType: 'car',
      assetPrice: 330000,
      upfrontPaid: 33000, // 10%
      financedBalance: 297000,
      interestRate: 6.45,
      monthlyPayment: 5792,
      termMonths: 60,
      remainingMonths: 56,
      status: 'Active',
      nextPaymentDate: '2026-11-05',
      imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    },
  ]);

  // Footer modal popup state for any navigation/legal click
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);
  const [forceCookieBanner, setForceCookieBanner] = useState(false);

  // Save country preference
  const handleSelectCountry = (country: CountryCode) => {
    setCurrentCountry(country);
    setSelectedAsset(null);
    setFormPrepopAmount(undefined);
    try {
      localStorage.setItem('aureus_country', country);
    } catch {
      // Ignore
    }
  };

  // Butter-smooth scroll helpers with automatic fixed header offset
  const smoothScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const headerHeight = 92;
    const targetY = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  };

  const scrollToCatalog = () => smoothScrollTo('asset-selection');
  const scrollToRates = () => {
    const el = document.getElementById('rates-comparison');
    if (el) smoothScrollTo('rates-comparison');
    else smoothScrollTo('calculator');
  };
  const scrollToForm = () => smoothScrollTo('application-form');
  const scrollToCalculator = () => smoothScrollTo('calculator');
  const scrollToInvestments = () => smoothScrollTo('investment-plans');

  // When user selects a property or car from catalog
  const handleSelectAsset = (type: LoanType, item: PropertyItem | VehicleItem) => {
    setSelectedAsset({
      type,
      id: item.id,
      title: item.title,
      price: item.price,
    });
    setSelectedLoanType(type);
    setFormPrepopAmount(item.price);
  };

  // Toggle favorite property
  const handleToggleFavoriteProperty = (id: string) => {
    setFavoritePropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle favorite vehicle
  const handleToggleFavoriteVehicle = (id: string) => {
    setFavoriteVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Down Navigation Tab Click
  const handleSelectBottomTab = (tab: BottomNavTab) => {
    setActiveBottomTab(tab);
    if (tab === 'home-loans') {
      setSelectedLoanType('home');
      scrollToCatalog();
    } else if (tab === 'car-loans') {
      setSelectedLoanType('car');
      scrollToCatalog();
    } else if (tab === 'investment') {
      scrollToInvestments();
    } else if (tab === 'cash-loan') {
      setIsCashLoanModalOpen(true);
    }
  };

  // When pre-approval application is completed (Step 4 Submit)
  const handleApplicationCompleted = (app: PreApprovalRecord) => {
    setPreApprovalApplications((prev) => [app, ...prev]);

    // Also add to active user loans for portfolio tracking
    const newLoan: UserLoan = {
      id: app.id,
      assetTitle: app.assetTitle,
      assetType: app.assetType,
      assetPrice: app.assetPrice,
      upfrontPaid: app.downPayment,
      financedBalance: app.financedAmount,
      interestRate: app.rate,
      monthlyPayment: app.monthlyPayment,
      termMonths: app.termYears * 12,
      remainingMonths: app.termYears * 12,
      status: 'Active',
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      imageUrl: preApprovalInitialAsset?.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      propertyRefId: preApprovalInitialAsset?.id,
    };
    setUserLoans((prev) => [newLoan, ...prev]);
  };

  // When user clicks "Lock In Estimate & Proceed to Application" in calculator
  const handleApplyWithCalculation = (type: LoanType, amount: number, term: number) => {
    setSelectedLoanType(type);
    setFormPrepopAmount(amount);
    setFormPrepopTerm(term);
    setPreApprovalInitialAsset({
      type,
      id: selectedAsset?.id || `calc-${Date.now()}`,
      title: selectedAsset?.title || `${type === 'home' ? 'Prime Residential Home' : 'Luxury Performance Vehicle'} Facility`,
      price: amount,
    });
    setIsPreApprovalModalOpen(true);
  };

  // Handle starting a new investment plan
  const handleSelectPlanToInvest = (plan: InvestmentPlan, amount: number) => {
    const newInv: UserInvestment = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      planId: plan.id,
      planName: plan.name,
      principalAmount: amount,
      apy: plan.apy,
      termMonths: plan.durationMonths,
      startDate: new Date().toISOString().split('T')[0],
      accruedYield: Math.round(amount * (plan.apy / 100 / 12)),
      nextPayoutDate: '2026-11-01',
      payoutFrequency: plan.payoutFrequency,
      autoReinvest: true,
    };
    setUserInvestments((prev) => [newInv, ...prev]);
  };

  // Item (30): Select tier brings direct application form instantly
  const handleApplyForPlan = (plan: InvestmentPlan, amount: number) => {
    setSelectedAsset({
      type: 'home',
      id: plan.id,
      title: `${plan.name} (${plan.apy}% APY Direct Facility)`,
      price: amount,
    });
    setFormPrepopAmount(amount);
    scrollToForm();
  };

  const currentProperties = PROPERTIES_BY_COUNTRY[currentCountry] || [];
  const currentVehicles = VEHICLES_BY_COUNTRY[currentCountry] || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 pb-24 sm:pb-28">
      {/* Fixed Luxury Header */}
      <Header
        currentCountry={currentCountry}
        onSelectCountry={handleSelectCountry}
        onNavigateToForm={() => {
          setPreApprovalInitialAsset(null);
          setIsPreApprovalModalOpen(true);
        }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Sections - Restored Website Layout */}
      <main className="flex-1">
        {/* 1. Hero Section: Direct Asset Acquisition (10% Down) or Institutional Investment Plans */}
        <Hero
          currentCountry={currentCountry}
          onSelectCountry={handleSelectCountry}
          onCheckRate={() => {
            setPreApprovalInitialAsset(null);
            setIsPreApprovalModalOpen(true);
          }}
          onOpenCalculator={scrollToCalculator}
          onBrowseCatalog={scrollToCatalog}
          onOpenInvestmentPlans={scrollToInvestments}
          onOpenWebApp={() => setIsDashboardOpen(true)}
        />

        {/* 2. Direct Balance Sheet Loan Facilities (Homes & Cars 10% Down) */}
        <LoanCards
          currentCountry={currentCountry}
          onSelectLoanForCalculator={(type) => {
            setSelectedLoanType(type);
            scrollToCalculator();
          }}
          onSelectLoanForForm={(type) => {
            setSelectedLoanType(type);
            scrollToForm();
          }}
        />

        {/* 3. Curated Marketplace: 20 Luxury Homes & 20 Worldwide Cars */}
        <AssetSelector
          currentCountry={currentCountry}
          onSelectCountry={handleSelectCountry}
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          onNavigateToCalculator={scrollToCalculator}
          onNavigateToForm={scrollToForm}
          activeTab={selectedLoanType}
          onTabChange={(t) => setSelectedLoanType(t)}
          onClearSelection={() => {
            setSelectedAsset(null);
            setFormPrepopAmount(undefined);
          }}
          onOpenPreApproval={(asset) => {
            setPreApprovalInitialAsset(asset || null);
            setIsPreApprovalModalOpen(true);
          }}
          favoritePropertyIds={favoritePropertyIds}
          favoriteVehicleIds={favoriteVehicleIds}
          onToggleFavoriteProperty={handleToggleFavoriteProperty}
          onToggleFavoriteVehicle={handleToggleFavoriteVehicle}
          onOpenCustomBudget={() => setIsCustomBudgetModalOpen(true)}
        />

        {/* 4. Zillow-Style Loan Options & 4-Step Home Loan Process */}
        <ZillowLoanProcess
          currentCountry={currentCountry}
          onOpenPreApproval={() => {
            setPreApprovalInitialAsset(null);
            setIsPreApprovalModalOpen(true);
          }}
          onOpenSampleTerms={(product) => {
            setSampleTermsProduct(product || '30-Year Fixed');
            setIsSampleTermsModalOpen(true);
          }}
          onOpenCustomBudget={() => setIsCustomBudgetModalOpen(true)}
        />

        {/* 5. Interactive Loan Calculator (defaulting to 10% Upfront Down Payment) */}
        <Calculator
          currentCountry={currentCountry}
          selectedLoanType={selectedLoanType}
          onChangeLoanType={setSelectedLoanType}
          onApplyWithCalculation={handleApplyWithCalculation}
          selectedAsset={selectedAsset}
          customAmount={formPrepopAmount}
          onClearSelectedAsset={() => {
            setSelectedAsset(null);
            setFormPrepopAmount(undefined);
          }}
          onBrowseAssets={scrollToCatalog}
        />

        {/* 6. How Direct Lending Operates (3-Step Sovereign Execution) */}
        <HowItWorks currentCountry={currentCountry} />

        {/* 7. Institutional Balance Sheet Power & Security (4 Pillars & Lenders) */}
        <TrustSignals currentCountry={currentCountry} />

        {/* 8. Institutional Investment Plans (8.4% - 15.6% APY) with Yield Calculator */}
        <InvestmentPlans
          currentCountry={currentCountry}
          onOpenDashboard={() => setIsDashboardOpen(true)}
        />

        {/* 9. Essential FAQ */}
        <FAQ currentCountry={currentCountry} />
      </main>

      {/* Comprehensive Compliance Footer with Clickable Popup Navigation */}
      <Footer
        currentCountry={currentCountry}
        onOpenModal={setActiveModal}
        onOpenCookieBanner={() => setForceCookieBanner(true)}
      />

      {/* Down Navigation Bar (Always Accessible at the bottom) */}
      <BottomNavBar
        currentCountry={currentCountry}
        activeTab={activeBottomTab}
        onSelectTab={handleSelectBottomTab}
        inboxCount={preApprovalApplications.length}
      />

      {/* GDPR Cookie Consent Banner */}
      <CookieBanner
        currentCountry={currentCountry}
        forceOpen={forceCookieBanner}
        onCloseForceOpen={() => setForceCookieBanner(false)}
      />

      {/* Interactive Information Popups for Footer Navigation & Legal */}
      <LegalModal
        modalType={activeModal}
        currentCountry={currentCountry}
        onClose={() => setActiveModal(null)}
        onNavigateToSection={(secId) => {
          smoothScrollTo(secId);
        }}
      />


      {/* 19-Step Pre-Approval Application Wizard Modal matching Zillow Home Loans */}
      <PreApprovalWizardModal
        isOpen={isPreApprovalModalOpen}
        onClose={() => setIsPreApprovalModalOpen(false)}
        currentCountry={currentCountry}
        initialAsset={preApprovalInitialAsset}
        onApplicationCompleted={handleApplicationCompleted}
        onNavigateToInbox={() => setIsInboxModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Favorites Modal (Saved Homes & Cars with Pre-Approval) */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        currentCountry={currentCountry}
        favoritePropertyIds={favoritePropertyIds}
        favoriteVehicleIds={favoriteVehicleIds}
        properties={currentProperties}
        vehicles={currentVehicles}
        onOpenPreApprovalForAsset={(asset) => {
          setIsFavoritesModalOpen(false);
          setPreApprovalInitialAsset(asset);
          setIsPreApprovalModalOpen(true);
        }}
        onToggleFavoriteProperty={handleToggleFavoriteProperty}
        onToggleFavoriteVehicle={handleToggleFavoriteVehicle}
      />

      {/* Inbox Modal (Official Loan Status & Pre-Approval Letters) */}
      <InboxModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
        currentCountry={currentCountry}
        applications={preApprovalApplications}
        onOpenPreApproval={() => {
          setIsInboxModalOpen(false);
          setPreApprovalInitialAsset(null);
          setIsPreApprovalModalOpen(true);
        }}
      />

      {/* Sample Loan Terms & Cost Breakdown Modal */}
      <SampleLoanTermsModal
        isOpen={isSampleTermsModalOpen}
        onClose={() => setIsSampleTermsModalOpen(false)}
        currentCountry={currentCountry}
        selectedProduct={sampleTermsProduct}
        onGetPreApproved={() => {
          setIsSampleTermsModalOpen(false);
          setPreApprovalInitialAsset(null);
          setIsPreApprovalModalOpen(true);
        }}
      />

      {/* User Portfolio / Dashboard Modal */}
      {isDashboardOpen && (
        <UserDashboard
          currentCountry={currentCountry}
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          onBrowseMarketplace={() => scrollToCatalog()}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenCashLoan={() => {
            setIsDashboardOpen(false);
            setIsCashLoanModalOpen(true);
          }}
          onOpenHomePreApproval={() => {
            setIsDashboardOpen(false);
            setPreApprovalInitialAsset(null);
            setIsPreApprovalModalOpen(true);
          }}
          onOpenInvestments={() => {
            setIsDashboardOpen(false);
            scrollToInvestments();
          }}
        />
      )}

      {/* Client Portal Authentication Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={() => {
          setIsAuthModalOpen(false);
          setIsDashboardOpen(true);
        }}
      />



      {/* Cash Loan Modal (Offers Cash Loan - Dedicated Cash Flow) */}
      <CashLoanModal
        isOpen={isCashLoanModalOpen}
        onClose={() => setIsCashLoanModalOpen(false)}
        currentCountry={currentCountry}
        onOpenInbox={() => {
          setIsCashLoanModalOpen(false);
          setIsInboxModalOpen(true);
        }}
        onOpenCustomBudget={() => {
          setIsCashLoanModalOpen(false);
          setIsCustomBudgetModalOpen(true);
        }}
        onOpenAdmin={() => {
          setIsCashLoanModalOpen(false);
          setIsAdminDashboardOpen(true);
        }}
        onOpenDashboard={() => {
          setIsCashLoanModalOpen(false);
          setIsDashboardOpen(true);
        }}
      />

      {/* Custom Budget Modal with Email Field & Subject Picker */}
      <CustomBudgetModal
        isOpen={isCustomBudgetModalOpen}
        onClose={() => setIsCustomBudgetModalOpen(false)}
        currentCountry={currentCountry}
      />

      {/* Institutional Admin Dashboard Modal (Inspect all user submissions & email clients) */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        currentCountry={currentCountry}
      />
    </div>
  );
}
