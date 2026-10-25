import React, { useState } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import { SubmissionsStore } from '../data/submissionsStore';
import { X, Mail, Phone, User, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface CustomBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
}

export const CustomBudgetModal: React.FC<CustomBudgetModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [targetBudget, setTargetBudget] = useState('');
  const [subject, setSubject] = useState(
    isGerman
      ? 'Budget liegt über Standard-Katalog (Maßgeschneiderte Linie)'
      : 'Budget higher than standard catalog (Bespoke Luxury Line)'
  );
  const [assetCategory, setAssetCategory] = useState<'home' | 'car' | 'cash' | 'bespoke'>('home');
  const [timeframe, setTimeframe] = useState<'now' | '1-3-months' | 'flexible'>('now');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `BDG-${currentCountry}-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(ref);
    SubmissionsStore.addCustomBudgetSubmission({
      id: ref,
      submittedAt: new Date().toISOString(),
      country: currentCountry,
      targetBudget: targetBudget || 'Custom Amount',
      subject,
      assetCategory,
      timeframe,
      fullName,
      email,
      phone,
      notes,
    });
    setSubmitted(true);
  };

  const mailtoLink = `mailto:advisory@aureus-private.com?subject=Custom%20Budget%20Inquiry%20-%20${encodeURIComponent(fullName || 'Client')}&body=Hello%20Aureus%20Advisory%20Team,%0A%0AMy%20budget%20is%20not%20listed%20on%20the%20platform.%0A%0ATarget%20Budget:%20${encodeURIComponent(targetBudget || 'Custom')}%0ACategory:%20${assetCategory}%0ATimeframe:%20${timeframe}%0AContact:%20${encodeURIComponent(fullName)}%20(${encodeURIComponent(phone)})%0A%0ANotes:%0A${encodeURIComponent(notes)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border-2 border-blue-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                {isGerman ? 'Individuelle Budget-Beratung' : 'Custom Budget Advisory'}
              </span>
              <h2 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? 'Ist Ihr Budget nicht aufgeführt? Sprechen Sie mit uns' : 'Is your budget not listed? Talk to us'}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 leading-relaxed shadow-xs">
                <p>
                  {isGerman
                    ? 'Unser privates Kreditkomitee strukturiert individuelle Darlehenslinien jeder Größenordnung. Egal ob Sie ein geringeres Anfangsbudget oder ein Mehrmillionen-Portfolio finanzieren möchten: Sprechen Sie mit uns.'
                    : 'Our private institutional lending desk structures bespoke facilities for any acquisition size. Whether you need a starter facility or a multi-million sovereign line: Talk to us.'}
                </p>
                <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-blue-700 font-medium">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direct Advisory Desk: <a href="mailto:advisory@aureus-private.com" className="underline font-bold hover:text-blue-900">advisory@aureus-private.com</a></span>
                </div>
              </div>

              {/* Subject Picker for Unlisted Budget Requirements */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                  {isGerman ? 'Betreff / Grund der Kontaktaufnahme' : 'Subject / Inquiry Reason'} *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value={isGerman ? 'Budget liegt über Standard-Katalog (Maßgeschneiderte Linie)' : 'Budget higher than standard catalog (Bespoke Luxury Line)'}>
                    {isGerman ? 'Budget liegt über dem Standard-Katalog (Höheres Budget)' : 'Budget higher than standard catalog (Above £1M / €1M / $1M)'}
                  </option>
                  <option value={isGerman ? 'Budget liegt unter Standard-Katalog (Einstiegs-Finanzierung)' : 'Budget lower than standard catalog (Starter Acquisition)'}>
                    {isGerman ? 'Budget liegt unter dem Standard-Katalog (Geringeres Budget)' : 'Budget lower than standard catalog (Under £500k / €500k / $500k)'}
                  </option>
                  <option value={isGerman ? 'Barkredit & Liquiditäts-Anfrage (Sonderhöhe)' : 'Express Cash Loan & Liquidity (Custom Amount)'}>
                    {isGerman ? 'Barkredit & Liquidität (Individuelle Kredithöhe)' : 'Express Cash Loan & Liquidity (Custom Amount)'}
                  </option>
                  <option value={isGerman ? 'Gewerbliches Portfolio & Mehrfachobjekte' : 'Commercial / Multi-Asset Portfolio Financing'}>
                    {isGerman ? 'Gewerbliches Portfolio & Mehrfachobjekte' : 'Commercial / Multi-Asset Portfolio Financing'}
                  </option>
                  <option value={isGerman ? 'Allgemeine Budget- und Zinsberatung' : 'General Budget & Custom Rate Advisory'}>
                    {isGerman ? 'Allgemeine Budget- und Zinsberatung' : 'General Budget & Custom Rate Advisory'}
                  </option>
                </select>
              </div>

              {/* Target Budget Field */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                  {isGerman ? 'Ihr gewünschtes Zielbudget' : 'Your Target Budget / Loan Amount'} *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-700 font-mono font-bold">
                    {country.currency}
                  </span>
                  <input
                    type="text"
                    required
                    value={targetBudget}
                    onChange={(e) => setTargetBudget(e.target.value)}
                    placeholder={isGerman ? 'z.B. 2.500.000 € oder 35.000 €' : 'e.g. 1,500,000 or 50,000'}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Asset Category */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                  {isGerman ? 'Finanzierungszweck' : 'Acquisition Category'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'home' as const, label: isGerman ? 'Immobilie' : 'Residence' },
                    { id: 'car' as const, label: isGerman ? 'Fahrzeug' : 'Vehicle' },
                    { id: 'cash' as const, label: isGerman ? 'Barkredit' : 'Cash Loan' },
                    { id: 'bespoke' as const, label: isGerman ? 'Bespoke / Divers' : 'Portfolio / Other' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setAssetCategory(cat.id)}
                      className={`py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        assetCategory === cat.id
                          ? 'bg-blue-50 border-2 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeframe (With NOW option) */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1.5">
                  {isGerman ? 'Zeithorizont' : 'Financing Timeframe'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'now' as const, label: isGerman ? 'Jetzt (Sofort)' : 'Now (Immediate)' },
                    { id: '1-3-months' as const, label: isGerman ? '1-3 Monate' : '1 - 3 Months' },
                    { id: 'flexible' as const, label: isGerman ? 'Flexibel' : 'Flexible' },
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setTimeframe(tf.id)}
                      className={`py-2 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        timeframe === tf.id
                          ? 'bg-blue-600 text-white shadow-xs border-blue-600'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information - Item (13): Clean labels without 'optional' or 'email of course' */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'Ihr Name' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lord Charles Harrington"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                    {isGerman ? 'E-Mail-Adresse' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@sovereign-holdings.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                  {isGerman ? 'Telefonnummer' : 'Phone Number'} *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7946 0912"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 tracking-wider mb-1">
                  {isGerman ? 'Ihre Wünsche / Anmerkungen' : 'Notes / Special Requests'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isGerman ? 'Beschreiben Sie Ihr geplantes Vorhaben...' : 'Describe your acquisition or budget parameters...'}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isGerman ? 'Anfrage absenden' : 'Submit Budget Inquiry'}</span>
                </button>

                <a
                  href={mailtoLink}
                  className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>{isGerman ? 'Direkt per E-Mail' : 'Email Directly'}</span>
                </a>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {isGerman ? 'Anfrage erfolgreich übermittelt' : 'Budget Inquiry Dispatched'}
              </h3>
              <p className="text-xs text-slate-700 max-w-sm mx-auto leading-relaxed">
                {isGerman
                  ? `Vielen Dank, ${fullName}. Ihre Anfrage für ${country.currency}${targetBudget} wurde registriert. Unsere Private Wealth Manager melden sich umgehend per E-Mail.`
                  : `Thank you, ${fullName}. Your tailored inquiry for ${country.currency}${targetBudget} has been received. Our advisory team will follow up at ${email} shortly.`}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-900 inline-block">
                Reference ID: <span className="font-bold text-blue-700">{referenceId}</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  {isGerman ? 'Schließen' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
