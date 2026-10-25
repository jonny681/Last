import React, { useState } from 'react';
import { CountryCode } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import {
  Globe,
  ArrowRight,
  Building2,
  Car,
  Wallet,
  Calculator,
} from 'lucide-react';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

interface HeroProps {
  currentCountry: CountryCode;
  onSelectCountry?: (country: CountryCode) => void;
  onCheckRate: () => void;
  onOpenCalculator: () => void;
  onBrowseCatalog: () => void;
  onOpenInvestmentPlans?: () => void;
  onOpenWebApp?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentCountry,
  onCheckRate,
  onOpenCalculator,
  onBrowseCatalog,
  onOpenWebApp,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [activeAssetTab, setActiveAssetTab] = useState<'home' | 'car'>('home');

  const formatCurrency = (val: number) => {
    return formatCurrencyCached(val, country.locale, country.currencyCode, 0);
  };

  // Sample featured assets
  const featuredHome = {
    title: isGerman ? 'St. James Terrace Penthouse' : 'The St. James Terrace Penthouse',
    location: isGerman ? 'Berlin-Mitte / Mayfair Prime' : 'London SW1 / Sovereign Prime',
    price: currentCountry === 'DE' ? 1150000 : currentCountry === 'UK' ? 980000 : currentCountry === 'CA' ? 1680000 : 1850000,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    beds: 4,
    baths: 4.5,
    area: '4,650 sq ft',
  };

  const featuredCar = {
    title: '2026 Aston Martin Vanquish V12',
    category: 'Twin-Turbo V12 · 835 HP',
    price: currentCountry === 'DE' ? 385000 : currentCountry === 'UK' ? 330000 : currentCountry === 'CA' ? 580000 : 640000,
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    speed: '3.2s 0-60 mph',
    topSpeed: '214 mph',
  };

  const currentAsset = activeAssetTab === 'home' ? featuredHome : featuredCar;
  const downPayment = Math.round(currentAsset.price * 0.1);
  const financedBalance = currentAsset.price - downPayment;
  const monthlyEst = activeAssetTab === 'home'
    ? Math.round((financedBalance * 0.0485) / 12 + financedBalance / (30 * 12))
    : Math.round((financedBalance * 1.055) / 60);

  return (
    <section className="relative min-h-[640px] lg:min-h-[700px] flex flex-col justify-center overflow-hidden pt-28 sm:pt-32 pb-16 bg-gradient-to-b from-slate-50/70 via-white to-white text-slate-900 border-b border-slate-200">
      {/* Editorial Ambient Light Highlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[130px]" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-indigo-50/50 blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full z-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Formal Institutional Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Sovereign Jurisdiction Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-blue-900 text-xs sm:text-sm font-medium shadow-xs">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Dedicated Multi-Jurisdiction Platform across 4 Sovereign Nations</span>
            </div>

            {/* Formal Editorial Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-slate-900 leading-[1.08]">
                Direct Financing for Exceptional{' '}
                <span className="text-blue-600 italic font-serif font-normal block sm:inline">
                  Homes & Motorcars.
                </span>
              </h1>
            </div>

            {/* Subtitle Value Promise */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Direct sovereign lending across 4 prime nations: United Kingdom (£), Canada ($), Australia ($), and Germany (€). Acquire curated prime residences and 20 worldwide performance vehicles with only 10% upfront payment.
            </p>

            {/* Action Buttons: Formal Institutional CTAs in Deep Navy Blue */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onBrowseCatalog}
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isGerman ? '10% Angebote ansehen' : 'Explore 10% Down Facilities'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={onOpenCalculator}
                className="px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-slate-500" />
                <span>{isGerman ? '10% Anzahlung berechnen' : 'Calculate 10% Down'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Formal Luxury Showcase Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl text-slate-900">
              
              {/* Asset Type Switcher (Prime Residence vs Prestige Motorcar) */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveAssetTab('home')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeAssetTab === 'home'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prime Residences</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAssetTab('car')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeAssetTab === 'car'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prestige Vehicles</span>
                  </button>
                </div>

                <div className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                  10% DOWN
                </div>
              </div>

              {/* Asset Presentation Box */}
              <div className="py-4 space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={currentAsset.imageUrl}
                    alt={currentAsset.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] font-medium text-slate-700 shadow-xs">
                    {activeAssetTab === 'home' ? (currentAsset as typeof featuredHome).location : (currentAsset as typeof featuredCar).category}
                  </div>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-slate-900 tracking-tight">
                    {currentAsset.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {activeAssetTab === 'home' ? (
                      <>
                        <span>{(currentAsset as typeof featuredHome).beds} Beds</span>
                        <span aria-hidden="true">·</span>
                        <span>{(currentAsset as typeof featuredHome).baths} Baths</span>
                        <span aria-hidden="true">·</span>
                        <span>{(currentAsset as typeof featuredHome).area}</span>
                      </>
                    ) : (
                      <>
                        <span>{(currentAsset as typeof featuredCar).speed}</span>
                        <span aria-hidden="true">·</span>
                        <span>{(currentAsset as typeof featuredCar).topSpeed}</span>
                        <span aria-hidden="true">·</span>
                        <span>Global Delivery Included</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantitative Breakdown Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Asset Purchase Price:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(currentAsset.price)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>10% Upfront to Acquire:</span>
                    <span className="font-mono font-bold text-emerald-700">{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>90% Aureus Direct Loan:</span>
                    <span className="font-mono">{formatCurrency(financedBalance)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1.5 border-t border-slate-200">
                    <span>Estimated Monthly:</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(monthlyEst)}/mo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onCheckRate}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Get Pre-Approved</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenWebApp || onBrowseCatalog}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Wallet className="w-3.5 h-3.5 text-blue-600" />
                  <span>Open in Web App</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
