import { useState, useMemo } from "react";
import {
  Building2,
  MapPin,
  PhoneCall,
  X,
  Search,
  CheckCircle2,
  Shield,
  Filter,
  Navigation,
  Sparkles,
  Users,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import type { Hazard, RelocationHub } from "@/lib/hazards";

interface ShelterDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hazard?: Hazard | null;
  initialDistrict?: string | null;
  initialState?: string | null;
}

export function ShelterDirectoryModal({
  isOpen,
  onClose,
  hazard,
  initialDistrict = null,
  initialState = null,
}: ShelterDirectoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>(initialState || "all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const allShelters: RelocationHub[] = useMemo(
    () => hazard?.relocationHubs ?? [],
    [hazard?.relocationHubs],
  );

  // Extract unique states & types
  const states = useMemo(() => {
    const s = new Set<string>();
    allShelters.forEach((hub) => s.add(hub.state));
    return Array.from(s);
  }, [allShelters]);

  const shelterTypes = useMemo(() => {
    const t = new Set<string>();
    allShelters.forEach((hub) => t.add(hub.type));
    return Array.from(t);
  }, [allShelters]);

  // Filter shelters
  const filteredShelters = useMemo(() => {
    return allShelters.filter((hub) => {
      // State filter
      if (selectedState !== "all" && hub.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      // Type filter
      if (selectedType !== "all" && hub.type !== selectedType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = hub.name.toLowerCase().includes(query);
        const matchesDistrict = hub.district.toLowerCase().includes(query);
        const matchesState = hub.state.toLowerCase().includes(query);
        const matchesFacility = hub.facilities.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesDistrict && !matchesState && !matchesFacility) {
          return false;
        }
      }
      return true;
    });
  }, [allShelters, selectedState, selectedType, searchQuery]);

  if (!isOpen) return null;

  const formatType = (typeStr: string) => {
    switch (typeStr) {
      case "cyclone_shelter":
        return "Multi-Purpose Cyclone Shelter";
      case "flood_relief_camp":
        return "Flood Evacuation & Relief Camp";
      case "district_hospital":
        return "District Emergency Hospital Hub";
      case "community_hall":
        return "Reinforced Community Safe Hall";
      case "heat_relief_center":
        return "Shaded Hydration & Cooling Oasis";
      case "lightning_safety_shelter":
        return "Surge-Protected Lightning Shelter";
      default:
        return typeStr.replace(/_/g, " ").toUpperCase();
    }
  };

  const totalCapacity = allShelters.reduce((acc, h) => acc + (h.capacity || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-background border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* TOP HEADER */}
        <div className="p-4 sm:p-5 border-b border-border bg-panel/70 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Designated Emergency Relocation Shelters
                </h3>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Verified Safe Elevation
                </span>
              </div>
              <p className="text-xs text-subtle-foreground mt-0.5">
                Target Hazard:{" "}
                <strong className="text-foreground">{hazard?.name || "All Hazards"}</strong> ·{" "}
                <span>{allShelters.length} Verified Centers</span> · Total Evacuation Capacity:{" "}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {totalCapacity.toLocaleString()} Persons
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-panel hover:text-foreground transition cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="p-3 sm:p-4 border-b border-border bg-background/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by shelter name, district, state, or facility (e.g. Solar, RO Water, Medical)..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-panel/70 border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground shrink-0">
              <Filter className="size-3" />
              <span>State:</span>
            </div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="rounded-lg bg-panel border border-border px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All States ({states.length})</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          {shelterTypes.length > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg bg-panel border border-border px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">All Types</option>
                {shelterTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SHELTERS LIST BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredShelters.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-panel/30 border border-dashed border-border space-y-2">
              <Building2 className="size-8 text-muted-foreground mx-auto opacity-50" />
              <h4 className="text-sm font-semibold text-foreground">No shelters found</h4>
              <p className="text-xs text-subtle-foreground max-w-sm mx-auto">
                No shelters match your search criteria. Try clearing search filters or changing
                state selection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedState("all");
                  setSelectedType("all");
                }}
                className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredShelters.map((hub, idx) => {
                return (
                  <div
                    key={`${hub.name}-${idx}`}
                    className="p-4 rounded-xl border border-border bg-panel/60 hover:bg-panel/90 transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {formatType(hub.type)}
                        </span>
                        <span className="font-mono text-subtle-foreground bg-background/80 px-2 py-0.5 rounded border border-border font-semibold flex items-center gap-1">
                          <Compass className="size-2.5 text-emerald-500" />+{hub.elevationMeters}m
                          MSL
                        </span>
                      </div>

                      {/* Shelter Title & Location */}
                      <h4 className="text-sm font-bold text-foreground mt-2 leading-snug">
                        {hub.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <MapPin className="size-3.5 text-emerald-500 shrink-0" />
                        <span>
                          <strong className="text-foreground">{hub.district}</strong>, {hub.state}
                        </span>
                      </p>

                      {/* Verified Facilities Chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hub.facilities.map((fac) => (
                          <span
                            key={fac}
                            className="rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-medium text-foreground border border-border flex items-center gap-1"
                          >
                            <CheckCircle2 className="size-2.5 text-emerald-500 shrink-0" />
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer: Capacity, Hotline & Directions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-subtle-foreground text-[11px]">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>
                          Capacity:{" "}
                          <strong className="text-foreground">
                            {hub.capacity.toLocaleString()}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${hub.contactNumber}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition shadow-sm"
                        >
                          <PhoneCall className="size-3" />
                          <span>{hub.contactNumber}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hub.name}, ${hub.district}, ${hub.state}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-panel hover:bg-panel-muted text-muted-foreground hover:text-foreground border border-border transition"
                          title="Open Google Maps Directions"
                        >
                          <Navigation className="size-3.5 text-sky-500" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM MODAL FOOTER */}
        <div className="p-3 sm:p-4 border-t border-border bg-panel/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-subtle-foreground shrink-0">
          <div className="flex items-center gap-2 text-[11px]">
            <Shield className="size-3.5 text-emerald-500" />
            <span>
              All shelters are equipped with 24x7 emergency backup generator, RO potable water, and
              SDRF task force connectivity.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-foreground text-background font-bold text-xs hover:opacity-90 transition cursor-pointer self-end sm:self-auto"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
