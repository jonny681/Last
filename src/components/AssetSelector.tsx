import React, { useState, useMemo, useEffect } from 'react';
import { CountryCode, LoanType, PropertyItem, VehicleItem } from '../types';
import { COUNTRIES, UI_TEXT } from '../data/translations';
import { PROPERTIES_BY_COUNTRY, WORLDWIDE_VEHICLES } from '../data/catalog';
import {
  Home,
  Car,
  Check,
  Search,
  ArrowRight,
  Eye,
  MapPin,
  Gauge,
  ShieldCheck,
  X,
  Compass,
  Maximize2,
  Minimize2,
  Globe,
  Ship,
  Plane,
  Building2,
  DollarSign
} from 'lucide-react';
import { WalkIn3DModal } from './WalkIn3DModal';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';

// Image assets fallback
import imgManor from '../assets/images/historic_country_manor_1791146249396.jpg';
import imgPenthouse from '../assets/images/luxury_penthouse_terrace_1791146237221.jpg';
import imgVilla from '../assets/images/card_home_loan_1791145368362.jpg';
import imgArchitectural from '../assets/images/hero_luxury_lending_1791145356660.jpg';
import imgSupercar from '../assets/images/hypercar_supercar_1791146260626.jpg';
import imgSuv from '../assets/images/luxury_suv_flagship_1791146272660.jpg';
import imgCoupe from '../assets/images/card_car_loan_1791145379615.jpg';

interface AssetSelectorProps {
  currentCountry: CountryCode;
  selectedAsset: {
    type: LoanType;
    id: string;
    title: string;
    price: number;
  } | null;
  onSelectAsset: (type: LoanType, item: PropertyItem | VehicleItem) => void;
  onNavigateToCalculator: () => void;
  onNavigateToForm: () => void;
  onClearSelection: () => void;
  onOpenPreApproval?: (asset?: { type: LoanType; id: string; title: string; price: number; imageUrl?: string }) => void;
  favoritePropertyIds?: string[];
  favoriteVehicleIds?: string[];
  onToggleFavoriteProperty?: (id: string) => void;
  onToggleFavoriteVehicle?: (id: string) => void;
  activeTab?: LoanType;
  onTabChange?: (tab: LoanType) => void;
  onOpenCustomBudget?: () => void;
  onSelectCountry?: (country: CountryCode) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  currentCountry,
  selectedAsset,
  onSelectAsset,
  onNavigateToCalculator,
  onNavigateToForm,
  onClearSelection,
  onOpenPreApproval,
  activeTab: controlledActiveTab,
  onTabChange,
  onOpenCustomBudget,
  onSelectCountry,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';
  const t = isGerman ? UI_TEXT.DE : UI_TEXT.EN;

