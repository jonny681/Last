import { PreApprovalSubmission, CashLoanSubmission, CustomBudgetSubmission, InvestmentSubmission, RegisteredUser, ChatMessage, UserPaymentMethod, BitcoinSettlementTransaction } from '../types';

const STORAGE_KEYS = {
  PRE_APPROVAL: 'aureus_pre_approvals_v2',
  CASH_LOAN: 'aureus_cash_loans_v2',
  CUSTOM_BUDGET: 'aureus_custom_budgets_v2',
  INVESTMENTS: 'aureus_investments_v2',
  USERS: 'aureus_users_v2',
  CURRENT_USER: 'aureus_current_user_v2',
  CHAT: 'aureus_chat_messages_v2',
  PAYMENT_METHODS: 'aureus_payment_methods_v2',
  BTC_TRANSACTIONS: 'aureus_btc_transactions_v2',
  COMPANY_BTC_ADDRESS: 'aureus_company_btc_address_v2',
};

export const DEFAULT_COMPANY_BTC_ADDRESS = 'bc1q9aureus7x4z802kldmq8w30v39fxz92mty6';

const DEFAULT_BTC_TRANSACTIONS: BitcoinSettlementTransaction[] = [
  {
    id: 'BTC-TX-2026-9921',
    userEmail: 'client@aureus-capital.com',
    userName: 'Private Client',
    fiatAmount: 5000,
    fiatCurrency: 'USD',
    btcAmount: 0.07304,
    btcRate: 68450,
    companyBtcAddress: DEFAULT_COMPANY_BTC_ADDRESS,
    txHash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    cardLast4: '4242',
    cardBrand: 'Visa Sovereign Debit',
    status: 'Settled',
    timestamp: '2026-10-20T11:24:00Z',
    purpose: 'Direct Capital Deposit & Treasury Settlement',
  },
];

const DEFAULT_PRE_APPROVALS: PreApprovalSubmission[] = [
  {
    id: 'PRE-APP-2026-84920',
    submittedAt: '2026-10-12T05:30:00Z',
    country: 'UK',
    timeframe: 'Within 3 months',
    propertyType: 'Single-family or townhome',
    homeUsage: 'Primary residence',
    cityOrZip: 'SW1A 1AA London',
    workingWithAgent: 'Yes',
    homePrice: 850000,
    monthlyPayment: 3820,
    downPayment: 85000,
    downPaymentTiming: "It's available now",
    grossIncome: 185000,
    selfEmployed: 'No',
    ownedHomePast3Years: 'Yes',
    militaryAffiliation: 'No',
    firstName: 'Oliver',
    lastName: 'Kensington',
    fullName: 'Oliver Kensington',
    email: 'oliver.kensington@mayfair-advisory.co.uk',
    phone: '+44 20 7946 0912',
    streetAddress: '14 Chesterfield Hill',
    unit: 'Penthouse B',
    city: 'London',
    state: 'Greater London',
    zipCode: 'W1J 5BG',
    electronicConsent: true,
    hadBankruptcy: 'No',
    sovereignId: 'QQ 12 34 56 A',
    dateOfBirth: '1984-06-15',
    creditReportConsent: true,
    status: 'Verified Pre-Approved',
    preApprovedAmount: 765000,
    interestRate: 4.85,
  },
  {
    id: 'PRE-APP-2026-61204',
    submittedAt: '2026-10-11T19:15:00Z',
    country: 'CA',
    timeframe: 'In 4-6 months',
    propertyType: 'Condominium',
    homeUsage: 'Secondary or vacation home',
    cityOrZip: 'V6B 1A1 Vancouver',
    workingWithAgent: 'No',
    homePrice: 920000,
    monthlyPayment: 4150,
    downPayment: 92000,
    downPaymentTiming: "It's available now",
    grossIncome: 210000,
    selfEmployed: 'Yes',
    ownedHomePast3Years: 'Yes',
    militaryAffiliation: 'No',
    firstName: 'Sophie',
    lastName: 'Tremblay',
    fullName: 'Sophie Tremblay',
    email: 'sophie.tremblay@pacific-ventures.ca',
    phone: '+1 (604) 555-0198',
    streetAddress: '1088 Burrard St',
    unit: 'Suite 2400',
    city: 'Vancouver',
    state: 'BC',
    zipCode: 'V6Z 2R9',
    electronicConsent: true,
    hadBankruptcy: 'No',
    sovereignId: '745-920-118',
    dateOfBirth: '1989-11-23',
    creditReportConsent: true,
    status: 'Under Review',
    preApprovedAmount: 828000,
    interestRate: 4.95,
  },
  {
    id: 'PRE-APP-2026-39158',
    submittedAt: '2026-10-10T14:45:00Z',
    country: 'DE',
    timeframe: 'Within 3 months',
    propertyType: 'Single-family or townhome',
    homeUsage: 'Primary residence',
    cityOrZip: '80331 München',
    workingWithAgent: 'Yes',
    homePrice: 780000,
    monthlyPayment: 3490,
    downPayment: 78000,
    downPaymentTiming: "It's available now",
    grossIncome: 165000,
    selfEmployed: 'No',
    ownedHomePast3Years: 'No',
    militaryAffiliation: 'No',
    firstName: 'Maximilian',
    lastName: 'von Berg',
    fullName: 'Maximilian von Berg',
    email: 'm.vonberg@bavaria-capital.de',
    phone: '+49 89 2444 0122',
    streetAddress: 'Maximilianstraße 35',
    unit: 'App. 4A',
    city: 'München',
    state: 'Bayern',
    zipCode: '80539',
    electronicConsent: true,
    hadBankruptcy: 'No',
    sovereignId: 'DE 94 812 045 19',
    dateOfBirth: '1981-04-12',
    creditReportConsent: true,
    status: 'Verified Pre-Approved',
    preApprovedAmount: 702000,
    interestRate: 4.19,
  },
];

