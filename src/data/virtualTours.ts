import { VirtualTourRoom, InteriorPhoto, SuggestedRoomSpec, PropertyItem } from '../types';

export interface RoomSetup {
  living: {
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
    hotspots: { x: number; y: number; title: string; detail: string }[];
  };
  kitchen: {
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
    hotspots: { x: number; y: number; title: string; detail: string }[];
  };
  master: {
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
    hotspots: { x: number; y: number; title: string; detail: string }[];
  };
  bath: {
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
    hotspots: { x: number; y: number; title: string; detail: string }[];
  };
  terrace: {
    name: string;
    description: string;
    imageUrl: string;
    features: string[];
    hotspots: { x: number; y: number; title: string; detail: string }[];
  };
}

// 20 completely distinct room configurations (1 to 20) with verified high-resolution architectural photography
// CRITICAL: ZERO humans/people in any photo. 100% pristine luxury interior/exterior photography.
export const ROOM_SETUPS_20: RoomSetup[] = [
  {
    "living": {
      "name": "Panoramic Living Salon",
      "description": "Expansive formal salon with 10-metre motorized glass pocket sliders opening directly to landscaped private grounds.",
      "imageUrl": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Floor-to-Ceiling Slimline Glazing",
        "Linear Bioethanol Fireplace",
        "Integrated Architectural Acoustics"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 50,
          "title": "Motorized Glazing",
          "detail": "Triple-glazed thermal acoustic pocket sliders opening to exterior terrace."
        },
        {
          "x": 80,
          "y": 40,
          "title": "Bespoke Joinery",
          "detail": "Smoked eucalyptus cabinetry with integrated climate wine cellar."
        }
      ]
    },
    "kitchen": {
      "name": "Gaggenau 400 Minimalist Quartzite Studio",
      "description": "Pristine architectural kitchen with monolithic waterfall island, Gaggenau 400 induction series, and concealed prep pantry.",
      "imageUrl": "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Taj Mahal Quartzite Waterfall Island",
        "Full Gaggenau 400 Series Suite",
        "Concealed Butler Walk-In Pantry"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 55,
          "title": "Waterfall Island",
          "detail": "Single-slab seamless quartzite with undermount prep sink and flush induction."
        },
        {
          "x": 65,
          "y": 35,
          "title": "Integrated Ventilation",
          "detail": "Ceiling-flush extraction array with ambient LED halo illumination."
        }
      ]
    },
    "master": {
      "name": "Primary Sanctuary & Suede Suite",
      "description": "Secluded primary wing featuring acoustic suede wall panels, walk-in dressing lounge by Poliform, and morning balcony.",
      "imageUrl": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Acoustic Suede Wall Panels",
        "Dual Poliform Dressing Suites",
        "Private Outlook Balcony"
      ],
      "hotspots": [
        {
          "x": 28,
          "y": 58,
          "title": "King Bespoke Bedstead",
          "detail": "Custom upholstered headboard with integrated wireless charging and mood lighting."
        },
        {
          "x": 74,
          "y": 42,
          "title": "Dressing Lounge",
          "detail": "Backlit smoked glass wardrobes with biometric jewellery vault."
        }
      ]
    },
    "bath": {
      "name": "Primary Spa Suite & Soaking Tub",
      "description": "Monolithic marble retreat with freestanding soaking tub overlooking private lightwell courtyard and dual rain showers.",
      "imageUrl": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Freestanding Composite Tub",
            "Dual Calacatta Marble Vanities",
            "Thermostatic Ceiling Rain Heads"
      ],
      "hotspots": [
            {
                  "x": 45,
                  "y": 55,
                  "title": "Soaking Tub",
                  "detail": "Matte composite oval tub with floor-mounted brushed brass tap."
            },
            {
                  "x": 75,
                  "y": 45,
                  "title": "Dual Vanity",
                  "detail": "Floating marble vanity with backlit anti-fog mirrors."
            }
      ]
},
    "terrace": {
      "name": "Skyline Terrace & Reflection Pool",
      "description": "Private rooftop terrace featuring heated saltwater reflection pool, outdoor kitchen pavilion, and open skyline vistas.",
      "imageUrl": "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Heated Saline Reflection Plunge Pool",
        "Viking Outdoor BBQ Pavilion",
        "Ipe Hardwood Decking"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 68,
          "title": "Reflection Plunge Pool",
          "detail": "Saline filtration with underwater LED illumination."
        },
        {
          "x": 82,
          "y": 52,
          "title": "Outdoor Dining Pergola",
          "detail": "Marine-grade stainless BBQ and refrigeration."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Woodland Atrium Great Hall",
      "description": "Double-height cedar timber and glass great hall framing mature woodland scenery with suspended hearth.",
      "imageUrl": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "22-Foot Double-Height Atrium",
        "Suspended Gyrofocus Hearth",
        "White Oak Plank Flooring"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 45,
          "title": "Suspended Hearth",
          "detail": "360-degree rotating sculptural fireplace with matte black finish."
        },
        {
          "x": 25,
          "y": 60,
          "title": "Atrium Glazing",
          "detail": "Solar-control structural glass walls framing garden canopy."
        }
      ]
    },
    "kitchen": {
      "name": "Calacatta Gold & Brushed Brass Chef Suite",
      "description": "Dramatic bookmatched Calacatta Gold marble kitchen with brushed brass tapware, fluted oak island, and Sub-Zero columns.",
      "imageUrl": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Calacatta Gold Bookmatched Slabs",
        "Custom Brushed Brass Range Hood",
        "Dual Sub-Zero Wine Refrigeration"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Calacatta Center Island",
          "detail": "Deep veined Italian marble with integrated breakfast bar seating."
        },
        {
          "x": 75,
          "y": 38,
          "title": "Dual Convection Ovens",
          "detail": "Touch-screen programmable steam and convection suite."
        }
      ]
    },
    "master": {
      "name": "Vineyard Master Wing & Spa Bath",
      "description": "Expansive private retreat with king upholstered bedstead, direct garden terrace access, and marble spa ensuite.",
      "imageUrl": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "King Designer Bedstead",
        "Limestone Gas Fireplace",
        "Marble Spa Ensuite Bath"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 52,
          "title": "King Master Bed",
          "detail": "Plush organic linen upholstery with integrated acoustic bedhead."
        },
        {
          "x": 68,
          "y": 48,
          "title": "Panoramic Garden Slider",
          "detail": "Seamless threshold to private cedar yoga deck."
        }
      ]
    },
    "bath": {
      "name": "Calacatta Gold Ensuite Bath",
      "description": "Floor-to-ceiling bookmatched Italian marble with frameless acoustic glass steam shower and heated porcelain floor.",
      "imageUrl": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Bookmatched Calacatta Gold",
            "Integrated Steam Shower",
            "Radiant Underfloor Heating"
      ],
      "hotspots": [
            {
                  "x": 40,
                  "y": 50,
                  "title": "Steam Shower",
                  "detail": "Frameless glass steam room with digital aromatics."
            }
      ]
},
    "terrace": {
      "name": "Landscape Patio & Firepit Lounge",
      "description": "Sunken conversation terrace with linear gas firepit, travertine pavers, and manicured boxwood hedging.",
      "imageUrl": "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Sunken Conversation Lounge",
        "Linear Natural Gas Firepit",
        "Silver Travertine Flagstones"
      ],
      "hotspots": [
        {
          "x": 52,
          "y": 65,
          "title": "Linear Firepit",
          "detail": "Granite-topped gas firepit with lava rock base."
        },
        {
          "x": 25,
          "y": 40,
          "title": "Landscape Lighting",
          "detail": "Automated architectural up-lighting in specimen trees."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Glazed Gallery Formal Salon",
      "description": "Refined salon with restored classical cornice moldings, chevron French oak parquet, and floor-to-ceiling glass atrium.",
      "imageUrl": "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Chevron French Oak Parquet",
        "Restored Classical Cornicing",
        "Floor-to-Ceiling Internal Atrium"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 55,
          "title": "French Oak Parquetry",
          "detail": "Hand-finished wire-brushed chevron oak parquetry."
        },
        {
          "x": 78,
          "y": 42,
          "title": "Gallery Illumination",
          "detail": "Museum-grade continuous LED cove art lighting."
        }
      ]
    },
    "kitchen": {
      "name": "Taj Mahal Quartzite & Fluted Oak Studio",
      "description": "Scandinavian-inspired minimalist culinary center with fluted natural oak millwork and Taj Mahal quartzite waterfall counters.",
      "imageUrl": "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Fluted White Oak Cabinetry",
        "Taj Mahal Satin Quartzite",
        "Miele Generation 7000 Suite"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 52,
          "title": "Fluted Oak Island",
          "detail": "Handcrafted 3D tambour woodwork with concealed push-latches."
        },
        {
          "x": 72,
          "y": 40,
          "title": "Miele Induction Hob",
          "detail": "Full-surface induction with wireless cookware recognition."
        }
      ]
    },
    "master": {
      "name": "Panoramic Ocean Master Retreat",
      "description": "Top-floor primary suite with wall-to-wall glass, linear fireplace, custom headboard wall, and private morning balcony.",
      "imageUrl": "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Custom Upholstered Bed Wall",
        "Linear Gas Fireplace",
        "Frameless Corner Glazing"
      ],
      "hotspots": [
        {
          "x": 30,
          "y": 55,
          "title": "Panoramic Bedstead",
          "detail": "Dual wireless charging pedestals and motorized shade automation."
        },
        {
          "x": 70,
          "y": 45,
          "title": "Morning Balcony Access",
          "detail": "Double sliders leading to cedar morning terrace."
        }
      ]
    },
    "bath": {
      "name": "Minimalist Basalt Stone Spa",
      "description": "Honed volcanic basalt stone walls with recessed linear drain and architectural skylight illumination.",
      "imageUrl": "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Honed Basalt Walls",
            "Architectural Light Shaft",
            "Concealed Water Closet"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 50,
                  "title": "Basalt Vanity",
                  "detail": "Solid carved basalt stone trough sink with matte black wall fixtures."
            }
      ]
},
    "terrace": {
      "name": "Rooftop Penthouse Horizon Terrace",
      "description": "Expansive rooftop terrace with custom Ipe hardwood decking, gas fire bowl, and perimeter glass windbreaks.",
      "imageUrl": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Structural Glass Windbreaks",
        "Natural Gas Fire Bowl",
        "Ipe Hardwood Decking"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 60,
          "title": "Fire Bowl Lounge",
          "detail": "Spherical cast concrete fire bowl with lava stones."
        },
        {
          "x": 80,
          "y": 50,
          "title": "Horizon Vista",
          "detail": "Unobstructed panoramic twilight view."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Contemporary Fireplace Salon",
      "description": "Low-profile modernist salon featuring suspended fireplace, polished microcement floors, and panoramic lake view.",
      "imageUrl": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Suspended Minimalist Fireplace",
        "Polished Microcement Flooring",
        "Acoustic Slatted Wall Panels"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 48,
          "title": "Suspended Fireplace",
          "detail": "Sculptural matte black hearth suspended from 4-metre ceiling."
        },
        {
          "x": 75,
          "y": 42,
          "title": "Acoustic Slats",
          "detail": "American walnut slatted wall system with integrated LED strip."
        }
      ]
    },
    "kitchen": {
      "name": "Smoked Glass & Nero Marquina Atelier",
      "description": "Architectural kitchen with Nero Marquina marble, illuminated smoked glass vitrines, and Dornbracht matte platinum fixtures.",
      "imageUrl": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Nero Marquina Monolithic Island",
        "Smoked Glass Backlit Vitrines",
        "Dornbracht Tara Fixtures"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 54,
          "title": "Nero Marquina Island",
          "detail": "Deep black Spanish marble with striking white calcite veins."
        },
        {
          "x": 74,
          "y": 38,
          "title": "Backlit Vitrines",
          "detail": "Automated sensor-activated interior lighting."
        }
      ]
    },
    "master": {
      "name": "Poliform Dressing Suite & Bedroom",
      "description": "Spacious primary suite featuring Poliform open-bay dressing room, silk-blend wool carpet, and terrace sliders.",
      "imageUrl": "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Poliform Senzafine Dressing Wardrobe",
        "Silk-Blend Wool Carpeting",
        "Full Height Terrace Glazing"
      ],
      "hotspots": [
        {
          "x": 32,
          "y": 56,
          "title": "Primary Bed Suite",
          "detail": "Custom velvet upholstered platform bed with integrated reading sconces."
        },
        {
          "x": 78,
          "y": 44,
          "title": "Dressing Gallery",
          "detail": "Backlit glass wardrobe system with leather-lined accessory drawers."
        }
      ]
    },
    "bath": {
      "name": "Scandinavian Terrazzo & Oak Suite",
      "description": "Custom fluted white oak cabinetry with Venetian terrazzo surfaces and Japanese deep soaking bath.",
      "imageUrl": "https://images.unsplash.com/photo-1600566752734-2a0cd6666ec4?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Venetian Terrazzo",
            "Fluted Oak Millwork",
            "Japanese Soaking Tub"
      ],
      "hotspots": [
            {
                  "x": 48,
                  "y": 52,
                  "title": "Deep Soaking Tub",
                  "detail": "Circulating temperature-controlled deep soaking bath."
            }
      ]
},
    "terrace": {
      "name": "Infinity Edge Heated Pool Deck",
      "description": "Cantilevered infinity lap pool overlooking coastal waters with submerged sun loungers and basalt stone paving.",
      "imageUrl": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "20-Metre Heated Infinity Lap Pool",
        "Submerged Tanning Ledge",
        "Flamed Basalt Stone Pavers"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 65,
          "title": "Infinity Edge",
          "detail": "Zero-edge water fall weir creating continuous reflection of water."
        },
        {
          "x": 85,
          "y": 52,
          "title": "Poolside Cabana",
          "detail": "Weatherproof shade structure with integrated misting fans."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Bouclé Architectural Living Hall",
      "description": "Light-filled great hall with curved bouclé furniture, double-height light wells, and natural limestone fireplace surround.",
      "imageUrl": "https://images.unsplash.com/photo-1543325042-c67825847491?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Curved Architectural Furniture",
        "Natural Limestone Fireplace",
        "Motorized Sky-Lit Atrium"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 52,
          "title": "Limestone Mantel",
          "detail": "Single block of French Saint-Maximin limestone with flush hearth."
        },
        {
          "x": 76,
          "y": 40,
          "title": "Light Well",
          "detail": "Motorized triple-glazed skylight with automated rain sensors."
        }
      ]
    },
    "kitchen": {
      "name": "Architectural Teak & Pietra Grey Kitchen",
      "description": "Custom teak cabinetry matched with Pietra Grey limestone, flush induction cooktop, and hidden walk-in pantry.",
      "imageUrl": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Solid Burmese Teak Joinery",
        "Pietra Grey Limestone Island",
        "Concealed Butler Scullery"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 54,
          "title": "Pietra Grey Island",
          "detail": "Honed charcoal limestone with subtle white veining."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Teak Millwork",
          "detail": "Marine-varnished solid teak with integrated finger-pulls."
        }
      ]
    },
    "master": {
      "name": "Fluted Walnut Master Suite",
      "description": "Warm, textured master retreat with fluted American walnut wall paneling, reading alcove, and private garden patio.",
      "imageUrl": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Fluted Walnut Wall Paneling",
        "Private Reading Alcove",
        "Frameless Corner Glazing"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 54,
          "title": "Walnut Bedhead",
          "detail": "Hand-milled fluted walnut panels concealing ambient perimeter LEDs."
        },
        {
          "x": 75,
          "y": 48,
          "title": "Garden Patio",
          "detail": "Private terrace with Japanese maple and water basin."
        }
      ]
    },
    "bath": {
      "name": "Floor-to-Ceiling Panoramic Glass Bath",
      "description": "Glass-encased master bath suite elevated above private gardens with electronic privacy smart-glass.",
      "imageUrl": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Switchable Privacy Smart-Glass",
            "Cantilevered Stone Tub",
            "Dornbracht Platinum Spouts"
      ],
      "hotspots": [
            {
                  "x": 42,
                  "y": 48,
                  "title": "Smart Glass",
                  "detail": "Instant electrochromic switch from crystal clear to frosted privacy."
            }
      ]
},
    "terrace": {
      "name": "Resort Pool & Sunken Firepit Lounge",
      "description": "Resort-style outdoor oasis with travertine pool deck, sunken circular firepit lounge, and outdoor shower pavilion.",
      "imageUrl": "https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Circular Sunken Firepit",
        "Travertine Pool Surrounds",
        "Cedar Outdoor Rain Shower"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 62,
          "title": "Sunken Firepit",
          "detail": "Circular bench seating for 10 with central gas fire bowl."
        },
        {
          "x": 80,
          "y": 45,
          "title": "Outdoor Shower",
          "detail": "Rain shower head set amidst tropical bamboo screening."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Double-Height Vaulted Great Hall",
      "description": "Stately 7-metre vaulted living hall with exposed steel trusses, polished terrazzo flooring, and floor-to-ceiling glass.",
      "imageUrl": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Exposed Architectural Steel Trusses",
        "Venetian Polished Terrazzo",
        "7-Metre Clear Ceiling Height"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 46,
          "title": "Steel Trusses",
          "detail": "Matte anthracite architectural trusses supporting cathedral roof."
        },
        {
          "x": 25,
          "y": 60,
          "title": "Terrazzo Flooring",
          "detail": "Hand-poured Italian terrazzo with Carrara marble chips."
        }
      ]
    },
    "kitchen": {
      "name": "Penthouse Double-Island Gourmet Suite",
      "description": "Executive kitchen with twin marble islands, walk-through temperature-controlled wine room, and La Cornue range.",
      "imageUrl": "https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Twin Calacatta Marble Islands",
        "Walk-Through Wine Cellar",
        "La Cornue Château Range"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 55,
          "title": "Prep Island",
          "detail": "Dual under-mount copper prep sinks and pull-out cutting boards."
        },
        {
          "x": 78,
          "y": 40,
          "title": "Glass Wine Room",
          "detail": "Climate-controlled 600-bottle illuminated wine vault."
        }
      ]
    },
    "master": {
      "name": "Skyline Penthouse Master Suite",
      "description": "Penthouse-level master sanctuary with panoramic urban skyline views, fireplace, and boutique dressing room.",
      "imageUrl": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "270-Degree City Skyline Views",
        "Dual Sided Glass Fireplace",
        "Custom Boutique Wardrobes"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 52,
          "title": "Skyline Bedstead",
          "detail": "Oriented toward city views with automated privacy blinds."
        },
        {
          "x": 74,
          "y": 46,
          "title": "Fireplace Divider",
          "detail": "See-through glass fireplace connecting bedroom and ensuite."
        }
      ]
    },
    "bath": {
      "name": "Nero Marquina & Brass Wellness Suite",
      "description": "Rich Spanish Nero Marquina marble accented by hand-burnished architectural brass and concealed cove lighting.",
      "imageUrl": "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Nero Marquina Marble",
            "Burnished Brass Fittings",
            "Recessed Ambient Coves"
      ],
      "hotspots": [
            {
                  "x": 55,
                  "y": 52,
                  "title": "Monolithic Vanity",
                  "detail": "Double integrated trough sink in honed black marble."
            }
      ]
},
    "terrace": {
      "name": "Subtropical Palm Terrace & Pool",
      "description": "Tropical terrace featuring cantilevered daybeds, heated lap pool, and architectural palm landscaping.",
      "imageUrl": "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Cantilevered Pool Daybeds",
        "Heated Swimming Pool",
        "Mature Date Palm Specimen Trees"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 65,
          "title": "Pool Daybeds",
          "detail": "Floating sun loungers suspended over turquoise pool water."
        },
        {
          "x": 80,
          "y": 50,
          "title": "Palm Canopy",
          "detail": "Architectural night lighting illuminating palm fronds."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Minimalist Designer Living Lounge",
      "description": "Sculptural living area with Italian designer furniture, custom acoustic plaster ceilings, and continuous garden view.",
      "imageUrl": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "BASWA Phon Acoustic Plaster",
        "Minimalist Fireplace Ribbon",
        "B&B Italia Modular Seating"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 52,
          "title": "Modular Seating",
          "detail": "Low-profile Italian leather and bouclé conversational group."
        },
        {
          "x": 75,
          "y": 42,
          "title": "Acoustic Ceiling",
          "detail": "Micro-perforated seamless acoustic plaster absorbing echo."
        }
      ]
    },
    "kitchen": {
      "name": "Corian & Walnut Cantilevered Kitchen",
      "description": "Seamless white Corian island cantilevered over rich Canaletto walnut storage drawers with induction cooktop.",
      "imageUrl": "https://images.unsplash.com/photo-1628797285815-453c1d0d21e3?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Seamless White Corian Island",
        "Canaletto Walnut Cabinetry",
        "Under-Counter Wine Cooler"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 54,
          "title": "Cantilevered Counter",
          "detail": "Single piece thermoformed Corian with integrated sinks."
        },
        {
          "x": 72,
          "y": 40,
          "title": "Concealed Induction",
          "detail": "Invisible induction points underneath the countertop surface."
        }
      ]
    },
    "master": {
      "name": "Primary Spa Ensuite & Soaking Tub",
      "description": "Luxurious master bedroom sanctuary with integrated freestanding oval bathtub, fluted glass, and garden access.",
      "imageUrl": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Freestanding Oval Soaking Tub",
        "Fluted Glass Screen Dividers",
        "Radiant Heated Stone Flooring"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 56,
          "title": "Oval Soaking Tub",
          "detail": "Cast composite resin tub with brushed gold floor-mounted mixer."
        },
        {
          "x": 75,
          "y": 44,
          "title": "Fluted Screen",
          "detail": "Custom reeded glass sliding wall for privacy."
        }
      ]
    },
    "bath": {
      "name": "Subterranean Basalt Thermal Bath",
      "description": "Atmospheric thermal bathing suite with dark slate flagstones, walk-in cold plunge, and cedar sauna portal.",
      "imageUrl": "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Dark Basalt Flagstones",
            "Cold Plunge Access",
            "Recessed Wall Torches"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 55,
                  "title": "Plunge Basin",
                  "detail": "Chilled thermal plunge pool lined with volcanic stone."
            }
      ]
},
    "terrace": {
      "name": "Architectural Courtyard & Water Feature",
      "description": "Intimate courtyard featuring granite reflecting pool, Japanese water spout, and outdoor gas fireplace.",
      "imageUrl": "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Granite Reflecting Pool",
        "Minimalist Gas Fireplace",
        "Japanese Zen Garden Accents"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 62,
          "title": "Reflecting Pool",
          "detail": "Black granite pool with recirculating waterfall sound."
        },
        {
          "x": 80,
          "y": 50,
          "title": "Courtyard Hearth",
          "detail": "Recessed gas hearth set into basalt garden wall."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Skyline Penthouse Living Gallery",
      "description": "Lofty light-drenched salon with wrap-around glass, floating timber staircase, and suspended fireplace.",
      "imageUrl": "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Wrap-Around Thermal Glass",
        "Floating Cantilevered Staircase",
        "Acoustically Treated Hardwood"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 50,
          "title": "Wrap-Around Glazing",
          "detail": "Motorized double-glazed panels with anti-glare solar tint."
        },
        {
          "x": 78,
          "y": 45,
          "title": "Floating Staircase",
          "detail": "Solid French oak treads cantilevered from reinforced concrete core."
        }
      ]
    },
    "kitchen": {
      "name": "Sunlit Chef Kitchen & Wine Towers",
      "description": "Dual Sub-Zero wine towers flank a massive quartz kitchen island with Viking commercial gas range and skylights.",
      "imageUrl": "https://images.unsplash.com/photo-1536896407451-6e3dd976edd1?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Dual Sub-Zero Wine Towers",
        "Viking Commercial 6-Burner Range",
        "Full-Length Roof Skylights"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 54,
          "title": "Chef Island",
          "detail": "3.5-metre quartz island with built-in warming drawers and dishwasher."
        },
        {
          "x": 74,
          "y": 38,
          "title": "Wine Towers",
          "detail": "Twin 146-bottle dual-zone wine storage units with UV glass."
        }
      ]
    },
    "master": {
      "name": "King Designer Master Sanctuary",
      "description": "Tranquil master bedroom with bespoke walnut headboard, automated drapery, and en-suite marble dressing room.",
      "imageUrl": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Custom Walnut Headboard",
        "Lutron Automated Drapery",
        "En-Suite Dressing Wardrobe"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 54,
          "title": "Walnut Headboard",
          "detail": "Integrated floating nightstands with concealed touch switches."
        },
        {
          "x": 72,
          "y": 44,
          "title": "Dressing Portal",
          "detail": "Pocket door leading to fully fitted walk-in wardrobe."
        }
      ]
    },
    "bath": {
      "name": "Japanese Hinoki Cedar Spa Retreat",
      "description": "Natural aromatic Hinoki wood slatted ceiling with oversized freestanding stone egg bath and bamboo garden view.",
      "imageUrl": "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Hinoki Cedar Slats",
            "Organic Egg Tub",
            "Private Bamboo Lightwell"
      ],
      "hotspots": [
            {
                  "x": 46,
                  "y": 54,
                  "title": "Hinoki Elements",
                  "detail": "Aromatherapeutic Japanese cypress timber accents."
            }
      ]
},
    "terrace": {
      "name": "Harbour Lookout Deck & Marina Berth",
      "description": "Waterside sun deck overlooking marina berths with built-in teak loungers, fire table, and deep-water mooring.",
      "imageUrl": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Built-In Teak Daybeds",
        "Linear Concrete Fire Table",
        "Direct Marina Pontoon Access"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 62,
          "title": "Fire Table",
          "detail": "Poured-in-place concrete gas fire table with river pebble media."
        },
        {
          "x": 82,
          "y": 50,
          "title": "Marina Mooring",
          "detail": "Private pontoon for tender and luxury powerboat."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Sunken Conversation Lounge & Salon",
      "description": "Modern architectural salon featuring sunken conversation pit, stone fireplace, and oversized picture windows.",
      "imageUrl": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Sunken Upholstered Conversation Pit",
        "Natural Stone Fireplace Wall",
        "Frameless Picture Windows"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 55,
          "title": "Conversation Pit",
          "detail": "Custom velvet sunken seating accommodating up to 12 guests."
        },
        {
          "x": 78,
          "y": 42,
          "title": "Fireplace Wall",
          "detail": "Dry-stacked quartzite fireplace rising two storeys."
        }
      ]
    },
    "kitchen": {
      "name": "Scandi-Modern Oak & Soapstone Kitchen",
      "description": "Minimalist Scandinavian kitchen featuring honed grey soapstone countertops, white oak cabinetry, and integrated herb wall.",
      "imageUrl": "https://images.unsplash.com/photo-1660652377925-d615178531db?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Honed Soapstone Countertops",
        "Natural White Oak Cabinets",
        "Integrated Living Herb Wall"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Soapstone Island",
          "detail": "Silky matte soapstone with seamless undermount sink."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Herb Garden Wall",
          "detail": "Hydroponic indoor herb wall with automated grow lights."
        }
      ]
    },
    "master": {
      "name": "Wellness Spa Sanctuary",
      "description": "Dedicated master retreat combining king sleeping quarters with glass-walled Finnish sauna and walk-in shower.",
      "imageUrl": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Integrated Finnish Sauna",
        "Double Rain-Head Shower",
        "Soundproof Acoustic Glazing"
      ],
      "hotspots": [
        {
          "x": 32,
          "y": 54,
          "title": "King Bed Suite",
          "detail": "Hypnos luxury mattress on custom upholstered platform."
        },
        {
          "x": 75,
          "y": 45,
          "title": "Glass Sauna",
          "detail": "Western red cedar sauna with Harvia electric heater and glass wall."
        }
      ]
    },
    "bath": {
      "name": "Thassos Snow Marble Penthouse Bath",
      "description": "Pristine pure white Grecian Thassos marble with suspended mirror pillars and freestanding sculptural bath.",
      "imageUrl": "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Pure Thassos Marble",
            "Floating Mirrors",
            "Acoustic Ceiling Plaster"
      ],
      "hotspots": [
            {
                  "x": 45,
                  "y": 50,
                  "title": "Sculptural Bath",
                  "detail": "Seamless solid stone resin tub facing private terrace glass."
            }
      ]
},
    "terrace": {
      "name": "Pergola Dining Deck & Lawn",
      "description": "Wisteria-covered pergola dining terrace overlooking manicured croquet lawn with outdoor pizza oven.",
      "imageUrl": "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Wisteria-Covered Cedar Pergola",
        "Wood-Fired Pizza Oven",
        "Manicured English Croquet Lawn"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 58,
          "title": "Dining Pergola",
          "detail": "Twelve-seat solid teak dining table with overhead chandelier."
        },
        {
          "x": 80,
          "y": 48,
          "title": "Outdoor Oven",
          "detail": "Hand-built refractory brick pizza oven."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Grand Formal Reception Salon",
      "description": "Stately formal living room with antique Persian rug, grand piano alcove, and 4.2-metre ceiling heights.",
      "imageUrl": "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "4.2-Metre Ceiling Height",
        "Bespoke Bookcase Library Wall",
        "Steinway Piano Alcove"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 48,
          "title": "Library Wall",
          "detail": "Floor-to-ceiling solid mahogany shelving with rolling brass ladder."
        },
        {
          "x": 78,
          "y": 55,
          "title": "Reception Seating",
          "detail": "Handcrafted velvet Chesterfields around marble coffee table."
        }
      ]
    },
    "kitchen": {
      "name": "Nero Marquina & White Quartz Kitchen",
      "description": "Bold black and white contrasting kitchen with Nero Marquina feature wall, pure white quartz island, and brass pendants.",
      "imageUrl": "https://images.unsplash.com/photo-1519137847-189aca33af2b?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Nero Marquina Feature Wall",
        "Pure White Quartz Island",
        "Brushed Brass Linear Pendants"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 54,
          "title": "Quartz Island",
          "detail": "Stain-proof engineered quartz with waterfall end panels."
        },
        {
          "x": 72,
          "y": 38,
          "title": "Brass Lighting",
          "detail": "Custom hand-rubbed brass chandelier with dimmable LEDs."
        }
      ]
    },
    "master": {
      "name": "Minimalist Linen Primary Suite",
      "description": "Calm, serene master bedroom dressed in washed Belgian linens with low-profile oak platform bed and private garden view.",
      "imageUrl": "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Belgian Linen Upholstery",
        "Solid Oak Platform Bed",
        "Motorized Sunscreen Blinds"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 55,
          "title": "Oak Platform Bed",
          "detail": "Floating platform design with concealed perimeter nightlights."
        },
        {
          "x": 75,
          "y": 48,
          "title": "Garden View Window",
          "detail": "Triple-glazed soundproof picture window framing private courtyard."
        }
      ]
    },
    "bath": {
      "name": "Fluted Oak & Bronze Skylight Bath",
      "description": "Double height ceiling with motorized skylight, warm European oak joinery, and patinated bronze shower enclosures.",
      "imageUrl": "https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Motorized Skylight",
            "European Oak Vanity",
            "Patinated Bronze Trim"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 48,
                  "title": "Skylight",
                  "detail": "Automated rain-sensor skylight providing natural daylight."
            }
      ]
},
    "terrace": {
      "name": "Waterfront Private Mooring Pier",
      "description": "Private timber pier and sun deck over the lake with boat launch slip, firepit lounge, and sunset vistas.",
      "imageUrl": "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Private Boat Mooring Slip",
        "Timber Deck Over Water",
        "Gas Firepit Lounge"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 60,
          "title": "Lake Pier",
          "detail": "Pressure-treated marine timber pier extending 15 metres into lake."
        },
        {
          "x": 82,
          "y": 48,
          "title": "Sunset Lounge",
          "detail": "Deep outdoor sofa configuration oriented toward western sunset."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Heritage Drawing Room & Library",
      "description": "Panelled country drawing room with open fireplace, Chesterfield sofas, and mullioned leaded windows.",
      "imageUrl": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Oak Wall Paneling",
        "Working Inglenook Fireplace",
        "Leaded Mullion Windows"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 50,
          "title": "Inglenook Fireplace",
          "detail": "Original 17th-century brick hearth with cast iron fireback."
        },
        {
          "x": 75,
          "y": 45,
          "title": "Library Nook",
          "detail": "Built-in oak bookshelves holding collection of rare volumes."
        }
      ]
    },
    "kitchen": {
      "name": "Dada Bespoke Cashmere Lacquer Kitchen",
      "description": "Contemporary Italian kitchen in matte cashmere lacquer with integrated Gaggenau appliances and walnut bar.",
      "imageUrl": "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Matte Cashmere Lacquer Finish",
        "Walnut Breakfast Cantilever",
        "Integrated Gaggenau Appliances"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 52,
          "title": "Cashmere Island",
          "detail": "Soft-touch scratch-resistant lacquer with seamless mitred edges."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Gaggenau Wall",
          "detail": "Flush wall oven, steam oven, and warming drawer configuration."
        }
      ]
    },
    "master": {
      "name": "Executive Penthouse Suite & Lounge",
      "description": "Grand master suite with private lounge, king upholstered bed, automated blackout shades, and panoramic vistas.",
      "imageUrl": "https://images.unsplash.com/photo-1590490359854-dfba19688d70?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Private Sitting Lounge",
        "Automated Blackout Drapery",
        "Smoked Oak Dressing Room"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 52,
          "title": "Executive Suite Bed",
          "detail": "King luxury mattress with motorized adjustable base and mood lighting."
        },
        {
          "x": 74,
          "y": 46,
          "title": "Sitting Lounge",
          "detail": "Pair of leather reading chairs with view over river grounds."
        }
      ]
    },
    "bath": {
      "name": "Bespoke Basalt & Fluted Glass Suite",
      "description": "Reeded privacy glass partitions with hand-chiseled granite wall textures and dual rainfall showers.",
      "imageUrl": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Reeded Glass Partitions",
            "Hand-Chiseled Granite",
            "Dual Rain Showers"
      ],
      "hotspots": [
            {
                  "x": 48,
                  "y": 52,
                  "title": "Reeded Glass",
                  "detail": "Custom architectural fluted glazing separating bathing zones."
            }
      ]
},
    "terrace": {
      "name": "Vaucluse Harbour Panorama Grounds",
      "description": "Grand elevated stone terrace with balustrades, classical fountains, and panoramic water and garden views.",
      "imageUrl": "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Classical Stone Balustrades",
        "Tiered Limestone Fountain",
        "Panoramic Water Views"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 58,
          "title": "Stone Terrace",
          "detail": "French limestone flags bordered by ornamental urns."
        },
        {
          "x": 80,
          "y": 45,
          "title": "Harbour Vista",
          "detail": "Sweeping views across estuary and private boat slip."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Contemporary Art Collector Salon",
      "description": "Gallery-standard living room with museum picture rails, fluted glass partitions, and minimalist gas fireplace.",
      "imageUrl": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Museum-Grade Picture Rails",
        "Fluted Glass Partitions",
        "Linear Gas Ribbon Fireplace"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 50,
          "title": "Gallery Walls",
          "detail": "Reinforced wall systems designed for oversized canvas artwork."
        },
        {
          "x": 76,
          "y": 42,
          "title": "Glass Partitions",
          "detail": "Acoustically dampening reeded glass walls separating salon."
        }
      ]
    },
    "kitchen": {
      "name": "Carrara Marble Heritage Gourmet Studio",
      "description": "Classical kitchen with Italian Carrara marble countertops, shaker cabinetry in deep navy, and brass hardware.",
      "imageUrl": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Honest Carrara Marble Slabs",
        "Deep Navy Shaker Cabinetry",
        "Perrin & Rowe Brass Tapware"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 54,
          "title": "Carrara Marble Island",
          "detail": "Classic grey-veined Italian marble with traditional ogee edge."
        },
        {
          "x": 74,
          "y": 40,
          "title": "Brass Hardware",
          "detail": "Solid unlacquered brass cup pulls that age naturally over time."
        }
      ]
    },
    "master": {
      "name": "Resort Pavilion Master Wing",
      "description": "Tropical-modern bedroom with sliding glass screens opening to private plunge pool, outdoor shower, and daybed.",
      "imageUrl": "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Direct Plunge Pool Access",
        "Private Outdoor Rain Shower",
        "Teak Louver Privacy Screens"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 52,
          "title": "Pavilion Bed",
          "detail": "Teak canopy bed with sheer mosquito netting and ceiling fan."
        },
        {
          "x": 75,
          "y": 55,
          "title": "Plunge Pool Slider",
          "detail": "Zero-threshold sliders stepping directly onto pool coping."
        }
      ]
    },
    "bath": {
      "name": "Arabescato Bookmatched Sanctuary",
      "description": "Dramatic veined Italian Arabescato marble walls surrounding a sunken bathing salon with walk-in dressing portal.",
      "imageUrl": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Sunken Bathing Salon",
            "Arabescato Bookmatched",
            "Dressing Wing Portal"
      ],
      "hotspots": [
            {
                  "x": 52,
                  "y": 55,
                  "title": "Sunken Salon",
                  "detail": "Three-step sunken marble bath with hydrotherapy jets."
            }
      ]
},
    "terrace": {
      "name": "Classical Garden Pavilion & Lawn",
      "description": "Classical colonnaded garden pavilion with limestone fireplace, dining loggia, and manicured parterre gardens.",
      "imageUrl": "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Colonnaded Dining Loggia",
        "Outdoor Stone Fireplace",
        "Symmetrical Boxwood Parterre"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 55,
          "title": "Dining Loggia",
          "detail": "Sheltered outdoor dining space with vaulted timber ceiling."
        },
        {
          "x": 80,
          "y": 45,
          "title": "Parterre Gardens",
          "detail": "Historic geometric boxwood hedging and central sundial."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Grand Marble Reception Foyer & Salon",
      "description": "Majestic salon with polished bookmatched Statuario marble flooring, crystal chandelier, and curved staircase.",
      "imageUrl": "https://images.unsplash.com/photo-1554995207-c18c20360a59?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Bookmatched Statuario Marble",
        "Curved Cantilevered Staircase",
        "Crystal Tiered Chandelier"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 52,
          "title": "Statuario Flooring",
          "detail": "Mirror-finish Italian marble with precision seamless grout lines."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Curved Staircase",
          "detail": "Sweeping marble staircase with handcrafted wrought iron balustrade."
        }
      ]
    },
    "kitchen": {
      "name": "Poggenpohl Segmento Architectural Kitchen",
      "description": "Handleless German kitchen by Poggenpohl with matte anthracite doors, ceramic island, and Miele appliances.",
      "imageUrl": "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Poggenpohl +SEGMENTO System",
        "Ultra-Slim Ceramic Worktop",
        "Full Integrated Miele Suite"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Ceramic Island",
          "detail": "Heat and scratch-proof ceramic surface with continuous waterfall edge."
        },
        {
          "x": 72,
          "y": 38,
          "title": "Handleless Cabinets",
          "detail": "Electronic touch-to-open servo-drive drawer mechanisms."
        }
      ]
    },
    "master": {
      "name": "Contemporary Primary Suite & Dressing Room",
      "description": "Serene master bedroom suite with neutral textiles, wool carpet, recessed ceiling LEDs, and walk-in dressing wardrobe.",
      "imageUrl": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Recessed Ambient LED Coving",
        "Walk-In Dressing Wardrobe",
        "Silk-Blend Neutral Carpeting"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 55,
          "title": "Primary Bedstead",
          "detail": "Padded upholstered bedstead with integrated bedside controls."
        },
        {
          "x": 74,
          "y": 45,
          "title": "Dressing Wardrobe",
          "detail": "Walk-in wardrobe with bespoke shoe racks and soft-closing drawers."
        }
      ]
    },
    "bath": {
      "name": "Architectural Garden En-Suite",
      "description": "Seamless floor-to-ceiling glass opening onto a private enclosed fern garden with exterior open-air rain shower.",
      "imageUrl": "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Open-Air Rain Shower",
            "Enclosed Fern Garden",
            "Brushed Titanium Hardware"
      ],
      "hotspots": [
            {
                  "x": 45,
                  "y": 50,
                  "title": "Outdoor Shower",
                  "detail": "Private walled garden shower with heated limestone tiles."
            }
      ]
},
    "terrace": {
      "name": "Alpine Pine Deck & Heated Hot Tub",
      "description": "Cedar deck immersed in forest with commercial cedar hot tub, outdoor heater lamps, and mountain views.",
      "imageUrl": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Western Red Cedar Decking",
        "Cedar Barrel Hot Tub",
        "Panoramic Alpine Panorama"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 62,
          "title": "Cedar Hot Tub",
          "detail": "Wood-fired and electric hybrid hot tub seating 8 people."
        },
        {
          "x": 80,
          "y": 48,
          "title": "Alpine Vista",
          "detail": "Sweeping panorama of snow-dusted pine ridges."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Floating Cantilevered Staircase Hall",
      "description": "Dramatic double-height living hall featuring floating open-tread staircase, glass bridge, and floor-to-ceiling glass.",
      "imageUrl": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Floating Open-Tread Staircase",
        "Glass Catwalk Bridge",
        "Thermal Insulated Glass Wall"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 50,
          "title": "Cantilevered Stairs",
          "detail": "Solid walnut treads anchored directly to reinforced concrete spine."
        },
        {
          "x": 75,
          "y": 38,
          "title": "Glass Bridge",
          "detail": "Structural glass floor bridge linking upper bedroom wings."
        }
      ]
    },
    "kitchen": {
      "name": "Poliform Alea Stone & Elm Culinary Studio",
      "description": "Italian architectural kitchen by Poliform with natural canaletto elm, flamed granite worktop, and integrated breakfast bar.",
      "imageUrl": "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Poliform Alea Kitchen System",
        "Flamed Granite Countertops",
        "Solid Elm Breakfast Bar"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 54,
          "title": "Flamed Granite Island",
          "detail": "Textured tactile granite with zero sheen and high stain resistance."
        },
        {
          "x": 72,
          "y": 40,
          "title": "Integrated Pantry",
          "detail": "Floor-to-ceiling cabinetry with concealed appliance garage."
        }
      ]
    },
    "master": {
      "name": "Period Master Suite & Garden Outlook",
      "description": "Refined traditional master bedroom with high ceilings, fireplace, bespoke drapery, and French doors to garden.",
      "imageUrl": "https://images.unsplash.com/photo-1512903516382-12773959d96c?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "French Garden Doors",
        "Carved Marble Fireplace",
        "Original Victorian Ceiling Rose"
      ],
      "hotspots": [
        {
          "x": 35,
          "y": 52,
          "title": "Traditional King Bed",
          "detail": "Antique mahogany four-poster bed with custom silk canopy."
        },
        {
          "x": 72,
          "y": 48,
          "title": "Garden French Doors",
          "detail": "Pair of tall glazed doors opening to private stone terrace."
        }
      ]
    },
    "bath": {
      "name": "Roman Travertine Wellness Suite",
      "description": "Textured Italian travertine stone with arched alcoves, custom warm lighting, and carved stone basins.",
      "imageUrl": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Roman Travertine",
            "Arched Alcoves",
            "Carved Basins"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 50,
                  "title": "Arched Alcove",
                  "detail": "Illuminated travertine arch framing bespoke bath amenities."
            }
      ]
},
    "terrace": {
      "name": "River Valley View Terrace",
      "description": "Elevated stone terrace overlooking winding river valley with glass railings, outdoor kitchen, and gas fire pit.",
      "imageUrl": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Frameless Glass Edge Railing",
        "Outdoor Stainless Kitchen",
        "River Valley Panorama"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 58,
          "title": "Valley Outlook",
          "detail": "Breathtaking view over river meander and protected meadows."
        },
        {
          "x": 80,
          "y": 50,
          "title": "BBQ Station",
          "detail": "Built-in Lynx outdoor grill with dual burners and mini fridge."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Designer Formal Salon & Fireplace",
      "description": "Warm contemporary salon with custom low-slung seating, built-in display vitrines, and linear gas fireplace.",
      "imageUrl": "https://images.unsplash.com/photo-1502005229762-ae1b466428f2?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Custom Built-In Vitrines",
        "Linear Gas Ribbon Fireplace",
        "Engineered White Oak Flooring"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 50,
          "title": "Linear Hearth",
          "detail": "Two-metre wide gas fireplace with ceramic river stone bed."
        },
        {
          "x": 78,
          "y": 45,
          "title": "Illuminated Vitrines",
          "detail": "Display vitrines with adjustable micro-LED spots."
        }
      ]
    },
    "kitchen": {
      "name": "Boffi Minimalist Pure White Kitchen",
      "description": "Architectural pure white kitchen by Boffi with Corian island, flush touch cabinetry, and hidden prep area.",
      "imageUrl": "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Boffi Minimalist System",
        "Seamless Solid Surface Worktop",
        "Concealed Prep Scullery"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "White Island",
          "detail": "Seamless monobloc island with integrated sink and drainer."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Hidden Scullery",
          "detail": "Sliding wall reveals second sink, dishwasher, and food prep zone."
        }
      ]
    },
    "master": {
      "name": "Woodland Glazed Master Wing",
      "description": "Peaceful bedroom suite with panoramic glass perimeter framing mature deciduous woodland, king bed, and private spa access.",
      "imageUrl": "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "180-Degree Glazed Perimeter",
        "King Designer Headboard",
        "Private Spa Deck Access"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 52,
          "title": "Glazed Bedroom",
          "detail": "Thermal acoustic double-glazed panels with anti-reflective coating."
        },
        {
          "x": 74,
          "y": 48,
          "title": "Spa Portal",
          "detail": "Direct stepping stone path to outdoor hot tub."
        }
      ]
    },
    "bath": {
      "name": "Smoked Walnut & Slate Ensuite",
      "description": "Warm dark smoked walnut wall paneling combined with graphite slate surfaces and freestanding black composite tub.",
      "imageUrl": "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Smoked Walnut Paneling",
            "Graphite Slate",
            "Black Composite Tub"
      ],
      "hotspots": [
            {
                  "x": 47,
                  "y": 53,
                  "title": "Black Tub",
                  "detail": "Velvety matte black composite tub with integrated overflow."
            }
      ]
},
    "terrace": {
      "name": "Oceanview Sunset Sun Deck",
      "description": "Southwest-facing oceanfront terrace with frameless glass railings, sun beds, and outdoor dining pergola.",
      "imageUrl": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Southwest Sunset Exposure",
        "Frameless Glass Balustrade",
        "Outdoor Dining Suite for 8"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 58,
          "title": "Sunset Horizon",
          "detail": "Prime twilight views over open coastal waters."
        },
        {
          "x": 80,
          "y": 50,
          "title": "Sun Loungers",
          "detail": "Teak sun loungers with quick-dry outdoor cushions."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Country Manor Great Room",
      "description": "Stately country residence great hall with rough-hewn stone fireplace, reclaimed timber beams, and garden French doors.",
      "imageUrl": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Rough-Hewn Stone Fireplace",
        "Reclaimed Oak Ceiling Beams",
        "Garden French Doors"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 48,
          "title": "Stone Hearth",
          "detail": "Solid granite lintel and oversized wood-burning hearth."
        },
        {
          "x": 72,
          "y": 58,
          "title": "Garden Access",
          "detail": "Pair of solid wood glazed doors leading to rose garden."
        }
      ]
    },
    "kitchen": {
      "name": "Equestrian Estate Timber & Quartzite Kitchen",
      "description": "Rustic luxury kitchen with substantial quartzite island, custom white oak cabinetry, and professional range cooker.",
      "imageUrl": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Thick-Edged Quartzite Island",
        "Hand-Crafted Oak Millwork",
        "La Cornue 48-Inch Range Cooker"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 52,
          "title": "Center Island",
          "detail": "Massive 3-metre quartzite island with breakfast seating."
        },
        {
          "x": 70,
          "y": 40,
          "title": "Range Cooker",
          "detail": "Dual electric/gas ovens with custom enamel finish."
        }
      ]
    },
    "master": {
      "name": "Victorian High-Ceiling Master Suite",
      "description": "Grand master bedroom with 3.8-metre ceilings, king upholstered bedstead, original cornice moldings, and en-suite wardrobe.",
      "imageUrl": "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "3.8-Metre Ceiling Height",
        "Restored Victorian Cornicing",
        "Walk-In Wardrobe Suite"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 52,
          "title": "Period Detailing",
          "detail": "Intricate floral plaster cornice and ceiling rose."
        },
        {
          "x": 72,
          "y": 48,
          "title": "Wardrobe Passage",
          "detail": "Double doors opening to backlit fitted dressing room."
        }
      ]
    },
    "bath": {
      "name": "Microcement Minimalist Bath Chamber",
      "description": "Seamless monolithic warm grey microcement coating across floor, walls, and vanity with hidden storage.",
      "imageUrl": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Continuous Microcement",
            "Hidden Storage",
            "Minimalist Linear Drain"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 52,
                  "title": "Linear Drain",
                  "detail": "Flush concealed perimeter drainage system."
            }
      ]
},
    "terrace": {
      "name": "Timber Alpine Chalet Veranda",
      "description": "Covered cedar timber veranda with outdoor heaters, lounge seating, and uninterrupted ski-run mountain views.",
      "imageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Covered Cedar Veranda",
        "Ceiling Infratech Heaters",
        "Mountain Ski-Slope Vistas"
      ],
      "hotspots": [
        {
          "x": 48,
          "y": 55,
          "title": "Veranda Seating",
          "detail": "Weatherproof deep lounge chairs with wool throws."
        },
        {
          "x": 80,
          "y": 42,
          "title": "Mountain Outlook",
          "detail": "Direct vista of alpine peaks and pine forests."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Glass Pavilion Living Sanctuary",
      "description": "Minimalist glass pavilion immersed in manicured gardens with polished screed concrete floor and minimalist hearth.",
      "imageUrl": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "360-Degree Glass Pavilion",
        "Polished Concrete Screed",
        "Minimalist Flush Hearth"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 50,
          "title": "Glass Perimeter",
          "detail": "Floor-to-ceiling ultra-clear glass with zero visual barriers."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Concrete Finish",
          "detail": "Diamond-polished heated concrete with satin luster."
        }
      ]
    },
    "kitchen": {
      "name": "Architectural Gallery Open Kitchen",
      "description": "Linear gallery-style kitchen with monolithic stainless steel workstation, white quartz island, and flush appliances.",
      "imageUrl": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Marine-Grade Stainless Workstation",
        "Pure Quartz Island Surface",
        "Zero-Protrusion Push Latches"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Stainless Worktop",
          "detail": "Seamless welded sinks and drainboards for sterile food prep."
        },
        {
          "x": 72,
          "y": 42,
          "title": "Appliance Tower",
          "detail": "Flush steam and speed oven combination."
        }
      ]
    },
    "master": {
      "name": "Lakeside Primary Suite & Balcony",
      "description": "Serene lakeside master bedroom with private morning deck, walk-in shower with lake views, and wool carpeting.",
      "imageUrl": "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Private Lakeside Balcony",
        "Water-View Walk-in Shower",
        "Plush Wool Broadloom Carpet"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 50,
          "title": "Lakeside Balcony",
          "detail": "Teak deck with glass railing hovering over the shoreline."
        },
        {
          "x": 75,
          "y": 58,
          "title": "Primary Bedstead",
          "detail": "Low-profile Japanese style bed frame."
        }
      ]
    },
    "bath": {
      "name": "Polished Plaster & Quartzite Retreat",
      "description": "Venetian polished marmorino plaster finish with sea-pearl quartzite vanity tops and soft perimeter downlighting.",
      "imageUrl": "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Marmorino Plaster",
            "Sea-Pearl Quartzite",
            "Custom Backlit Mirrors"
      ],
      "hotspots": [
            {
                  "x": 53,
                  "y": 51,
                  "title": "Quartzite Top",
                  "detail": "Mitered 60mm quartzite island vanity."
            }
      ]
},
    "terrace": {
      "name": "Stone Terraced Courtyard Pavilion",
      "description": "Multilevel stone terrace featuring carved stone benches, potted boxwood, and private garden pavilions.",
      "imageUrl": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Hand-Laid Stone Terraces",
        "Carved Limestone Benches",
        "Historic Fountain Basin"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 60,
          "title": "Terrace Level",
          "detail": "Elevated seating area overlooking lower lawn."
        },
        {
          "x": 78,
          "y": 48,
          "title": "Limestone Bench",
          "detail": "Solid limestone outdoor seating with custom cushions."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Classical Georgian Drawing Room",
      "description": "Proportioned Georgian drawing room with sash windows, marble fireplace, detailed cornicing, and hardwood parquetry.",
      "imageUrl": "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Original Sash Windows",
        "Versailles Parquet Flooring",
        "Classical Marble Fireplace"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 48,
          "title": "Versailles Parquet",
          "detail": "Hand-assembled French oak parquetry with natural beeswax patina."
        },
        {
          "x": 72,
          "y": 55,
          "title": "Georgian Mantel",
          "detail": "Carved white marble mantelpiece with cast brass fender."
        }
      ]
    },
    "kitchen": {
      "name": "Japandi Hinoki & Basalt Kitchen Studio",
      "description": "Tranquil kitchen combining natural Japanese hinoki wood finishes with flamed black basalt countertops and hidden prep bay.",
      "imageUrl": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Natural Japanese Hinoki Wood",
        "Flamed Black Basalt Worktops",
        "Concealed Shoji Slide Pantry"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 52,
          "title": "Basalt Center Island",
          "detail": "Textured basalt stone with waterproof nano-sealant."
        },
        {
          "x": 75,
          "y": 40,
          "title": "Shoji Screen Pantry",
          "detail": "Sliding slatted screens concealing dry goods and appliances."
        }
      ]
    },
    "master": {
      "name": "Cathedral Close Master Bedroom",
      "description": "Tranquil master sanctuary with soaring ceilings, sash bay windows, bespoke dressing room, and limestone en-suite.",
      "imageUrl": "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Cathedral Arch Window Details",
        "Polished Limestone Bathroom",
        "Bespoke Oak Dressers"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Sash Windows",
          "detail": "Acoustically insulated restored timber sashes."
        },
        {
          "x": 72,
          "y": 46,
          "title": "En-Suite Portal",
          "detail": "Pocket door opening to twin vanity bath suite."
        }
      ]
    },
    "bath": {
      "name": "Art Deco Monochrome Luxury Bath",
      "description": "High-gloss black lacquer and statuario marble checkerboard flooring with burnished gold fixtures and pedestal tub.",
      "imageUrl": "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Checkerboard Marble",
            "Black Lacquer Trim",
            "Burnished Gold Fixtures"
      ],
      "hotspots": [
            {
                  "x": 45,
                  "y": 54,
                  "title": "Pedestal Tub",
                  "detail": "Restored architectural cast iron and enamel pedestal bath."
            }
      ]
},
    "terrace": {
      "name": "Heritage Park Grounds & Motor Court",
      "description": "Expansive private parkland terrace with gravel motor court, heritage stone pillars, and mature oak trees.",
      "imageUrl": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Gravel Motor Court",
        "Heritage Limestone Pillars",
        "Mature Century Oak Trees"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 58,
          "title": "Motor Court",
          "detail": "Accommodates up to 8 vehicles with automated entry gate."
        },
        {
          "x": 80,
          "y": 48,
          "title": "Parkland Perimeter",
          "detail": "Four acres of manicured estate grounds."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Modernist Open Living Pavilion",
      "description": "Architect-designed open-concept pavilion with floor-to-ceiling glass, linear fireplace, and cantilevered roof overhang.",
      "imageUrl": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Cantilevered Roof Overhang",
        "Floor-to-Ceiling Thermal Glass",
        "Seamless Outdoor Transition"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 50,
          "title": "Overhang Shading",
          "detail": "Architectural eaves block summer sun while allowing winter light."
        },
        {
          "x": 75,
          "y": 45,
          "title": "Living Space",
          "detail": "Seamless continuous floor extending onto outer terrace."
        }
      ]
    },
    "kitchen": {
      "name": "Warm Walnut & Antique Bronze Chef Atelier",
      "description": "Custom American walnut kitchen with antique bronze pulls, quartzite countertops, and secondary scullery prep room.",
      "imageUrl": "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "American Walnut Veneers",
        "Solid Antique Bronze Hardware",
        "Walk-Through Scullery Prep Room"
      ],
      "hotspots": [
        {
          "x": 40,
          "y": 52,
          "title": "Walnut Island",
          "detail": "Rich bookmatched grain with continuous waterfall edges."
        },
        {
          "x": 72,
          "y": 42,
          "title": "Prep Scullery",
          "detail": "Separate back kitchen with commercial dishwasher and sink."
        }
      ]
    },
    "master": {
      "name": "Maritime Coastal Master Suite",
      "description": "Coastal master bedroom with shiplap ceiling accents, sliding glass doors to waterside deck, and king bed.",
      "imageUrl": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Shiplap Ceiling Accents",
        "Sliding Door to Waterside Deck",
        "En-Suite Ocean-View Bath"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 50,
          "title": "Waterside Slider",
          "detail": "Impact-resistant acoustic sliding glass door."
        },
        {
          "x": 72,
          "y": 55,
          "title": "King Coastal Bed",
          "detail": "Natural linen upholstery with maritime accents."
        }
      ]
    },
    "bath": {
      "name": "Coastal Stone & Driftwood Spa",
      "description": "Natural limestone flagstones, reclaimed weathered timber beam ceiling, and freestanding tub gazing out to coast.",
      "imageUrl": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Natural Flagstones",
            "Reclaimed Timber Beams",
            "Coastal Horizon View"
      ],
      "hotspots": [
            {
                  "x": 48,
                  "y": 50,
                  "title": "Horizon Window",
                  "detail": "Low-iron picture window framing ocean horizon."
            }
      ]
},
    "terrace": {
      "name": "Cantilevered Glass Lawn Terrace",
      "description": "Spectacular glass-fronted terrace projecting toward the hillside with sunken fire pit and outdoor dining area.",
      "imageUrl": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Projecting Cantilevered Terrace",
        "Sunken Gas Fire Bowl",
        "Integrated Wind Screen"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 55,
          "title": "Cantilever Edge",
          "detail": "Structural steel projection overlooking valley below."
        },
        {
          "x": 80,
          "y": 45,
          "title": "Fire Bowl",
          "detail": "Natural stone gas burner with volcanic stone media."
        }
      ]
    }
  },
  {
    "living": {
      "name": "Thames-Side Glass Living Salon",
      "description": "Riverside living room with 12-metre motorized glass facade opening directly onto private timber mooring deck.",
      "imageUrl": "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "12-Metre Riverside Glass Pocket",
        "Private Mooring Deck Access",
        "Integrated Motorized Blinds"
      ],
      "hotspots": [
        {
          "x": 45,
          "y": 52,
          "title": "Riverside Glass Pocket",
          "detail": "Pocket doors slide completely out of sight into wall cavity."
        },
        {
          "x": 78,
          "y": 45,
          "title": "Riverside Lounge",
          "detail": "Low-profile seating oriented directly toward river views."
        }
      ]
    },
    "kitchen": {
      "name": "Contemporary Horizon Marble Island Suite",
      "description": "Ultra-modern kitchen with dramatic bookmatched marble island, pop-up charging ports, and Sub-Zero refrigeration columns.",
      "imageUrl": "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Bookmatched Horizon Marble Island",
        "Flush Pop-Up Charging Hubs",
        "Sub-Zero Integrated Cooling Columns"
      ],
      "hotspots": [
        {
          "x": 42,
          "y": 52,
          "title": "Horizon Marble Island",
          "detail": "Continuous dramatic marble veining with flush undermount sink."
        },
        {
          "x": 74,
          "y": 40,
          "title": "Cooling Columns",
          "detail": "Independently zoned 36-inch refrigerator and freezer units."
        }
      ]
    },
    "master": {
      "name": "Forest View Master Sanctuary",
      "description": "Elevated treetop master bedroom with floor-to-ceiling glass corner, private morning balcony, and fireplace.",
      "imageUrl": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Treetop Corner Glass",
        "Private Morning Balcony",
        "Linear Gas Fireplace"
      ],
      "hotspots": [
        {
          "x": 38,
          "y": 50,
          "title": "Treetop Corner View",
          "detail": "Butt-glazed structural corner framing forest canopy."
        },
        {
          "x": 72,
          "y": 58,
          "title": "Balcony Door",
          "detail": "Access to private morning deck with outdoor shower."
        }
      ]
    },
    "bath": {
      "name": "Bespoke Penthouse Spa with Sauna",
      "description": "Integrated glass-walled Finnish dry sauna, double rain shower, and freestanding stone soaking bath.",
      "imageUrl": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=85",
      "features": [
            "Integrated Finnish Sauna",
            "Double Rain Shower",
            "Freestanding Stone Tub"
      ],
      "hotspots": [
            {
                  "x": 50,
                  "y": 50,
                  "title": "Dry Sauna",
                  "detail": "Cedar lined dry sauna with volcanic stone heater."
            }
      ]
},
    "terrace": {
      "name": "Thames Riverside Mooring & Pavilion",
      "description": "Private riverside mooring pontoon with teak dining deck, electric boat charger, and manicured water gardens.",
      "imageUrl": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85",
      "features": [
        "Private Boat Mooring Pontoon",
        "Electric Marine Charging Station",
        "Teak Dining Deck for 10"
      ],
      "hotspots": [
        {
          "x": 50,
          "y": 55,
          "title": "Boat Mooring",
          "detail": "Direct river mooring suitable for 40ft day cruisers."
        },
        {
          "x": 80,
          "y": 48,
          "title": "Waterside Pavilion",
          "detail": "Covered pavilion with outdoor infrared heaters and lighting."
        }
      ]
    }
  }
];

