import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  HeartHandshake,
  Camera,
  Store,
  Coffee,
  Tag,
  Building2,
  Video,
  Award,
  Landmark,
  MessageSquareQuote,
  PhoneCall,
  Type,
  Palette,
  UserCheck,
  Handshake,
  Users,
  Search,
  ChevronDown,
  ChevronRight,
  Sliders,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  LayoutGrid,
  Rocket,
  Paintbrush,
  Newspaper,
  ChevronsUpDown,
  Route,
  LifeBuoy,
  CheckSquare,
  Target,
  Send,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const NAV_TREE_DATA = [
  {
    id: 'homepage',
    category: 'Homepage Sections',
    subtitle: 'Hero banner, services, pricing, about, reviews & contact',
    icon: LayoutGrid,
    accentColor: 'text-neon-blue',
    badgeColor: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
    items: [
      {
        id: 'hero',
        label: 'Hero Banner',
        icon: Sparkles,
        description: 'Banner headlines, subtitle & CTA buttons',
        badge: 'Main',
      },
      {
        id: 'acknowledged',
        label: 'Acknowledged By',
        icon: Award,
        description: 'Partner logos ticker & acknowledged badges',
        badge: 'Partners',
      },
      {
        id: 'about',
        label: 'About Story',
        icon: HeartHandshake,
        description: 'Story, workspace photo & mission',
      },
      {
        id: 'services',
        label: 'Services & Desks',
        icon: Store,
        description: 'Dedicated desks, private cabins & meeting rooms',
        badge: 'Popular',
      },
      {
        id: 'amenities',
        label: 'Amenities & Perks',
        icon: Coffee,
        description: '1 Gbps WiFi, coffee bar, backup & sound pods',
      },
      {
        id: 'media',
        label: 'Press & Highlights',
        icon: Newspaper,
        description: 'Press clippings, news articles & social proof',
      },
      {
        id: 'pricing',
        label: 'Pricing & Memberships',
        icon: Tag,
        description: 'Day pass, monthly plans & hourly rates',
        badge: 'Plans',
      },
      {
        id: 'gallery',
        label: 'Photo Gallery',
        icon: Camera,
        description: 'Workspace photos, cafeteria & vibe shots',
      },
      {
        id: 'testimonials',
        label: 'Reviews & Testimonials',
        icon: MessageSquareQuote,
        description: 'Member reviews, star ratings & feedback',
      },
      {
        id: 'contact',
        label: 'Contact & Location',
        icon: PhoneCall,
        description: 'Phone, email, address, operating hours & map',
        badge: 'Info',
      },
    ],
  },
  {
    id: 'franchise-group',
    category: 'Franchise Page',
    subtitle: 'Franchise model, income streams, roadmap & space criteria',
    icon: Rocket,
    accentColor: 'text-amber-400',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    items: [
      {
        id: 'franchise',
        label: 'Franchise Opportunity',
        icon: Building2,
        description: 'Hero pitch, CTA buttons & 4 financial highlights',
        badge: 'Hero',
      },
      {
        id: 'franchiseCredibility',
        label: 'Credibility & Authority Highlights',
        icon: Award,
        description: '3 authority pillars: 10+ Yrs Network, First Coworking Space & Leaders/Media recognition',
        badge: '3 Pillars',
      },
      {
        id: 'founderVideo',
        label: 'Founder Video & Message',
        icon: Video,
        description: 'Founder video source, aspect ratio (16:9, 9:16), frame curvature & bezel thickness/color',
        badge: 'Video & Frame',
      },
      {
        id: 'franchiseStory',
        label: 'Ecosystem & Recognition',
        icon: Sparkles,
        description: 'Partner logos marquee & trusted startup ecosystem network',
        badge: 'Ecosystem',
      },
      {
        id: 'franchiseVision',
        label: 'Vision: Why India is Betting Big',
        icon: Target,
        description: 'Vision narrative, side photo & 2 feature metric cards',
        badge: 'Vision',
      },
      {
        id: 'franchiseBenefits',
        label: 'Why Partner with Us',
        icon: Award,
        description: 'Brand identity, proven model & partner perks',
        badge: 'Benefits',
      },
      {
        id: 'franchiseRevenue',
        label: 'Income & Revenue Potential',
        icon: Landmark,
        description: 'Profitability model, investment & cabin yields',
        badge: 'Revenue',
      },
      {
        id: 'franchiseProcess',
        label: 'Path to Ownership',
        icon: Route,
        description: '5-step launch roadmap & arrangement layout styles',
        badge: 'Roadmap',
      },
      {
        id: 'franchiseSupport',
        label: 'Operational Support',
        icon: LifeBuoy,
        description: 'Pillars of support, brochure download CTA & layout styles',
        badge: 'Support',
      },
      {
        id: 'franchiseRequirements',
        label: 'Space & Requirements',
        icon: CheckSquare,
        description: 'Physical space specs, building criteria & investment capability note',
        badge: 'Criteria',
      },
      {
        id: 'franchiseTestimonials',
        label: 'Voice of Franchise Partners',
        icon: MessageSquareQuote,
        description: 'Partner reviews, testimonials & success quotes',
        badge: 'Reviews',
      },
      {
        id: 'franchiseInquiry',
        label: 'Franchise Application Form',
        icon: Send,
        description: 'Form replica, field switches, budget tiers, WhatsApp CTA & leads sync',
        badge: 'Form & Leads',
      },
    ],
  },
  {
    id: 'appearance',
    category: 'Appearance & Design',
    subtitle: 'Brand colors, neon accents & typography fonts',
    icon: Paintbrush,
    accentColor: 'text-pink-400',
    badgeColor: 'bg-pink-400/20 text-pink-300 border-pink-400/30',
    items: [
      {
        id: 'theme',
        label: 'Theme & Colors',
        icon: Palette,
        description: 'Brand palette presets, neon glow & custom colors',
        badge: 'Palette',
      },
      {
        id: 'typography',
        label: 'Typography & Fonts',
        icon: Type,
        description: 'Primary/secondary fonts, headings & weights',
        badge: 'Fonts',
      },
    ],
  },
  {
    id: 'crm-leads',
    category: 'Customer Leads',
    subtitle: 'Real-time inquiries and applications',
    icon: Users,
    accentColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    items: [
      {
        id: 'bookings',
        label: 'Workspace Leads',
        icon: UserCheck,
        description: 'Desk tours & seat inquiries submitted locally',
        countKey: 'bookings',
      },
      {
        id: 'franchiseInquiries',
        label: 'Franchise Leads',
        icon: Handshake,
        description: 'Franchise expansion applications with WhatsApp & CSV',
        countKey: 'franchise',
      },
    ],
  },
  {
    id: 'system-security',
    category: 'System & Security',
    subtitle: 'Admin credentials, password changes & protection',
    icon: ShieldCheck,
    accentColor: 'text-purple-400',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    items: [
      {
        id: 'security',
        label: 'Account & Password',
        icon: Lock,
        description: 'Update admin email, change login password & reset credentials',
        badge: 'Security',
      },
    ],
  },
];