const DEFAULT_CASH_LOANS: CashLoanSubmission[] = [
  {
    id: 'AUR-CASH-UK-28190',
    submittedAt: '2026-10-12T08:20:00Z',
    country: 'UK',
    amount: 150000,
    termMonths: 36,
    monthlyPayment: 4492,
    purpose: 'Bridge Capital for Luxury Motorcar Acquisition',
    urgency: 'Within 24 Hours',
    disbursementMethod: 'Direct Wire Transfer',
    bankName: 'Coutts & Co Private Bank',
    accountNumber: '440-9182-019',
    fullName: 'Lord Edward Hastings',
    email: 'hastings.estate@mayfair-private.co.uk',
    phone: '+44 20 7183 9920',
    monthlyIncome: 28500,
    employmentStatus: 'Private Asset Manager / Landlord',
    sovereignId: 'HA 99 12 34 B',
    status: 'Under Review — Status Sent to Email',
  },
  {
    id: 'AUR-CASH-CA-74021',
    submittedAt: '2026-10-11T16:10:00Z',
    country: 'CA',
    amount: 75000,
    termMonths: 24,
    monthlyPayment: 3290,
    purpose: 'Renovation & Architectural Staging for Waterfront Property',
    urgency: 'Same-Day Wire',
    disbursementMethod: 'Direct Wire Transfer',
    bankName: 'RBC Royal Bank Private Banking',
    accountNumber: '003-8821-490',
    fullName: 'Marcus Vance',
    email: 'm.vance@vance-holdings.ca',
    phone: '+1 (416) 555-8291',
    monthlyIncome: 19500,
    employmentStatus: 'Corporate Executive',
    sovereignId: '812-491-002',
    status: 'Approved - Ready for Disbursement',
  },
];