  // Tab: 'home' or 'car'
  const [internalActiveTab, setInternalActiveTab] = useState<LoanType>('home');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (tab: LoanType) => {
    setInternalActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Worldwide shipping destination simulator for cars
  const [shippingDestination, setShippingDestination] = useState<string>('UK (Port of Southampton)');

  // Quick detail modal state
  const [inspectItem, setInspectItem] = useState<{
    type: LoanType;
    data: PropertyItem | VehicleItem;
  } | null>(null);

  // Fullscreen photo lightbox state
  const [isPhotoFullScreen, setIsPhotoFullScreen] = useState(false);

  // 3D Walk-in modal state
  const [walkInModalProperty, setWalkInModalProperty] = useState<PropertyItem | null>(null);

  useEffect(() => {
    setIsPhotoFullScreen(false);
  }, [inspectItem?.data.id]);

  const properties = PROPERTIES_BY_COUNTRY[currentCountry] || [];
  // 20 Worldwide Prestige Vehicles available to any country
  const vehicles = WORLDWIDE_VEHICLES || [];

  // Helper for image resolution
  const getImage = (key: string) => {
    switch (key) {
      case 'manor':
        return imgManor;
      case 'penthouse':
        return imgPenthouse;
      case 'villa':
        return imgVilla;
      case 'architectural':
        return imgArchitectural;
      case 'supercar':
      case 'ev':
        return imgSupercar;
      case 'suv':
        return imgSuv;
      case 'coupe':
      default:
        return imgCoupe;
    }
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return formatCurrencyCached(val, country.locale, country.currencyCode, 0);
  };

  // Monthly estimate helper for badges (calculated on 90% financed balance after 10% upfront payment)
  const getMonthlyEstimate = (price: number, type: LoanType) => {
    const rate = type === 'home' ? country.homeLoan.defaultRate : country.carLoan.defaultRate;
    const termYears = type === 'home' ? country.homeLoan.defaultTerm : country.carLoan.defaultTerm;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = termYears * 12;
    const financedBalance = price * 0.90; // Only 10% upfront payment required
    const monthly = (financedBalance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return formatCurrency(Math.round(monthly));
  };

  // Categories
  const propertyCategories = useMemo(() => {
    const cats = new Set<string>();
    properties.forEach((p) => cats.add(p.type));
    return ['all', ...Array.from(cats)];
  }, [properties]);

  const vehicleCategories = useMemo(() => {
    const cats = new Set<string>();
    vehicles.forEach((v) => cats.add(v.category));
    return ['all', ...Array.from(cats)];
  }, [vehicles]);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'all' || p.type === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [properties, searchQuery, selectedCategory, sortOrder]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesSearch =
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [vehicles, searchQuery, selectedCategory, sortOrder]);

  const countryKeys: CountryCode[] = ['UK', 'CA', 'AU', 'DE'];

  return (
    <section id="asset-selection" className="py-20 bg-slate-50 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Curated Prime Residences · Performance Vehicles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            {isGerman
              ? 'Wählen Sie Ihr Wunschobjekt oder Traumfahrzeug'
              : 'Choose Your Property or Vehicle'}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {isGerman
              ? `Wählen Sie aus handverlesenen Residenzen in ${country.name} oder weltweit lieferbaren Traumwagen. Mit 10% Anzahlung sofort vorabgenehmigen.`
              : `Explore premier residences in ${country.name} or our performance vehicles with guaranteed global delivery. Acquire with only 10% upfront payment.`}
          </p>
        </div>

        {/* Persistent Selected Asset Notification Banner */}
        {selectedAsset && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-100 border-2 border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase font-mono tracking-wider text-slate-700 flex items-center gap-2 font-semibold">
                  <span>{isGerman ? 'Aktuell ausgewählt' : 'Currently Selected For Financing'}</span>
                  <span>·</span>
                  <span className="text-slate-600">{selectedAsset.type === 'home' ? (isGerman ? 'Immobilie' : 'Home') : (isGerman ? 'Fahrzeug' : 'Vehicle')}</span>
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-0.5">
                  {selectedAsset.title} — <span className="font-mono text-slate-900 font-bold">{formatCurrency(selectedAsset.price)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onNavigateToCalculator}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                {isGerman ? 'Im Rechner prüfen' : 'View in Calculator'}
              </button>
              <button
                type="button"
                onClick={onNavigateToForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isGerman ? 'Finanzierung beantragen' : 'Apply For This'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClearSelection}
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={isGerman ? 'Auswahl aufheben' : 'Clear selection'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Primary Tab Switcher: Homes vs Car Loans */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setSelectedCategory('all');
              }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4 text-slate-900" />
              <span>{country.flag} Homes in {country.name}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('car');
                setSelectedCategory('all');
              }}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'car'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4 text-slate-900" />
              <span>Car Loans & Prestige Vehicles</span>
            </button>
          </div>