const STORAGE_KEY = 'startupcafe_admin_nav_expanded';

const getParentCategoryId = (tabId) => {
  const found = NAV_TREE_DATA.find((group) =>
    group.items.some((item) => item.id === tabId)
  );
  return found ? found.id : 'homepage';
};

export default function AdminTreeNav({
  activeTab,
  onSelectTab,
  localBookingsCount = 0,
  franchiseLeadsCount = 0,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion state: by default, only the category containing the active tab is open, rest stay closed
  const [expandedCategories, setExpandedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    const parentId = getParentCategoryId(activeTab);
    const initial = {};
    NAV_TREE_DATA.forEach((group) => {
      initial[group.id] = group.id === parentId;
    });
    return initial;
  });

  // Keep expanded category synced across drawer/desktop instances
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setExpandedCategories(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // When activeTab changes, expand its parent category and keep the rest closed (accordion)
  useEffect(() => {
    if (!activeTab) return;
    const parentId = getParentCategoryId(activeTab);
    setExpandedCategories((prev) => {
      if (prev[parentId]) return prev;
      const nextState = {};
      NAV_TREE_DATA.forEach((group) => {
        nextState[group.id] = group.id === parentId;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  }, [activeTab]);

  // Accordion toggle: opening one category closes the others so unneeded sections stay closed
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const isCurrentlyOpen = !!prev[categoryId];
      const nextState = {};

      // Close all categories
      NAV_TREE_DATA.forEach((group) => {
        nextState[group.id] = false;
      });

      // If clicked category was closed, open it; if it was open, it is now collapsed
      nextState[categoryId] = !isCurrentlyOpen;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  };

  const isAnyExpanded = useMemo(() => {
    return NAV_TREE_DATA.some((group) => !!expandedCategories[group.id]);
  }, [expandedCategories]);

  // Expand all / Collapse all helper
  const handleToggleAll = () => {
    setExpandedCategories(() => {
      const willExpand = !isAnyExpanded;
      const nextState = {};
      NAV_TREE_DATA.forEach((group) => {
        nextState[group.id] = willExpand;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  };

  const getCount = (countKey) => {
    if (countKey === 'bookings') return localBookingsCount;
    if (countKey === 'franchise') return franchiseLeadsCount;
    return null;
  };

  // Filter items if searching
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return NAV_TREE_DATA;

    return NAV_TREE_DATA.map((group) => {
      const matchingItems = group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          group.category.toLowerCase().includes(q)
      );
      return {
        ...group,
        items: matchingItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const activeCategory = useMemo(() => {
    for (const group of NAV_TREE_DATA) {
      if (group.items.some((item) => item.id === activeTab)) {
        return group;
      }
    }
    return NAV_TREE_DATA[0];
  }, [activeTab]);

  return (
    <aside
      className={`glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full'
        }`}
    >
      {/* Tree Header */}
      <div className="p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple/30 to-neon-blue/30 border border-neon-purple/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(176,38,255,0.3)]">
                <Sliders size={16} className="text-neon-purple" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-wide truncate">
                  Navigation Tree
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {NAV_TREE_DATA.length} categories · {NAV_TREE_DATA.reduce((acc, g) => acc + g.items.length, 0)} sections
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {!isCollapsed && (
              <button
                type="button"
                onClick={handleToggleAll}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isAnyExpanded ? 'Collapse all categories' : 'Expand all categories'}
              >
                <ChevronsUpDown size={15} />
              </button>
            )}

            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Search input (when not collapsed) */}
        {!isCollapsed && (
          <div className="mt-3 relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter sections..."
              className="w-full pl-8.5 pr-8 py-1.5 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple/60 focus:ring-1 focus:ring-neon-purple/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tree Content */}
      <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
        {filteredGroups.map((group) => {
          const isExpanded = expandedCategories[group.id] || searchQuery.length > 0;
          const GroupIcon = group.icon;
          const hasActiveItem = group.items.some((i) => i.id === activeTab);

          return (
            <div key={group.id} className="relative">
              {/* Category Subheading / Folder Root */}
              {!isCollapsed ? (
                <button
                  type="button"
                  onClick={() => toggleCategory(group.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer group ${hasActiveItem
                      ? 'bg-white/[0.04] text-white'
                      : 'text-slate-300 hover:bg-white/[0.02] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${group.badgeColor} border shadow-sm transition-transform group-hover:scale-105`}
                    >
                      <GroupIcon size={13} className={group.accentColor} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 group-hover:text-white truncate">
                      {group.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                      {group.items.length}
                    </span>
                    <span className="text-slate-400 transition-transform duration-200">
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                  </div>
                </button>
              ) : (
                <div
                  className="flex justify-center py-1 text-slate-400"
                  title={group.category}
                >
                  <GroupIcon size={16} className={group.accentColor} />
                </div>
              )}

              {/* Tree Items */}
              {isExpanded && (
                <div className="mt-1 relative pl-5 ml-2 space-y-1">
                  {group.items.map((item, idx) => {
                    const isActive = activeTab === item.id;
                    const ItemIcon = item.icon;
                    const count = getCount(item.countKey);
                    const isLast = idx === group.items.length - 1;

                    return (
                      <div key={item.id} className="relative flex items-center">
                        {/* Tree Branch: Vertical Trunk Segment */}
                        {!isCollapsed && (
                          <div
                            className={`absolute -left-3.5 w-[1.5px] pointer-events-none transition-colors ${isLast ? 'top-0 h-1/2' : 'top-0 bottom-0'
                              } ${isActive ? 'bg-neon-purple/50' : 'bg-white/15'}`}
                          />
                        )}

                        {/* Tree Branch: Horizontal Elbow */}
                        {!isCollapsed && (
                          <div
                            className={`absolute -left-3.5 w-3 h-[1.5px] top-1/2 pointer-events-none transition-colors ${isActive ? 'bg-neon-purple/70' : 'bg-white/15'
                              }`}
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectTab(item.id)}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer group relative ${isActive
                              ? 'bg-gradient-to-r from-neon-purple/25 to-neon-blue/20 text-white font-semibold border border-neon-purple/50 shadow-[0_0_15px_rgba(176,38,255,0.25)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                            } ${isCollapsed ? 'justify-center px-1' : ''}`}
                        >
                          {/* Active left indicator pill */}
                          {isActive && !isCollapsed && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-gradient-to-b from-neon-purple to-neon-blue" />
                          )}

                          {/* Icon with subtle background */}
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${isActive
                                ? 'bg-neon-purple/30 text-white border border-neon-purple/40 shadow-[0_0_8px_rgba(176,38,255,0.4)]'
                                : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                              }`}
                          >
                            <ItemIcon size={13} />
                          </div>

                          {/* Label & Description */}
                          {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-xs truncate ${isActive
                                      ? 'text-white font-bold'
                                      : 'text-slate-300 group-hover:text-white'
                                    }`}
                                >
                                  {item.label}
                                </span>

                                {/* Badges / Counts */}
                                {count !== null && (
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-sm ${count > 0
                                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse'
                                        : 'bg-white/10 text-slate-400 border border-white/10'
                                      }`}
                                  >
                                    {count}
                                  </span>
                                )}

                                {item.badge && count === null && (
                                  <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-white/10 text-slate-400 shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Collapsed dot for active or leads count */}
                          {isCollapsed && count !== null && count > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[9px] font-bold text-black flex items-center justify-center">
                              {count}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="p-4 text-center text-xs text-slate-400">
            No sections match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Tree Footer: Active Section Breadcrumb */}
      {!isCollapsed && activeCategory && (
        <div className="p-3 border-t border-white/10 bg-white/[0.02] text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 truncate">
            <span className="truncate">{activeCategory.category}</span>
            <span>›</span>
            <span className="text-white font-semibold truncate">
              {NAV_TREE_DATA.flatMap((g) => g.items).find((i) => i.id === activeTab)?.label}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        </div>
      )}
    </aside>
  );
}