const DEFAULT_CUSTOM_BUDGETS: CustomBudgetSubmission[] = [
  {
    id: 'BDG-UK-918401',
    submittedAt: '2026-10-12T11:00:00Z',
    country: 'UK',
    targetBudget: '£4,500,000',
    subject: 'Bespoke Grade-II Listed Manor Acquisition in Cotswolds',
    assetCategory: 'home',
    timeframe: 'now',
    fullName: 'Charlotte Weatherby',
    email: 'c.weatherby@weatherby-trust.co.uk',
    phone: '+44 1451 820 918',
    notes: 'Requiring balance sheet facility for historical estate with 40 acres. 10% down equity ready for immediate wire clearing.',
    status: 'Under Review',
  },
];

const DEFAULT_INVESTMENTS: InvestmentSubmission[] = [
  {
    id: 'AUR-INV-2026-1092',
    submittedAt: '2026-10-13T10:00:00Z',
    country: 'UK',
    tierId: 'tier-50k',
    tierName: 'Sovereign Portfolio Partner ($50,000)',
    principalAmount: 50000,
    durationMonths: 12,
    ratePercent: 39.63,
    totalYield: 69813,
    gain: 19813,
    monthlyPayout: 1651,
    fullName: 'Oliver Kensington',
    email: 'oliver.kensington@mayfair-advisory.co.uk',
    phone: '+44 20 7946 0912',
    bankName: 'Barclays Wealth International',
    accountNumber: 'GB82 BARC 2000 0081 9283 01',
    status: 'Active / Generating Yield',
    reinvestmentPlan: 'monthly_payout',
  },
  {
    id: 'AUR-INV-2026-8812',
    submittedAt: '2026-10-14T14:30:00Z',
    country: 'CA',
    tierId: 'tier-25k',
    tierName: 'Prestige Growth Capital ($25,000)',
    principalAmount: 25000,
    durationMonths: 12,
    ratePercent: 41.27,
    totalYield: 35318,
    gain: 10318,
    monthlyPayout: 860,
    fullName: 'Sophie Tremblay',
    email: 'sophie.tremblay@pacific-ventures.ca',
    phone: '+1 (604) 555-0198',
    bankName: 'TD Private Wealth Management',
    accountNumber: 'CA04 TDOM 0001 9281 7291 00',
    status: 'Active / Generating Yield',
    reinvestmentPlan: 'retirement',
  },
];

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: 'USR-89102',
    name: 'Oliver Kensington',
    email: 'oliver.kensington@mayfair-advisory.co.uk',
    phone: '+44 20 7946 0912',
    password: 'password123',
    createdAt: '2026-10-01T00:00:00Z',
    avatar: 'OK',
  },
  {
    id: 'USR-DEMO',
    name: 'Private Client',
    email: 'client@aureus-capital.com',
    phone: '+1 (800) 555-0199',
    password: 'password123',
    createdAt: '2026-10-01T00:00:00Z',
    avatar: 'PC',
  },
];