export function generateVirtualTourRooms(
  propertyIndex: number,
  propertyId: string,
  propertyTitle: string,
  propertyLocation: string
): VirtualTourRoom[] {
  // Special bespoke cinematic video suite for first home uk-prop-1
  if (propertyId === 'uk-prop-1') {
    return [
      {
        id: `${propertyId}-room-living`,
        name: 'Panoramic Living Salon',
        category: 'living',
        description: 'Expansive formal salon with 10-metre motorized glass pocket sliders opening directly to landscaped private grounds. Part of The St. James Terrace Penthouse in Mayfair, London.',
        imageUrl: '/videos/living.jpg',
        videoUrl: '/videos/home1_living.mp4',
        features: [
          'Floor-to-Ceiling Slimline Glazing',
          'Linear Bioethanol Fireplace',
          'Integrated Architectural Acoustics'
        ],
        hotspots: [
          { x: 45, y: 50, title: 'Motorized Glazing', detail: 'Triple-glazed thermal acoustic pocket sliders opening to exterior terrace.' },
          { x: 80, y: 40, title: 'Bespoke Joinery', detail: 'Smoked eucalyptus cabinetry with integrated climate wine cellar.' }
        ]
      },
      {
        id: `${propertyId}-room-kitchen`,
        name: 'Gaggenau 400 Minimalist Quartzite Studio',
        category: 'kitchen',
        description: 'Pristine architectural kitchen with monolithic waterfall island, Gaggenau 400 induction series, and concealed prep pantry. Custom crafted for The St. James Terrace Penthouse.',
        imageUrl: '/videos/kitchen.jpg',
        videoUrl: '/videos/home1_kitchen.mp4',
        features: [
          'Taj Mahal Quartzite Waterfall Island',
          'Full Gaggenau 400 Series Suite',
          'Concealed Butler Walk-In Pantry'
        ],
        hotspots: [
          { x: 35, y: 55, title: 'Waterfall Island', detail: 'Single-slab seamless quartzite with undermount prep sink and flush induction.' },
          { x: 65, y: 35, title: 'Integrated Ventilation', detail: 'Ceiling-flush extraction array with ambient LED halo illumination.' }
        ]
      },
      {
        id: `${propertyId}-room-master`,
        name: 'Primary Sanctuary & Suede Suite',
        category: 'master',
        description: 'Secluded primary wing featuring acoustic suede wall panels, walk-in dressing lounge by Poliform, and morning balcony. Private master wing of The St. James Terrace Penthouse.',
        imageUrl: '/videos/bedroom.jpg',
        videoUrl: '/videos/home1_bedroom.mp4',
        features: [
          'Acoustic Suede Wall Panels',
          'Dual Poliform Dressing Suites',
          'Private Outlook Balcony'
        ],
        hotspots: [
          { x: 28, y: 58, title: 'King Bespoke Bedstead', detail: 'Custom upholstered headboard with integrated wireless charging and mood lighting.' },
          { x: 74, y: 42, title: 'Dressing Lounge', detail: 'Backlit smoked glass wardrobes with biometric jewellery vault.' }
        ]
      },
      {
        id: `${propertyId}-room-bath`,
        name: 'Primary Spa Suite & Soaking Tub',
        category: 'bath',
        description: 'Monolithic Italian marble retreat with freestanding soaking tub, dual rainfall showers, and ambient spa illumination. Part of The St. James Terrace Penthouse.',
        imageUrl: '/videos/bathroom.jpg',
        videoUrl: '/videos/home1_bathroom.mp4',
        features: [
          'Freestanding Composite Soaking Tub',
          'Calacatta Marble Dual Vanities',
          'Concealed Thermostatic Rain Suite'
        ],
        hotspots: [
          { x: 45, y: 55, title: 'Soaking Tub', detail: 'Matte composite oval tub with floor-mounted brushed brass tap.' },
          { x: 75, y: 45, title: 'Italian Marble Finishes', detail: 'Single-slab continuous veined bookmatched marble wall cladding.' }
        ]
      }
    ];
  }

  // Select setup modulo 20 to ensure every house 1 to 20 has its own distinct room set
  const setupIndex = Math.abs(propertyIndex) % ROOM_SETUPS_20.length;
  const setup = ROOM_SETUPS_20[setupIndex];

  return [
    {
      id: `${propertyId}-room-living`,
      name: `${setup.living.name}`,
      category: 'living',
      description: `${setup.living.description} Part of ${propertyTitle} in ${propertyLocation}.`,
      imageUrl: setup.living.imageUrl,
      features: setup.living.features,
      hotspots: setup.living.hotspots
    },
    {
      id: `${propertyId}-room-kitchen`,
      name: `${setup.kitchen.name}`,
      category: 'kitchen',
      description: `${setup.kitchen.description} Custom crafted for ${propertyTitle}.`,
      imageUrl: setup.kitchen.imageUrl,
      features: setup.kitchen.features,
      hotspots: setup.kitchen.hotspots
    },
    {
      id: `${propertyId}-room-master`,
      name: `${setup.master.name}`,
      category: 'master',
      description: `${setup.master.description} Private master wing of ${propertyTitle}.`,
      imageUrl: setup.master.imageUrl,
      features: setup.master.features,
      hotspots: setup.master.hotspots
    },
    {
      id: `${propertyId}-room-bath`,
      name: `${setup.bath.name}`,
      category: 'wellness',
      description: `${setup.bath.description} En-suite spa bath of ${propertyTitle}.`,
      imageUrl: setup.bath.imageUrl,
      features: setup.bath.features,
      hotspots: setup.bath.hotspots
    },
    {
      id: `${propertyId}-room-terrace`,
      name: `${setup.terrace.name}`,
      category: 'terrace',
      description: `${setup.terrace.description} Private outdoor grounds of ${propertyTitle}.`,
      imageUrl: setup.terrace.imageUrl,
      features: setup.terrace.features,
      hotspots: setup.terrace.hotspots
    }
  ];
}

