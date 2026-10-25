import React from 'react';
import { CountryCode, LoanType } from '../types';
import { COUNTRIES } from '../data/translations';
import { X, ArrowLeft, Inbox, CheckCircle2, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export interface PreApprovalRecord {
  id: string;
  assetTitle: string;
  assetType: LoanType;
  assetPrice: number;
  downPayment: number;
  financedAmount: number;
  termYears: number;
  rate: number;
  monthlyPayment: number;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  submittedAt: string;
  status: 'Verified Pre-Approved' | 'In Review';
}

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
  applications: PreApprovalRecord[];
  onOpenPreApproval: () => void;
}

export const InboxModal: React.FC<InboxModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  applications,
  onOpenPreApproval,
}) => {
  if (!isOpen) return null;

  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] text-slate-900">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isGerman ? 'Zurück' : 'Back'}</span>
          </button>

          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-600" />
            <span>{isGerman ? 'Kredit-Postfach & Status' : 'Loan Status & Inbox'}</span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1 text-slate-800 text-sm">
          {applications.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <Inbox className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? 'Keine aktiven Kreditanträge' : 'No active loan pre-approvals yet'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {isGerman
                  ? 'Führen Sie die Schritte 1 bis 4 aus, um eine Vorabgenehmigung für unsere Immobilien oder Fahrzeuge mit nur 10% Anzahlung zu erhalten.'
                  : 'Complete Steps 1-4 to receive an instant verified pre-approval letter for our prime homes or prestige vehicles with only 10% down.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPreApproval();
                }}
                className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{isGerman ? 'Vorabgenehmigung starten' : 'Get Pre-Approved Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                {isGerman ? 'Ihre aktiven Vorabgenehmigungen' : 'Your Verified Pre-Approvals'} ({applications.length})
              </div>

              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-blue-700 font-bold">{app.id}</span>
                      <h4 className="text-base font-serif font-bold text-slate-900">{app.assetTitle}</h4>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono font-bold flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{app.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">{isGerman ? 'Kaufpreis' : 'Purchase Price'}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(app.assetPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">{isGerman ? '10% Anzahlung' : '10% Down'}</span>
                      <span className="text-blue-700 font-bold">{formatCurrency(app.downPayment)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">{isGerman ? 'Darlehen' : 'Financed'}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(app.financedAmount)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">{isGerman ? 'Monatsrate' : 'Monthly'}</span>
                      <span className="text-blue-900 font-bold">{formatCurrency(app.monthlyPayment)}/mo</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Status dispatched to: <strong className="text-slate-900">{app.borrowerEmail}</strong></span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>{country.regulatorBadge}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 shadow-xs cursor-pointer"
          >
            {isGerman ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
