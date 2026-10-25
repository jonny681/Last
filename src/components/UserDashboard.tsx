import React, { useState, useEffect, useRef } from 'react';
import {
  CountryCode,
  PreApprovalSubmission,
  CashLoanSubmission,
  InvestmentSubmission,
  ChatMessage,
  PropertyItem,
  VehicleItem,
  UserPaymentMethod,
  BitcoinSettlementTransaction,
} from '../types';
import { COUNTRIES } from '../data/translations';
import {
  PROPERTIES_BY_COUNTRY,
  WORLDWIDE_VEHICLES,
  VEHICLES_BY_COUNTRY,
} from '../data/catalog';
import { INVESTMENT_TIERS, InvestmentTierConfig } from '../data/investmentPlans';
import {
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Banknote,
  TrendingUp,
  User,
  LogOut,
  Mail,
  ArrowRight,
  ArrowLeft,
  Send,
  MessageSquare,
  Home,
  Car,
  CreditCard,
  ChevronRight,
  Wallet,
  Phone,
  RefreshCw,
  Menu,
  Search,
  Filter,
  Check,
  Zap,
  Download,
  Building,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Bell,
  Sparkles,
  Gift,
  Share2,
  Copy,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Bitcoin,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { SubmissionsStore, DEFAULT_COMPANY_BTC_ADDRESS } from '../data/submissionsStore';
import { FirebaseService, AppUser } from '../services/firebaseService';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface UserDashboardProps {
  currentCountry: CountryCode;
  isOpen: boolean;
  onClose: () => void;
  onBrowseMarketplace?: () => void;
  onOpenAuth?: () => void;
  onOpenCashLoan?: () => void;
  onOpenHomePreApproval?: () => void;
  onOpenInvestments?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentCountry,
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const country = COUNTRIES[currentCountry];
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'my-loans'
    | 'my-investments'
    | 'payment-methods'
    | 'card-to-bitcoin'
    | 'homeloans'
    | 'carloans'
    | 'investments'
    | 'cashloans'
    | 'chat'
    | 'repayments'
  >('overview');

  // Currency display state (matching Bamboo currency toggle)
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'NGN'>('USD');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addMoneyTab, setAddMoneyTab] = useState<'card_to_btc' | 'wire'>('card_to_btc');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState<string>('5000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('2500');
  const [referralCopied, setReferralCopied] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Free Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([]);
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [newPmType, setNewPmType] = useState<'bank_account' | 'debit_card' | 'wire_transfer' | 'card_to_crypto'>('bank_account');
  const [newPmInstitution, setNewPmInstitution] = useState('');
  const [newPmHolder, setNewPmHolder] = useState('');
  const [newPmNumber, setNewPmNumber] = useState('');
  const [newPmRouting, setNewPmRouting] = useState('');
  const [newPmExpiry, setNewPmExpiry] = useState('');
  const [newPmCvv, setNewPmCvv] = useState('');
  const [newPmZip, setNewPmZip] = useState('');
  const [newPmSetDefault, setNewPmSetDefault] = useState(true);

  // Bitcoin & Card-to-Bitcoin Direct Treasury Payment Gateway State
  const [isCardToBtcModalOpen, setIsCardToBtcModalOpen] = useState(false);
  const [btcFiatAmount, setBtcFiatAmount] = useState<string>('5000');
  const [btcCardNumber, setBtcCardNumber] = useState('');
  const [btcCardExpiry, setBtcCardExpiry] = useState('');
  const [btcCardCvv, setBtcCardCvv] = useState('');
  const [btcCardHolder, setBtcCardHolder] = useState('');
  const [btcBillingZip, setBtcBillingZip] = useState('');
  const [btcPaymentPurpose, setBtcPaymentPurpose] = useState('Direct Capital Deposit & Treasury Allocation');
  const [isProcessingBtcPayment, setIsProcessingBtcPayment] = useState(false);
  const [btcSuccessTx, setBtcSuccessTx] = useState<BitcoinSettlementTransaction | null>(null);
  const [companyBtcAddress] = useState<string>(() => SubmissionsStore.getCompanyBtcAddress());
  const [btcTransactions, setBtcTransactions] = useState<BitcoinSettlementTransaction[]>(() => SubmissionsStore.getBitcoinTransactions());
  const [btcRate] = useState<number>(68450); // Live spot $68,450 USD / BTC
  const [copiedBtcAddress, setCopiedBtcAddress] = useState(false);
  const [qrCodeModalOpen, setQrCodeModalOpen] = useState(false);
  const [selectedOnRampProvider, setSelectedOnRampProvider] = useState<'moonpay' | 'transak' | 'ramp'>('moonpay');
  const [onRampViewMode, setOnRampViewMode] = useState<'embedded_widget' | 'card_checkout'>('embedded_widget');
  const [onRampStep, setOnRampStep] = useState<'details' | 'processing' | 'blockchain_dispatch' | 'completed'>('details');

  // Sub-tabs for in-app catalogs vs existing applications
  const [carView, setCarView] = useState<'catalog' | 'applications'>('catalog');
  const [homeView, setHomeView] = useState<'catalog' | 'applications'>('catalog');
  const [investView, setInvestView] = useState<'catalog' | 'portfolio'>('catalog');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Vehicle filters
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState<string>('all');
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState<string>('');

  // Property search
  const [propertySearchQuery, setPropertySearchQuery] = useState<string>('');

  // Investment duration selection
  const [selectedInvestDuration, setSelectedInvestDuration] = useState<6 | 12>(12);

  // In-app Application Modal state
  const [selectedVehicleForFinance, setSelectedVehicleForFinance] = useState<VehicleItem | null>(null);
  const [selectedPropertyForMortgage, setSelectedPropertyForMortgage] = useState<PropertyItem | null>(null);
  const [selectedTierForInvest, setSelectedTierForInvest] = useState<InvestmentTierConfig | null>(null);

  // In-app application form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSovereignId, setFormSovereignId] = useState('');
  const [formBankName, setFormBankName] = useState('');
  const [formAccountNumber, setFormAccountNumber] = useState('');
  const [formTermYears, setFormTermYears] = useState<number>(5);
  const [isSubmittingInApp, setIsSubmittingInApp] = useState(false);

  // In-app Express Cash Loan request state
  const [cashAmount, setCashAmount] = useState<number>(75000);
  const [cashTermMonths, setCashTermMonths] = useState<number>(36);
  const [cashDisbursementMethod, setCashDisbursementMethod] = useState<'Direct Wire Transfer' | 'Official Cheque by Courier'>('Direct Wire Transfer');
  const [cashPurpose, setCashPurpose] = useState<string>('Asset Acquisition / Liquidity Bridge');
  const [cashApplicantName, setCashApplicantName] = useState<string>('');
  const [cashApplicantEmail, setCashApplicantEmail] = useState<string>('');
  const [cashApplicantPhone, setCashApplicantPhone] = useState<string>('');
  const [cashBankName, setCashBankName] = useState<string>('');
  const [cashAccountNumber, setCashAccountNumber] = useState<string>('');
  const [cashDeliveryAddress, setCashDeliveryAddress] = useState<string>('');

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Current User state
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => FirebaseService.getCurrentUser());

  // Portfolio data
  const [userPreApprovals, setUserPreApprovals] = useState<PreApprovalSubmission[]>([]);
  const [userCashLoans, setUserCashLoans] = useState<CashLoanSubmission[]>([]);
  const [userInvestments, setUserInvestments] = useState<InvestmentSubmission[]>([]);

  // Real-time Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return formatCurrencyCached(amount, currentCountry);
  };

  // Subscribe to Auth state
  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthChanged((user) => {
      setCurrentUser(user);
      if (user) {
        loadUserData(user.email);
        if (user.displayName) setFormName(user.displayName);
        if (user.email) setFormEmail(user.email);
        if (user.phone) setFormPhone(user.phone);
        if (user.displayName) setCashApplicantName(user.displayName);
        if (user.email) setCashApplicantEmail(user.email);
        if (user.phone) setCashApplicantPhone(user.phone);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = (email?: string) => {
    const targetEmail = email || currentUser?.email || '';
    if (!targetEmail) {
      setUserPreApprovals([]);
      setUserCashLoans([]);
      setUserInvestments([]);
      setChatMessages([]);
      setPaymentMethods(SubmissionsStore.getPaymentMethods());
      return;
    }

    const data = SubmissionsStore.getUserPortfolioData(targetEmail);
    setUserPreApprovals(data.preApprovals);
    setUserCashLoans(data.cashLoans);
    setUserInvestments(data.investments);

    const msgs = SubmissionsStore.getChatMessages(targetEmail);
    setChatMessages(msgs);

    const pms = SubmissionsStore.getPaymentMethods(targetEmail);
    setPaymentMethods(pms);

    const btx = SubmissionsStore.getBitcoinTransactions(targetEmail);
    setBtcTransactions(btx);
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPmInstitution.trim() || !newPmNumber.trim() || !newPmHolder.trim()) {
      setFeedbackMessage('Please provide institution name, account/card number, and holder name.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    const cleanNum = newPmNumber.replace(/\s+/g, '');
    const masked = cleanNum.length > 4 ? `•••• ${cleanNum.slice(-4)}` : `•••• ${cleanNum}`;

    const newMethod = SubmissionsStore.addPaymentMethod({
      userEmail: currentUser?.email || 'client@aureus-capital.com',
      type: newPmType,
      label:
        newPmType === 'bank_account'
          ? 'Direct Bank Account'
          : newPmType === 'debit_card'
          ? 'Primary Debit Card'
          : newPmType === 'card_to_crypto'
          ? 'Credit/Debit Card (Card-to-Bitcoin Rail)'
          : 'Direct Wire Account',
      institutionName: newPmInstitution.trim(),
      accountOrCardNumberMasked: masked,
      routingOrSortCode: newPmRouting.trim() || undefined,
      holderName: newPmHolder.trim(),
      expiry: newPmExpiry.trim() || undefined,
      isDefault: newPmSetDefault,
    });

    setPaymentMethods(SubmissionsStore.getPaymentMethods(currentUser?.email || ''));
    setIsAddPaymentMethodOpen(false);
    setNewPmInstitution('');
    setNewPmHolder('');
    setNewPmNumber('');
    setNewPmRouting('');
    setNewPmExpiry('');
    setNewPmCvv('');
    setNewPmZip('');

    setFeedbackMessage(`Free payment method (${newMethod.institutionName}) linked successfully with $0.00 fees!`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleExecuteCardToBitcoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCard = btcCardNumber.replace(/\s+/g, '');
    if (!cleanCard || cleanCard.length < 12) {
      setFeedbackMessage('Please enter a valid 16-digit debit or credit card number.');
      setTimeout(() => setFeedbackMessage(null), 3500);
      return;
    }
    if (!btcCardExpiry || !btcCardCvv || !btcCardHolder) {
      setFeedbackMessage('Please complete cardholder name, expiry date, and CVV.');
      setTimeout(() => setFeedbackMessage(null), 3500);
      return;
    }

    const fiatNum = parseFloat(btcFiatAmount) || 1000;
    const btcAmount = Number((fiatNum / btcRate).toFixed(6));
    const cardLast4 = cleanCard.slice(-4);
    const brand = cleanCard.startsWith('4') ? 'Visa' : cleanCard.startsWith('5') ? 'Mastercard' : 'Debit/Credit Card';

    setIsProcessingBtcPayment(true);

    setTimeout(() => {
      const recorded = SubmissionsStore.recordBitcoinTransaction({
        userEmail: currentUser?.email || 'client@aureus-capital.com',
        userName: btcCardHolder.trim(),
        fiatAmount: fiatNum,
        fiatCurrency: selectedCurrency,
        btcAmount,
        btcRate,
        companyBtcAddress,
        cardLast4,
        cardBrand: `${brand} (Direct-to-BTC Rail)`,
        purpose: btcPaymentPurpose,
      });

      setIsProcessingBtcPayment(false);
      setBtcSuccessTx(recorded);
      setBtcTransactions(SubmissionsStore.getBitcoinTransactions(currentUser?.email || ''));
      setIsCardToBtcModalOpen(false);
      setIsAddMoneyOpen(false);
      setFeedbackMessage(`Card charged ${selectedCurrency} ${fiatNum.toLocaleString()} — ${btcAmount} BTC settled directly into Company Bitcoin Treasury!`);
      setTimeout(() => setFeedbackMessage(null), 6000);
    }, 1300);
  };

  useEffect(() => {
    if (isOpen) {
      const user = FirebaseService.getCurrentUser();
      setCurrentUser(user);
      loadUserData(user?.email);
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentUser?.email) {
      const unsub = FirebaseService.subscribeChat(currentUser.email, (realtimeMsgs) => {
        if (realtimeMsgs && realtimeMsgs.length > 0) {
          setChatMessages(realtimeMsgs);
        }
      });
      return () => unsub();
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'chat') {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [chatMessages, activeTab]);

  const handleLogout = async () => {
    await FirebaseService.signOut();
    setCurrentUser(null);
    setUserPreApprovals([]);
    setUserCashLoans([]);
    setUserInvestments([]);
    setChatMessages([]);
    if (onOpenAuth) {
      onClose();
      onOpenAuth();
    }
  };

  const handleSendChat = async (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();
    const textToSend = promptText || chatInput;
    if (!textToSend.trim()) return;

    const email = currentUser?.email || 'client@aureus-capital.com';
    const senderName = currentUser?.displayName || 'Client';

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userEmail: email.toLowerCase(),
      sender: 'user',
      senderName,
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    SubmissionsStore.sendChatMessage(email, 'user', textToSend.trim(), senderName);
    await FirebaseService.sendChatMessage(newMsg);

    setChatMessages((prev) => [...prev, newMsg]);
    if (!promptText) setChatInput('');

    setTimeout(async () => {
      const underwriterReply: ChatMessage = {
        id: `MSG-ADM-${Date.now()}`,
        userEmail: email.toLowerCase(),
        sender: 'admin',
        senderName: 'Julian Sterling (Chat Support Specialist)',
        text: `Thank you for contacting Chat Support. Your balance sheet facility is active. All clearing certificates and disbursement schedules will be sent directly to this private thread and your email (${email}).`,
        timestamp: new Date().toISOString(),
      };
      SubmissionsStore.sendChatMessage(email, 'admin', underwriterReply.text, underwriterReply.senderName);
      await FirebaseService.sendChatMessage(underwriterReply);
      setChatMessages((prev) => [...prev, underwriterReply]);
    }, 1100);
  };

  // Submit in-app auto finance pre-approval
  const handleSubmitVehicleFinance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleForFinance) return;
    setIsSubmittingInApp(true);

    const price = selectedVehicleForFinance.price;
    const down = Math.round(price * 0.1);
    const financed = price - down;
    const monthly = Math.round((financed * 1.0419) / (formTermYears * 12));

    const newSubmission: PreApprovalSubmission = {
      id: `AUR-CAR-${country.code}-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      timeframe: 'Immediately (48h Freight)',
      propertyType: `${selectedVehicleForFinance.year} ${selectedVehicleForFinance.make} ${selectedVehicleForFinance.model}`,
      homeUsage: 'Prime Automotive Asset',
      cityOrZip: selectedVehicleForFinance.tag,
      workingWithAgent: 'No',
      homePrice: price,
      monthlyPayment: monthly,
      downPayment: down,
      downPaymentTiming: "It's available now",
      grossIncome: 180000,
      selfEmployed: 'No',
      ownedHomePast3Years: 'Yes',
      militaryAffiliation: 'No',
      firstName: formName.split(' ')[0] || 'Client',
      lastName: formName.split(' ').slice(1).join(' ') || 'Prestige',
      fullName: formName || 'Private Client',
      email: formEmail || currentUser?.email || 'client@aureus-capital.com',
      phone: formPhone || '+1 (800) 555-0199',
      streetAddress: '100 Financial Boulevard',
      city: 'Capital City',
      state: 'Central',
      zipCode: '10001',
      electronicConsent: true,
      hadBankruptcy: 'No',
      sovereignId: formSovereignId || 'AUTH-VERIFIED',
      dateOfBirth: '1985-06-15',
      creditReportConsent: true,
      status: 'Verified Pre-Approved',
      preApprovedAmount: financed,
      interestRate: 4.19,
    };

    SubmissionsStore.addPreApprovalSubmission(newSubmission);
    await FirebaseService.saveLoan(newSubmission);

    setUserPreApprovals((prev) => [newSubmission, ...prev]);
    setIsSubmittingInApp(false);
    setSelectedVehicleForFinance(null);
    setCarView('applications');
    setFeedbackMessage(`Pre-approval secured for ${selectedVehicleForFinance.make} ${selectedVehicleForFinance.model}. 10% down payment terms locked.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Submit in-app home mortgage pre-approval
  const handleSubmitHomeMortgage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyForMortgage) return;
    setIsSubmittingInApp(true);

    const price = selectedPropertyForMortgage.price;
    const down = Math.round(price * 0.1);
    const financed = price - down;
    const monthly = Math.round((financed * 1.039) / (formTermYears * 12));

    const newSubmission: PreApprovalSubmission = {
      id: `AUR-HOME-${country.code}-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      timeframe: 'Within 30 Days',
      propertyType: selectedPropertyForMortgage.title,
      homeUsage: 'Primary Residence',
      cityOrZip: selectedPropertyForMortgage.location,
      workingWithAgent: 'No',
      homePrice: price,
      monthlyPayment: monthly,
      downPayment: down,
      downPaymentTiming: "It's available now",
      grossIncome: 240000,
      selfEmployed: 'No',
      ownedHomePast3Years: 'Yes',
      militaryAffiliation: 'No',
      firstName: formName.split(' ')[0] || 'Client',
      lastName: formName.split(' ').slice(1).join(' ') || 'Prestige',
      fullName: formName || 'Private Client',
      email: formEmail || currentUser?.email || 'client@aureus-capital.com',
      phone: formPhone || '+1 (800) 555-0199',
      streetAddress: selectedPropertyForMortgage.location,
      city: selectedPropertyForMortgage.location.split(',')[0] || 'Metropolis',
      state: country.name,
      zipCode: '10021',
      electronicConsent: true,
      hadBankruptcy: 'No',
      sovereignId: formSovereignId || 'AUTH-VERIFIED',
      dateOfBirth: '1984-08-20',
      creditReportConsent: true,
      status: 'Verified Pre-Approved',
      preApprovedAmount: financed,
      interestRate: 3.9,
    };

    SubmissionsStore.addPreApprovalSubmission(newSubmission);
    await FirebaseService.saveLoan(newSubmission);

    setUserPreApprovals((prev) => [newSubmission, ...prev]);
    setIsSubmittingInApp(false);
    setSelectedPropertyForMortgage(null);
    setHomeView('applications');
    setFeedbackMessage(`Mortgage pre-approved for ${selectedPropertyForMortgage.title}. Ref: ${newSubmission.id}`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Submit in-app capital allocation
  const handleSubmitInvestmentAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierForInvest) return;
    setIsSubmittingInApp(true);

    const tierRate = selectedTierForInvest.rates[selectedInvestDuration];
    const newInv: InvestmentSubmission = {
      id: `AUR-WEALTH-${country.code}-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      tierId: selectedTierForInvest.id,
      tierName: selectedTierForInvest.name,
      principalAmount: selectedTierForInvest.price,
      durationMonths: selectedInvestDuration,
      ratePercent: tierRate.ratePercent,
      totalYield: tierRate.yieldTotal,
      gain: tierRate.gain,
      monthlyPayout: tierRate.monthlyPayout,
      fullName: formName || 'Private Client',
      email: formEmail || currentUser?.email || 'client@aureus-capital.com',
      phone: formPhone || '+1 (800) 555-0199',
      bankName: formBankName || 'Private Wealth Clearing Bank',
      accountNumber: formAccountNumber || 'IBAN-0091-8821-4401',
      status: 'Active / Generating Yield',
      reinvestmentPlan: 'monthly_payout',
    };

    SubmissionsStore.addInvestmentSubmission(newInv);
    await FirebaseService.saveInvestment(newInv);

    setUserInvestments((prev) => [newInv, ...prev]);
    setIsSubmittingInApp(false);
    setSelectedTierForInvest(null);
    setInvestView('portfolio');
    setFeedbackMessage(`Capital allocated: ${formatCurrency(selectedTierForInvest.price)} in ${selectedTierForInvest.name}. Payouts scheduled.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Submit in-app express cash loan
  const handleSubmitExpressCashLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInApp(true);

    const monthly = Math.round((cashAmount * 1.072) / cashTermMonths);
    const newCashLoan: CashLoanSubmission = {
      id: `AUR-CASH-${country.code}-${Math.floor(10000 + Math.random() * 90000)}`,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      amount: cashAmount,
      termMonths: cashTermMonths,
      monthlyPayment: monthly,
      purpose: cashPurpose,
      urgency: 'Within 24 Hours',
      disbursementMethod: cashDisbursementMethod,
      bankName: cashDisbursementMethod === 'Direct Wire Transfer' ? cashBankName : 'Courier Cheque Delivery',
      accountNumber: cashDisbursementMethod === 'Direct Wire Transfer' ? cashAccountNumber : cashDeliveryAddress,
      fullName: cashApplicantName || 'Private Client',
      email: cashApplicantEmail || currentUser?.email || 'client@aureus-capital.com',
      phone: cashApplicantPhone || '+1 (800) 555-0199',
      monthlyIncome: 25000,
      employmentStatus: 'Employed / High Net Worth',
      sovereignId: 'AUTO-ID-VERIFIED',
      status: 'Verified & Approved',
    };

    SubmissionsStore.addCashLoanSubmission(newCashLoan);
    await FirebaseService.saveLoan(newCashLoan);

    setUserCashLoans((prev) => [newCashLoan, ...prev]);
    setIsSubmittingInApp(false);
    setFeedbackMessage(`Express cash facility of ${formatCurrency(cashAmount)} confirmed. Dispatch initiated.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  if (!isOpen) return null;

  // Split loans
  const homeLoans = userPreApprovals.filter(
    (p) => !p.propertyType.toLowerCase().includes('car') && !p.propertyType.toLowerCase().includes('vehicle') && !p.propertyType.includes('V12') && !p.propertyType.includes('GT3')
  );
  const carLoans = userPreApprovals.filter(
    (p) => p.propertyType.toLowerCase().includes('car') || p.propertyType.toLowerCase().includes('vehicle') || p.propertyType.includes('V12') || p.propertyType.includes('GT3') || p.propertyType.includes('Aston') || p.propertyType.includes('Ferrari') || p.propertyType.includes('Porsche')
  );

  const totalInvestmentPrincipal = userInvestments.reduce((acc, i) => acc + i.principalAmount, 0);
  const totalInvestmentYield = userInvestments.reduce((acc, i) => acc + i.totalYield, 0);
  const totalCashLoanAmount = userCashLoans.reduce((acc, c) => acc + c.amount, 0);
  const totalPreApprovedVolume = userPreApprovals.reduce((acc, p) => acc + p.preApprovedAmount, 0);
  const totalActiveDebt = totalPreApprovedVolume + totalCashLoanAmount;
  const creditLimit = 2500000;
  const availableCredit = Math.max(0, creditLimit - totalActiveDebt);

  // In-app vehicle list
  const allVehicles: VehicleItem[] = VEHICLES_BY_COUNTRY[currentCountry] || WORLDWIDE_VEHICLES;
  const filteredVehicles = allVehicles.filter((v) => {
    const matchesCategory =
      vehicleCategoryFilter === 'all' ||
      v.category.toLowerCase().includes(vehicleCategoryFilter.toLowerCase());
    const matchesSearch =
      !vehicleSearchQuery ||
      v.title.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(vehicleSearchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(vehicleSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // In-app properties list
  const allProperties: PropertyItem[] = PROPERTIES_BY_COUNTRY[currentCountry] || [];
  const filteredProperties = allProperties.filter((p) => {
    return (
      !propertySearchQuery ||
      p.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(propertySearchQuery.toLowerCase())
    );
  });

  const getTabTitle = (tab: typeof activeTab) => {
    switch (tab) {
      case 'overview': return 'Portfolio Overview';
      case 'my-loans': return 'My Obtained Loans';
      case 'my-investments': return 'My Obtained Investments';
      case 'payment-methods': return 'Payment Methods (Free)';
      case 'card-to-bitcoin': return 'Card-to-Bitcoin Gateway';
      case 'homeloans': return 'Prime Home Mortgages';
      case 'carloans': return 'Prestige Auto Finance';
      case 'investments': return 'Wealth Allocation Plans';
      case 'cashloans': return '24h Express Cash';
      case 'chat': return 'Concierge Chat Support';
      case 'repayments': return 'Repayments & Clearing';
      default: return 'Client Portal';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-7xl h-[94vh] max-h-[960px] bg-white border border-slate-200/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden text-slate-900">
        
        {/* ======================================================== */}
        {/* MINIMALIST APP HEADER: CANCEL (LEFT) & MENU (RIGHT) ONLY */}
        {/* ======================================================== */}
        <header className="px-4 sm:px-8 py-3.5 border-b border-slate-200/90 bg-white flex items-center justify-between shrink-0 z-20">
          {/* Left: ONLY Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs border border-slate-200 shrink-0 active:scale-95"
            title="Cancel and close Aureus portal"
          >
            <X className="w-4 h-4 text-slate-600" />
            <span>Cancel</span>
          </button>

          {/* Right: ONLY Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs border border-slate-800 active:scale-95"
            title="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 text-blue-400" />
            <span>Menu</span>
          </button>
        </header>

        {/* Main Body with Left Menu & Viewport */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* ======================================================== */}
          {/* CLIENT PORTAL LEFT SIDEBAR MENU (DESKTOP)               */}
          {/* ======================================================== */}
          <aside className="w-64 border-r border-slate-200/90 bg-slate-50/70 p-4 shrink-0 flex flex-col justify-between overflow-y-auto hidden md:flex text-xs">
            <div className="space-y-5">
              {/* Client Status Badge */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Client Account</div>
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{currentUser?.displayName || 'Private Client'}</span>
                </div>
              </div>

              {/* Navigation Categories */}
              {/* 1. CLIENT PORTFOLIO */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Portfolio
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-slate-500" />
                    <span>Portfolio Overview</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('my-loans')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'my-loans'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Obtained Loans</span>
                  </div>
                  {(userPreApprovals.length + userCashLoans.length) > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                      {userPreApprovals.length + userCashLoans.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('my-investments')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'my-investments'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>My Obtained Investments</span>
                  </div>
                  {userInvestments.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      {userInvestments.length}
                    </span>
                  )}
                </button>
              </div>

              {/* 2. BANKING & PAYMENTS */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Banking & Payments
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('payment-methods')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'payment-methods'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Methods</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    FREE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card-to-bitcoin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'card-to-bitcoin'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span>On-Ramp Card → BTC</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    activeTab === 'card-to-bitcoin' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    MOONPAY
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('repayments')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'repayments'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-slate-500" />
                    <span>Repayments & Clearing</span>
                  </div>
                </button>
              </div>

              {/* 3. FINANCING (APPLY) */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Financing & Yield
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('homeloans')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'homeloans'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Home Mortgages (10% Down)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('carloans')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'carloans'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-slate-500" />
                  <span>Prestige Auto Loans</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cashloans')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'cashloans'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5 text-slate-500" />
                  <span>24h Express Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('investments')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'investments'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  <span>Wealth Allocation Plans</span>
                </button>
              </div>

              {/* 4. SUPPORT */}
              <div className="space-y-1">
                <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Client Support
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Concierge Chat</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </div>
            </div>

            {/* Quick Action in Sidebar for Free Payment Method */}
            <div className="pt-4 border-t border-slate-200">
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Payment Method</span>
                </div>
                <p className="text-[10px] text-emerald-900/80 leading-snug">
                  0% transaction fees on all loan repayments & down payments.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddPaymentMethodOpen(true)}
                  className="w-full py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] transition-colors cursor-pointer text-center block shadow-xs"
                >
                  + Add Free Method
                </button>
              </div>
            </div>
          </aside>

          {/* Slide-over Drawer Menu (Triggered by top-right 'Menu' button) */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex animate-fade-in">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="relative w-80 max-w-[85vw] ml-auto bg-white h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 text-xs">
                <div className="space-y-4">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-serif font-bold text-base text-slate-950">Aureus Menu</span>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Client Account & Sign In / Out */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Client Account</span>
                      <button
                        type="button"
                        onClick={() => {
                          loadUserData();
                          setFeedbackMessage('Ledger synchronized successfully.');
                          setTimeout(() => setFeedbackMessage(null), 3000);
                        }}
                        className="text-[10px] text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        title="Sync Ledger"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sync</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-slate-900 truncate">
                            {currentUser?.displayName || 'Private Client'}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {currentUser?.email || 'Direct Allocation'}
                          </div>
                        </div>
                      </div>

                      {!currentUser ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onClose();
                            if (onOpenAuth) onOpenAuth();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold cursor-pointer shrink-0"
                        >
                          Sign In
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer transition-colors shrink-0"
                          title="Sign Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Balance Sheet Facility:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(creditLimit)}</span>
                    </div>
                  </div>

                  {/* Navigation List */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Portfolio</div>
                      {[
                        { id: 'overview', label: 'Portfolio Overview', icon: Wallet },
                        { id: 'my-loans', label: 'My Obtained Loans', icon: FileText, count: userPreApprovals.length + userCashLoans.length },
                        { id: 'my-investments', label: 'My Obtained Investments', icon: TrendingUp, count: userInvestments.length },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                              isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-800'}`}>
                                {item.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Banking & Payments</div>
                      {[
                        { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, badge: 'FREE', badgeColor: 'bg-emerald-100 text-emerald-800' },
                        { id: 'card-to-bitcoin', label: 'On-Ramp Card → BTC', icon: Zap, badge: 'MOONPAY', badgeColor: 'bg-slate-100 text-slate-800' },
                        { id: 'repayments', label: 'Repayments & Clearing', icon: Activity },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                              isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Facilities</div>
                      {[
                        { id: 'homeloans', label: 'Home Mortgages (10% Down)', icon: Home },
                        { id: 'carloans', label: 'Prestige Vehicles (10% Down)', icon: Car },
                        { id: 'cashloans', label: '24h Express Cash', icon: Banknote },
                        { id: 'investments', label: 'Wealth Allocation Plans', icon: Sparkles },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(item.id as any);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                              isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Support</div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('chat');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                          activeTab === 'chat' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span>Concierge Chat</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCardToBtcModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-white" />
                    <span>Pay with Card (Company Settlement)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAddPaymentMethodOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center block shadow-xs cursor-pointer transition-colors"
                  >
                    + Add Free Payment Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Alert Bar */}
          {feedbackMessage && (
            <div className="absolute top-3 left-4 right-4 z-30 p-3 rounded-2xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between shadow-lg animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* MAIN EDITORIAL WORKSPACE VIEWPORT                        */}
          {/* ======================================================== */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#fbfcff]">

          
          {/* ------------------------------------------------------ */}
          {/* 1. PORTFOLIO OVERVIEW TAB (Framer Minimalist Bento)    */}
          {/* ------------------------------------------------------ */}
          {/* ------------------------------------------------------ */}
          {/* 1. BAMBOO & TROVE FINTECH PORTFOLIO OVERVIEW           */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-10">
              
              {/* Bamboo Top User Greeting & Status Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'PC'}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      Welcome back, {currentUser?.displayName || 'Private Client'}!
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Direct Treasury Allocation · {country.name} ({selectedCurrency})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Currency Switcher Dropdown (matching Bamboo 'Your total wealth in USD') */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Switch currency"
                    >
                      <span>{selectedCurrency}</span>
                      <span className="text-[10px] text-slate-400">▼</span>
                    </button>
                    {isCurrencyDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 text-xs">
                        {(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN'] as const).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => {
                              setSelectedCurrency(curr);
                              setIsCurrencyDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between ${
                              selectedCurrency === curr ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{curr}</span>
                            {selectedCurrency === curr && <Check className="w-3.5 h-3.5 text-slate-900" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer relative"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-900 ring-2 ring-white" />
                    </button>
                    {notificationsOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 text-xs space-y-2">
                        <div className="font-bold text-slate-900 flex justify-between items-center border-b pb-2">
                          <span>Activity & Notifications</span>
                          <span className="text-[10px] text-slate-600 font-medium">Ready</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                          <div className="font-semibold text-slate-900">Direct Treasury Facilities Ready</div>
                          <div className="text-[11px] text-slate-600">Explore 10% down financing for homes and vehicles.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Story / Promo Cards Carousel */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {/* Story 1 */}
                <div
                  onClick={() => {
                    setActiveTab('carloans');
                    setCarView('catalog');
                  }}
                  className="min-w-[220px] sm:min-w-[240px] p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between h-32 relative overflow-hidden"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">10% DOWN</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-snug">What's new in Aureus</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">20 worldwide vehicles ready for driveway delivery</p>
                  </div>
                </div>

                {/* Story 2 */}
                <div
                  onClick={() => {
                    setActiveTab('investments');
                    setInvestView('catalog');
                  }}
                  className="min-w-[220px] sm:min-w-[240px] p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between h-32 border border-slate-700/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold border border-white/20">12.4% - 15.6% APY</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-snug">Let experts manage your money</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">Asset-backed institutional yield vaults</p>
                  </div>
                </div>

                {/* Story 3 */}
                <div
                  onClick={() => {
                    setActiveTab('carloans');
                    setCarView('catalog');
                  }}
                  className="min-w-[220px] sm:min-w-[240px] p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between h-32 border border-slate-700/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">SUPERCAR VIP</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-snug">Drive the 2026 Vanquish V12</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">Only 10% upfront payment required</p>
                  </div>
                </div>

                {/* Story 4 */}
                <div
                  onClick={() => {
                    setActiveTab('homeloans');
                    setHomeView('catalog');
                  }}
                  className="min-w-[220px] sm:min-w-[240px] p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm flex flex-col justify-between h-32 border border-slate-700/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">GLOBAL RESIDENCES</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-snug">London & Sydney Villas</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">Direct 90% sovereign treasury pre-approval</p>
                  </div>
                </div>
              </div>

              {/* BAMBOO TOTAL WEALTH CARD */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Your total wealth in <strong className="text-slate-900 font-bold">{selectedCurrency} ⇕</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                    title={isBalanceHidden ? 'Show Balance' : 'Hide Balance'}
                  >
                    {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Big bold balance */}
                <div className="text-4xl sm:text-5xl font-extrabold font-serif tracking-tight text-slate-950">
                  {isBalanceHidden ? '••••••••••' : (
                    userInvestments.length === 0 && userCashLoans.length === 0 ? (
                      selectedCurrency === 'USD' ? '$0.00' :
                      selectedCurrency === 'GBP' ? '£0.00' :
                      selectedCurrency === 'EUR' ? '€0.00' :
                      selectedCurrency === 'CAD' ? 'CA$0.00' :
                      selectedCurrency === 'AUD' ? 'AU$0.00' :
                      '₦0.00'
                    ) : (
                      formatCurrency(
                        userInvestments.reduce((sum, inv) => sum + (inv.principalAmount || 0), 0) +
                        userCashLoans.reduce((sum, c) => sum + (c.amount || 0), 0)
                      )
                    )
                  )}
                </div>

                {/* Prominent Action Pills side-by-side (Deep Blue/Slate Theme) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddMoneyOpen(true)}
                    className="py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(true)}
                    className="py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 border border-slate-200"
                  >
                    <Minus className="w-4 h-4" />
                    <span>- Withdraw</span>
                  </button>
                </div>

                {/* Referrals Banner (Image 4: matching deep blue/slate color) */}
                <div
                  onClick={() => {
                    navigator.clipboard?.writeText('https://aureus.capital/ref/CLIENT-TIER-1');
                    setReferralCopied(true);
                    setTimeout(() => setReferralCopied(false), 2500);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  title="Click to copy your referral link"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Referrals & Rewards</span>
                      <span className="hidden sm:inline text-slate-500 ml-1.5">· Earn $250 bonus on every approved acquisition</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">$250.00</span>
                    <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {referralCopied ? 'Copied!' : 'Share'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 8-CIRCLE QUICK ACTIONS GRID */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
                  Quick Actions
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 text-center">
                  {[
                    { label: 'Home Loan', icon: Home, color: 'bg-slate-100 text-slate-800 border-slate-200', action: () => { setActiveTab('homeloans'); setHomeView('catalog'); } },
                    { label: 'Car Loan', icon: Car, color: 'bg-slate-100 text-slate-800 border-slate-200', action: () => { setActiveTab('carloans'); setCarView('catalog'); } },
                    { label: 'Investment', icon: TrendingUp, color: 'bg-slate-100 text-slate-800 border-slate-200', action: () => { setActiveTab('investments'); setInvestView('catalog'); } },
                    { label: 'Cash Loan', icon: Banknote, color: 'bg-slate-100 text-slate-800 border-slate-200', action: () => setActiveTab('cashloans') },
                    { label: 'Withdraw', icon: Minus, color: 'bg-slate-100 text-slate-700 border-slate-200', action: () => setIsWithdrawOpen(true) },
                    { label: 'Statements', icon: FileText, color: 'bg-slate-100 text-slate-700 border-slate-200', action: () => setActiveTab('repayments') },
                    { label: 'Chat Support', icon: MessageSquare, color: 'bg-slate-100 text-slate-800 border-slate-200', action: () => setActiveTab('chat') },
                    { label: 'Add Money', icon: Plus, color: 'bg-slate-900 text-white border-slate-900', action: () => setIsAddMoneyOpen(true) },
                  ].map((act, i) => {
                    const ActIcon = act.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={act.action}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-white hover:shadow-xs border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                      >
                        <div className={`w-11 h-11 rounded-2xl ${act.color} border flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs`}>
                          <ActIcon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 group-hover:text-slate-900 truncate w-full">
                          {act.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BAMBOO PORTFOLIO LIST */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Portfolio & Facilities</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('investments');
                      setInvestView('catalog');
                    }}
                    className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ New Investment</span>
                  </button>
                </div>

                {userPreApprovals.length === 0 && userInvestments.length === 0 && userCashLoans.length === 0 ? (
                  <div className="py-10 px-6 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">No active facilities or investments yet</div>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Your approved 10% down home mortgages, auto finance, and yield portfolios will appear here once initiated.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {userPreApprovals.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveTab('homeloans');
                          setHomeView('applications');
                        }}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                            <Home className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{p.propertyType || 'Mortgage Facility'}</div>
                            <div className="text-xs text-slate-500">{p.id} · 10% Down</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono font-bold text-slate-900">{formatCurrency(p.preApprovedAmount || p.homePrice)}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">{p.status || 'Active'}</div>
                        </div>
                      </div>
                    ))}
                    {userCashLoans.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setActiveTab('cashloans')}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                            <Banknote className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">24h Express Cash Facility</div>
                            <div className="text-xs text-slate-500">{c.id} · {c.disbursementMethod || 'Direct Wire'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono font-bold text-slate-900">{formatCurrency(c.amount)}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">{c.status}</div>
                        </div>
                      </div>
                    ))}
                    {userInvestments.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setActiveTab('investments');
                          setInvestView('portfolio');
                        }}
                        className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{inv.tierName || 'Institutional Yield Vault'}</div>
                            <div className="text-xs text-slate-500">{inv.id} · {inv.durationMonths} Months</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono font-bold text-slate-900">+{formatCurrency(inv.principalAmount)}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">{inv.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Chat Support Banner */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>24/7 Live Chat Support Online</span>
                  </div>
                  <div className="font-semibold text-base">Julian Sterling, Chat Support Specialist</div>
                  <p className="text-xs text-slate-400 max-w-lg">
                    Real-time assistance, application tracking, and immediate answers for 10% down vehicle or residence facilities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  Open Chat Support
                </button>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 1B. MY OBTAINED LOANS & MORTGAGES VIEW                 */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'my-loans' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                      Client Credit Ledger
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                      {userPreApprovals.length + userCashLoans.length} Active
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-0.5">
                    My Obtained Loans & Mortgages
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Direct institutional facilities deployed from Aureus Capital Treasury with 10% upfront payment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('payment-methods')}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free Payment Methods</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('homeloans')}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Facility</span>
                  </button>
                </div>
              </div>

              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Total Approved Balance</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
                    {formatCurrency(
                      userPreApprovals.reduce((sum, p) => sum + (p.preApprovedAmount || p.homePrice * 0.9), 0) +
                      userCashLoans.reduce((sum, c) => sum + c.amount, 0)
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">90% Direct Balance Sheet Loan</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Monthly Debt Service</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-blue-600">
                    {formatCurrency(
                      userPreApprovals.reduce((sum, p) => sum + p.monthlyPayment, 0) +
                      userCashLoans.reduce((sum, c) => sum + c.monthlyPayment, 0)
                    )}/mo
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Auto-debited via Free Method</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">10% Down Paid</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-600">
                    {formatCurrency(
                      userPreApprovals.reduce((sum, p) => sum + p.downPayment, 0)
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Verified Deposit Cleared</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Active Facilities</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
                    {userPreApprovals.length + userCashLoans.length}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Under Sovereign Escrow</span>
                </div>
              </div>

              {/* Loans List */}
              {userPreApprovals.length === 0 && userCashLoans.length === 0 ? (
                <div className="p-10 sm:p-14 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-lg font-serif font-bold text-slate-900">No Active Loans Yet</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Every client can acquire prime residences or luxury motorcars with only a 10% upfront payment, or request 24h express liquidity directly from treasury.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('homeloans')}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Browse Prime Mortgages</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('carloans')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer border border-slate-200 flex items-center gap-2"
                    >
                      <Car className="w-4 h-4 text-blue-600" />
                      <span>Browse Vehicles</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('cashloans')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer border border-slate-200 flex items-center gap-2"
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Request Express Cash</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Home & Vehicle Pre-Approvals */}
                  {userPreApprovals.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                            <Home className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {p.propertyType || 'Prime Residential Mortgage'} · {p.cityOrZip}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              Facility Ref: {p.id} · Applied {new Date(p.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{p.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Asset Value</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(p.homePrice)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">10% Down Payment</span>
                          <span className="font-bold text-emerald-700 font-mono text-sm">{formatCurrency(p.downPayment)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">90% Direct Balance Loan</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {formatCurrency(p.preApprovedAmount || p.homePrice * 0.9)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Monthly Repayment</span>
                          <span className="font-bold text-blue-600 font-mono text-sm">{formatCurrency(p.monthlyPayment)}/mo</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>Interest Rate: <strong className="text-slate-800">{p.interestRate || 4.85}% Fixed</strong></span>
                          <span>·</span>
                          <span>Repayment Rail: <strong className="text-emerald-700">Free Direct Debit (0% fee)</strong></span>
                          <span>·</span>
                          <span>Next Due: <strong className="text-slate-800">1st of Month</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('repayments')}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                          >
                            Repayment Schedule
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackMessage(`Official Pre-Approval Certificate for ${p.id} downloaded.`);
                              setTimeout(() => setFeedbackMessage(null), 3000);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Letter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Cash Loans */}
                  {userCashLoans.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                            <Banknote className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              24h Express Cash Facility · {c.purpose}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              Facility Ref: {c.id} · Applied {new Date(c.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{c.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Disbursed Principal</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(c.amount)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Amortization Term</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{c.termMonths} Months</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Monthly Repayment</span>
                          <span className="font-bold text-blue-600 font-mono text-sm">{formatCurrency(c.monthlyPayment)}/mo</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Disbursement Rail</span>
                          <span className="font-bold text-emerald-700 font-mono text-sm">{c.disbursementMethod}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>Interest Rate: <strong className="text-slate-800">{c.interestRate || 6.25}% APR</strong></span>
                          <span>·</span>
                          <span>Settlement Rail: <strong className="text-emerald-700">Free Direct Bank Account</strong></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveTab('repayments')}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
                        >
                          View Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 1C. MY OBTAINED INVESTMENTS VIEW                       */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'my-investments' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                      Treasury Yield Portfolio
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      {userInvestments.length} Active Notes
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-0.5">
                    My Obtained Investments
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    High-yield institutional wealth allocations generating automated monthly distributions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('payment-methods')}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payout Accounts (Free)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('investments')}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Deploy Capital</span>
                  </button>
                </div>
              </div>

              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Total Capital Deployed</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-slate-900">
                    {formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.principalAmount, 0))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Active Wealth Allocations</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Monthly Passive Payout</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-600">
                    +{formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.monthlyPayout, 0))}/mo
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Direct to Linked Free Bank</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Total Accrued Return</span>
                  <div className="text-lg sm:text-2xl font-bold font-mono text-blue-600">
                    {formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.totalYield, 0))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Guaranteed Treasury Yield</span>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Next Distribution</span>
                  <div className="text-lg sm:text-xl font-bold font-mono text-slate-900">
                    1st of Month
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Scheduled Direct Credit
                  </span>
                </div>
              </div>

              {/* Investments List */}
              {userInvestments.length === 0 ? (
                <div className="p-10 sm:p-14 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-lg font-serif font-bold text-slate-900">No Active Investment Portfolios Deployed</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Participate in Aureus institutional liquidity pools and wealth notes with fixed yields from 8.4% to 41.2% APR, credited monthly to your free linked payment method.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('investments')}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Explore Capital Allocation Plans</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userInvestments.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{inv.tierName}</div>
                            <div className="text-[11px] font-mono text-slate-400">
                              Note ID: {inv.id} · Enrolled {new Date(inv.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{inv.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Principal Deployed</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(inv.principalAmount)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Annualized APY</span>
                          <span className="font-bold text-emerald-700 font-mono text-sm">{inv.ratePercent}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Monthly Payout (Yield)</span>
                          <span className="font-bold text-emerald-600 font-mono text-sm">+{formatCurrency(inv.monthlyPayout)}/mo</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Total Return</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{formatCurrency(inv.totalYield)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
                        <div className="text-slate-500 text-[11px] space-y-0.5">
                          <div>
                            Payout Destination: <strong className="text-slate-800">{inv.bankName} ({inv.accountNumber})</strong>
                          </div>
                          <div className="text-emerald-700">
                            Automatic zero-fee direct deposit on the 1st of every calendar month.
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackMessage(`Audited Yield Statement for ${inv.id} generated.`);
                              setTimeout(() => setFeedbackMessage(null), 3000);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Yield Statement</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 1D. PAYMENT METHODS & FREE SETTLEMENT VIEW             */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'payment-methods' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                      Banking & Settlement
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      100% FREE · 0% FEES
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-0.5">
                    Payment Methods & Settlement Accounts
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Link zero-fee checking accounts, debit cards, or institutional wire rails for 10% down payments and monthly loan repayments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddPaymentMethodOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Add Free Payment Method</span>
                </button>
              </div>

              {/* Step-by-Step Educational Callout on How to Add Free Payment Method */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white border border-emerald-200/90 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                      <h4 className="text-sm sm:text-base font-bold text-emerald-950">
                        How Free Payment Methods Work at Aureus Capital
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed pl-8">
                      Aureus absorbs 100% of payment network clearing fees, interchange charges, and SWIFT/ACH handling costs. 
                      When you add a direct bank account or debit card, you will <strong>never be charged any processing fees ($0.00)</strong>. 
                      Use your free payment method for:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-8 pt-1 text-xs text-emerald-950">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>10% Asset Down Payments (Free)</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Automated Monthly Repayments (Free)</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Receiving Monthly Wealth Yield (Free)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddPaymentMethodOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Add Free Method Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Company Treasury & Direct Card Payment Gateway Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center font-bold shrink-0">
                        <CreditCard className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          <span>Direct Card Payment & Treasury Gateway</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            Instant Clearing
                          </span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          Pay directly with any Visa, Mastercard, or American Express card. Funds clear immediately and deposit into the Aureus Capital Primary Corporate Treasury Account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('card-to-bitcoin')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>Open Card Portal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCardToBtcModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Pay with Card Now</span>
                    </button>
                  </div>
                </div>

                {/* Company Destination Account Box */}
                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Company Settlement Destination (Aureus Corporate Treasury)</span>
                    </div>
                    <div className="font-mono font-bold text-white text-xs sm:text-sm">
                      Aureus Capital Treasury Ltd — AC-TREASURY-019482 (Primary Corporate Account)
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-700/60 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified Corporate Account</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* List of User's Linked Free Payment Methods */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Linked Accounts & Cards ({paymentMethods.length})
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    256-bit Encrypted Banking Vault
                  </span>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
                    <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                      <h5 className="text-sm font-semibold text-slate-800">No payment methods linked yet</h5>
                      <p className="text-xs text-slate-500">
                        Add your checking account or debit card with 0% fee to activate automated settlement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddPaymentMethodOpen(true)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Free Payment Method</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className={`p-5 rounded-2xl bg-white border transition-all shadow-xs relative flex flex-col justify-between ${
                          pm.isDefault ? 'border-emerald-500/80 ring-1 ring-emerald-500/30' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                                {pm.type === 'bank_account' ? (
                                  <Building className="w-5 h-5 text-blue-600" />
                                ) : pm.type === 'debit_card' ? (
                                  <CreditCard className="w-5 h-5 text-indigo-600" />
                                ) : (
                                  <Banknote className="w-5 h-5 text-emerald-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-900">{pm.institutionName}</div>
                                <div className="text-xs text-slate-500 font-mono">{pm.accountOrCardNumberMasked}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                0% Fee · Free
                              </span>
                              {pm.isDefault && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-200">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Account Holder:</span>
                              <span className="font-medium text-slate-800 truncate block">{pm.holderName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Method Type:</span>
                              <span className="font-medium text-slate-800 capitalize">
                                {pm.type.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          {!pm.isDefault ? (
                            <button
                              type="button"
                              onClick={() => {
                                SubmissionsStore.setDefaultPaymentMethod(pm.id, currentUser?.email || '');
                                setPaymentMethods(SubmissionsStore.getPaymentMethods(currentUser?.email || ''));
                                setFeedbackMessage(`${pm.institutionName} set as primary payment method.`);
                                setTimeout(() => setFeedbackMessage(null), 3000);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                              <Check className="w-3.5 h-3.5" /> Primary Settlement Method
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              SubmissionsStore.removePaymentMethod(pm.id);
                              setPaymentMethods(SubmissionsStore.getPaymentMethods(currentUser?.email || ''));
                              setFeedbackMessage('Payment method removed.');
                              setTimeout(() => setFeedbackMessage(null), 3000);
                            }}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 1E. FIAT-TO-CRYPTO ON-RAMP PAYMENT GATEWAY (MOONPAY / TRANSAK / RAMP) */}
          {/* --------------------------------------------------------------------- */}
          {activeTab === 'card-to-bitcoin' && (
            <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                      Hybrid Fintech Infrastructure
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold border border-slate-800">
                      ⚡ On-Ramp Processor Rail
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight mt-0.5">
                    Fiat-to-Crypto On-Ramp Gateway
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Clients pay with standard debit/credit cards (Visa, Mastercard, Apple Pay). The specialized on-ramp engine converts funds at spot rate and deposits Bitcoin directly into the company treasury.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-400">1 BTC ≈</span>
                    <span className="font-bold text-white">${btcRate.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Core Infrastructure: 3-Tier Architecture Flow */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-5 shadow-lg border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>The Core Infrastructure (How Systems Connect)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hybrid bridge connecting traditional banking rails with cryptocurrency markets via APIs, Webhooks & Widget Embeds.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 self-start sm:self-auto">
                    ACTIVE ON-RAMP RAILS
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>1. Client Card Authorization</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Client enters Visa, Mastercard, Apple Pay, or Google Pay details. 3D-Secure handles bank verification without crypto complexity for the payer.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <RefreshCw className="w-4 h-4 text-blue-400" />
                      <span>2. On-Ramp Liquidity Bridge</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Specialized processor (MoonPay / Transak / Ramp) locks spot Bitcoin price, executes the fiat-to-crypto conversion, and triggers settlement webhooks.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Bitcoin className="w-4 h-4" />
                      <span>3. Direct Company Settlement</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Purchased Bitcoin broadcasts on the blockchain directly into the Aureus Capital Company Treasury address with 100% custody by the company.
                    </p>
                  </div>
                </div>
              </div>

              {/* On-Ramp Provider Selection & Status Bar */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                      Active On-Ramp Payment Processor
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      Choose Your Preferred On-Ramp Provider
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Destination:</span>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      Company Treasury (Locked)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'moonpay',
                      name: 'MoonPay',
                      badge: 'RECOMMENDED',
                      badgeColor: 'bg-slate-900 text-white',
                      coverage: '160+ Countries',
                      methods: 'Visa, Mastercard, Apple Pay, Google Pay',
                      desc: 'Industry-standard embedded web & mobile SDK with highest card acceptance.',
                    },
                    {
                      id: 'transak',
                      name: 'Transak',
                      badge: 'GLOBAL RAILS',
                      badgeColor: 'bg-blue-100 text-blue-900',
                      coverage: '170+ Countries',
                      methods: 'Credit Card, SEPA, UK Faster Payments',
                      desc: 'Developer-friendly fiat-to-crypto widget with multi-currency local card routing.',
                    },
                    {
                      id: 'ramp',
                      name: 'Ramp Network',
                      badge: 'INSTANT 3DS',
                      badgeColor: 'bg-emerald-100 text-emerald-900',
                      coverage: '150+ Countries',
                      methods: 'Cards, Open Banking, PIX',
                      desc: 'Ultra-fast non-custodial checkout with direct blockchain liquidity dispatch.',
                    },
                  ].map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => setSelectedOnRampProvider(prov.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedOnRampProvider === prov.id
                          ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900'
                          : 'border-slate-200 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-slate-950 flex items-center gap-1.5">
                            <span>{prov.name}</span>
                            {selectedOnRampProvider === prov.id && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            )}
                          </h5>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${prov.badgeColor}`}>
                            {prov.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {prov.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[10px] space-y-0.5 text-slate-600 font-mono">
                        <div>Coverage: <strong>{prov.coverage}</strong></div>
                        <div>Rails: <strong>{prov.methods}</strong></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Treasury Bitcoin Receiving Destination (Locked Address) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-sm space-y-3 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Company Bitcoin Treasury Receiving Address (Pre-Locked into On-Ramp SDK)</span>
                    </div>
                    <div className="font-mono font-bold text-white text-sm sm:text-base break-all select-all">
                      {companyBtcAddress}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Network: <strong>Bitcoin Mainnet (Native SegWit / Bech32)</strong> · Automated Clearing
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(companyBtcAddress);
                        setCopiedBtcAddress(true);
                        setFeedbackMessage('Company Bitcoin Treasury address copied!');
                        setTimeout(() => {
                          setCopiedBtcAddress(false);
                          setFeedbackMessage(null);
                        }, 3000);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedBtcAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedBtcAddress ? 'Copied' : 'Copy Address'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrCodeModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View QR</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive On-Ramp Payment Engine & Live Widget Frame */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Payment Amount & Conversion Calculator */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Step 1</span>
                        <h4 className="text-base font-bold text-slate-900">Payment Amount</h4>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">{selectedCurrency}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Amount to Charge on Card ({selectedCurrency})
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                          {selectedCurrency === 'USD' ? '$' : selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'EUR' ? '€' : '$'}
                        </span>
                        <input
                          type="number"
                          value={btcFiatAmount}
                          onChange={(e) => setBtcFiatAmount(e.target.value)}
                          placeholder="5000"
                          className="w-full pl-8 pr-3.5 py-3 rounded-2xl border border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="grid grid-cols-4 gap-2">
                      {['1000', '5000', '10000', '25000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setBtcFiatAmount(amt)}
                          className={`py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            btcFiatAmount === amt
                              ? 'bg-slate-900 text-white border-slate-900 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          ${parseInt(amt).toLocaleString()}
                        </button>
                      ))}
                    </div>

                    {/* Live On-Ramp Conversion Preview */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 shadow-xs">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Company Bitcoin Received ({selectedOnRampProvider.toUpperCase()}):</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 font-mono font-bold text-[10px]">
                          Direct On-Chain
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-center gap-1.5">
                        <Bitcoin className="w-6 h-6 text-blue-400" />
                        <span>
                          {((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800 font-mono">
                        <span>Spot Rate: 1 BTC = ${btcRate.toLocaleString()}</span>
                        <span className="text-emerald-400 font-bold">Network Fee: $0.00</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Purpose</label>
                      <select
                        value={btcPaymentPurpose}
                        onChange={(e) => setBtcPaymentPurpose(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900"
                      >
                        <option value="Direct Capital Deposit & Treasury Allocation">Direct Capital Deposit & Treasury Allocation</option>
                        <option value="10% Vehicle Down Payment (Prestige Auto)">10% Vehicle Down Payment (Prestige Auto)</option>
                        <option value="10% Prime Real Estate Down Payment">10% Prime Real Estate Down Payment</option>
                        <option value="24h Express Cash Loan Repayment">24h Express Cash Loan Repayment</option>
                        <option value="Wealth Allocation Yield Vault Investment">Wealth Allocation Yield Vault Investment</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5 mt-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} Security Guarantee</span>
                    </div>
                    <p className="leading-snug text-slate-500">
                      Card is authorized via 256-bit bank encryption. Once verified, {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} automatically delivers {((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC to the company Bitcoin treasury.
                    </p>
                  </div>
                </div>

                {/* Right: Embedded On-Ramp Widget & Card Form */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Step 2</span>
                      <h4 className="text-base font-bold text-slate-900">
                        {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} Card Checkout
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700 font-bold font-mono text-[10px]">VISA</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700 font-bold font-mono text-[10px]">MASTERCARD</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 border text-slate-700 font-bold font-mono text-[10px]">APPLE PAY</span>
                    </div>
                  </div>

                  <form onSubmit={handleExecuteCardToBitcoin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cardholder Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={btcCardHolder}
                        onChange={(e) => setBtcCardHolder(e.target.value)}
                        placeholder="e.g. Oliver Kensington"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        16-Digit Credit or Debit Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={btcCardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                            setBtcCardNumber(formatted);
                          }}
                          placeholder="4532 •••• •••• 8492"
                          maxLength={19}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry *</label>
                        <input
                          type="text"
                          required
                          value={btcCardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                            setBtcCardExpiry(v);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CVV *</label>
                        <input
                          type="password"
                          required
                          value={btcCardCvv}
                          onChange={(e) => setBtcCardCvv(e.target.value.slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">ZIP / Postal</label>
                        <input
                          type="text"
                          value={btcBillingZip}
                          onChange={(e) => setBtcBillingZip(e.target.value)}
                          placeholder="W1J 5BG"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {/* On-Ramp Embedded Status Preview */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-300 font-bold uppercase tracking-wider">
                          {selectedOnRampProvider.toUpperCase()} ON-RAMP ENGINE
                        </span>
                        <span className="font-bold text-emerald-400">3DS SECURE</span>
                      </div>
                      <div className="font-mono text-sm sm:text-base tracking-widest text-slate-100">
                        {btcCardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <div>
                          <span>CARDHOLDER: </span>
                          <span className="text-white font-bold">{btcCardHolder.toUpperCase() || 'YOUR NAME'}</span>
                        </div>
                        <div>
                          <span>SETTLEMENT: </span>
                          <span className="text-emerald-400 font-bold">100% COMPANY BITCOIN</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingBtcPayment}
                      className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {isProcessingBtcPayment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Authorizing Card via {selectedOnRampProvider.toUpperCase()}...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-blue-400" />
                          <span>
                            Pay {selectedCurrency} {parseFloat(btcFiatAmount || '0').toLocaleString()} via {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} → Settle {((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC to Company
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Company On-Ramp Bitcoin Settlement History */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Company On-Ramp Bitcoin Settlements ({btcTransactions.length})
                  </h4>
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified On-Chain Rail
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="divide-y divide-slate-100">
                    {btcTransactions.map((tx) => (
                      <div key={tx.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50/70 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold shrink-0">
                            <Bitcoin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {tx.cardBrand} (•••• {tx.cardLast4})
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                {tx.status}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px] font-medium">
                              {tx.purpose} · Paid by {tx.userName}
                            </div>
                            <div className="text-slate-400 text-[10px] font-mono break-all pt-0.5">
                              TxHash: <span className="text-blue-600">{tx.txHash.slice(0, 16)}...{tx.txHash.slice(-16)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <div className="font-extrabold text-sm sm:text-base font-mono text-slate-950">
                            +{tx.btcAmount} BTC
                          </div>
                          <div className="text-slate-500 text-xs font-semibold">
                            {tx.fiatCurrency} {tx.fiatAmount.toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-[10px]">
                            {new Date(tx.timestamp).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 2. AUTO FINANCE TAB (In-App Vehicle Catalog)           */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'carloans' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-slate-950">
                    Prestige Auto Finance
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>10% Down Payment to Acquire</span>
                    <span aria-hidden="true">·</span>
                    <span>90% Balance Sheet Financed</span>
                    <span aria-hidden="true">·</span>
                    <span>Enclosed Freight Included</span>
                  </div>
                </div>

                {/* Sub-tab segmented control */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setCarView('catalog')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      carView === 'catalog'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Browse 20 Vehicles
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarView('applications')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      carView === 'applications'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Auto Loans ({carLoans.length})
                  </button>
                </div>
              </div>

              {carView === 'catalog' && (
                <div className="space-y-6">
                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={vehicleSearchQuery}
                        onChange={(e) => setVehicleSearchQuery(e.target.value)}
                        placeholder="Search Aston Martin, Ferrari, Porsche, Rolls-Royce..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                      {['all', 'supercar', 'suv', 'coupe', 'ev'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setVehicleCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-colors ${
                            vehicleCategoryFilter === cat
                              ? 'bg-slate-900 text-white font-semibold'
                              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {cat === 'all' ? 'All Vehicles' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Grid (Clean Framer Product Showcase) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((car) => {
                      const downPayment = Math.round(car.price * 0.1);
                      const financed = car.price - downPayment;
                      const monthlyEst = Math.round((financed * 1.0419) / 60);

                      return (
                        <div
                          key={car.id}
                          className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Photographic Presentation */}
                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                              <img
                                src={car.imageUrl}
                                alt={car.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>

                            {/* Card Content */}
                            <div className="p-5 space-y-3">
                              <div className="space-y-1">
                                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                  {car.make}
                                </div>
                                <h4 className="text-base font-semibold text-slate-900">
                                  {car.title}
                                </h4>
                              </div>

                              {/* Unboxed Metadata (Zero-Pill Discipline) */}
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{car.hp} HP</span>
                                <span aria-hidden="true">·</span>
                                <span>{car.acceleration}</span>
                                <span aria-hidden="true">·</span>
                                <span>{car.drivetrain}</span>
                              </div>

                              {/* Clean Financial Breakdown Box */}
                              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                  <span>Vehicle Value:</span>
                                  <span className="font-semibold text-slate-900">{formatCurrency(car.price)}</span>
                                </div>
                                <div className="flex justify-between text-blue-700 font-semibold">
                                  <span>10% Down to Acquire:</span>
                                  <span className="font-mono font-bold">{formatCurrency(downPayment)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                                  <span>Monthly Repayment:</span>
                                  <span className="font-mono font-bold text-slate-900">{formatCurrency(monthlyEst)}/mo</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="p-5 pt-0">
                            <button
                              type="button"
                              onClick={() => setSelectedVehicleForFinance(car)}
                              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>Finance This Vehicle (10% Down)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {carView === 'applications' && (
                <div className="space-y-4">
                  {carLoans.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs space-y-3">
                      <p>No automotive financing applications recorded yet.</p>
                      <button
                        type="button"
                        onClick={() => setCarView('catalog')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs cursor-pointer"
                      >
                        Browse 20 Vehicles in Catalog
                      </button>
                    </div>
                  ) : (
                    carLoans.map((app) => (
                      <div
                        key={app.id}
                        className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {app.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              Submitted {new Date(app.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-blue-700">
                            {app.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Vehicle</span>
                            <span className="font-semibold text-slate-900">{app.propertyType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Asset Price</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.homePrice)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">90% Financed</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.preApprovedAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Monthly Repayment</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.monthlyPayment)}/mo</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 3. PRIME HOME MORTGAGES TAB (In-App Property Catalog)  */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'homeloans' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-slate-950">
                    Prime Home Mortgages
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>10% Down Payment to Acquire</span>
                    <span aria-hidden="true">·</span>
                    <span>3.90% Fixed Base APR</span>
                    <span aria-hidden="true">·</span>
                    <span>{country.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setHomeView('catalog')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      homeView === 'catalog'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Browse Residences
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeView('applications')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      homeView === 'applications'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Mortgages ({homeLoans.length})
                  </button>
                </div>
              </div>

              {homeView === 'catalog' && (
                <div className="space-y-6">
                  <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                      placeholder={`Search prime residences in ${country.name}...`}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map((prop) => {
                      const downPayment = Math.round(prop.price * 0.1);
                      const financed = prop.price - downPayment;
                      const monthlyEst = Math.round((financed * 1.039) / (25 * 12));

                      return (
                        <div
                          key={prop.id}
                          className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                              <img
                                src={prop.imageUrl}
                                alt={prop.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            </div>

                            <div className="p-5 space-y-3">
                              <div className="space-y-1">
                                <div className="text-xs font-mono text-slate-400 truncate">
                                  {prop.location}
                                </div>
                                <h4 className="text-base font-semibold text-slate-900 truncate">
                                  {prop.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{prop.bedrooms} Beds</span>
                                <span aria-hidden="true">·</span>
                                <span>{prop.bathrooms} Baths</span>
                                <span aria-hidden="true">·</span>
                                <span>{prop.area}</span>
                              </div>

                              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                  <span>Estate Value:</span>
                                  <span className="font-semibold text-slate-900">{formatCurrency(prop.price)}</span>
                                </div>
                                <div className="flex justify-between text-blue-700 font-semibold">
                                  <span>10% Down to Acquire:</span>
                                  <span className="font-mono font-bold">{formatCurrency(downPayment)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                                  <span>Est. Mortgage (25y):</span>
                                  <span className="font-mono font-bold text-slate-900">{formatCurrency(monthlyEst)}/mo</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 pt-0">
                            <button
                              type="button"
                              onClick={() => setSelectedPropertyForMortgage(prop)}
                              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>Apply Mortgage (10% Down)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {homeView === 'applications' && (
                <div className="space-y-4">
                  {homeLoans.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs space-y-3">
                      <p>No residential mortgage applications on file.</p>
                      <button
                        type="button"
                        onClick={() => setHomeView('catalog')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs cursor-pointer"
                      >
                        Browse Prime Residences in Catalog
                      </button>
                    </div>
                  ) : (
                    homeLoans.map((app) => (
                      <div
                        key={app.id}
                        className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              {app.id}
                            </span>
                            <span className="text-xs text-slate-400">
                              Submitted {new Date(app.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-blue-700">
                            {app.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Property</span>
                            <span className="font-semibold text-slate-900">{app.propertyType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Purchase Price</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.homePrice)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Financed (90%)</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.preApprovedAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Monthly Repayment</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(app.monthlyPayment)}/mo</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 4. 24H EXPRESS CASH LOANS TAB                          */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'cashloans' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-4 border-b border-slate-200">
                <h3 className="text-2xl font-serif font-semibold text-slate-950">
                  24h Express Cash Facility
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct institutional liquidity ($5,000 to $500,000) disbursed within 24 hours via bank wire or priority official courier cheque.
                </p>
              </div>

              {/* Express Cash Box */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 uppercase font-mono">
                      Requested Liquidity Amount
                    </span>
                    <span className="text-3xl font-serif font-semibold text-slate-950 font-mono tabular-nums">
                      {formatCurrency(cashAmount)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={5000}
                    max={500000}
                    step={5000}
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Min: {formatCurrency(5000)}</span>
                    <span>Max: {formatCurrency(500000)}</span>
                  </div>
                </div>

                {/* Term Switcher */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-500 uppercase font-mono">
                    Term Amortisation
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {[12, 24, 36, 48, 60].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCashTermMonths(t)}
                        className={`py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          cashTermMonths === t
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t} Mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantitative Calculation Strip */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Monthly Repayment:</span>
                    <span className="text-lg font-semibold text-slate-900 font-mono tabular-nums">
                      {formatCurrency(Math.round((cashAmount * 1.072) / cashTermMonths))}/mo
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Fixed Facility Rate:</span>
                    <span className="text-base font-semibold text-slate-900 font-mono">3.85% Fixed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Clearing Timeline:</span>
                    <span className="text-base font-semibold text-blue-700">Within 24 Hours</span>
                  </div>
                </div>

                {/* Disbursement Channel */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-500 uppercase font-mono">
                    Disbursement Channel
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCashDisbursementMethod('Direct Wire Transfer')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-colors ${
                        cashDisbursementMethod === 'Direct Wire Transfer'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs">Direct Bank Wire</div>
                      <div className={`text-[11px] mt-0.5 ${cashDisbursementMethod === 'Direct Wire Transfer' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Electronic clearing directly into your bank account
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCashDisbursementMethod('Official Cheque by Courier')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-colors ${
                        cashDisbursementMethod === 'Official Cheque by Courier'
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-xs">Official Courier Cheque</div>
                      <div className={`text-[11px] mt-0.5 ${cashDisbursementMethod === 'Official Cheque by Courier' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Delivered via priority insured security courier
                      </div>
                    </button>
                  </div>
                </div>

                {/* Direct Request Form */}
                <form onSubmit={handleSubmitExpressCashLoan} className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={cashApplicantName}
                        onChange={(e) => setCashApplicantName(e.target.value)}
                        placeholder="Full Legal Name"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={cashApplicantEmail}
                        onChange={(e) => setCashApplicantEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={cashApplicantPhone}
                        onChange={(e) => setCashApplicantPhone(e.target.value)}
                        placeholder="+44 / +1 / +61..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  {cashDisbursementMethod === 'Direct Wire Transfer' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name *</label>
                        <input
                          type="text"
                          required
                          value={cashBankName}
                          onChange={(e) => setCashBankName(e.target.value)}
                          placeholder="e.g. Coutts & Co / Barclays / TD Bank"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Account Number / IBAN *</label>
                        <input
                          type="text"
                          required
                          value={cashAccountNumber}
                          onChange={(e) => setCashAccountNumber(e.target.value)}
                          placeholder="Bank Account Number or IBAN"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Courier Delivery Address *</label>
                      <input
                        type="text"
                        required
                        value={cashDeliveryAddress}
                        onChange={(e) => setCashDeliveryAddress(e.target.value)}
                        placeholder="Street Address, City, Postal Code for Insured Courier Delivery"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingInApp}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{isSubmittingInApp ? 'Registering Facility...' : `Request ${formatCurrency(cashAmount)} Cash Facility (24h Dispatch)`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Active Cash Loans List */}
              {userCashLoans.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    My Active Cash Facilities
                  </h4>
                  {userCashLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{loan.id}</span>
                        <span className="text-xs font-semibold text-blue-700">
                          {loan.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Facility Amount: <strong className="text-slate-900 font-mono tabular-nums">{formatCurrency(loan.amount)}</strong> ({loan.termMonths} Months)</span>
                        <span>Monthly: <strong className="text-slate-900 font-mono tabular-nums">{formatCurrency(loan.monthlyPayment)}/mo</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 5. WEALTH & INVESTMENTS TAB (In-App Yield Notes)       */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'investments' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-slate-950">
                    Asset-Backed Wealth Notes
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>100% Physical Title Lien Backed</span>
                    <span aria-hidden="true">·</span>
                    <span>Guaranteed Monthly Payouts</span>
                    <span aria-hidden="true">·</span>
                    <span>Earn While You Sleep</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInvestView('catalog')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      investView === 'catalog'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Wealth Notes Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestView('portfolio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      investView === 'portfolio'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Portfolio ({userInvestments.length})
                  </button>
                </div>
              </div>

              {investView === 'catalog' && (
                <div className="space-y-6">
                  {/* Duration Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Term Duration & Payout Cadence</div>
                      <div className="text-xs text-slate-500">Automated monthly direct bank distributions</div>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSelectedInvestDuration(6)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          selectedInvestDuration === 6
                            ? 'bg-white text-slate-900 font-semibold shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        6 Months
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedInvestDuration(12)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          selectedInvestDuration === 12
                            ? 'bg-white text-slate-900 font-semibold shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        12 Months (Maximum APY)
                      </button>
                    </div>
                  </div>

                  {/* 4 Clean Wealth Tiers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {INVESTMENT_TIERS.map((tier) => {
                      const rateConfig = tier.rates[selectedInvestDuration];

                      return (
                        <div
                          key={tier.id}
                          className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono text-slate-400">
                                {tier.tier}
                              </span>
                              <span className="text-xs text-slate-500">
                                {selectedInvestDuration} Months Term
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xl font-serif font-semibold text-slate-950">
                                {tier.name}
                              </h4>
                              <div className="text-2xl font-semibold font-mono text-slate-900 tabular-nums">
                                {formatCurrency(tier.price)}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {tier.description}
                            </p>

                            {/* Yield Strip */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-0.5">Monthly Payout:</span>
                                <span className="text-lg font-semibold text-blue-600 font-mono tabular-nums">
                                  {formatCurrency(rateConfig.monthlyPayout)}/mo
                                </span>
                                <span className="text-[11px] text-slate-500 block">Earn while you sleep</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[11px] mb-0.5">Guaranteed Total Payout:</span>
                                <span className="text-lg font-semibold text-slate-900 font-mono tabular-nums">
                                  {formatCurrency(rateConfig.yieldTotal)}
                                </span>
                                <span className="text-[11px] text-blue-700 font-semibold block">
                                  +{formatCurrency(rateConfig.gain)} Total Profit
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{tier.collateralBacking}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedTierForInvest(tier)}
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
                          >
                            <span>Allocate {formatCurrency(tier.price)} Capital</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {investView === 'portfolio' && (
                <div className="space-y-4">
                  {userInvestments.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 text-xs space-y-3">
                      <p>No active investment allocations yet.</p>
                      <button
                        type="button"
                        onClick={() => setInvestView('catalog')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs cursor-pointer"
                      >
                        Explore 4 Wealth Note Tiers
                      </button>
                    </div>
                  ) : (
                    userInvestments.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="font-mono font-bold text-slate-900 text-xs">{inv.id}</span>
                          <span className="text-xs font-semibold text-blue-700">
                            {inv.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Facility</span>
                            <span className="font-semibold text-slate-900">{inv.tierName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Principal</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(inv.principalAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Monthly Payout</span>
                            <span className="font-semibold text-blue-600 font-mono tabular-nums">{formatCurrency(inv.monthlyPayout)}/mo</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Total Return</span>
                            <span className="font-semibold text-slate-900 font-mono tabular-nums">{formatCurrency(inv.totalYield)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 6. LIVE CHAT SUPPORT                                   */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[620px] rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-950 flex items-center gap-2">
                      <span>Julian Sterling</span>
                      <span className="text-xs text-slate-400" aria-hidden="true">·</span>
                      <span className="text-xs text-blue-700 font-semibold">Chat Support Specialist</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Live Client Support · Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30">
                {chatMessages.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    Inquire directly regarding your auto loan pre-approval, vehicle enclosed delivery, or wealth note distributions.
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isAdmin ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isAdmin ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
                          }`}
                        >
                          {isAdmin ? 'JS' : 'ME'}
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                            isAdmin
                              ? 'bg-white border border-slate-200 text-slate-900'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                            <span>{msg.senderName}</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="leading-relaxed">{msg.text}</div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2.5 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
                {[
                  'Check my vehicle loan pre-approval',
                  'Confirm wire disbursement timeline',
                  'Inquire about wealth note monthly distribution',
                  'Request facility limit increase',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendChat(undefined, chip)}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendChat} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a private inquiry to Julian Sterling..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* 7. TREASURY & REPAYMENTS TAB                           */}
          {/* ------------------------------------------------------ */}
          {activeTab === 'repayments' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="pb-4 border-b border-slate-200">
                <h3 className="text-2xl font-serif font-semibold text-slate-950">
                  Treasury Clearing & Repayments
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Automated electronic clearing and direct debit schedules for all active credit facilities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <span className="text-xs font-mono uppercase text-slate-400 block">Total Monthly Facility Obligation</span>
                  <div className="text-3xl font-semibold text-slate-950 font-mono tabular-nums">
                    {formatCurrency(
                      userPreApprovals.reduce((a, b) => a + b.monthlyPayment, 0) +
                        userCashLoans.reduce((a, b) => a + b.monthlyPayment, 0)
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Automatically debited from your linked settlement account on the 1st of every month.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <span className="text-xs font-mono uppercase text-slate-400 block">Monthly Passive Payout (Yield)</span>
                  <div className="text-3xl font-semibold text-blue-600 font-mono tabular-nums">
                    +{formatCurrency(userInvestments.reduce((a, b) => a + b.monthlyPayout, 0))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Credited automatically to your designated bank account every 30 days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        </div>

        {/* ======================================================== */}
        {/* IN-APP MOBILE BOTTOM NAVIGATION BAR (DEDICATED DOCK)     */}
        {/* ======================================================== */}
        <nav
          aria-label="Aureus Mobile Navigation"
          className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-1 py-1.5 flex items-center justify-around shrink-0 z-20"
        >
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'my-loans', label: 'My Loans', icon: FileText, count: userPreApprovals.length + userCashLoans.length },
            { id: 'my-investments', label: 'Investments', icon: TrendingUp, count: userInvestments.length },
            { id: 'payment-methods', label: 'Payments', icon: CreditCard },
            { id: 'chat', label: 'Support', icon: MessageSquare },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer relative ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`} />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ======================================================== */}
      {/* IN-APP MODAL: VEHICLE FINANCING (Zero Redirect)         */}
      {/* ======================================================== */}
      {selectedVehicleForFinance && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Finance {selectedVehicleForFinance.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>10% Down to Take Delivery</span>
                  <span aria-hidden="true">·</span>
                  <span>90% Financed</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVehicleForFinance(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitVehicleFinance} className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Asset Value:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(selectedVehicleForFinance.price)}</span>
                </div>
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>10% Down Payment:</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(Math.round(selectedVehicleForFinance.price * 0.1))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>90% Balance Sheet Financed:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(Math.round(selectedVehicleForFinance.price * 0.9))}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Legal Name"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+44 / +1 / +61..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sovereign Identity / Passport / Driving Licence ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSovereignId}
                    onChange={(e) => setFormSovereignId(e.target.value)}
                    placeholder="e.g. DL / SIN / National ID"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Financing Term</label>
                  <select
                    value={formTermYears}
                    onChange={(e) => setFormTermYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value={3}>3 Years (36 Months)</option>
                    <option value={4}>4 Years (48 Months)</option>
                    <option value={5}>5 Years (60 Months) — Standard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingInApp}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmittingInApp ? 'Registering Pre-Approval...' : 'Confirm Pre-Approval (10% Down)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: HOME MORTGAGE PRE-APPROVAL                */}
      {/* ======================================================== */}
      {selectedPropertyForMortgage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  Mortgage Pre-Approval
                </h4>
                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                  {selectedPropertyForMortgage.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPropertyForMortgage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitHomeMortgage} className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Estate Value:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(selectedPropertyForMortgage.price)}</span>
                </div>
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>10% Down Payment:</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(Math.round(selectedPropertyForMortgage.price * 0.1))}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                  <span>90% Financed Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(Math.round(selectedPropertyForMortgage.price * 0.9))}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+44 / +1 / +61..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Sovereign Identity / National ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSovereignId}
                    onChange={(e) => setFormSovereignId(e.target.value)}
                    placeholder="Identification / Tax ID"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingInApp}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmittingInApp ? 'Registering Mortgage...' : 'Submit Mortgage Pre-Approval'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: CAPITAL ALLOCATION (WEALTH NOTE)          */}
      {/* ======================================================== */}
      {selectedTierForInvest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  {selectedTierForInvest.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{formatCurrency(selectedTierForInvest.price)} Principal</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedInvestDuration} Months Term</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTierForInvest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvestmentAllocation} className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Monthly Payout:</span>
                  <span className="text-lg font-semibold text-blue-600 font-mono tabular-nums">
                    {formatCurrency(selectedTierForInvest.rates[selectedInvestDuration].monthlyPayout)}/mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Return:</span>
                  <span className="text-lg font-semibold text-slate-900 font-mono tabular-nums">
                    {formatCurrency(selectedTierForInvest.rates[selectedInvestDuration].yieldTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Full Legal Name or Entity"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+44 / +1 / +61..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={formBankName}
                      onChange={(e) => setFormBankName(e.target.value)}
                      placeholder="e.g. Barclays / TD Bank / Coutts"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Number / IBAN *</label>
                    <input
                      type="text"
                      required
                      value={formAccountNumber}
                      onChange={(e) => setFormAccountNumber(e.target.value)}
                      placeholder="Account Number or IBAN"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingInApp}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {isSubmittingInApp ? 'Deploying Capital...' : `Confirm ${formatCurrency(selectedTierForInvest.price)} Allocation`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* IN-APP MODAL: ADD MONEY / DEPOSIT                        */}
      {/* ======================================================== */}
      {isAddMoneyOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold block uppercase">
                  Aureus Capital Treasury Settlement
                </span>
                <h4 className="text-base font-bold">Add Money to Capital Account</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMoneyOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Rails Toggle */}
            <div className="flex border-b border-slate-200 bg-slate-100/80 p-1.5 gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setAddMoneyTab('card_to_btc')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addMoneyTab === 'card_to_btc'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>On-Ramp Card Pay</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  addMoneyTab === 'card_to_btc' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>MOONPAY</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMoneyTab('wire')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  addMoneyTab === 'wire'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-blue-400" />
                <span>SWIFT / Wire</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
              {addMoneyTab === 'card_to_btc' ? (
                /* Fiat-to-Crypto On-Ramp Gateway Form */
                <form onSubmit={handleExecuteCardToBitcoin} className="space-y-4">
                  {/* On-Ramp Provider Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Select Fiat-to-Crypto On-Ramp Gateway
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'moonpay', name: 'MoonPay', tag: 'Recommended', fee: '0% Surcharge' },
                        { id: 'transak', name: 'Transak', tag: '170+ Countries', fee: 'Global Cards' },
                        { id: 'ramp', name: 'Ramp Network', tag: 'Instant 3DS', fee: 'Fast Settle' },
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setSelectedOnRampProvider(prov.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedOnRampProvider === prov.id
                              ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{prov.name}</span>
                            {selectedOnRampProvider === prov.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${
                            selectedOnRampProvider === prov.id ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {prov.tag}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Amount on Card ({selectedCurrency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                      <input
                        type="number"
                        value={btcFiatAmount}
                        onChange={(e) => setBtcFiatAmount(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Hybrid On-Ramp Execution Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>Company Bitcoin Received via {selectedOnRampProvider.toUpperCase()}:</span>
                      <span className="text-emerald-400 font-mono font-bold">1 BTC ≈ ${btcRate.toLocaleString()}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-extrabold text-white flex items-center gap-1.5">
                      <Bitcoin className="w-5 h-5 text-blue-400" />
                      <span>{((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate border-t border-slate-800 pt-1.5">
                      Settles to Company Wallet: <strong className="text-slate-200">{companyBtcAddress}</strong>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Name on Card *</label>
                      <input
                        type="text"
                        required
                        value={btcCardHolder}
                        onChange={(e) => setBtcCardHolder(e.target.value)}
                        placeholder="Cardholder Legal Name"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">16-Digit Card Number (Visa / Mastercard) *</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={btcCardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                            const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                            setBtcCardNumber(formatted);
                          }}
                          placeholder="4532 •••• •••• 8492"
                          maxLength={19}
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry *</label>
                        <input
                          type="text"
                          required
                          value={btcCardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                            setBtcCardExpiry(v);
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">CVV *</label>
                        <input
                          type="password"
                          required
                          value={btcCardCvv}
                          onChange={(e) => setBtcCardCvv(e.target.value.slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingBtcPayment}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    {isProcessingBtcPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Processing via {selectedOnRampProvider.toUpperCase()} On-Ramp...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span>
                          Pay with Card via {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} → Settle {((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC to Company
                        </span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Bank Wire Transfer Tab */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Amount ({selectedCurrency})</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                      <input
                        type="number"
                        value={addMoneyAmount}
                        onChange={(e) => setAddMoneyAmount(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600"
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  {/* Transfer Details Card */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>SWIFT / Fedwire Treasury Instructions</span>
                      <span className="text-[10px] bg-blue-200/60 px-2 py-0.5 rounded text-blue-900 font-medium">Instant Clearing</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-800 font-mono">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Beneficiary:</span>
                        <span className="font-bold">Aureus Capital Treasury Ltd</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">IBAN / Account:</span>
                        <span className="font-bold">GB89 AURS 4005 1290 8472 10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Sort / BIC:</span>
                        <span className="font-bold">AURSGB2L (40-05-12)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Reference:</span>
                        <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-blue-300">
                          REF-NELSON-774
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMoneyOpen(false);
                      setFeedbackMessage(`Deposit instruction of ${selectedCurrency} ${addMoneyAmount} logged. Allocation will credit within 15 minutes.`);
                      setTimeout(() => setFeedbackMessage(null), 4000);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    I Have Completed Wire Transfer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: WITHDRAW / DRAWDOWN                        */}
      {/* ======================================================== */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold block uppercase">
                  Capital Drawdown
                </span>
                <h4 className="text-base font-bold">Withdraw Capital / Yield</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Withdrawal Amount ({selectedCurrency})</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-500"
                    placeholder="2500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Destination Account</div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Barclays Private Banking</div>
                      <div className="text-[10px] text-slate-500">Account ending in •••• 8492</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsWithdrawOpen(false);
                  setFeedbackMessage(`Payout of ${selectedCurrency} ${withdrawAmount} submitted to your verified bank account.`);
                  setTimeout(() => setFeedbackMessage(null), 4000);
                }}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Confirm Payout Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: ADD FREE PAYMENT METHOD                    */}
      {/* ======================================================== */}
      {isAddPaymentMethodOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in text-slate-900">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                    Zero-Fee Clearing
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    100% FREE · $0.00
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-0.5">Add Free Payment Method</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPaymentMethodOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddPaymentMethod} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Select Free Payment Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPmType('bank_account')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      newPmType === 'bank_account'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Bank Account</span>
                    <span className="text-[9px] text-emerald-700 font-medium">Free ACH/SEPA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPmType('debit_card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      newPmType === 'debit_card'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Debit Card</span>
                    <span className="text-[9px] text-emerald-700 font-medium">0% Card Fee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPmType('card_to_crypto')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      newPmType === 'card_to_crypto'
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className={`w-4 h-4 ${newPmType === 'card_to_crypto' ? 'text-white' : 'text-slate-600'}`} />
                    <span className="text-[11px]">Card Pay</span>
                    <span className={`text-[9px] font-medium ${newPmType === 'card_to_crypto' ? 'text-slate-300' : 'text-slate-500'}`}>Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPmType('wire_transfer')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      newPmType === 'wire_transfer'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">Direct Wire</span>
                    <span className="text-[9px] text-emerald-700 font-medium">Institutional</span>
                  </button>
                </div>
              </div>

              {/* Form Fields according to selected type */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {newPmType === 'bank_account'
                      ? 'Bank / Financial Institution Name *'
                      : newPmType === 'debit_card'
                      ? 'Card Brand / Issuer Bank *'
                      : newPmType === 'card_to_crypto'
                      ? 'Card Brand / Issuer (Visa / Mastercard) *'
                      : 'Sending Treasury Bank *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPmInstitution}
                    onChange={(e) => setNewPmInstitution(e.target.value)}
                    placeholder={
                      newPmType === 'bank_account'
                        ? 'e.g. Barclays, Chase, RBC, Deutsche Bank'
                        : newPmType === 'debit_card'
                        ? 'e.g. Chase Visa Debit, Barclays Debit'
                        : newPmType === 'card_to_crypto'
                        ? 'e.g. Visa Signature (Card-to-Bitcoin Rail)'
                        : 'e.g. HSBC Commercial Bank'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Account Holder / Name on Card *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPmHolder}
                    onChange={(e) => setNewPmHolder(e.target.value)}
                    placeholder="Full Legal Name or Entity"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {newPmType === 'debit_card' || newPmType === 'card_to_crypto' ? '16-Digit Card Number *' : 'Account Number / IBAN *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newPmNumber}
                      onChange={(e) => setNewPmNumber(e.target.value)}
                      placeholder={newPmType === 'debit_card' || newPmType === 'card_to_crypto' ? '4532 •••• •••• 8492' : 'GB82 BARC 2000 0081 9283 01'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {newPmType === 'debit_card' || newPmType === 'card_to_crypto' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Expiry *</label>
                        <input
                          type="text"
                          required
                          value={newPmExpiry}
                          onChange={(e) => setNewPmExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">CVV *</label>
                        <input
                          type="password"
                          required
                          value={newPmCvv}
                          onChange={(e) => setNewPmCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Sort Code / Routing Number
                      </label>
                      <input
                        type="text"
                        value={newPmRouting}
                        onChange={(e) => setNewPmRouting(e.target.value)}
                        placeholder="e.g. 20-04-15 or 021000021"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-[11px] text-emerald-950">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Free Electronic Settlement Guarantee</span>
                  </div>
                  <p className="text-emerald-900/80 leading-relaxed text-[10px]">
                    No fee is charged to link this payment method ($0.00). All transactions for 10% asset down payments and monthly loan repayments carry a 0.00% processing surcharge.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newPmSetDefault}
                    onChange={(e) => setNewPmSetDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700">Set as my default payment method for all facilities</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2 active:scale-95"
              >
                <span>Add Free Payment Method ($0.00 Fee)</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: FIAT-TO-CRYPTO ON-RAMP PAYMENT GATEWAY     */}
      {/* ======================================================== */}
      {isCardToBtcModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in text-slate-900">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white border border-slate-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold block uppercase">
                    On-Ramp Payment Processor
                  </span>
                  <h4 className="text-base font-bold">Pay with Card → Settle to Bitcoin</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCardToBtcModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto">
              {/* On-Ramp Gateway Provider Switcher */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Select On-Ramp Gateway
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'moonpay', name: 'MoonPay', tag: 'Recommended' },
                    { id: 'transak', name: 'Transak', tag: 'Global Cards' },
                    { id: 'ramp', name: 'Ramp Network', tag: 'Fast 3DS' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedOnRampProvider(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedOnRampProvider === p.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{p.name}</span>
                        {selectedOnRampProvider === p.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${
                        selectedOnRampProvider === p.id ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {p.tag}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Educational Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-slate-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Hybrid On-Ramp Settlement Infrastructure</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  You enter debit or credit card details in {selectedCurrency}. {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} charges your card, converts fiat at spot rate, and settles Bitcoin directly into the Aureus Capital Company Treasury wallet.
                </p>
              </div>

              <form onSubmit={handleExecuteCardToBitcoin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount to Charge on Card ({selectedCurrency}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      required
                      value={btcFiatAmount}
                      onChange={(e) => setBtcFiatAmount(e.target.value)}
                      placeholder="5000"
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                {/* Company Destination Summary Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Company Bitcoin Received ({selectedOnRampProvider.toUpperCase()}):</span>
                    <span className="text-emerald-400 font-mono font-bold">1 BTC = ${btcRate.toLocaleString()}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-white flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-blue-400" />
                    <span>{((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate border-t border-slate-800 pt-1.5 flex items-center justify-between">
                    <span>Settles to: {companyBtcAddress}</span>
                    <span className="text-emerald-400 font-bold">0% Client Fee</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Purpose</label>
                  <select
                    value={btcPaymentPurpose}
                    onChange={(e) => setBtcPaymentPurpose(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-medium"
                  >
                    <option value="Direct Capital Deposit & Treasury Allocation">Direct Capital Deposit & Treasury Allocation</option>
                    <option value="10% Vehicle Down Payment (Prestige Auto)">10% Vehicle Down Payment (Prestige Auto)</option>
                    <option value="10% Prime Real Estate Down Payment">10% Prime Real Estate Down Payment</option>
                    <option value="24h Express Cash Loan Repayment">24h Express Cash Loan Repayment</option>
                    <option value="Wealth Allocation Yield Vault Investment">Wealth Allocation Yield Vault Investment</option>
                  </select>
                </div>

                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={btcCardHolder}
                      onChange={(e) => setBtcCardHolder(e.target.value)}
                      placeholder="Name exactly as printed on card"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">16-Digit Card Number (Visa / Mastercard) *</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={btcCardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                          setBtcCardNumber(formatted);
                        }}
                        placeholder="4532 •••• •••• 8492"
                        maxLength={19}
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry *</label>
                      <input
                        type="text"
                        required
                        value={btcCardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                          setBtcCardExpiry(v);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">CVV *</label>
                      <input
                        type="password"
                        required
                        value={btcCardCvv}
                        onChange={(e) => setBtcCardCvv(e.target.value.slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-center text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingBtcPayment}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
                >
                  {isProcessingBtcPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Processing via {selectedOnRampProvider.toUpperCase()} & Settling to Company Bitcoin...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>
                        Pay with Card via {selectedOnRampProvider === 'moonpay' ? 'MoonPay' : selectedOnRampProvider === 'transak' ? 'Transak' : 'Ramp'} → Settle {((parseFloat(btcFiatAmount || '0') || 0) / btcRate).toFixed(6)} BTC to Company
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: ON-RAMP BITCOIN CONFIRMATION RECEIPT       */}
      {/* ======================================================== */}
      {btcSuccessTx && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in text-slate-900">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white text-center space-y-2 relative">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold block uppercase">
                  Fiat-to-Crypto On-Ramp Complete
                </span>
                <h4 className="text-lg font-bold">Settled Directly to Company Bitcoin</h4>
              </div>
              <p className="text-xs text-slate-300">
                Card charged in {btcSuccessTx.fiatCurrency}; Bitcoin credited into Aureus Treasury.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Amounts Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">Bitcoin Transferred to Company Treasury:</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 flex items-center justify-center gap-1.5">
                  <Bitcoin className="w-6 h-6 text-blue-600" />
                  <span>+{btcSuccessTx.btcAmount} BTC</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Card Charged: {btcSuccessTx.fiatCurrency} {btcSuccessTx.fiatAmount.toLocaleString()}
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-2 text-[11px] border border-slate-200 rounded-2xl p-4 bg-slate-50/60 font-mono">
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-bold text-slate-900">{btcSuccessTx.id}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Payment Rail:</span>
                  <span className="font-bold text-slate-900">{btcSuccessTx.cardBrand} (•••• {btcSuccessTx.cardLast4})</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Cardholder:</span>
                  <span className="font-bold text-slate-900">{btcSuccessTx.userName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="font-bold text-slate-900 text-right">{btcSuccessTx.purpose}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-slate-500 mb-0.5">Company Treasury Address:</div>
                  <div className="font-bold text-slate-900 text-[10px] break-all select-all bg-white p-1 rounded border border-slate-200">
                    {btcSuccessTx.companyBtcAddress}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-slate-500 mb-0.5">Bitcoin Blockchain TxHash:</div>
                  <div className="font-bold text-blue-700 text-[10px] break-all select-all bg-white p-1 rounded border border-blue-200">
                    {btcSuccessTx.txHash}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(btcSuccessTx.txHash);
                    setFeedbackMessage('Bitcoin TxHash copied to clipboard!');
                    setTimeout(() => setFeedbackMessage(null), 3000);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy TxHash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBtcSuccessTx(null)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* IN-APP MODAL: COMPANY BITCOIN TREASURY QR CODE           */}
      {/* ======================================================== */}
      {qrCodeModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in text-slate-900">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-center">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                Company Bitcoin Treasury
              </span>
              <button
                type="button"
                onClick={() => setQrCodeModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Simulated Crisp SVG QR Code */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-md flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="26" height="26" rx="4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" />

                  <rect x="69" y="5" width="26" height="26" rx="4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" />

                  <rect x="5" y="69" width="26" height="26" rx="4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" />

                  {/* QR Pattern Data Dots */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="36" y="18" width="6" height="6" />
                  <rect x="56" y="18" width="6" height="6" />

                  <rect x="8" y="36" width="6" height="6" />
                  <rect x="18" y="36" width="6" height="6" />
                  <rect x="28" y="36" width="6" height="6" />
                  <rect x="38" y="36" width="6" height="6" />
                  <rect x="58" y="36" width="6" height="6" />
                  <rect x="68" y="36" width="6" height="6" />
                  <rect x="78" y="36" width="6" height="6" />
                  <rect x="88" y="36" width="6" height="6" />

                  <rect x="38" y="46" width="6" height="6" />
                  <rect x="48" y="46" width="6" height="6" />
                  <rect x="68" y="46" width="6" height="6" />
                  <rect x="88" y="46" width="6" height="6" />

                  <rect x="36" y="58" width="6" height="6" />
                  <rect x="46" y="58" width="6" height="6" />
                  <rect x="56" y="58" width="6" height="6" />
                  <rect x="76" y="58" width="6" height="6" />

                  <rect x="36" y="76" width="6" height="6" />
                  <rect x="46" y="76" width="6" height="6" />
                  <rect x="66" y="76" width="6" height="6" />
                  <rect x="86" y="76" width="6" height="6" />

                  <rect x="36" y="86" width="6" height="6" />
                  <rect x="56" y="86" width="6" height="6" />
                  <rect x="76" y="86" width="6" height="6" />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center">
                    <Bitcoin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Bitcoin Mainnet Native SegWit
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 break-all select-all bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {companyBtcAddress}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(companyBtcAddress);
                  setCopiedBtcAddress(true);
                  setFeedbackMessage('Company Bitcoin address copied!');
                  setTimeout(() => {
                    setCopiedBtcAddress(false);
                    setFeedbackMessage(null);
                  }, 3000);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                {copiedBtcAddress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBtcAddress ? 'Copied to Clipboard!' : 'Copy Treasury Address'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

