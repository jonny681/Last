export interface InvestmentTierConfig {
  id: string;
  price: 10000 | 25000 | 50000 | 100000;
  name: string;
  tier: string;
  badge: string;
  collateralBacking: string;
  description: string;
  rates: {
    12: {
      yieldTotal: number;
      gain: number;
      ratePercent: number; // APY
      monthlyPayout: number;
    };
    6: {
      yieldTotal: number;
      gain: number;
      ratePercent: number; // 6m rate
      monthlyPayout: number;
    };
  };
  highlights: string[];
}

export const INVESTMENT_TIERS: InvestmentTierConfig[] = [
  {
    id: 'tier-10k',
    price: 10000,
    name: 'Prime Starter Asset Pool',
    tier: 'Tier I · $10,000 Facility',
    badge: 'Popular for Immediate High Yield',
    collateralBacking: '100% Backed by Physical Title to Prime Residential Homes & Luxury Cars',
    description: 'Direct high-yield asset-backed capital deployment secured against prime residences and prestige luxury vehicles. Earn while you sleep with automated payouts.',
    rates: {
      12: {
        yieldTotal: 19316,
        gain: 9316,
        ratePercent: 93.16,
        monthlyPayout: 776,
      },
      6: {
        yieldTotal: 14658,
        gain: 4658,
        ratePercent: 46.58,
        monthlyPayout: 776,
      },
    },
    highlights: [
      'Guaranteed $19,316 total payout at 12 months ($14,658 at 6 months)',
      'Earn while you sleep: $776/month passive payouts directly to your bank account',
      'Directly collateralised by prime real estate mortgages and luxury car titles',
      'Zero management or withdrawal fees upon term completion',
      'Eligible for custom high-yield private retirement structuring',
    ],
  },
  {
    id: 'tier-25k',
    price: 25000,
    name: 'Prestige Growth Capital',
    tier: 'Tier II · $25,000 Facility',
    badge: 'Balanced Growth & Monthly Payouts',
    collateralBacking: 'Senior Title Liens on Luxury Vehicles & Architectural Residences',
    description: 'Strategic private liquidity note deployed into our top-tier prime home purchases and supercar financing portfolios with priority capital clearing.',
    rates: {
      12: {
        yieldTotal: 35318,
        gain: 10318,
        ratePercent: 41.27,
        monthlyPayout: 860,
      },
      6: {
        yieldTotal: 30159,
        gain: 5159,
        ratePercent: 20.64,
        monthlyPayout: 860,
      },
    },
    highlights: [
      'Guaranteed $35,318 total payout at 12 months ($30,159 at 6 months)',
      'Predictable monthly yield distributions of $860/mo direct to your bank account',
      'Over-collateralised with physical vehicle titles and recorded first mortgages',
      'Full capital loss protection reserve fund coverage',
      'Personal portfolio liaison and dedicated liquidity options',
    ],
  },
  {
    id: 'tier-50k',
    price: 50000,
    name: 'Sovereign Portfolio Partner',
    tier: 'Tier III · $50,000 Facility',
    badge: 'High-Volume Balance Sheet Allocation',
    collateralBacking: 'Multi-Asset Prime Home Mortgages & Luxury Fleet Securities',
    description: 'Institutional-grade investment allocation funding multiple luxury property originations and high-demand exotic automobile acquisitions.',
    rates: {
      12: {
        yieldTotal: 69813,
        gain: 19813,
        ratePercent: 39.63,
        monthlyPayout: 1651,
      },
      6: {
        yieldTotal: 59907,
        gain: 9907,
        ratePercent: 19.81,
        monthlyPayout: 1651,
      },
    },
    highlights: [
      'Guaranteed $69,813 total payout at 12 months ($59,907 at 6 months)',
      'High monthly cash distribution of $1,651/mo direct to bank account',
      'Comprehensive 150% asset backing coverage on homes and performance cars',
      'Quarterly performance audits and verified collateral documentation',
      'Tailored retirement transition planning with zero tax friction',
    ],
  },
  {
    id: 'tier-100k',
    price: 100000,
    name: 'Institutional Private Wealth & Retirement Fund',
    tier: 'Tier IV · $100,000 Master Facility',
    badge: 'Maximum Wealth Structuring & Retirement Planning',
    collateralBacking: 'Aureus Sovereign Balance Sheet + Dedicated Capital Loss Reserve + Senior Asset Liens',
    description: 'Our premier bespoke private wealth facility. Let us structure your complete passive wealth generation and secure high-yield retirement plan.',
    rates: {
      12: {
        yieldTotal: 130528,
        gain: 30528,
        ratePercent: 30.53,
        monthlyPayout: 2544,
      },
      6: {
        yieldTotal: 115264,
        gain: 15264,
        ratePercent: 15.26,
        monthlyPayout: 2544,
      },
    },
    highlights: [
      'Guaranteed $130,528 total payout at 12 months ($115,264 at 6 months)',
      'Substantial $2,544/mo passive monthly earnings while you sleep',
      'Full private retirement plan structuring with Aureus Senior Treasury Partner',
      'First-rank senior priority on all portfolio home and car cashflows',
      'Dedicated bespoke liquidity window and multi-currency payout options',
    ],
  },
];

export interface InvestmentCalculationResult {
  principal: number;
  months: 6 | 12;
  ratePercent: number;
  monthlyPayout: number;
  totalInterest: number;
  totalReturn: number;
  collateralCoverageValue: number;
}

export function calculateTierYield(
  price: number,
  months: 6 | 12
): InvestmentCalculationResult {
  const tier = INVESTMENT_TIERS.find((t) => t.price === price) || INVESTMENT_TIERS[0];
  const rateData = tier.rates[months];

  return {
    principal: tier.price,
    months,
    ratePercent: rateData.ratePercent,
    monthlyPayout: rateData.monthlyPayout,
    totalInterest: rateData.gain,
    totalReturn: rateData.yieldTotal,
    collateralCoverageValue: tier.price * 1.5,
  };
}

// Compatibility exports
export const INVESTMENT_PLANS = INVESTMENT_TIERS.map((tier) => ({
  id: tier.id,
  name: tier.name,
  tier: tier.tier,
  apy: tier.rates[12].ratePercent,
  durationMonths: 12,
  minInvestment: tier.price,
  maxInvestment: tier.price * 5,
  payoutFrequency: 'Monthly',
  riskRating: 'Secured Tier 1',
  description: tier.description,
  highlights: tier.highlights,
  badge: tier.badge,
}));

export function calculateInvestmentReturns(
  amount: number,
  apy: number,
  durationMonths: number
): InvestmentCalculationResult {
  const months = (durationMonths === 6 ? 6 : 12) as 6 | 12;
  const closestTier = INVESTMENT_TIERS.find((t) => t.price === amount) || INVESTMENT_TIERS[0];
  return calculateTierYield(closestTier.price, months);
}