export const SubmissionsStore = {
  // Pre-Approvals
  getPreApprovalSubmissions(): PreApprovalSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRE_APPROVAL);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRE_APPROVAL, JSON.stringify(DEFAULT_PRE_APPROVALS));
        return DEFAULT_PRE_APPROVALS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_PRE_APPROVALS;
    }
  },

  addPreApprovalSubmission(sub: PreApprovalSubmission): void {
    try {
      const current = this.getPreApprovalSubmissions();
      const updated = [sub, ...current.filter((x) => x.id !== sub.id)];
      localStorage.setItem(STORAGE_KEYS.PRE_APPROVAL, JSON.stringify(updated));
      this.ensureUserForSubmission(sub.fullName, sub.email, sub.phone);
    } catch (e) {
      console.error('Failed to store pre-approval submission', e);
    }
  },

  // Cash Loans
  getCashLoanSubmissions(): CashLoanSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASH_LOAN);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CASH_LOAN, JSON.stringify(DEFAULT_CASH_LOANS));
        return DEFAULT_CASH_LOANS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CASH_LOANS;
    }
  },

  addCashLoanSubmission(sub: CashLoanSubmission): void {
    try {
      const current = this.getCashLoanSubmissions();
      const updated = [sub, ...current.filter((x) => x.id !== sub.id)];
      localStorage.setItem(STORAGE_KEYS.CASH_LOAN, JSON.stringify(updated));
      this.ensureUserForSubmission(sub.fullName, sub.email, sub.phone);
    } catch (e) {
      console.error('Failed to store cash loan submission', e);
    }
  },

  // Custom Budgets
  getCustomBudgetSubmissions(): CustomBudgetSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_BUDGET);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_BUDGET, JSON.stringify(DEFAULT_CUSTOM_BUDGETS));
        return DEFAULT_CUSTOM_BUDGETS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CUSTOM_BUDGETS;
    }
  },

  addCustomBudgetSubmission(sub: CustomBudgetSubmission): void {
    try {
      const current = this.getCustomBudgetSubmissions();
      const updated = [sub, ...current.filter((x) => x.id !== sub.id)];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_BUDGET, JSON.stringify(updated));
      this.ensureUserForSubmission(sub.fullName, sub.email, sub.phone);
    } catch (e) {
      console.error('Failed to store custom budget submission', e);
    }
  },

  // Investments
  getInvestmentSubmissions(): InvestmentSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(DEFAULT_INVESTMENTS));
        return DEFAULT_INVESTMENTS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_INVESTMENTS;
    }
  },

  addInvestmentSubmission(sub: InvestmentSubmission): void {
    try {
      const current = this.getInvestmentSubmissions();
      const updated = [sub, ...current.filter((x) => x.id !== sub.id)];
      localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(updated));
      this.ensureUserForSubmission(sub.fullName, sub.email, sub.phone);
    } catch (e) {
      console.error('Failed to store investment submission', e);
    }
  },

  // Status updates by Admin Dashboard (Item 5)
  updateSubmissionStatus(
    type: 'preApproval' | 'cashLoan' | 'customBudget' | 'investment',
    id: string,
    newStatus: string
  ): void {
    try {
      if (type === 'preApproval') {
        const items = this.getPreApprovalSubmissions().map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(STORAGE_KEYS.PRE_APPROVAL, JSON.stringify(items));
      } else if (type === 'cashLoan') {
        const items = this.getCashLoanSubmissions().map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(STORAGE_KEYS.CASH_LOAN, JSON.stringify(items));
      } else if (type === 'investment') {
        const items = this.getInvestmentSubmissions().map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(items));
      } else {
        const items = this.getCustomBudgetSubmissions().map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        localStorage.setItem(STORAGE_KEYS.CUSTOM_BUDGET, JSON.stringify(items));
      }
    } catch (e) {
      console.error('Failed to update submission status', e);
    }
  },

  deleteSubmission(type: 'preApproval' | 'cashLoan' | 'customBudget' | 'investment', id: string): void {
    try {
      if (type === 'preApproval') {
        const items = this.getPreApprovalSubmissions().filter((x) => x.id !== id);
        localStorage.setItem(STORAGE_KEYS.PRE_APPROVAL, JSON.stringify(items));
      } else if (type === 'cashLoan') {
        const items = this.getCashLoanSubmissions().filter((x) => x.id !== id);
        localStorage.setItem(STORAGE_KEYS.CASH_LOAN, JSON.stringify(items));
      } else if (type === 'investment') {
        const items = this.getInvestmentSubmissions().filter((x) => x.id !== id);
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(items));
      } else {
        const items = this.getCustomBudgetSubmissions().filter((x) => x.id !== id);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_BUDGET, JSON.stringify(items));
      }
    } catch (e) {
      console.error('Failed to delete submission', e);
    }
  },

  getTotalCount(): number {
    return (
      this.getPreApprovalSubmissions().length +
      this.getCashLoanSubmissions().length +
      this.getCustomBudgetSubmissions().length +
      this.getInvestmentSubmissions().length
    );
  },

  // User Accounts & Client Portal (Item 5)
  getRegisteredUsers(): RegisteredUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USERS;
    }
  },

  getCurrentUser(): RegisteredUser | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
      // Auto-fallback to default client user for quick access
      return null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: RegisteredUser | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  },

  registerUser(name: string, email: string, phone?: string, password?: string): RegisteredUser {
    const users = this.getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updated = { ...existing, name: name || existing.name, phone: phone || existing.phone };
      this.setCurrentUser(updated);
      return updated;
    }

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CL';

    const newUser: RegisteredUser = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: name || 'Valued Client',
      email,
      phone,
      password: password || 'client123',
      createdAt: new Date().toISOString(),
      avatar: initials,
    };

    const updated = [newUser, ...users];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(email: string, password?: string): RegisteredUser | null {
    const users = this.getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    // If user typed an email that submitted applications before, automatically create/log them in!
    return this.registerUser(email.split('@')[0], email, '', password);
  },

  logoutUser(): void {
    this.setCurrentUser(null);
  },

  ensureUserForSubmission(name: string, email: string, phone?: string): void {
    if (!email) return;
    const users = this.getRegisteredUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      const initials = name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'CL';

      const newUser: RegisteredUser = {
        id: `USR-${Date.now().toString(36).toUpperCase()}`,
        name: name || 'Valued Client',
        email,
        phone,
        password: 'password123',
        createdAt: new Date().toISOString(),
        avatar: initials,
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([newUser, ...users]));
      // If no current user is logged in, log this applicant in so their dashboard updates instantly!
      if (!this.getCurrentUser()) {
        this.setCurrentUser(newUser);
      }
    }
  },

  // Query all submissions related to an email address
  getUserPortfolioData(userEmail: string) {
    const emailNorm = (userEmail || '').trim().toLowerCase();

    const allPreApprovals = this.getPreApprovalSubmissions();
    const userPreApprovals = emailNorm
      ? allPreApprovals.filter((x) => x.email.toLowerCase() === emailNorm)
      : allPreApprovals.slice(0, 2);

    const allCashLoans = this.getCashLoanSubmissions();
    const userCashLoans = emailNorm
      ? allCashLoans.filter((x) => x.email.toLowerCase() === emailNorm)
      : allCashLoans.slice(0, 2);

    const allInvestments = this.getInvestmentSubmissions();
    const userInvestments = emailNorm
      ? allInvestments.filter((x) => x.email.toLowerCase() === emailNorm)
      : allInvestments;

    const allBudgets = this.getCustomBudgetSubmissions();
    const userBudgets = emailNorm
      ? allBudgets.filter((x) => x.email.toLowerCase() === emailNorm)
      : allBudgets.slice(0, 1);

    return {
      preApprovals: userPreApprovals,
      cashLoans: userCashLoans,
      investments: userInvestments,
      customBudgets: userBudgets,
    };
  },

  // Real-Time Underwriter / Admin Chat System (Item 11)
  getChatMessages(userEmail: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      const emailNorm = (userEmail || '').trim().toLowerCase();
      let all: ChatMessage[] = [];
      if (data) {
        all = JSON.parse(data);
      }
      const userMsgs = emailNorm ? all.filter((m) => m.userEmail.toLowerCase() === emailNorm) : all;
      if (userMsgs.length === 0 && emailNorm) {
        // Welcoming seed message from senior underwriter
        const welcome: ChatMessage = {
          id: `MSG-INIT-${Date.now()}`,
          userEmail: emailNorm,
          sender: 'admin',
          senderName: 'Julian Sterling (Head of Underwriting)',
          text: `Welcome to Aureus Prestige. Your credit profile and investment allocations are actively monitored by our balance sheet committee. If you need immediate loan disbursement or have questions regarding your verification documents, reply directly here.`,
          timestamp: new Date().toISOString(),
        };
        const updated = [...all, welcome];
        localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
        return [welcome];
      }
      return userMsgs;
    } catch {
      return [];
    }
  },

  sendChatMessage(
    userEmail: string,
    sender: 'user' | 'admin',
    text: string,
    senderName: string
  ): ChatMessage {
    const emailNorm = (userEmail || '').trim().toLowerCase();
    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userEmail: emailNorm,
      sender,
      senderName,
      text,
      timestamp: new Date().toISOString(),
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      const all: ChatMessage[] = data ? JSON.parse(data) : [];
      const updated = [...all, newMsg];
      localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save chat message', e);
    }
    return newMsg;
  },

  getAllChatUsers(): { email: string; userName: string; lastMessage: ChatMessage; messageCount: number }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      const all: ChatMessage[] = data ? JSON.parse(data) : [];
      const userMap = new Map<string, { lastMessage: ChatMessage; count: number; name?: string }>();
      
      const users = this.getRegisteredUsers();
      const userNameMap = new Map<string, string>();
      users.forEach((u) => userNameMap.set(u.email.toLowerCase(), u.name));
      this.getPreApprovalSubmissions().forEach((p) => userNameMap.set(p.email.toLowerCase(), p.fullName));
      this.getCashLoanSubmissions().forEach((c) => userNameMap.set(c.email.toLowerCase(), c.fullName));
      this.getInvestmentSubmissions().forEach((i) => userNameMap.set(i.email.toLowerCase(), i.fullName));

      for (const msg of all) {
        const email = (msg.userEmail || '').trim().toLowerCase();
        if (!email) continue;
        const existing = userMap.get(email);
        if (!existing || new Date(msg.timestamp) > new Date(existing.lastMessage.timestamp)) {
          userMap.set(email, {
            lastMessage: msg,
            count: (existing?.count || 0) + 1,
            name: userNameMap.get(email) || (msg.sender === 'user' ? msg.senderName : undefined)
          });
        } else {
          existing.count += 1;
        }
      }

      if (userMap.size === 0) {
        const defaultEmail = 'alexander.vance@prestige-holdings.co.uk';
        const msgs = this.getChatMessages(defaultEmail);
        if (msgs.length > 0) {
          userMap.set(defaultEmail, {
            lastMessage: msgs[msgs.length - 1],
            count: msgs.length,
            name: 'Alexander Vance'
          });
        }
      }

      return Array.from(userMap.entries()).map(([email, info]) => ({
        email,
        userName: info.name || email.split('@')[0],
        lastMessage: info.lastMessage,
        messageCount: info.count,
      })).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    } catch {
      return [];
    }
  },

  // Free Payment Methods Management
  getPaymentMethods(userEmail?: string): UserPaymentMethod[] {
    const DEFAULT_PAYMENT_METHODS: UserPaymentMethod[] = [
      {
        id: 'PM-88192-ACH',
        userEmail: 'client@aureus-capital.com',
        type: 'bank_account',
        label: 'Direct Bank Account (ACH / Faster Payments)',
        institutionName: 'Barclays Private Clearing',
        accountOrCardNumberMasked: '•••• 8472',
        routingOrSortCode: '20-04-15',
        holderName: 'Private Client Treasury',
        isDefault: true,
        isFree: true,
        createdAt: '2026-10-01T00:00:00Z',
        status: 'Verified',
      },
      {
        id: 'PM-49102-DBT',
        userEmail: 'client@aureus-capital.com',
        type: 'debit_card',
        label: 'Primary Debit Card',
        institutionName: 'Visa Commercial Debit',
        accountOrCardNumberMasked: '•••• 4242',
        holderName: 'Private Client Treasury',
        expiry: '09/29',
        isDefault: false,
        isFree: true,
        createdAt: '2026-10-05T00:00:00Z',
        status: 'Active',
      },
    ];

    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
      let all: UserPaymentMethod[] = [];
      if (!data) {
        all = DEFAULT_PAYMENT_METHODS;
        localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(all));
      } else {
        all = JSON.parse(data);
      }
      const emailNorm = (userEmail || '').trim().toLowerCase();
      if (!emailNorm) return all;
      const userMethods = all.filter((p) => p.userEmail.toLowerCase() === emailNorm);
      return userMethods.length > 0 ? userMethods : all;
    } catch {
      return DEFAULT_PAYMENT_METHODS;
    }
  },

  addPaymentMethod(method: Omit<UserPaymentMethod, 'id' | 'createdAt' | 'isFree' | 'status'>): UserPaymentMethod {
    const all = this.getPaymentMethods();
    const newMethod: UserPaymentMethod = {
      ...method,
      id: `PM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      isFree: true, // 100% Free - Zero Fees
      status: 'Verified',
    };
    let updated = all;
    if (newMethod.isDefault) {
      updated = updated.map((m) =>
        m.userEmail.toLowerCase() === newMethod.userEmail.toLowerCase()
          ? { ...m, isDefault: false }
          : m
      );
    }
    updated = [newMethod, ...updated];
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save payment method', e);
    }
    return newMethod;
  },

  removePaymentMethod(id: string): void {
    const all = this.getPaymentMethods();
    const updated = all.filter((m) => m.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove payment method', e);
    }
  },

  setDefaultPaymentMethod(id: string, userEmail: string): void {
    const all = this.getPaymentMethods();
    const emailNorm = (userEmail || '').trim().toLowerCase();
    const updated = all.map((m) => {
      if (emailNorm && m.userEmail.toLowerCase() !== emailNorm) return m;
      return { ...m, isDefault: m.id === id };
    });
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to set default payment method', e);
    }
  },

  // Company Bitcoin Treasury & Direct Card-to-Bitcoin Gateway
  getCompanyBtcAddress(): string {
    try {
      const addr = localStorage.getItem(STORAGE_KEYS.COMPANY_BTC_ADDRESS);
      return addr || DEFAULT_COMPANY_BTC_ADDRESS;
    } catch {
      return DEFAULT_COMPANY_BTC_ADDRESS;
    }
  },

  setCompanyBtcAddress(address: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY_BTC_ADDRESS, address);
    } catch (e) {
      console.error('Failed to set company btc address', e);
    }
  },

  getBitcoinTransactions(userEmail?: string): BitcoinSettlementTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BTC_TRANSACTIONS);
      let all: BitcoinSettlementTransaction[] = [];
      if (!data) {
        all = DEFAULT_BTC_TRANSACTIONS;
        localStorage.setItem(STORAGE_KEYS.BTC_TRANSACTIONS, JSON.stringify(all));
      } else {
        all = JSON.parse(data);
      }
      const emailNorm = (userEmail || '').trim().toLowerCase();
      if (!emailNorm) return all;
      const userTx = all.filter((tx) => tx.userEmail.toLowerCase() === emailNorm);
      return userTx.length > 0 ? userTx : all;
    } catch {
      return DEFAULT_BTC_TRANSACTIONS;
    }
  },

  recordBitcoinTransaction(tx: Omit<BitcoinSettlementTransaction, 'id' | 'timestamp' | 'txHash' | 'status'>): BitcoinSettlementTransaction {
    const all = this.getBitcoinTransactions();
    const randomHex = () => Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
    const newTx: BitcoinSettlementTransaction = {
      ...tx,
      id: `BTC-TX-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      txHash: `${randomHex()}${randomHex()}${randomHex()}${randomHex()}${randomHex()}`.slice(0, 64),
      status: 'Settled',
    };
    const updated = [newTx, ...all];
    try {
      localStorage.setItem(STORAGE_KEYS.BTC_TRANSACTIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save btc transaction', e);
    }
    return newTx;
  },
};
