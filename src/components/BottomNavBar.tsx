import React from 'react';
import { CountryCode } from '../types';
import { Home, Car, TrendingUp, Banknote, User } from 'lucide-react';

export type BottomNavTab = 'home-loans' | 'car-loans' | 'investment' | 'cash-loan';

interface BottomNavBarProps {
  currentCountry: CountryCode;
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  inboxCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentCountry,
  activeTab,
  onSelectTab,
  inboxCount = 0,
}) => {
  const isGerman = currentCountry === 'DE';

  const navItems = [
    {
      id: 'home-loans' as BottomNavTab,
      label: isGerman ? 'Immobilien' : 'Home Loan',
      sublabel: isGerman ? '10% Anzahlung' : '10% Down',
      icon: Home,
      badge: 0,
    },
    {
      id: 'car-loans' as BottomNavTab,
      label: isGerman ? 'Autokredite' : 'Car Loan',
      sublabel: isGerman ? '10% Anzahlung' : '10% Down',
      icon: Car,
      badge: 0,
    },
    {
      id: 'investment' as BottomNavTab,
      label: isGerman ? 'Anlagepläne' : 'Investment',
      sublabel: isGerman ? 'Zinsrendite' : '8.4% - 15.6% APY',
      icon: TrendingUp,
      badge: 0,
    },
    {
      id: 'cash-loan' as BottomNavTab,
      label: isGerman ? 'Barkredit' : 'Cash Loan',
      sublabel: isGerman ? '24h Auszahlung' : '24h Payout',
      icon: Banknote,
      badge: inboxCount > 0 ? inboxCount : 0,
    },
  ];

  return (
    <nav
      aria-label="Down navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg pb-[max(env(safe-area-inset-bottom),10px)] pt-2 transition-all"
    >
      <div className="max-w-2xl mx-auto px-2 sm:px-6">
        <div className="flex items-center justify-around gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer group ${
                  isActive
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-label={item.label}
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 rounded-full bg-slate-900" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 text-slate-900' : 'group-hover:scale-105'
                    }`}
                  />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] sm:text-[11px] mt-0.5 font-medium tracking-tight text-center truncate w-full ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