/**
 * Returns the complete interior & exterior media collection tailored specifically for this home.
 * Guaranteed: NO two homes share any media!
 */
export function getHomeInteriorGallery(property: PropertyItem): InteriorPhoto[] {
  if (property.id === 'uk-prop-1') {
    return [
      {
        id: `${property.id}-photo-exterior`,
        name: 'Grand Architectural Facade & Grounds (4K Video)',
        category: 'exterior',
        imageUrl: '/videos/exterior.jpg',
        videoUrl: '/videos/home1_exterior.mp4',
        description: `Authentic exterior architecture and private motor court for ${property.title} in ${property.location}.`
      },
      {
        id: `${property.id}-photo-living`,
        name: 'Panoramic Living Salon (4K Video)',
        category: 'living',
        imageUrl: '/videos/living.jpg',
        videoUrl: '/videos/home1_living.mp4',
        description: 'Expansive formal salon with 10-metre motorized glass pocket sliders opening directly to landscaped private grounds.'
      },
      {
        id: `${property.id}-photo-kitchen`,
        name: 'Gaggenau 400 Minimalist Kitchen (4K Video)',
        category: 'kitchen',
        imageUrl: '/videos/kitchen.jpg',
        videoUrl: '/videos/home1_kitchen.mp4',
        description: 'Pristine architectural kitchen with monolithic waterfall island, Gaggenau 400 induction series, and concealed prep pantry.'
      },
      {
        id: `${property.id}-photo-master`,
        name: 'Primary Master Sanctuary Suite (4K Video)',
        category: 'master',
        imageUrl: '/videos/bedroom.jpg',
        videoUrl: '/videos/home1_bedroom.mp4',
        description: 'Secluded primary wing featuring acoustic suede wall panels, walk-in dressing lounge by Poliform, and morning balcony.'
      },
      {
        id: `${property.id}-photo-bath`,
        name: 'Primary Spa Bath & Soaking Tub (4K Video)',
        category: 'bath',
        imageUrl: '/videos/bathroom.jpg',
        videoUrl: '/videos/home1_bathroom.mp4',
        description: 'Monolithic Italian marble retreat with freestanding soaking tub, dual rainfall showers, and ambient spa illumination.'
      }
    ];
  }

  const match = property.id.match(/\d+/);
  const propIndex = match ? Math.max(0, parseInt(match[0], 10) - 1) : 0;
  const setupIndex = propIndex % ROOM_SETUPS_20.length;
  const setup = ROOM_SETUPS_20[setupIndex];

  return [
    {
      id: `${property.id}-photo-exterior`,
      name: 'Grand Architectural Facade & Private Grounds',
      category: 'exterior',
      imageUrl: property.imageUrl,
      description: `Authentic exterior architecture and perimeter motor court for ${property.title} in ${property.location}.`
    },
    {
      id: `${property.id}-photo-living`,
      name: setup.living.name,
      category: 'living',
      imageUrl: setup.living.imageUrl,
      description: setup.living.description
    },
    {
      id: `${property.id}-photo-kitchen`,
      name: setup.kitchen.name,
      category: 'kitchen',
      imageUrl: setup.kitchen.imageUrl,
      description: setup.kitchen.description
    },
    {
      id: `${property.id}-photo-master`,
      name: setup.master.name,
      category: 'master',
      imageUrl: setup.master.imageUrl,
      description: setup.master.description
    },
    {
      id: `${property.id}-photo-bath`,
      name: setup.bath.name,
      category: 'bath',
      imageUrl: setup.bath.imageUrl,
      description: setup.bath.description
    },
    {
      id: `${property.id}-photo-terrace`,
      name: setup.terrace.name,
      category: 'terrace',
      imageUrl: setup.terrace.imageUrl,
      description: setup.terrace.description
    }
  ];
}

