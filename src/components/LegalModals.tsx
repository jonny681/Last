import React from 'react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  X,
  ShieldCheck,
  FileText,
  Scale,
  Landmark,
  Home,
  Car,
  Calculator,
  Lock,
  HelpCircle,
  MapPin,
  Sparkles,
  Percent,
} from 'lucide-react';

interface LegalModalsProps {
  currentCountry: CountryCode;
  modalType: string | null;
  onClose: () => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  currentCountry,
  modalType,
  onClose,
  onNavigateToSection,
}) => {
  if (!modalType) return null;

  const isGerman = currentCountry === 'DE';
  const country = COUNTRIES[currentCountry];

  const handleActionClick = (sectionId: string) => {
    onClose();
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderIcon = () => {
    switch (modalType) {
      case 'privacy':
        return <ShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'terms':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'impressum':
        return <Scale className="w-5 h-5 text-blue-600" />;
      case 'overview':
        return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'catalog':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'loans':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'calculator':
      case 'down-payment':
        return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'security':
      case 'treasury':
        return <Lock className="w-5 h-5 text-blue-600" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
      case 'locations':
      case 'advisory':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTitle = () => {
    switch (modalType) {
      case 'privacy':
        return isGerman ? 'Datenschutzerklärung (DSGVO)' : 'Privacy Policy & Data Security';
      case 'terms':
        return isGerman ? 'Allgemeine Darlehensbedingungen' : 'General Lending Terms & Conditions';
      case 'impressum':
        return isGerman ? 'Impressum & Regulatorische Angaben' : 'Statutory Impressum & Legal Disclosures';
      case 'overview':
        return isGerman ? 'Über Aureus Prestige' : 'About Aureus Prestige Group';
      case 'catalog':
        return isGerman ? 'Immobilien- & Fahrzeug-Portfolio' : 'Curated Homes & Prestige Vehicles';
      case 'loans':
        return isGerman ? 'Direkte Darlehensfazilitäten' : 'Direct Loan Facilities';
      case 'calculator':
      case 'down-payment':
        return isGerman ? '10 % Anzahlungsregel & Rechner' : '10% Down Payment Policy & Calculator';
      case 'security':
        return isGerman ? 'Bankensicherheit & BaFin/FCA-Clearing' : 'Institutional Security & Regulatory Clearing';
      case 'treasury':
        return isGerman ? 'Institutionelle Bilanzfinanzierung' : 'Institutional Balance Sheet Facilities';
      case 'faq':
        return isGerman ? 'Häufig gestellte Fragen (FAQ)' : 'Frequently Asked Questions (FAQ)';
      case 'locations':
        return isGerman ? 'Globale Niederlassungen & Repräsentanzen' : 'Global Offices & Desks';
      case 'advisory':
        return isGerman ? 'Private Wealth Lending Beratung' : 'Private Wealth Lending Advisory';
      default:
        return 'Information';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[88vh] bg-white border-2 border-blue-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                {getTitle()}
              </h3>
              <p className="text-xs text-slate-600 font-mono">
                Aureus Capital Group · Jurisdiction: {country.name} ({country.code} · {country.currency})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* OVERVIEW MODAL */}
          {modalType === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs">
                <div className="font-serif font-bold text-base text-blue-950 mb-1">
                  {isGerman ? 'Wir sind der direkte Kreditgeber' : 'We Are The Real Direct Lender'}
                </div>
                <p className="text-xs text-slate-700">
                  {isGerman
                    ? 'Aureus Prestige / Aureus Capital GmbH ist keine Vergleichsplattform und kein Vermittler. Wir finanzieren alle Immobiliendarlehen und Kfz-Kredite unmittelbar aus eigener institutioneller Bilanz.'
                    : 'Aureus Prestige / Aureus Capital is the direct institutional lender, not a broker or comparison referral portal. All residential mortgages and luxury vehicle loans are underwritten and funded directly from our sovereign balance sheet.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '1. Kernvoraussetzung: Nur 10 % Anzahlung' : '1. Standard 10% Upfront Acquisition Requirement'}
                </h4>
                <p>
                  {isGerman
                    ? 'Für alle gelisteten Immobilien und Fahrzeuge in jedem Land ist lediglich eine Anzahlung von 10 % des Kaufpreises erforderlich. Die verbleibenden 90 % werden direkt von Aureus Capital bereitgestellt. Kreditnehmer können auch höhere Prozentsätze (15 %, 20 %, 30 %+) wählen.'
                    : 'For all curated properties and luxury motorcars across the UK, Canada, Australia, and Germany, our standard financing policy requires only a 10% upfront payment of the total asset price to acquire. The remaining 90% is financed directly by Aureus Capital. Borrowers may also select higher upfront percentages.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '2. Vier souveräne Märkte' : '2. Four Sovereign Jurisdictions'}
                </h4>
                <p>
                  {isGerman
                    ? 'Wir operieren in Deutschland (€), Großbritannien (£), Kanada (C$) und Australien (A$). In jedem Markt unterhalten wir dedizierte Treasury-Desks und erfüllen alle lokalen aufsichtsrechtlichen Pflichten.'
                    : 'We maintain direct capital clearing operations in the United Kingdom (£), Canada (C$), Australia (A$), and Germany (€), issuing loans tailored to national legal frameworks.'}
                </p>
              </div>
            </div>
          )}

          {/* CATALOG MODAL */}
          {modalType === 'catalog' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs">
                <div className="font-serif font-bold text-base text-blue-950 mb-1">
                  {isGerman ? 'Kuratierte Immobilien & Prestige-Fahrzeuge' : 'Curated Prime Homes & Performance Vehicles'}
                </div>
                <p className="text-xs text-slate-700">
                  {isGerman
                    ? 'Jedes der 4 Länder verfügt über einen vollständig eigenständigen Katalog von erstklassigen Wohnimmobilien und exklusiven Fahrzeugen mit authentischen lokalen Preisen und Ausstattungen.'
                    : 'Each of the 4 countries features an entirely distinct catalog of prime residential properties and luxury vehicles, complete with authentic localized pricing, addresses, and specifications.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? 'Vermögenserwerb mit 10 % Anzahlung' : 'Asset Acquisition With 10% Down'}
                </h4>
                <p>
                  {isGerman
                    ? 'Wählen Sie einfach ein beliebiges Objekt aus unserem Katalog. Unser System berechnet automatisch die exakte 10 % Anzahlung und übernimmt das 90 %-Darlehen in den Rechner und das Antragsformular.'
                    : 'Select any listing in the catalog. Our engine instantly calculates the mandatory 10% upfront deposit and pre-populates the 90% direct loan facility in both the interactive calculator and confidential application.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleActionClick('asset-selection')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
                >
                  {isGerman ? 'Zum Katalog wechseln' : 'Open Catalog Browser'}
                </button>
              </div>
            </div>
          )}

          {/* LOANS MODAL */}
          {modalType === 'loans' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs">
                <div className="font-serif font-bold text-base text-blue-950 mb-1">
                  {isGerman ? 'Direkte Darlehensfazilitäten aus eigener Bilanz' : 'Direct Balance Sheet Facilities'}
                </div>
                <p className="text-xs text-slate-700">
                  {isGerman
                    ? 'Als direkter Kreditgeber vergeben wir Baufinanzierungen bis zu 30 Jahren Zinsbindung und Kfz-Kredite für Luxusfahrzeuge von 12 bis 84 Monaten.'
                    : 'As the real direct lender, we provide prime residential mortgages with fixed terms up to 30 years and prestige automotive loans from 12 to 84 months.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? 'Garantierte 10 %-Anzahlungsanforderung' : 'Guaranteed 10% Down Payment Requirement'}
                </h4>
                <p>
                  {isGerman
                    ? 'Kreditnehmer müssen für alle Kredite lediglich 10 % des Kaufpreises vorab einbringen. Bis zu 90 % finanzieren wir direkt aus unserem Treasury-Fonds.'
                    : 'Borrowers need only provide a 10% upfront deposit to acquire any asset. Up to 90% is financed directly from our institutional treasury.'}
                </p>
              </div>
            </div>
          )}

          {/* CALCULATOR & DOWN-PAYMENT MODALS */}
          {(modalType === 'calculator' || modalType === 'down-payment') && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs">
                <div className="flex items-center gap-2 font-serif font-bold text-base text-blue-950 mb-1">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span>{isGerman ? '10 % Anzahlungsregel für alle Kredite' : 'The 10% Upfront Acquisition Rule'}</span>
                </div>
                <p className="text-xs text-slate-700">
                  {isGerman
                    ? 'Die Anzahlung für alle Immobilien und Fahrzeuge beginnt bei mindestens 10 % des Kaufpreises. Kreditnehmer können im Rechner auch 15 %, 20 %, 25 %, 30 % oder bis zu 70 % wählen.'
                    : 'The upfront payment to acquire any property or luxury car starts at a strict minimum of 10% of the asset purchase price. Borrowers can also choose higher percentages (15%, 20%, 25%, 30%, up to 70%) to minimize lifetime borrowing costs.'}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? 'Mathematische Modellierung der Monatsrate' : 'Net Loan Amortization Modeling'}
                </h4>
                <p>
                  {isGerman
                    ? 'Die monatliche Rate wird ausschließlich auf den verbleibenden Darlehensbetrag (Kaufpreis abzüglich Anzahlung) berechnet. Das spart Zinskosten und gibt Ihnen volle Planungssicherheit.'
                    : 'Monthly payments and amortisation schedules are computed strictly against the net financed amount (Purchase Price minus Upfront Payment). This saves interest costs and ensures crystal-clear predictability.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleActionClick('calculator')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
                >
                  {isGerman ? 'Zum Darlehensrechner' : 'Open Loan Calculator'}
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY MODAL */}
          {modalType === 'privacy' && (
            <div className="space-y-4">
              <p>
                {isGerman
                  ? 'Der Schutz Ihrer personenbezogenen Daten hat für die Aureus Capital GmbH als direktem Kreditgeber oberste Priorität. Wir erheben und verarbeiten Ihre Angaben ausschließlich im Einklang mit der EU-Datenschutz-Grundverordnung (DSGVO) sowie dem Bundesdatenschutzgesetz (BDSG).'
                  : 'At Aureus Prestige / Aureus Capital, protecting your personal and financial data is paramount. As the direct lender, we process borrower records strictly in accordance with GDPR (UK & EU), PIPEDA (Canada), and the Privacy Act 1988 (Australia).'}
              </p>
              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '1. Zweck der direkten Datenerhebung' : '1. Purpose of Direct Processing'}
                </h4>
                <p>
                  {isGerman
                    ? 'Ihre im Rahmen der unverbindlichen Kreditanfrage gemachten Angaben werden ausschließlich zur internen Bonitäts- und Beleihungsprüfung durch unseren Kreditausschuss verwendet.'
                    : 'Information submitted through our portal is used exclusively to evaluate indicative direct lending facilities and underwrite balance sheet financing.'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '2. Keine Weitergabe an unbefugte Dritte' : '2. No Unauthorised Third-Party Disclosures'}
                </h4>
                <p>
                  {isGerman
                    ? 'Ihre Daten werden zu keinem Zeitpunkt an Marketingagenturen oder externe Kreditmakler verkauft. Als direkter Darlehensgeber verbleiben Ihre Akten in unserem verschlüsselten Treasury-Tresor.'
                    : 'We never sell your data to marketing aggregators or lead brokers. As the direct capital lender, your file remains confidential within our proprietary underwriting vault.'}
                </p>
              </div>
            </div>
          )}

          {/* TERMS MODAL */}
          {modalType === 'terms' && (
            <div className="space-y-4">
              <p>
                {isGerman
                  ? 'Die Inanspruchnahme unserer Finanzierungsfazilitäten unterliegt den nachfolgenden Darlehensbedingungen der Aureus Capital GmbH als direktem Kreditgeber.'
                  : 'Borrowing facilities provided through Aureus Prestige are governed by the following direct institutional lending terms.'}
              </p>
              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '1. Direkter Darlehensgeberstatus' : '1. Direct Capital Lender Status'}
                </h4>
                <p>
                  {isGerman
                    ? 'Aureus Capital GmbH ist der direkte Kreditgeber. Darlehensverträge kommen unmittelbar zwischen Ihnen und der Aureus Capital GmbH zustande.'
                    : 'Aureus Capital is the direct capital funding institution. All credit agreements are contracted directly between the borrower and Aureus Capital.'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? '2. Mindestanzahlung von 10 % zum Erwerb' : '2. 10% Minimum Upfront Acquisition Requirement'}
                </h4>
                <p>
                  {isGerman
                    ? 'Der Vermögenserwerb von Immobilien oder Fahrzeugen setzt eine Anzahlung von mindestens 10 % des Kaufpreises voraus. Die verbleibenden 90 % werden durch das Darlehen finanziert.'
                    : 'Acquisition of listed residences and prestige vehicles requires an upfront payment of at least 10% of total asset valuation. Up to 90% is financed via the direct facility.'}
                </p>
              </div>
            </div>
          )}

          {/* IMPRESSUM MODAL */}
          {modalType === 'impressum' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs font-mono space-y-1 text-slate-800 shadow-xs">
                <div className="font-bold text-blue-900 mb-2 text-sm font-sans">
                  {isGerman ? 'Aufsichtsrechtliche Pflichtangaben des direkten Kreditgebers' : 'Regulatory Status & Statutory Company Details'}
                </div>
                <div>{country.footerCompliance}</div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-base mb-1 font-serif">
                  {isGerman ? 'Zuständige Aufsichtsbehörden' : 'Competent Supervisory Authorities'}
                </h4>
                <p className="text-xs text-slate-600">
                  {currentCountry === 'DE' && 'Industrie- und Handelskammer Frankfurt am Main & BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht), Graurheindorfer Str. 108, 53117 Bonn.'}
                  {currentCountry === 'UK' && 'Financial Conduct Authority (FCA), 12 Endeavour Square, London E20 1JN. Financial Ombudsman Service (FOS), Exchange Tower, London E14 9SR.'}
                  {currentCountry === 'CA' && 'Financial Services Regulatory Authority of Ontario (FSRA), 25 Sheppard Avenue West, Suite 100, Toronto, ON M2N 6S6.'}
                  {currentCountry === 'AU' && 'Australian Securities and Investments Commission (ASIC), Level 5, 100 Market Street, Sydney NSW 2000. ACL #389201.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs font-mono text-blue-700 font-semibold hidden sm:block">
            {isGerman ? 'Nur 10 % Anzahlung erforderlich' : 'Only 10% upfront payment required to acquire'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-xs ml-auto cursor-pointer"
          >
            {isGerman ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const LegalModal = LegalModals;
