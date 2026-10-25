export type CountryCode = 'UK' | 'CA' | 'AU' | 'DE';
export type LoanType = 'home' | 'car';

export type FooterModalType = 
  | 'overview'
  | 'catalog'
  | 'loans'
  | 'calculator'
  | 'how-it-works'
  | 'security'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'impressum'
  | 'down-payment'
  | 'advisory'
  | 'treasury'
  | 'locations'
  | null;



export interface CountryConfig {
  code: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  currency: string;
  currencyCode: string;
  locale: string;
  homeLoan: {
    min: number;
    max: number;
    defaultAmount: number;
    defaultRate: number;
    defaultTerm: number;
    terms: number[];
    badge: string;
  };
  carLoan: {
    min: number;
    max: number;
    defaultAmount: number;
    defaultRate: number;
    defaultTerm: number;
    terms: number[];
    badge: string;
  };
  regulatorBadge: string;
  regulatorText: string;
  footerCompliance: string;
  statVolume: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  loanType: LoanType;
  amount: string;
  rate: string;
  quote: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PartnerLender {
  name: string;
  tier: string;
  location: string;
}

export interface VirtualTourHotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  detail: string;
}

export interface VirtualTourRoom {
  id: string;
  name: string;
  category: 'foyer' | 'living' | 'kitchen' | 'master' | 'bath' | 'terrace' | 'pool' | 'wellness' | 'exterior';
  description: string;
  imageUrl: string;
  videoUrl?: string;
  embedUrl?: string;
  localVideoUrl?: string;
  features?: string[];
  hotspots?: VirtualTourHotspot[];
}

export interface SuggestedRoomSpec {
  name: string;
  count: number;
  type: string;
  description: string;
}

export interface InteriorPhoto {
  id: string;
  name: string;
  category: 'exterior' | 'living' | 'kitchen' | 'master' | 'bath' | 'terrace';
  imageUrl: string;
  videoUrl?: string;
  description: string;
}

export interface HomePerspective {
  id: string;
  number: number; // 1 to 15
  title: string;
  cameraPerspective: string;
  category: 'exterior' | 'living' | 'master' | 'kitchen' | 'bath';
  imageUrl: string;
  description: string;
}

export interface PropertyItem {
  id: string;
  title: string;
  location: string;
  price: number; // max 1,000,000 as per user requirement
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  tag: string;
  description: string;
  imageKey?: 'manor' | 'penthouse' | 'villa' | 'architectural';
  imageUrl: string; // distinct high-res photo for each house
  videoUrl?: string;
  fullWalkthroughVideoUrl?: string;
  galleryUrls?: string[];
  interiorGallery?: InteriorPhoto[];
  suggestedRooms?: SuggestedRoomSpec[];
  roomSummary?: string;
  virtualTourRooms?: VirtualTourRoom[];
  perspectives?: HomePerspective[];
}

export interface VehicleItem {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  hp: number;
  acceleration: string;
  drivetrain: string;
  tag: string;
  description: string;
  imageKey?: 'supercar' | 'suv' | 'coupe' | 'ev';
  imageUrl: string; // distinct high-res photo for each car
  galleryUrls?: string[];
}

export interface InvestmentPlan {
  id: string;
  name: string;
  badge: string;
  tier: 'Prime Starter' | 'Prestige Growth' | 'Sovereign Treasury';
  apy: number; // e.g. 8.4, 11.2, 14.6
  minInvestment: number;
  maxInvestment: number;
  durationMonths: number;
  payoutFrequency: 'Monthly' | 'Quarterly' | 'Bi-Annual';
  collateralBacking: string;
  riskRating: 'AAA Asset-Backed' | 'AA+ Senior Secured' | 'AAA Sovereign Guarantee';
  description: string;
  highlights: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  clientId: string;
  memberTier: string;
  kycStatus: 'Verified Prime Borrower' | 'Pending Review' | 'Tier-1 Certified';
  creditScore: number;
  clearingBank: string;
}

export interface UserLoan {
  id: string;
  assetTitle: string;
  assetType: LoanType;
  assetPrice: number;
  upfrontPaid: number; // 10%
  financedBalance: number;
  interestRate: number;
  monthlyPayment: number;
  termMonths: number;
  remainingMonths: number;
  status: 'Active' | 'Underwriting' | 'Disbursed';
  nextPaymentDate: string;
  imageUrl: string;
  propertyRefId?: string;
}

export interface UserInvestment {
  id: string;
  planId: string;
  planName: string;
  principalAmount: number;
  apy: number;
  termMonths: number;
  startDate: string;
  accruedYield: number;
  nextPayoutDate: string;
  payoutFrequency: 'Monthly' | 'Quarterly' | 'Bi-Annual';
  autoReinvest: boolean;
}

export interface PreApprovalSubmission {
  id: string;
  submittedAt: string;
  country: CountryCode;
  timeframe: string;
  propertyType: string;
  homeUsage: string;
  cityOrZip: string;
  workingWithAgent: 'Yes' | 'No';
  homePrice: number;
  monthlyPayment: number;
  downPayment: number;
  downPaymentTiming: string;
  grossIncome: number;
  selfEmployed: 'Yes' | 'No';
  ownedHomePast3Years: 'Yes' | 'No';
  militaryAffiliation: 'Yes' | 'No';
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  electronicConsent: boolean;
  hadBankruptcy: 'Yes' | 'No';
  sovereignId: string;
  dateOfBirth: string;
  creditReportConsent: boolean;
  status: string;
  preApprovedAmount: number;
  interestRate: number;
}

export interface CashLoanSubmission {
  id: string;
  submittedAt: string;
  country: CountryCode;
  amount: number;
  termMonths: number;
  monthlyPayment: number;
  purpose: string;
  urgency: string;
  disbursementMethod: string;
  bankName: string;
  accountNumber: string;
  chequePayeeName?: string;
  chequeDeliveryAddress?: string;
  chequeCity?: string;
  chequeState?: string;
  chequeZip?: string;
  chequeInstructions?: string;
  fullName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  employmentStatus: string;
  sovereignId: string;
  status: string;
  interestRate?: number;
}

export interface CustomBudgetSubmission {
  id: string;
  submittedAt: string;
  country: CountryCode;
  targetBudget: string;
  subject: string;
  assetCategory: string;
  timeframe: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  status?: string;
}

export interface InvestmentSubmission {
  id: string;
  submittedAt: string;
  country: CountryCode;
  tierId: string;
  tierName: string;
  principalAmount: number;
  durationMonths: 6 | 12;
  ratePercent: number;
  totalYield: number;
  gain: number;
  monthlyPayout: number;
  fullName: string;
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  status: string;
  reinvestmentPlan?: 'compound' | 'monthly_payout' | 'retirement';
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  userEmail: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface UserPaymentMethod {
  id: string;
  userEmail: string;
  type: 'bank_account' | 'debit_card' | 'wire_transfer' | 'card_to_crypto' | 'bitcoin_wallet';
  label: string;
  institutionName: string;
  accountOrCardNumberMasked: string;
  routingOrSortCode?: string;
  holderName: string;
  expiry?: string;
  isDefault: boolean;
  isFree: boolean;
  createdAt: string;
  status: 'Verified' | 'Active';
}

export interface BitcoinSettlementTransaction {
  id: string;
  userEmail: string;
  userName: string;
  fiatAmount: number;
  fiatCurrency: string;
  btcAmount: number;
  btcRate: number;
  companyBtcAddress: string;
  txHash: string;
  cardLast4: string;
  cardBrand: string;
  status: 'Confirmed' | 'Settled';
  timestamp: string;
  purpose: string;
}
