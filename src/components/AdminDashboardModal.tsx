import React, { useState, useEffect } from 'react';
import {
  CountryCode,
  PreApprovalSubmission,
  CashLoanSubmission,
  CustomBudgetSubmission,
  InvestmentSubmission,
  ChatMessage,
} from '../types';
import { COUNTRIES } from '../data/translations';
import { SubmissionsStore } from '../data/submissionsStore';
import {
  X,
  Building,
  ShieldCheck,
  Mail,
  Phone,
  Download,
  Trash2,
  Search,
  Copy,
  Check,
  Send,
  Eye,
  FileText,
  Banknote,
  MessageSquare,
  TrendingUp,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
}) => {
  const [activeTab, setActiveTab] = useState<'preApproval' | 'cashLoan' | 'investments' | 'chat' | 'customBudget'>('preApproval');
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<'ALL' | CountryCode>('ALL');

  // Submissions data
  const [preApprovals, setPreApprovals] = useState<PreApprovalSubmission[]>([]);
  const [cashLoans, setCashLoans] = useState<CashLoanSubmission[]>([]);
  const [customBudgets, setCustomBudgets] = useState<CustomBudgetSubmission[]>([]);
  const [investments, setInvestments] = useState<InvestmentSubmission[]>([]);

  // Chat management state
  const [chatUsers, setChatUsers] = useState<{ email: string; userName: string; lastMessage: ChatMessage; messageCount: number }[]>([]);
  const [activeChatEmail, setActiveChatEmail] = useState<string>('');
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);
  const [adminChatReply, setAdminChatReply] = useState('');

  // Selected item for full details inspection
  const [selectedPreApproval, setSelectedPreApproval] = useState<PreApprovalSubmission | null>(null);
  const [selectedCashLoan, setSelectedCashLoan] = useState<CashLoanSubmission | null>(null);
  const [selectedCustomBudget, setSelectedCustomBudget] = useState<CustomBudgetSubmission | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentSubmission | null>(null);

  // Email composer modal state
  const [emailComposerOpen, setEmailComposerOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState({ name: '', email: '', subject: '', body: '' });

  // Copied alert state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = () => {
    setPreApprovals(SubmissionsStore.getPreApprovalSubmissions());
    setCashLoans(SubmissionsStore.getCashLoanSubmissions());
    setCustomBudgets(SubmissionsStore.getCustomBudgetSubmissions());
    setInvestments(SubmissionsStore.getInvestmentSubmissions());
    const users = SubmissionsStore.getAllChatUsers();
    setChatUsers(users);
    if (users.length > 0 && !activeChatEmail) {
      setActiveChatEmail(users[0].email);
      setActiveChatMessages(SubmissionsStore.getChatMessages(users[0].email));
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEmailComposer = (recipientName: string, recipientEmail: string, refId: string) => {
    setEmailRecipient({
      name: recipientName,
      email: recipientEmail,
      subject: `Aureus Sovereign Lending — Official Update for Reference ${refId}`,
      body: `Dear ${recipientName},\n\nThank you for submitting your application to Aureus Institutional Lending (Ref: ${refId}).\n\nOur Senior Underwriting Committee has reviewed your sovereign file and would like to confirm your verified status.\n\nPlease find your loan documentation attached.\n\nWarm regards,\nPrivate Lending Advisory Desk\nAureus Financial Group`,
    });
    setEmailComposerOpen(true);
  };

  const handleSendEmailViaMailto = () => {
    const mailto = `mailto:${emailRecipient.email}?subject=${encodeURIComponent(
      emailRecipient.subject
    )}&body=${encodeURIComponent(emailRecipient.body)}`;
    window.location.href = mailto;
    setEmailComposerOpen(false);
  };

  const handleDelete = (type: 'preApproval' | 'cashLoan' | 'customBudget' | 'investment', id: string) => {
    if (confirm(`Are you sure you want to delete record ${id}?`)) {
      SubmissionsStore.deleteSubmission(type as any, id);
      loadData();
      if (selectedPreApproval?.id === id) setSelectedPreApproval(null);
      if (selectedCashLoan?.id === id) setSelectedCashLoan(null);
      if (selectedCustomBudget?.id === id) setSelectedCustomBudget(null);
      if (selectedInvestment?.id === id) setSelectedInvestment(null);
    }
  };

  const handleStatusChange = (
    type: 'preApproval' | 'cashLoan' | 'customBudget' | 'investment',
    id: string,
    newStatus: string
  ) => {
    SubmissionsStore.updateSubmissionStatus(type, id, newStatus);
    loadData();
  };

  const handleAdminSendChat = (e?: React.FormEvent, promptText?: string) => {
    if (e) e.preventDefault();
    const textToSend = promptText || adminChatReply;
    if (!textToSend.trim() || !activeChatEmail) return;

    SubmissionsStore.sendChatMessage(
      activeChatEmail,
      'admin',
      textToSend.trim(),
      'Julian Sterling (Head of Underwriting)'
    );
    setActiveChatMessages(SubmissionsStore.getChatMessages(activeChatEmail));
    setChatUsers(SubmissionsStore.getAllChatUsers());
    if (!promptText) setAdminChatReply('');
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'preApproval') {
      csvContent +=
        'ID,SubmittedAt,Country,Name,Email,Phone,HomePrice,DownPayment,GrossIncome,PropertyType,HomeUsage,CityOrZip,Address,SovereignID,Status\n';
      preApprovals.forEach((item) => {
        csvContent += `"${item.id}","${item.submittedAt}","${item.country}","${item.fullName}","${item.email}","${item.phone}",${item.homePrice},${item.downPayment},${item.grossIncome},"${item.propertyType}","${item.homeUsage}","${item.cityOrZip}","${item.streetAddress}, ${item.city}","${item.sovereignId}","${item.status}"\n`;
      });
    } else if (activeTab === 'cashLoan') {
      csvContent +=
        'ID,SubmittedAt,Country,Name,Email,Phone,Amount,TermMonths,MonthlyPayment,Purpose,BankName,AccountNumber,SovereignID,Status\n';
      cashLoans.forEach((item) => {
        csvContent += `"${item.id}","${item.submittedAt}","${item.country}","${item.fullName}","${item.email}","${item.phone}",${item.amount},${item.termMonths},${item.monthlyPayment},"${item.purpose}","${item.bankName}","${item.accountNumber}","${item.sovereignId}","${item.status}"\n`;
      });
    } else if (activeTab === 'investments') {
      csvContent +=
        'ID,SubmittedAt,Country,Name,Email,Phone,TierPrice,TierName,DurationMonths,RatePercent,MonthlyPayout,TotalYield,BankName,Status\n';
      investments.forEach((item) => {
        csvContent += `"${item.id}","${item.submittedAt}","${item.country}","${item.fullName}","${item.email}","${item.phone}",${item.principalAmount},"${item.tierName}",${item.durationMonths},${item.ratePercent},${item.monthlyPayout},${item.totalYield},"${item.bankName}","${item.status}"\n`;
      });
    } else {
      csvContent += 'ID,SubmittedAt,Country,Name,Email,Phone,TargetBudget,Subject,Category,Timeframe,Notes\n';
      customBudgets.forEach((item) => {
        csvContent += `"${item.id}","${item.submittedAt}","${item.country}","${item.fullName}","${item.email}","${item.phone}","${item.targetBudget}","${item.subject}","${item.assetCategory}","${item.timeframe}","${item.notes.replace(/"/g, '""')}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aureus_${activeTab}_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPreApprovals = preApprovals.filter((item) => {
    const matchesCountry = countryFilter === 'ALL' || item.country === countryFilter;
    const matchesQuery =
      !searchQuery ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cityOrZip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sovereignId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const filteredCashLoans = cashLoans.filter((item) => {
    const matchesCountry = countryFilter === 'ALL' || item.country === countryFilter;
    const matchesQuery =
      !searchQuery ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sovereignId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const filteredInvestments = investments.filter((item) => {
    const matchesCountry = countryFilter === 'ALL' || item.country === countryFilter;
    const matchesQuery =
      !searchQuery ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  const filteredCustomBudgets = customBudgets.filter((item) => {
    const matchesCountry = countryFilter === 'ALL' || item.country === countryFilter;
    const matchesQuery =
      !searchQuery ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetBudget.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[96vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                  Institutional Master Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Submissions
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                Institutional Admin Dashboard & User Submissions
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls & Counters */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('preApproval')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'preApproval'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pre-Approval Loans</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'preApproval' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {preApprovals.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cashLoan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'cashLoan'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash Loans</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'cashLoan' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {cashLoans.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'investments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investment Allocations</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'investments' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {investments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Underwriter Live Chat</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'chat' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {chatUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customBudget')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'customBudget'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Budgets</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'customBudget' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {customBudgets.length}
              </span>
            </button>
          </div>

          {/* Search & Country Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, ID..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs w-48 sm:w-60 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="UK">UK (🇬🇧)</option>
              <option value="CA">Canada (🇨🇦)</option>
              <option value="AU">Australia (🇦🇺)</option>
              <option value="DE">Germany (🇩🇪)</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(96vh-170px)]">
          {/* TAB 1: PRE-APPROVAL LOANS TABLE */}
          {activeTab === 'preApproval' && (
            <div className="space-y-3">
              {filteredPreApprovals.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs">
                  No Pre-Approval applications found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 font-bold">Ref ID / Date</th>
                        <th className="p-3.5 font-bold">Applicant Info</th>
                        <th className="p-3.5 font-bold">Property & Price</th>
                        <th className="p-3.5 font-bold">Financials</th>
                        <th className="p-3.5 font-bold">Sovereign ID</th>
                        <th className="p-3.5 font-bold">Status</th>
                        <th className="p-3.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPreApprovals.map((app) => (
                        <tr key={app.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-blue-900">{app.id}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(app.submittedAt).toLocaleDateString()} {new Date(app.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {app.country}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 text-sm">
                              {app.fullName}
                            </div>
                            <div className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 shrink-0" />
                              <a
                                href={`mailto:${app.email}?subject=Aureus%20Pre-Approval%20Letter%20-${app.id}`}
                                className="underline hover:text-blue-800"
                              >
                                {app.email}
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{app.phone}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{app.propertyType}</div>
                            <div className="text-[11px] text-slate-600">{app.cityOrZip}</div>
                            <div className="font-mono text-blue-700 font-bold mt-1">
                              Price: {app.country === 'UK' ? '£' : app.country === 'DE' ? '€' : '$'}
                              {app.homePrice.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-600">
                              Down: {app.country === 'UK' ? '£' : app.country === 'DE' ? '€' : '$'}
                              {app.downPayment.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="text-slate-800">
                              Income: {app.country === 'UK' ? '£' : app.country === 'DE' ? '€' : '$'}
                              {app.grossIncome.toLocaleString()}/yr
                            </div>
                            <div className="text-[11px] text-slate-600">
                              Monthly: {app.country === 'UK' ? '£' : app.country === 'DE' ? '€' : '$'}
                              {app.monthlyPayment.toLocaleString()}/mo
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Self-Employed: {app.selfEmployed}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                              <span>{app.sovereignId}</span>
                            </div>
                            <div className="text-[10px] text-slate-600 mt-0.5">
                              DOB: {app.dateOfBirth}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange('preApproval', app.id, e.target.value)}
                              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-white border border-blue-300 text-blue-900 cursor-pointer shadow-xs focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Under Review — Status Sent to Email">Under Review</option>
                              <option value="Verified Pre-Approved">Verified Pre-Approved</option>
                              <option value="Approved - Ready for Closing">Approved - Ready for Closing</option>
                              <option value="Disbursed within 24h">Disbursed (24h)</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedPreApproval(app)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="View All 19 Form Answers"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEmailComposer(app.fullName, app.email, app.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Email User Directly"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete('preApproval', app.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CASH LOANS TABLE */}
          {activeTab === 'cashLoan' && (
            <div className="space-y-3">
              {filteredCashLoans.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs">
                  No Cash Loan applications found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 font-bold">Ref ID / Date</th>
                        <th className="p-3.5 font-bold">Borrower</th>
                        <th className="p-3.5 font-bold">Cash Facility</th>
                        <th className="p-3.5 font-bold">Purpose & Urgency</th>
                        <th className="p-3.5 font-bold">Receiving Bank & Account</th>
                        <th className="p-3.5 font-bold">Sovereign ID</th>
                        <th className="p-3.5 font-bold">Status / Decision</th>
                        <th className="p-3.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCashLoans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-blue-900">{loan.id}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(loan.submittedAt).toLocaleDateString()}
                            </div>
                            <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {loan.country}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 text-sm">{loan.fullName}</div>
                            <div className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 shrink-0" />
                              <a
                                href={`mailto:${loan.email}?subject=Aureus%20Cash%20Facility%20-${loan.id}`}
                                className="underline hover:text-blue-800"
                              >
                                {loan.email}
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{loan.phone}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="text-base font-bold text-blue-700">
                              {loan.country === 'UK' ? '£' : loan.country === 'DE' ? '€' : '$'}
                              {loan.amount.toLocaleString()}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {loan.termMonths} months · {loan.country === 'UK' ? '£' : loan.country === 'DE' ? '€' : '$'}
                              {loan.monthlyPayment.toLocaleString()}/mo
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{loan.purpose}</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 border border-blue-200">
                              {loan.urgency}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{loan.bankName}</div>
                            <div className="font-mono text-[11px] text-slate-600 mt-0.5">
                              {loan.accountNumber}
                            </div>
                            <div className="text-[10px] text-slate-500">Method: {loan.disbursementMethod}</div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                              <span>{loan.sovereignId}</span>
                            </div>
                            <div className="text-[10px] text-slate-600 mt-0.5">
                              Income: {loan.country === 'UK' ? '£' : loan.country === 'DE' ? '€' : '$'}
                              {loan.monthlyIncome.toLocaleString()}/mo
                            </div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={loan.status}
                              onChange={(e) => handleStatusChange('cashLoan', loan.id, e.target.value)}
                              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-white border border-blue-300 text-blue-900 cursor-pointer shadow-xs focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Under Review — Status Sent to Email">Under Review</option>
                              <option value="Approved - Ready for Disbursement">Approved</option>
                              <option value="Disbursed within 24h">Disbursed (24h)</option>
                              <option value="Declined">Declined</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedCashLoan(loan)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Inspect Full Cash Loan Application"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEmailComposer(loan.fullName, loan.email, loan.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Email User Directly"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete('cashLoan', loan.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM BUDGETS / TALK TO US */}
          {activeTab === 'customBudget' && (
            <div className="space-y-3">
              {filteredCustomBudgets.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs">
                  No Custom Budget inquiries found.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs text-slate-800">
                    <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-3.5 font-bold">Ref ID / Date</th>
                        <th className="p-3.5 font-bold">Client Information</th>
                        <th className="p-3.5 font-bold">Target Budget</th>
                        <th className="p-3.5 font-bold">Subject & Category</th>
                        <th className="p-3.5 font-bold">Timeframe & Notes</th>
                        <th className="p-3.5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomBudgets.map((bdg) => (
                        <tr key={bdg.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-blue-900">{bdg.id}</div>
                            <div className="text-[10px] text-slate-500">
                              {new Date(bdg.submittedAt).toLocaleDateString()}
                            </div>
                            <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {bdg.country}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 text-sm">{bdg.fullName}</div>
                            <div className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 shrink-0" />
                              <a
                                href={`mailto:${bdg.email}?subject=Aureus%20Custom%20Budget%20Inquiry%20-${bdg.id}`}
                                className="underline hover:text-blue-800"
                              >
                                {bdg.email}
                              </a>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{bdg.phone}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-base font-bold text-blue-700">
                              {bdg.targetBudget}
                            </div>
                            <div className="text-[10px] text-slate-600 uppercase font-mono">
                              Category: {bdg.assetCategory}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{bdg.subject}</div>
                          </td>
                          <td className="p-3.5 max-w-xs">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                              {bdg.timeframe}
                            </span>
                            <p className="text-[11px] text-slate-700 mt-1 line-clamp-2 italic">
                              "{bdg.notes || 'No extra notes provided'}"
                            </p>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedCustomBudget(bdg)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Inspect Full Inquiry"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEmailComposer(bdg.fullName, bdg.email, bdg.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Reply / Email Client"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete('customBudget', bdg.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVESTMENTS ALLOCATIONS */}
          {activeTab === 'investments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900">
                    Institutional Investment Allocations ($10k · $25k · $50k · $100k)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Asset-backed wealth notes funding home originations and exotic vehicle fleet. 100% title lien backed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors border border-blue-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Investments CSV</span>
                </button>
              </div>

              {filteredInvestments.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No investment allocations matching current filters.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                        <th className="p-3.5">Ref ID & Date</th>
                        <th className="p-3.5">Nation</th>
                        <th className="p-3.5">Investor Name & Contact</th>
                        <th className="p-3.5">Principal & Tier</th>
                        <th className="p-3.5">Term & Rate</th>
                        <th className="p-3.5">Monthly / Total Yield</th>
                        <th className="p-3.5">Payout Bank</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInvestments.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-mono">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                                {inv.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(inv.id, inv.id)}
                                className="text-slate-400 hover:text-slate-700 p-0.5"
                                title="Copy ID"
                              >
                                {copiedId === inv.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-600 mt-1">
                              {new Date(inv.submittedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="text-xl mr-1">{COUNTRIES[inv.country]?.flag || '🌍'}</span>
                            <span className="font-mono text-xs font-semibold">{inv.country}</span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 text-sm">{inv.fullName}</div>
                            <div className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 shrink-0" />
                              <a href={`mailto:${inv.email}`} className="underline hover:text-blue-800">{inv.email}</a>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{inv.phone}</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-sm font-bold text-emerald-700">
                              {inv.country === 'UK' ? '£' : inv.country === 'DE' ? '€' : '$'}
                              {inv.principalAmount.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                              {inv.tierName}
                            </div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-slate-900">{inv.durationMonths} Months</div>
                            <div className="text-[11px] text-blue-700 font-semibold">{inv.ratePercent.toFixed(2)}% Guaranteed</div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="text-blue-700 font-bold">
                              {inv.country === 'UK' ? '£' : inv.country === 'DE' ? '€' : '$'}
                              {inv.monthlyPayout.toLocaleString()}/mo
                            </div>
                            <div className="text-emerald-700 font-semibold text-[11px]">
                              Total: {inv.country === 'UK' ? '£' : inv.country === 'DE' ? '€' : '$'}
                              {inv.totalYield.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{inv.bankName}</div>
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">{inv.accountNumber}</div>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={inv.status}
                              onChange={(e) => handleStatusChange('investment', inv.id, e.target.value)}
                              className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-white border border-blue-300 text-blue-900 cursor-pointer shadow-xs focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="Under Review — Status Sent to Email">Under Review</option>
                              <option value="Allocated in Sovereign Custody">Allocated in Custody</option>
                              <option value="Yield Active — Monthly Paid">Yield Active</option>
                              <option value="Matured & Capital Returned">Matured & Returned</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveChatEmail(inv.email);
                                setActiveTab('chat');
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer transition-colors"
                              title="Chat with Investor"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEmailComposer(inv.fullName, inv.email, inv.id)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 cursor-pointer transition-colors"
                              title="Email Investor"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete('investment', inv.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: UNDERWRITER LIVE CHAT MANAGEMENT (Item 11) */}
          {activeTab === 'chat' && (
            <div className="h-[620px] flex border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden">
              {/* Left Column: User Conversations List */}
              <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Active Client Inquiries ({chatUsers.length})</span>
                  </h4>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60">
                  {chatUsers.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No client conversations recorded.
                    </div>
                  ) : (
                    chatUsers.map((u) => {
                      const isSelected = u.email.toLowerCase() === activeChatEmail.toLowerCase();
                      return (
                        <button
                          key={u.email}
                          type="button"
                          onClick={() => {
                            setActiveChatEmail(u.email);
                            setActiveChatMessages(SubmissionsStore.getChatMessages(u.email));
                          }}
                          className={`w-full p-4 text-left transition-colors cursor-pointer flex items-start gap-3 ${
                            isSelected ? 'bg-blue-50/80 border-l-4 border-l-blue-600' : 'hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {u.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs truncate">
                                {u.userName}
                              </span>
                              <span className="text-[10px] text-slate-600 font-mono">
                                {new Date(u.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 truncate mt-0.5">
                              {u.email}
                            </div>
                            <div className="text-[11px] text-slate-600 truncate mt-1 italic">
                              "{u.lastMessage.text}"
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Active Conversation */}
              <div className="flex-1 flex flex-col bg-slate-50/30">
                {activeChatEmail ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {activeChatEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {chatUsers.find((u) => u.email === activeChatEmail)?.userName || activeChatEmail}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                              Verified Applicant
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {activeChatEmail} · Direct Senior Underwriter Channel
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEmailComposer(activeChatEmail.split('@')[0], activeChatEmail, 'CHAT-REF')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email Client</span>
                        </button>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {activeChatMessages.map((msg) => {
                        const isAdmin = msg.sender === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 max-w-xl ${isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isAdmin ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
                              }`}
                            >
                              {isAdmin ? 'JS' : 'U'}
                            </div>
                            <div>
                              <div
                                className={`flex items-center gap-2 mb-1 text-[11px] ${
                                  isAdmin ? 'text-slate-500 flex-row-reverse' : 'text-slate-500'
                                }`}
                              >
                                <span className="font-semibold text-slate-700">{msg.senderName}</span>
                                <span className="text-[10px] font-mono">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div
                                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                  isAdmin
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Underwriter Canned Replies */}
                    <div className="px-4 py-2 border-t border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono shrink-0">
                        Underwriter Presets:
                      </span>
                      {[
                        'Your loan facility has been approved by the committee. Funds will disburse within 24 hours.',
                        'We have received and verified your identification. Pre-approval certificate has been dispatched.',
                        'Your investment tier allocation has been registered in sovereign balance sheet custody.',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAdminSendChat(undefined, preset)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] whitespace-nowrap cursor-pointer transition-all border border-slate-200"
                        >
                          {preset.slice(0, 40)}...
                        </button>
                      ))}
                    </div>

                    {/* Underwriter Reply Input Bar */}
                    <form onSubmit={handleAdminSendChat} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
                      <input
                        type="text"
                        value={adminChatReply}
                        onChange={(e) => setAdminChatReply(e.target.value)}
                        placeholder={`Reply as Julian Sterling to ${activeChatEmail}...`}
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!adminChatReply.trim()}
                        className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                      >
                        <span>Send Reply</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                    Select a conversation from the left to start chatting.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sovereign Underwriting Repository</span>
          </div>
          <div>
            Showing <span className="text-blue-700 font-bold">{activeTab === 'preApproval' ? filteredPreApprovals.length : activeTab === 'cashLoan' ? filteredCashLoans.length : activeTab === 'investments' ? filteredInvestments.length : activeTab === 'chat' ? chatUsers.length : filteredCustomBudgets.length}</span> active records
          </div>
        </div>
      </div>

      {/* INSPECTOR MODAL: PRE-APPROVAL FULL 19 FIELDS */}
      {selectedPreApproval && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">Complete Application Audit</span>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {selectedPreApproval.fullName} — {selectedPreApproval.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreApproval(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">1. Acquisition Timing:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.timeframe}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">2. Property Type:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.propertyType}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">3. Usage / Occupancy:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.homeUsage}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">4. Target City / ZIP:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.cityOrZip}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">5. Real Estate Agent:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.workingWithAgent}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">6. Home Purchase Price:</span>
                <span className="font-bold text-blue-700 font-mono text-sm">
                  {selectedPreApproval.country === 'UK' ? '£' : selectedPreApproval.country === 'DE' ? '€' : '$'}
                  {selectedPreApproval.homePrice.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">7. Target Monthly Payment:</span>
                <span className="font-bold text-blue-900 font-mono">
                  {selectedPreApproval.country === 'UK' ? '£' : selectedPreApproval.country === 'DE' ? '€' : '$'}
                  {selectedPreApproval.monthlyPayment.toLocaleString()} / mo
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">8. Upfront Cash Down Payment:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {selectedPreApproval.country === 'UK' ? '£' : selectedPreApproval.country === 'DE' ? '€' : '$'}
                  {selectedPreApproval.downPayment.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">9. Down Payment Readiness:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.downPaymentTiming}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">10. Gross Annual Income:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {selectedPreApproval.country === 'UK' ? '£' : selectedPreApproval.country === 'DE' ? '€' : '$'}
                  {selectedPreApproval.grossIncome.toLocaleString()} / yr
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">11. Self-Employment Income:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.selfEmployed}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">12. Owned Home in Past 3 Years:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.ownedHomePast3Years}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">13. Military Affiliation:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.militaryAffiliation}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">14. Direct Contact Info:</span>
                <div className="font-bold text-slate-900">{selectedPreApproval.fullName}</div>
                <div className="text-blue-700 font-semibold">{selectedPreApproval.email}</div>
                <div className="text-slate-700">{selectedPreApproval.phone}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">15. Residential Physical Address:</span>
                <span className="font-bold text-slate-900">
                  {selectedPreApproval.streetAddress} {selectedPreApproval.unit && `(${selectedPreApproval.unit})`},{' '}
                  {selectedPreApproval.city}, {selectedPreApproval.state} {selectedPreApproval.zipCode}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">16. Electronic Consent Accepted:</span>
                <span className="font-bold text-emerald-700">Yes (Consented)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 block text-[10px] uppercase font-mono">18. Bankruptcy Past 7 Years:</span>
                <span className="font-bold text-slate-900">{selectedPreApproval.hadBankruptcy}</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 col-span-2">
                <span className="text-blue-800 block text-[10px] uppercase font-mono font-bold">
                  19. Sovereign Identification & Credit Check:
                </span>
                <div className="flex items-center justify-between mt-1">
                  <div>
                    <span className="text-slate-600 text-[11px]">Sovereign ID: </span>
                    <span className="font-bold font-mono text-blue-900 text-sm">
                      {selectedPreApproval.sovereignId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600 text-[11px]">Date of Birth: </span>
                    <span className="font-bold font-mono text-slate-900">
                      {selectedPreApproval.dateOfBirth}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() =>
                  handleOpenEmailComposer(selectedPreApproval.fullName, selectedPreApproval.email, selectedPreApproval.id)
                }
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email to Applicant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL: CASH LOAN DETAILS */}
      {selectedCashLoan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">Cash Loan Application Details</span>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {selectedCashLoan.fullName} — {selectedCashLoan.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCashLoan(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Approved Cash Facility:</span>
                <span className="text-lg font-serif font-bold text-blue-700 font-mono">
                  {selectedCashLoan.country === 'UK' ? '£' : selectedCashLoan.country === 'DE' ? '€' : '$'}
                  {selectedCashLoan.amount.toLocaleString()}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Monthly Repayment:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedCashLoan.country === 'UK' ? '£' : selectedCashLoan.country === 'DE' ? '€' : '$'}
                  {selectedCashLoan.monthlyPayment.toLocaleString()} / mo ({selectedCashLoan.termMonths} months)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Disbursement Destination:</span>
                <span className="font-bold text-slate-900">
                  {selectedCashLoan.bankName} ({selectedCashLoan.accountNumber})
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Purpose & Urgency:</span>
                <span className="font-bold text-slate-900">
                  {selectedCashLoan.purpose} · {selectedCashLoan.urgency}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                <span className="text-blue-800 font-mono font-bold">Borrower Sovereign ID:</span>
                <span className="font-mono font-bold text-blue-900">
                  {selectedCashLoan.sovereignId}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Contact Details:</span>
                <div className="text-right">
                  <div className="text-blue-700 font-bold">{selectedCashLoan.email}</div>
                  <div className="text-slate-600">{selectedCashLoan.phone}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleOpenEmailComposer(selectedCashLoan.fullName, selectedCashLoan.email, selectedCashLoan.id)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email to Applicant</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL: CUSTOM BUDGET INQUIRY */}
      {selectedCustomBudget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">Talk to Us / Custom Budget Inquiry</span>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {selectedCustomBudget.fullName} — {selectedCustomBudget.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomBudget(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Target Budget / Amount:</span>
                <span className="text-lg font-serif font-bold text-blue-700 font-mono">
                  {selectedCustomBudget.targetBudget}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-mono block text-[10px] uppercase">Subject:</span>
                <span className="font-bold text-slate-900">{selectedCustomBudget.subject}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Category & Timeframe:</span>
                <span className="font-bold text-slate-900">
                  {selectedCustomBudget.assetCategory} · {selectedCustomBudget.timeframe}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-mono block text-[10px] uppercase">Client Inquire Notes:</span>
                <p className="text-slate-800 mt-1 italic leading-relaxed">
                  "{selectedCustomBudget.notes || 'No extra notes provided'}"
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-mono">Client Contact:</span>
                <div className="text-right">
                  <div className="text-blue-700 font-bold">{selectedCustomBudget.email}</div>
                  <div className="text-slate-600">{selectedCustomBudget.phone}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() =>
                  handleOpenEmailComposer(selectedCustomBudget.fullName, selectedCustomBudget.email, selectedCustomBudget.id)
                }
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Send Direct Email to Client</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL COMPOSER MODAL (Allows admin to receive and send emails to applicants directly) */}
      {emailComposerOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Compose Email to {emailRecipient.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmailComposerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 text-[10px] uppercase font-mono mb-1 font-semibold">To Recipient:</label>
                <input
                  type="text"
                  readOnly
                  value={`${emailRecipient.name} <${emailRecipient.email}>`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-blue-900 font-mono text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] uppercase font-mono mb-1 font-semibold">Subject:</label>
                <input
                  type="text"
                  value={emailRecipient.subject}
                  onChange={(e) => setEmailRecipient({ ...emailRecipient, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[10px] uppercase font-mono mb-1 font-semibold">Message Body:</label>
                <textarea
                  rows={7}
                  value={emailRecipient.body}
                  onChange={(e) => setEmailRecipient({ ...emailRecipient, body: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => handleCopyText(emailRecipient.email, 'email-copy')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-200 border border-slate-300 font-medium"
              >
                {copiedId === 'email-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'email-copy' ? 'Copied' : 'Copy Email'}</span>
              </button>

              <button
                type="button"
                onClick={handleSendEmailViaMailto}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Email Client (Mailto)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
