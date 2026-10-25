import React, { useState, useRef, useEffect } from 'react';
import { PropertyItem, CountryCode, HomePerspective } from '../types';
import { COUNTRIES } from '../data/translations';
import { HOME2_PERSPECTIVES } from '../data/homePerspectives';
import {
  X,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Compass,
  ArrowRight,
  MapPin,
  Grid,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';

export interface WalkInSpace {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  category: 'exterior' | 'living' | 'master' | 'kitchen' | 'bath';
  cloudinaryPublicId: string;
  embedUrl: string;
  videoUrl: string;
  localVideoUrl: string;
  imageUrl: string;
  description: string;
}

export const UK_PROP_2_WALK_IN_SPACES: WalkInSpace[] = [
  {
    id: 'exterior',
    label: 'Exterior of the house',
    shortLabel: 'Exterior',
    icon: '🏡',
    category: 'exterior',
    cloudinaryPublicId: '07df0615-e9d1-49a3-b236-506fca587c4d',
    embedUrl: 'https://player.cloudinary.com/embed/?cloud_name=tjs47oss&public_id=07df0615-e9d1-49a3-b236-506fca587c4d',
    videoUrl: 'https://res.cloudinary.com/tjs47oss/video/upload/07df0615-e9d1-49a3-b236-506fca587c4d.mp4',
    localVideoUrl: '/videos/home2/exterior.mp4',
    imageUrl: '/videos/home2/exterior.jpg',
    description: 'Grand architectural exterior facade, landscaped grounds, and stone motor court arrival.',
  },
  {
    id: 'living',
    label: 'Living Room',
    shortLabel: 'Living Room',
    icon: '🛋️',
    category: 'living',
    cloudinaryPublicId: '67a99d41-c4cc-4a24-8748-9658be4d6bb9',
    embedUrl: 'https://player.cloudinary.com/embed/?cloud_name=tjs47oss&public_id=67a99d41-c4cc-4a24-8748-9658be4d6bb9',
    videoUrl: 'https://res.cloudinary.com/tjs47oss/video/upload/67a99d41-c4cc-4a24-8748-9658be4d6bb9.mp4',
    localVideoUrl: '/videos/home2/living.mp4',
    imageUrl: '/videos/home2/living.jpg',
    description: 'Expansive formal reception salon with panoramic glazing, ambient cove illumination, and contemporary designer furnishings.',
  },
  {
    id: 'master',
    label: 'Master Bedroom',
    shortLabel: 'Master Bedroom',
    icon: '🛏️',
    category: 'master',
    cloudinaryPublicId: 'Creating_luxury_master_bedroom_v__20261010222936',
    embedUrl: 'https://player.cloudinary.com/embed/?cloud_name=tjs47oss&public_id=Creating_luxury_master_bedroom_v__20261010222936',
    videoUrl: 'https://res.cloudinary.com/tjs47oss/video/upload/Creating_luxury_master_bedroom_v__20261010222936.mp4',
    localVideoUrl: '/videos/home2/master.mp4',
    imageUrl: '/videos/home2/master.jpg',
    description: 'Primary luxury master suite with upholstered king bedstead, integrated reading sconces, and serene retreat ambiance.',
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    shortLabel: 'Kitchen',
    icon: '🍳',
    category: 'kitchen',
    cloudinaryPublicId: '3cf8de56-0677-4e26-9a9d-dd87e6c4f085',
    embedUrl: 'https://player.cloudinary.com/embed/?cloud_name=tjs47oss&public_id=3cf8de56-0677-4e26-9a9d-dd87e6c4f085',
    videoUrl: 'https://res.cloudinary.com/tjs47oss/video/upload/3cf8de56-0677-4e26-9a9d-dd87e6c4f085.mp4',
    localVideoUrl: '/videos/home2/kitchen.mp4',
    imageUrl: '/videos/home2/kitchen.jpg',
    description: 'Gourmet culinary studio featuring seamless solid surface countertops, custom minimalist cabinetry, and premium appliances.',
  },
  {
    id: 'bath',
    label: 'Bathroom',
    shortLabel: 'Bathroom',
    icon: '🛁',
    category: 'bath',
    cloudinaryPublicId: '562df68d-6da5-43d2-8918-f0355bca8fb5',
    embedUrl: 'https://player.cloudinary.com/embed/?cloud_name=tjs47oss&public_id=562df68d-6da5-43d2-8918-f0355bca8fb5',
    videoUrl: 'https://res.cloudinary.com/tjs47oss/video/upload/562df68d-6da5-43d2-8918-f0355bca8fb5.mp4',
    localVideoUrl: '/videos/home2/bath.mp4',
    imageUrl: '/videos/home2/bath.jpg',
    description: 'Spa bathroom with contemporary stone vanity, frameless glass rain shower, and ambient relaxation illumination.',
  },
];

interface WalkIn3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyItem;
  currentCountry: CountryCode;
  onSelectAsset?: (type: 'home', item: PropertyItem) => void;
  onNavigateToCalculator?: () => void;
  onOpenPreApproval?: (asset: { type: 'home'; id: string; title: string; price: number; imageUrl?: string }) => void;
}

