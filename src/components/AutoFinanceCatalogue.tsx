import React, { useState, useMemo } from 'react';
import { CountryCode, VehicleItem } from '../types';
import { COUNTRIES } from '../data/translations';
import { WORLDWIDE_VEHICLES } from '../data/catalog';
import { formatCurrency as formatCurrencyCached } from '../utils/formatters';
import {
  Car,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Ship,
  Sparkles,
  Heart,
  ChevronRight,
  Gauge,
  Zap,
  SlidersHorizontal,
  X,
  Info,
} from 'lucide-react';

interface AutoFinanceCatalogueProps {
  currentCountry: CountryCode;
  onApplyForVehicle: (vehicle: VehicleItem) => void;
  favoriteVehicleIds?: string[];
  onToggleFavoriteVehicle?: (id: string) => void;
  onOpenCustomBudget?: () => void;
}

export const AutoFinanceCatalogue: React.FC<AutoFinanceCatalogueProps> = ({
  currentCountry,
  onApplyForVehicle,
  favoriteVehicleIds = [],
  onToggleFavoriteVehicle,
  onOpenCustomBudget,
}) => {
  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
  const [inspectVehicle, setInspectVehicle] = useState<VehicleItem | null>(null);

  const formatCurrency = (val: number) => {
    return formatCurrencyCached(
      val,
      country.locale || (currentCountry === 'DE' ? 'de-DE' : 'en-US'),
      country.currencyCode || 'USD',
      0
    );
  };

  // Monthly estimate at 10% upfront payment (90% balance financed)
  const getMonthlyEstimate = (price: number) => {
    const rate = country.carLoan.defaultRate || 5.85;
    const termYears = country.carLoan.defaultTerm || 5;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = termYears * 12;
    const financedBalance = price * 0.90; // Only 10% down
    const monthly =
      (financedBalance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return formatCurrency(Math.round(monthly));
  };

  // Categories from vehicles
  const categories = useMemo(() => {
    const set = new Set<string>();
    WORLDWIDE_VEHICLES.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return ['all', ...Array.from(set)];
  }, []);

  const filteredVehicles = useMemo(() => {
    return WORLDWIDE_VEHICLES.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;

      let matchesBudget = true;
      if (selectedBudget === 'under150k') matchesBudget = v.price < 150000;
      else if (selectedBudget === '150k-250k') matchesBudget = v.price >= 150000 && v.price <= 250000;
      else if (selectedBudget === 'over250k') matchesBudget = v.price > 250000;

      return matchesSearch && matchesCat && matchesBudget;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedBudget, sortBy]);

  return (
    <div className="w-full bg-slate-50/50 py-10 sm:py-16 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Block: Framer / Land-book inspired */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-blue-600 uppercase">
              <Car className="w-4 h-4 text-blue-600" />
              <span>{isGerman ? 'Direkte Autofinanzierung' : 'Prestige Auto Finance Catalogue'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">
                {isGerman ? 'Weltweite Auslieferung' : 'Global Port Delivery'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-950 tracking-tight">
              {isGerman
                ? 'Luxus- & Sportwagen mit nur 10% Anzahlung erwerben'
                : 'Acquire Prestige Vehicles with 10% Upfront Down Payment'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isGerman
                ? `20 handverlesene Sportwagen, Luxus-SUVs und Grand Tourer. 90% Bilanzfinanzierung direkt über Aureus Treasury in ${country.name} (${country.currency}).`
                : `20 curated performance supercars, luxury SUVs, and grand tourers. 90% financed directly by Aureus Treasury in ${country.name} (${country.currency}).`}
            </p>
          </div>

          {/* Quick Stats Pill Island */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {isGerman ? 'Anzahlung' : 'Min. Down Payment'}
              </div>
              <div className="text-lg font-serif font-bold text-blue-600">
                10% <span className="text-xs text-slate-600 font-sans font-normal">{isGerman ? 'zu Beginn' : 'to acquire'}</span>
              </div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                {isGerman ? 'Treasury Satz' : 'Financing APR'}
              </div>
              <div className="text-lg font-serif font-bold text-slate-900">
                {country.carLoan.defaultRate.toFixed(2)}% <span className="text-xs text-slate-500 font-sans font-normal">Fixed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isGerman
                    ? 'Fahrzeug nach Marke, Modell oder Typ suchen (z.B. Porsche, Aston Martin, Ferrari)...'
                    : 'Search by make, model or performance spec (e.g. Porsche, Aston Martin, Ferrari)...'
                }
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Budget Filters & Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedBudget('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBudget === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Budgets
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBudget('under150k')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBudget === 'under150k' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  &lt; 150k
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBudget('150k-250k')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBudget === '150k-250k' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  150k - 250k
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBudget('over250k')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedBudget === 'over250k' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  250k+
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
              >
                <option value="recommended">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-500 font-mono text-[11px] shrink-0 mr-1">
              {isGerman ? 'Kategorie:' : 'Segment:'}
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {cat === 'all'
                    ? isGerman
                      ? 'Alle 20 Fahrzeuge'
                      : 'All 20 Vehicles'
                    : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Delivery Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900">{filteredVehicles.length}</strong> verified luxury vehicles</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Ship className="w-3.5 h-3.5 text-blue-600" />
              <span>Complimentary insured shipping to {country.name}</span>
            </span>
          </div>

          {onOpenCustomBudget && (
            <button
              type="button"
              onClick={onOpenCustomBudget}
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4 cursor-pointer"
            >
              Vehicle not listed? Request custom acquisition →
            </button>
          )}
        </div>

        {/* Vehicle Cards Grid: 16:9 Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVehicles.map((vehicle) => {
            const downPayment = Math.round(vehicle.price * 0.10);
            const financedAmount = Math.round(vehicle.price * 0.90);
            const monthlyPayment = getMonthlyEstimate(vehicle.price);
            const isFav = favoriteVehicleIds.includes(vehicle.id);

            return (
              <div
                key={vehicle.id}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Vehicle Image 16:9 */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                        {vehicle.make}
                      </span>

                      {onToggleFavoriteVehicle && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavoriteVehicle(vehicle.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                            isFav
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/40 text-white hover:bg-black/60'
                          }`}
                          aria-label="Save vehicle to favorites"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Bottom Image Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        10% Down to Drive Away
                      </span>
                      <span className="font-mono text-slate-200 text-[11px]">
                        {vehicle.year || '2026'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {vehicle.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{vehicle.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vehicle.model}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">Ready for Delivery</span>
                      </div>
                    </div>

                    {/* Key Technical Specs Ribbon */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-600">0-60 MPH</div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {vehicle.acceleration || '3.2s'}
                        </div>
                      </div>
                      <div className="border-x border-slate-200">
                        <div className="text-[10px] font-mono uppercase text-slate-600">Power</div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {vehicle.hp ? `${vehicle.hp} HP` : '650 HP'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-600">Drivetrain</div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5 truncate px-1">
                          {vehicle.drivetrain || 'AWD'}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & 10% Down Breakdown Box */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-600 font-medium">Acquisition Price:</span>
                        <span className="text-xl font-serif font-bold text-slate-900">
                          {formatCurrency(vehicle.price)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
                        <span className="text-blue-900 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                          10% Down Payment:
                        </span>
                        <span className="font-mono font-bold text-blue-700 text-sm">
                          {formatCurrency(downPayment)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Treasury Financed (90%):</span>
                        <span className="font-mono font-semibold">{formatCurrency(financedAmount)}</span>
                      </div>

                      <div className="pt-1.5 flex items-center justify-between text-xs font-medium text-slate-800">
                        <span>Estimated Repayment:</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{monthlyPayment}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => setInspectVehicle(vehicle)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-600" />
                    <span>Specs & Port</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApplyForVehicle(vehicle)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply for Finance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vehicle Spec & Delivery Modal */}
        {inspectVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
              {/* Modal Top */}
              <div className="relative aspect-[16/9] w-full bg-slate-900">
                <img
                  src={inspectVehicle.imageUrl}
                  alt={inspectVehicle.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setInspectVehicle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs uppercase font-mono tracking-wider text-blue-300">
                    {inspectVehicle.make} · {inspectVehicle.category}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    {inspectVehicle.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Acquisition</div>
                    <div className="text-base font-serif font-bold text-slate-900 mt-0.5">
                      {formatCurrency(inspectVehicle.price)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                    <div className="text-[10px] font-mono text-blue-700 uppercase">10% Down</div>
                    <div className="text-base font-serif font-bold text-blue-700 mt-0.5">
                      {formatCurrency(inspectVehicle.price * 0.10)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">0-60 Time</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {inspectVehicle.acceleration || '3.2s'}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Power Output</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">
                      {inspectVehicle.hp ? `${inspectVehicle.hp} HP` : '650 HP'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Vehicle Overview</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {inspectVehicle.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Ship className="w-4 h-4 text-blue-600" />
                    <span>Global Port Delivery Logistics ({country.name})</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vehicles are delivered fully certified and registered with comprehensive marine transit insurance. Direct handover at customs or enclosed transporter delivery to your private garage.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setInspectVehicle(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const v = inspectVehicle;
                    setInspectVehicle(null);
                    onApplyForVehicle(v);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Lock In 10% Down & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