          {/* Quick Search, Category Filter & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[180px] sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'home' ? 'Search city, features...' : 'Search make, model, HP...'}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="all">
                {activeTab === 'home' ? 'All Home Types' : 'All Vehicle Types'}
              </option>
              {(activeTab === 'home' ? propertyCategories : vehicleCategories)
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="default">{isGerman ? 'Sortierung: Empfohlen' : 'Sort: Featured'}</option>
              <option value="price-asc">{isGerman ? 'Preis: Aufsteigend' : 'Price: Low to High'}</option>
              <option value="price-desc">{isGerman ? 'Preis: Absteigend' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Country Switcher Strip for Homes */}
        {activeTab === 'home' && (
          <div className="mb-6 p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <span className="text-slate-500 font-normal">Active Sovereign Territory:</span>
              <strong className="text-slate-900 font-semibold">{country.name} ({country.currency})</strong>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 text-[11px]">Showing curated residential properties</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Switch Jurisdiction:</span>
              {countryKeys.map((cCode) => {
                const c = COUNTRIES[cCode];
                const isSelected = cCode === currentCountry;
                return (
                  <button
                    key={cCode}
                    type="button"
                    onClick={() => onSelectCountry && onSelectCountry(cCode)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Shipping Strip for Vehicles */}
        {activeTab === 'car' && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>White-Glove Vehicle Logistics</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    Global Delivery
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Prestige performance vehicles are available with enclosed air or ocean transport. Customs handled directly by our trade desk.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-slate-700">Delivery Port:</span>
              <select
                value={shippingDestination}
                onChange={(e) => setShippingDestination(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-xs font-semibold text-slate-800 shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="UK (Port of Southampton)">🇬🇧 UK (Port of Southampton / London)</option>
                <option value="Canada (Halifax / Vancouver)">🇨🇦 Canada (Halifax / Vancouver)</option>
                <option value="Australia (Sydney / Melbourne)">🇦🇺 Australia (Sydney / Melbourne)</option>
                <option value="Germany (Bremerhaven)">🇩🇪 Germany (Bremerhaven Hub)</option>
                <option value="Global Door-to-Door Carrier">🌍 Global Door-to-Door Enclosed Carrier</option>
              </select>
            </div>
          </div>
        )}

        {/* Asset Cards Grid */}
        {activeTab === 'home' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => {
              const isSelected = selectedAsset?.id === prop.id;
              const monthlyEst = getMonthlyEstimate(prop.price, 'home');
              const imgSrc = prop.imageUrl || (prop.imageKey ? getImage(prop.imageKey) : imgVilla);

              return (
                <div
                  key={prop.id}
                  className={`group rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/30'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={imgSrc}
                      alt={prop.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = imgVilla;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Badge & Quick Inspect */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-sm">
                          {prop.tag}
                        </span>
                        {((prop.virtualTourRooms && prop.virtualTourRooms.length > 0) || prop.perspectives || prop.id === 'uk-prop-2') && (
                          <button
                            type="button"
                            onClick={() => setWalkInModalProperty(prop)}
                            className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-semibold shadow-xs hover:bg-blue-700 flex items-center gap-1 cursor-pointer transition-all"
                            title="15 Architectural Perspectives (Generated from Video)"
                          >
                            <Compass className="w-2.5 h-2.5" />
                            <span>{prop.perspectives || prop.id === 'uk-prop-2' ? '15 Perspectives' : '3D Walk-in'}</span>
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setInspectItem({ type: 'home', data: prop })}
                        className="w-7 h-7 rounded-full bg-white/90 border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title={isGerman ? 'Details ansehen' : 'Quick View'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Tag Overlay with 10% Down Badge */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <div className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-sm tabular-nums">
                          {formatCurrency(prop.price)}
                        </div>
                        <div className="text-[11px] font-mono text-blue-200 font-semibold drop-shadow-xs">
                          {isGerman ? '10% Anzahlung: ' : '10% Down: '}
                          <span className="text-white font-bold">{formatCurrency(prop.price * 0.10)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-semibold block mb-0.5 shadow-xs">
                          90% Loan
                        </span>
                        <div className="text-[10px] font-mono text-slate-200 drop-shadow-xs">
                          {monthlyEst}/mo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal line-clamp-2 mt-1 leading-relaxed">
                        {prop.description}
                      </p>
                    </div>

                    {/* Action Trigger Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                      {((prop.virtualTourRooms && prop.virtualTourRooms.length > 0) || prop.perspectives || prop.id === 'uk-prop-2') && (
                        <button
                          type="button"
                          onClick={() => setWalkInModalProperty(prop)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Compass className="w-3.5 h-3.5 text-blue-600" />
                          <span>{prop.perspectives || prop.id === 'uk-prop-2' ? '📸 15 Perspectives (Generated from Video)' : '3D Walk-in Tour'}</span>
                        </button>
                      )}
                      {onOpenPreApproval && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAsset('home', prop);
                            onOpenPreApproval({
                              type: 'home',
                              id: prop.id,
                              title: prop.title,
                              price: prop.price,
                              imageUrl: prop.imageUrl,
                            });
                          }}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{isGerman ? 'Vorabgenehmigung anfordern' : 'Get Pre-Approved Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAsset('home', prop);
                          onNavigateToCalculator();
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selected for Loan</span>
                          </>
                        ) : (
                          <span>Model in Loan Calculator</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map((car) => {
              const isSelected = selectedAsset?.id === car.id;
              const monthlyEst = getMonthlyEstimate(car.price, 'car');
              const imgSrc = car.imageUrl || (car.imageKey ? getImage(car.imageKey) : imgCoupe);

              return (
                <div
                  key={car.id}
                  className={`group rounded-2xl bg-white border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/30'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={imgSrc}
                      alt={car.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = imgSupercar;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    {/* Badge & Quick Inspect */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                          Worldwide Shipping
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200 shadow-xs">
                          {car.tag}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setInspectItem({ type: 'car', data: car })}
                        className="w-7 h-7 rounded-full bg-white/90 border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        title={isGerman ? 'Details ansehen' : 'Quick View'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Tag Overlay with 10% Down Badge */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <div className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-sm tabular-nums">
                          {formatCurrency(car.price)}
                        </div>
                        <div className="text-[11px] font-mono text-blue-200 font-semibold drop-shadow-xs">
                          {isGerman ? '10% Anzahlung: ' : '10% Down: '}
                          <span className="text-white font-bold">{formatCurrency(car.price * 0.10)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-semibold block mb-0.5 shadow-xs">
                          90% Loan
                        </span>
                        <div className="text-[10px] font-mono text-slate-200 drop-shadow-xs">
                          {monthlyEst}/mo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                        <Gauge className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{car.make} · {car.category}</span>
                      </div>
                      <h3 className="text-sm font-serif font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {car.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal line-clamp-2 mt-1 leading-relaxed">
                        {car.description}
                      </p>

                      {/* Specs Row */}
                      <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                        <span className="font-semibold text-slate-800">{car.hp} HP</span>
                        <span>·</span>
                        <span>{car.acceleration}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Plane className="w-2.5 h-2.5" />
                          Global Freight
                        </span>
                      </div>
                    </div>

                    {/* Action Trigger Buttons */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                      {onOpenPreApproval && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectAsset('car', car);
                            onOpenPreApproval({
                              type: 'car',
                              id: car.id,
                              title: car.title,
                              price: car.price,
                              imageUrl: imgSrc,
                            });
                          }}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>{isGerman ? 'Vorabgenehmigung anfordern' : 'Get Pre-Approved Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAsset('car', car);
                          onNavigateToCalculator();
                        }}
                        className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Selected for Loan</span>
                          </>
                        ) : (
                          <span>Model in Loan Calculator</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Budget Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <span>Bespoke Sovereign Facilities</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Budget not listed in the catalog? Talk to us
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              Whether your requirements are below catalog minimums or you require a bespoke multi-million sovereign line for estates or exotic fleets: Our private credit desk reviews every bespoke brief.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onOpenCustomBudget) onOpenCustomBudget();
              }}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              Talk To Us
            </button>
            <a
              href="mailto:advisory@aureus-private.com?subject=Custom%20Budget%20Inquiry"
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all"
            >
              Email Directly
            </a>
          </div>
        </div>
      </div>

      {/* Inspect Item Modal */}
      {inspectItem && (() => {
        const isHome = inspectItem.type === 'home';
        const property = isHome ? (inspectItem.data as PropertyItem) : null;
        const vehicle = !isHome ? (inspectItem.data as VehicleItem) : null;

        const itemImage = isHome
          ? (property?.imageUrl || (property?.imageKey ? getImage(property.imageKey) : imgVilla))
          : (vehicle?.imageUrl || getImage(vehicle?.imageKey || 'supercar'));

        const upfrontAmount = Math.round(inspectItem.data.price * 0.1);
        const financedAmount = inspectItem.data.price - upfrontAmount;
        const monthlyEst = getMonthlyEstimate(inspectItem.data.price, inspectItem.type);

        return (
          <>
            {/* Full Screen Image Lightbox */}
            {isPhotoFullScreen && (
              <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-3 animate-fade-in">
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsPhotoFullScreen(false)}
                    className="p-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
                  <img
                    src={itemImage}
                    alt={inspectItem.data.title}
                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  />
                </div>
                <div className="mt-4 px-4 py-2 rounded-full bg-slate-800 text-center text-xs text-white font-mono">
                  {inspectItem.data.title}
                </div>
              </div>
            )}

            {/* Main Modal Window */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
              <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh]">
                
                {/* Photo Viewport */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={itemImage}
                    alt={inspectItem.data.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = isHome ? imgVilla : imgSupercar;
                    }}
                  />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200 text-slate-900 text-[11px] font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>{inspectItem.data.tag}</span>
                  </div>

                  {/* Top Controls */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoFullScreen(true)}
                      className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-blue-600 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectItem(null)}
                      className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-rose-600 flex items-center justify-center shadow-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Information Section */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-800 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                        {inspectItem.data.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isHome ? property?.location : (vehicle ? `${vehicle.make} · Worldwide Delivery` : '')}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-2xl font-serif font-bold text-slate-900 tabular-nums">
                        {formatCurrency(inspectItem.data.price)}
                      </div>
                      <div className="text-xs font-semibold text-blue-700 mt-0.5">
                        Only 10% Down: {formatCurrency(upfrontAmount)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        90% Financed: {formatCurrency(financedAmount)} · {monthlyEst}/mo
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Specs */}
                  {vehicle && (
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Power</span>
                        <span className="text-sm font-bold text-slate-900">{vehicle.hp} HP</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-slate-500 block text-[10px] uppercase">Acceleration</span>
                        <span className="text-sm font-bold text-slate-900">{vehicle.acceleration}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">Worldwide Shipping</span>
                        <span className="text-xs font-semibold text-emerald-700">Enclosed Air/Sea</span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1 font-semibold">
                      Overview
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {inspectItem.data.description}
                    </p>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setInspectItem(null)}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Close
                    </button>
                    {onOpenPreApproval && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectAsset(inspectItem.type, inspectItem.data);
                          const itemData = inspectItem.data;
                          setInspectItem(null);
                          onOpenPreApproval({
                            type: inspectItem.type,
                            id: itemData.id,
                            title: itemData.title,
                            price: itemData.price,
                            imageUrl: (itemData as any).imageUrl,
                          });
                        }}
                        className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Get Pre-Approved Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAsset(inspectItem.type, inspectItem.data);
                        setInspectItem(null);
                        onNavigateToCalculator();
                      }}
                      className="px-5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Model in Calculator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* 3D Walk-in Tour Modal */}
      {walkInModalProperty && (
        <WalkIn3DModal
          isOpen={Boolean(walkInModalProperty)}
          onClose={() => setWalkInModalProperty(null)}
          property={walkInModalProperty}
          currentCountry={currentCountry}
          onSelectAsset={onSelectAsset}
          onNavigateToCalculator={onNavigateToCalculator}
          onOpenPreApproval={onOpenPreApproval}
        />
      )}
    </section>
  );
};