/**
 * Suggests detailed room counts, types, and architectural configurations for each property.
 */
export function getSuggestedRooms(property: PropertyItem): SuggestedRoomSpec[] {
  const beds = property.bedrooms || 3;
  const baths = property.bathrooms || 3;
  const guestBedrooms = Math.max(1, beds - 1);
  const fullBaths = Math.max(1, baths - 1);

  return [
    {
      name: 'Primary Master Suite',
      count: 1,
      type: 'Bedroom',
      description: 'Expansive king master suite with bespoke dressing room, integrated sound acoustic isolation, and direct terrace portal.'
    },
    {
      name: 'Deluxe Guest Bedrooms',
      count: guestBedrooms,
      type: 'Bedroom',
      description: `${guestBedrooms} double suites featuring built-in Italian smoked oak wardrobes and private exterior balconies.`
    },
    {
      name: 'Primary Spa En-Suite Bathroom',
      count: 1,
      type: 'Bathroom',
      description: 'Monolithic freestanding stone soaking tub, dual marble vanity basins, and thermostatic ceiling rainfall shower.'
    },
    {
      name: 'En-Suite Guest Bathrooms',
      count: Math.max(0, fullBaths - 1),
      type: 'Bathroom',
      description: 'Italian porcelain slabs, frameless glass rain showers, and radiant underfloor heating.'
    },
    {
      name: 'Executive Guest Powder Room',
      count: 1,
      type: 'Bathroom',
      description: 'Ground floor hospitality half-bath with backlit translucent onyx vanity and designer bronze hardware.'
    },
    {
      name: 'Bespoke Chef Kitchen',
      count: 1,
      type: 'Culinary',
      description: 'Taj Mahal quartzite waterfall island, full Gaggenau 400 induction suite, and concealed walk-in butler pantry.'
    },
    {
      name: 'Double-Height Living Salon',
      count: 1,
      type: 'Reception',
      description: 'Expansive formal salon with 10-metre motorized slimline glass sliders opening to landscaped grounds.'
    },
    {
      name: 'Heated Loggia & Private Grounds',
      count: 1,
      type: 'Outdoor',
      description: 'Private heated outdoor terrace with architectural linear fire table and manicured perimeter gardens.'
    }
  ];
}