export const WalkIn3DModal: React.FC<WalkIn3DModalProps> = ({
  isOpen,
  onClose,
  property,
  currentCountry,
  onSelectAsset,
  onNavigateToCalculator,
  onOpenPreApproval,
}) => {
  // Use property perspectives or default to the 15 home perspectives generated from video
  const perspectives: HomePerspective[] = property.perspectives && property.perspectives.length > 0
    ? property.perspectives
    : HOME2_PERSPECTIVES;

  // View mode: 'perspectives' (default: 15 pics from video), 'grid', 'spaces', 'video'
  const [viewMode, setViewMode] = useState<'perspectives' | 'grid' | 'spaces' | 'video'>('perspectives');
  const [activePerspIndex, setActivePerspIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<'all' | 'exterior' | 'living' | 'master' | 'kitchen' | 'bath'>('all');
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const country = COUNTRIES[currentCountry];
  const isGerman = currentCountry === 'DE';
  const spaces = UK_PROP_2_WALK_IN_SPACES;
  const currentSpace = spaces[activeSpaceIndex] || spaces[0];

  const filteredPerspectives = filterCategory === 'all'
    ? perspectives
    : perspectives.filter((p) => p.category === filterCategory);

  const currentPerspective = perspectives[activePerspIndex] || perspectives[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(country.locale, {
      style: 'currency',
      currency: country.currencyCode,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const upfrontAmount = Math.round(property.price * 0.1);
  const financedAmount = property.price - upfrontAmount;

  // Slideshow auto-advance every 3.5 seconds
  useEffect(() => {
    if (!isSlideshowPlaying || viewMode !== 'perspectives') return;
    const interval = setInterval(() => {
      setActivePerspIndex((prev) => (prev < perspectives.length - 1 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [isSlideshowPlaying, viewMode, perspectives.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (viewMode === 'perspectives') {
          setActivePerspIndex((prev) => (prev < perspectives.length - 1 ? prev + 1 : 0));
        } else if (viewMode === 'spaces') {
          setActiveSpaceIndex((prev) => (prev < spaces.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowLeft') {
        if (viewMode === 'perspectives') {
          setActivePerspIndex((prev) => (prev > 0 ? prev - 1 : perspectives.length - 1));
        } else if (viewMode === 'spaces') {
          setActiveSpaceIndex((prev) => (prev > 0 ? prev - 1 : spaces.length - 1));
        }
      } else if (e.key === 'Escape') {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullScreen, onClose, viewMode, perspectives.length, spaces.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div
        ref={containerRef}
        className={`relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[94vh] ${
          isFullScreen ? 'fixed inset-0 max-w-none max-h-none rounded-none border-none z-50' : ''
        }`}
      >
        {/* Top Header & Mode Switcher Bar - Clean White & Blue */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold uppercase tracking-wider">
                  15 Perspectives · Video Extracted
                </span>
                <span className="text-xs font-serif font-bold text-slate-900 truncate">
                  {property.title}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{property.location}</span>
                <span>·</span>
                <span className="text-blue-700 font-semibold">
                  {viewMode === 'perspectives'
                    ? `Perspective ${currentPerspective.number} of 15`
                    : currentSpace.label}
                </span>
              </div>
            </div>
          </div>

          {/* Primary View Mode Switcher: 15 Perspectives (from video) vs Grid vs Spaces */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('perspectives')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'perspectives'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="15 Perspectives Studio generated directly from 4K Video"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>15 Perspectives (From Video)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="View all 15 perspectives simultaneously in grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid (All 15)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('spaces')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'spaces'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="View by 5 Interior Rooms"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>5 Rooms</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('video')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Play source walkthrough video"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Source Video</span>
            </button>
          </div>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-blue-400 flex items-center justify-center transition-colors cursor-pointer"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode 1: 15 Perspectives Interactive Studio (DEFAULT) */}
        {viewMode === 'perspectives' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Viewport Frame */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden select-none group shrink-0">
              <img
                key={currentPerspective.id}
                src={currentPerspective.imageUrl}
                alt={currentPerspective.title}
                className="w-full h-full object-cover animate-in fade-in duration-200"
              />

              {/* Top Gradient Badge Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Perspective {currentPerspective.number} / 15</span>
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono border border-white/20">
                    {currentPerspective.cameraPerspective}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      isSlideshowPlaying
                        ? 'bg-blue-600 text-white'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                  >
                    {isSlideshowPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>{isSlideshowPlaying ? 'Pause Slideshow' : 'Autoplay (3.5s)'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pointer-events-none">
                <div className="max-w-3xl">
                  <h4 className="text-base sm:text-lg font-serif font-bold text-white drop-shadow-md">
                    {currentPerspective.title}
                  </h4>
                  <p className="text-xs text-slate-200 font-sans mt-0.5 line-clamp-2 drop-shadow-sm">
                    {currentPerspective.description}
                  </p>
                </div>
              </div>

              {/* Prev / Next Floating Arrows */}
              <button
                type="button"
                onClick={() => setActivePerspIndex((prev) => (prev > 0 ? prev - 1 : perspectives.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105"
                title="Previous Perspective"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActivePerspIndex((prev) => (prev < perspectives.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105"
                title="Next Perspective"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Chips & 15 Thumbnail Ribbon */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium pb-1">
                  <span className="text-slate-500 font-mono text-[11px] mr-1">Filter:</span>
                  {[
                    { id: 'all', label: 'All 15' },
                    { id: 'exterior', label: '🏡 Exterior (1-3)' },
                    { id: 'living', label: '🛋️ Living (4-6)' },
                    { id: 'master', label: '🛏️ Master (7-9)' },
                    { id: 'kitchen', label: '🍳 Kitchen (10-12)' },
                    { id: 'bath', label: '🛁 Bath (13-15)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilterCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                        filterCategory === cat.id
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-slate-500 shrink-0">
                  {currentPerspective.number} / 15
                </div>
              </div>

              {/* 15 Thumbnails Strip */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                {perspectives.map((p, idx) => {
                  const isActive = idx === activePerspIndex;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePerspIndex(idx)}
                      className={`relative shrink-0 w-20 h-13 rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                        isActive
                          ? 'border-blue-600 ring-2 ring-blue-400/50 scale-105 shadow-sm'
                          : 'border-slate-300 hover:border-blue-400 opacity-75 hover:opacity-100'
                      }`}
                      title={`${p.number}. ${p.title}`}
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[9px] font-mono font-bold leading-none ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-black/70 text-white'
                      }`}>
                        #{p.number}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Grid Overview of All 15 Perspectives */}
        {viewMode === 'grid' && (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-4 bg-slate-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h4 className="text-base font-serif font-bold text-slate-900">
                  All 15 Architectural Perspectives
                </h4>
                <p className="text-xs text-slate-500">
                  Extracted from high-definition 4K walkthrough video angles. Click any card to inspect full view.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                15 Perspectives Total
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {perspectives.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePerspIndex(idx);
                    setViewMode('perspectives');
                  }}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold shadow-xs">
                      #{p.number}
                    </span>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-blue-600 font-semibold uppercase">
                        {p.category}
                      </span>
                      <h5 className="text-xs font-medium text-slate-900 line-clamp-2 mt-0.5 group-hover:text-blue-600 transition-colors">
                        {p.title}
                      </h5>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      Inspect View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode 3: 5 Interior & Exterior Spaces */}
        {viewMode === 'spaces' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden select-none shrink-0">
              <img
                src={currentSpace.imageUrl}
                alt={currentSpace.label}
                className="w-full h-full object-cover animate-in fade-in duration-200"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">
                  {currentSpace.icon} {currentSpace.label}
                </span>
                <p className="text-xs text-slate-200 mt-1 max-w-2xl">
                  {currentSpace.description}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              {spaces.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSpaceIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    idx === activeSpaceIndex
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode 4: Source Video Player (Secondary / Optional Reference) */}
        {viewMode === 'video' && (
          <div className="relative aspect-[16/9] w-full bg-black overflow-hidden select-none shrink-0">
            <video
              ref={videoRef}
              src={property.fullWalkthroughVideoUrl || '/videos/home2/walkthrough_clipped.mp4'}
              poster={currentSpace.imageUrl}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Information & Action Footer Section - White & Blue Luxury */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 bg-white flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  {property.tag}
                </span>
                <span className="text-xs font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {property.type}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                {property.title} · {viewMode === 'perspectives' ? currentPerspective.title : currentSpace.label}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                {viewMode === 'perspectives' ? currentPerspective.description : currentSpace.description}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tabular-nums">
                {formatCurrency(property.price)}
              </div>
              <div className="text-xs font-mono text-blue-700 font-semibold mt-0.5">
                {isGerman ? '10% Anzahlung: ' : '10% Down Payment: '}
                <span className="text-slate-900 font-bold">{formatCurrency(upfrontAmount)}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {isGerman ? '90% Darlehen: ' : '90% Financed: '} {formatCurrency(financedAmount)}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {isGerman ? 'Schließen' : 'Close'}
            </button>
            {onOpenPreApproval && (
              <button
                type="button"
                onClick={() => {
                  if (onSelectAsset) onSelectAsset('home', property);
                  onClose();
                  onOpenPreApproval({
                    type: 'home',
                    id: property.id,
                    title: property.title,
                    price: property.price,
                    imageUrl: currentPerspective.imageUrl || property.imageUrl,
                  });
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>{isGerman ? 'Vorabgenehmigung anfordern' : 'Get Pre-Approved for this Home'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigateToCalculator && (
              <button
                type="button"
                onClick={() => {
                  if (onSelectAsset) onSelectAsset('home', property);
                  onClose();
                  onNavigateToCalculator();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{isGerman ? 'Darlehensrechner' : 'Model 10% Down Loan'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
