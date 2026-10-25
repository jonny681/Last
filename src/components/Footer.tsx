import React from 'react';
import { CountryCode, FooterModalType } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  currentCountry: CountryCode;
  onOpenModal: (type: FooterModalType) => void;
  onOpenCookieBanner: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentCountry,
  onOpenModal,
  onOpenCookieBanner,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';
  const t = isGerman ? UI_TEXT.DE : UI_TEXT.EN;

  return (
    <footer className="bg-slate-950 border-t-2 border-slate-800 pt-16 pb-24 text-slate-300 text-xs font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Direct Institutional Lender Statutory Notice Banner */}
        <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white text-sm font-serif">
                  {t.footer.complianceTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/50">
                  {isGerman ? 'Direkter Kreditgeber' : 'Direct Institutional Lender'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {t.footer.disclaimerGeneral}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed">
                {country.footerCompliance}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Columns Footer Navigation: All Items Open Popups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Profile */}
          <div>
            <div className="text-lg font-serif font-bold text-white tracking-wider mb-3">
              <span>AUREUS <span className="text-blue-400 font-medium">PRESTIGE</span></span>
            </div>
            <p className="leading-relaxed mb-4 text-slate-300">
              {t.footer.aboutBrand}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-500/25 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-medium">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-xs">{country.name} ({country.currency})</span>
              </div>
              <div className="text-[11px] text-blue-300 font-mono">
                {isGerman ? 'Erwerb mit 10 % Anzahlung' : 'Only 10% upfront payment required'}
              </div>
            </div>
          </div>

          {/* Column 2: Portal Navigation (Clickable Popups) */}
          <div>
            <div className="font-semibold text-white uppercase tracking-widest text-xs mb-3 font-serif flex items-center justify-between">
              <span>{t.footer.quickLinks}</span>
              <span className="text-[10px] font-mono text-blue-400 lowercase">popup info</span>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('overview')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.home} (Direct Profile)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('catalog')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.catalog}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('loans')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.loans}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('calculator')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.calculator}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('how-it-works')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.process}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('security')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.security}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('faq')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.nav.faq}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Compliance & Legal Policies (Clickable Popups) */}
          <div>
            <div className="font-semibold text-white uppercase tracking-widest text-xs mb-3 font-serif flex items-center justify-between">
              <span>{t.footer.legalLinks}</span>
              <span className="text-[10px] font-mono text-blue-400 lowercase">popup info</span>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.footer.privacyLink}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.footer.termsLink}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('impressum')}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.footer.impressumLink}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('down-payment')}
                  className="hover:text-blue-400 text-blue-300 font-semibold transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{isGerman ? '10 % Anzahlungsrichtlinie' : '10% Upfront Acquisition Policy'}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookieBanner}
                  className="hover:text-blue-400 text-slate-300 transition-colors text-left flex items-center gap-1.5 group w-full cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span>{t.footer.cookiesLink}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Treasury Support & Global Offices */}
          <div>
            <div className="font-semibold text-white uppercase tracking-widest text-xs mb-3 font-serif flex items-center justify-between">
              <span>{t.footer.contactDirect}</span>
              <button
                type="button"
                onClick={() => onOpenModal('locations')}
                className="text-[10px] font-mono text-blue-400 hover:underline cursor-pointer"
              >
                {isGerman ? 'Alle Standorte' : 'All Desks'}
              </button>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${t.footer.email}`} className="hover:text-white transition-colors truncate">
                  {t.footer.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${t.footer.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {t.footer.phone}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('locations')}
                  className="flex items-start gap-2 text-slate-400 hover:text-white transition-colors text-left w-full group pt-1 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] leading-tight text-slate-300">
                    {currentCountry === 'UK' && '1 St. James’s Square, Mayfair, London SW1Y 4PD (Click for Office Info)'}
                    {currentCountry === 'CA' && '161 Bay Street, Suite 2700, Toronto, ON M5J 2S1 (Click for Office Info)'}
                    {currentCountry === 'AU' && 'Tower 1, 100 Barangaroo Avenue, Sydney NSW 2000 (Click for Office Info)'}
                    {currentCountry === 'DE' && 'Taunusanlage 8, 60329 Frankfurt am Main (Hier für Standort-Details klicken)'}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Aureus Prestige Capital Group. {t.footer.rightsReserved}
          </div>
          <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
            <span>TLS 1.3</span>
            <span>·</span>
            <span>DIRECT INSTITUTIONAL LENDER</span>
            <span>·</span>
            <span className="text-blue-400 font-semibold">10% UPFRONT DEPOSIT REQUIREMENT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
