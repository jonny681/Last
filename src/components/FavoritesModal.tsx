import React from 'react';
import { CountryCode, PropertyItem, VehicleItem } from '../types';
import { COUNTRIES } from '../data/translations';
import {
  X,
  Bookmark,
  Home,
  Car,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Check
} from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: CountryCode;
  favoritePropertyIds: string[];
  favoriteVehicleIds: string[];
  properties: PropertyItem[];
  vehicles: VehicleItem[];
  onOpenPreApprovalForAsset: (asset: { type: 'home' | 'car'; id: string; title: string; price: number; imageUrl?: string }) => void;
  onToggleFavoriteProperty: (id: string) => void;
  onToggleFavoriteVehicle: (id: string) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  favoritePropertyIds,
  favoriteVehicleIds,
  properties,
  vehicles,
  onOpenPreApprovalForAsset,
  onToggleFavoriteProperty,
  onToggleFavoriteVehicle,
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

  const favoriteProperties = properties.filter((p) => favoritePropertyIds.includes(p.id));
  const favoriteVehicles = vehicles.filter((v) => favoriteVehicleIds.includes(v.id));
  const totalFavorites = favoriteProperties.length + favoriteVehicles.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] text-slate-900">
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
            <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
            <span>{isGerman ? 'Ihre gemerkten Favoriten' : 'Saved Portfolio'} ({totalFavorites})</span>
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
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {totalFavorites === 0 ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <Bookmark className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-base font-serif font-bold text-slate-900">
                {isGerman ? 'Keine Favoriten gespeichert' : 'No assets saved yet'}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {isGerman
                  ? 'Speichern Sie Immobilien oder Fahrzeuge, um sie für den schnellen Vergleich zu sichern.'
                  : 'Save any of our residences or vehicles to keep them for quick comparison and instant pre-approval.'}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{isGerman ? 'Katalog durchsuchen' : 'Browse Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Properties */}
              {favoriteProperties.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider flex items-center gap-2">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>{isGerman ? 'Gespeicherte Immobilien' : 'Saved Luxury Residences'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteProperties.map((prop) => (
                      <div
                        key={prop.id}
                        className="rounded-2xl bg-white border border-slate-200 p-3.5 flex gap-3 shadow-xs relative group"
                      >
                        <img
                          src={prop.imageUrl}
                          alt={prop.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-blue-600 font-semibold">{prop.tag}</div>
                            <div className="text-xs font-serif font-bold text-slate-900 truncate">{prop.title}</div>
                            <div className="text-xs font-mono text-blue-700 font-bold">{formatCurrency(prop.price)}</div>
                            <div className="text-[10px] text-slate-600 font-mono">10% Down: {formatCurrency(prop.price * 0.1)}</div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenPreApprovalForAsset({ type: 'home', id: prop.id, title: prop.title, price: prop.price, imageUrl: prop.imageUrl });
                              }}
                              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                            >
                              {isGerman ? 'Vorabgenehmigung (Jetzt)' : 'Get Pre-Approved Now'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleFavoriteProperty(prop.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-auto cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicles */}
              {favoriteVehicles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span>{isGerman ? 'Gespeicherte Fahrzeuge' : 'Saved Prestige Vehicles'}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteVehicles.map((veh) => (
                      <div
                        key={veh.id}
                        className="rounded-2xl bg-white border border-slate-200 p-3.5 flex gap-3 shadow-xs relative group"
                      >
                        <img
                          src={veh.imageUrl}
                          alt={veh.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] font-mono text-blue-600 font-semibold">{veh.tag}</div>
                            <div className="text-xs font-serif font-bold text-slate-900 truncate">{veh.title}</div>
                            <div className="text-xs font-mono text-blue-700 font-bold">{formatCurrency(veh.price)}</div>
                            <div className="text-[10px] text-slate-600 font-mono">10% Down: {formatCurrency(veh.price * 0.1)}</div>
                          </div>
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenPreApprovalForAsset({ type: 'car', id: veh.id, title: veh.title, price: veh.price, imageUrl: veh.imageUrl });
                              }}
                              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                            >
                              {isGerman ? 'Vorabgenehmigung (Jetzt)' : 'Get Pre-Approved Now'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleFavoriteVehicle(veh.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-auto cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <span>{totalFavorites} {isGerman ? 'Favoriten' : 'items saved'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 shadow-xs cursor-pointer"
          >
            {isGerman ? 'Schließen' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
