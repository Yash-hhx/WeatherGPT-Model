import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Home,
  LifeBuoy,
  MapPin,
  PhoneCall,
  Shield,
  ShieldAlert,
  Users,
  Sprout,
  Store,
  Truck,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";

import { LanguageBar } from "@/components/LanguageBar";
import { ShelterDirectoryModal } from "@/components/ShelterDirectoryModal";
import {
  DISASTER_PHASES,
  EMERGENCY_HELPLINES,
  OCCUPATIONS,
  severityBorder,
  severityText,
  type DisasterPhase,
  type Hazard,
  type Occupation,
} from "@/lib/hazards";
import { translateCard, type LangCode } from "@/lib/i18n";

export function PrecautionDeck({
  hazard,
  lang,
  onLangChange,
}: {
  hazard: Hazard;
  lang: LangCode;
  onLangChange: (l: LangCode) => void;
}) {
  const [activePhase, setActivePhase] = useState<DisasterPhase>("before");
  const [occupation, setOccupation] = useState<Occupation>("civilian");
  const [showHelplines, setShowHelplines] = useState(false);
  const [showSheltersModal, setShowSheltersModal] = useState(false);

  // Filter cards strictly for selected occupation and active phase, fallback to all cards for this occupation
  const occupationCards = (hazard.cards ?? []).filter((c) => c.occupation === occupation);
  const phaseOccupationCards = occupationCards.filter((c) => !c.phase || c.phase === activePhase);

  // If specific phase cards exist for this occupation, use them; otherwise use all cards for this occupation
  const cards =
    phaseOccupationCards.length > 0
      ? phaseOccupationCards
      : occupationCards.length > 0
        ? occupationCards
        : (hazard.cards ?? []).filter((c) => !c.phase || c.phase === activePhase);

  const activePhaseMeta = DISASTER_PHASES.find((p) => p.id === activePhase) ?? DISASTER_PHASES[0];

  const getOccupationIcon = (occ: Occupation) => {
    switch (occ) {
      case "farmer":
        return <Sprout className="size-3.5 text-emerald-500" />;
      case "business":
        return <Store className="size-3.5 text-amber-500" />;
      case "commuter":
        return <Truck className="size-3.5 text-sky-500" />;
      case "government":
        return <ShieldAlert className="size-3.5 text-red-500" />;
      default:
        return <Users className="size-3.5 text-emerald-500" />;
    }
  };

  const getAudienceHeadline = (occ: Occupation, phase: DisasterPhase) => {
    switch (occ) {
      case "farmer":
        return phase === "before"
          ? "Kisan Protocol: Pre-Impact Harvest, Crop Protection & Livestock Relocation"
          : phase === "during"
            ? "Kisan Protocol: High-Voltage Lightning & In-Field Flood Survival Rules"
            : "Kisan Protocol: Saline Drainage, Fodder Disinfection & 72-Hour PMFBY Claims";
      case "business":
        return phase === "before"
          ? "MSME & Industry: Asset Waterproofing, DG Set Lockdown & Cloud Data Backup"
          : phase === "during"
            ? "MSME & Industry: Shift Cancellation, Power Isolation & Emergency Staff Roll-Call"
            : "MSME & Industry: Electrical Grid Reconnection Audit & SDRF Insurance Claims";
      case "commuter":
        return phase === "before"
          ? "Transport & Fleet: Coastal Highway Closures, Tree-Fall Hazards & Parking Safety"
          : phase === "during"
            ? "Transport & Fleet: 'Turn Around, Don't Drown' — Bridge & Subway Inundation Protocols"
            : "Transport & Fleet: Route Clearance Verification, Pothole Hazards & Transport Portal Updates";
      case "government":
        return phase === "before"
          ? "First Responders: Mandatory Evacuation Orders, Siren Alerts & SAT-Phone Testing"
          : phase === "during"
            ? "First Responders: Live DEOC 1077 Dispatch, NDRF Boat Staging & Emergency Triage"
            : "First Responders: Chlorine/ORS Supply Distribution, Camp Sanitation & Epidemic Control";
      default:
        return phase === "before"
          ? "Civilian & Residents: Emergency Supply Bag, Roof Securing & Pre-Evacuation Readiness"
          : phase === "during"
            ? "Civilian & Residents: Interior Safe Room, Gas/Power Shut-Off & Emergency Helpline SOS"
            : "Civilian & Residents: Water Chlorination, Live Wire Avoidance & Structural Damage Verification";
    }
  };

  return (
    <div className="flex flex-col shrink-0 border-t border-border bg-background/95 p-4 lg:p-6 backdrop-blur-xl transition-all">
      {/* Top Header with Phase Controls & Language Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-hazard-safe" />
            <h2 className="font-display text-sm uppercase tracking-widest text-foreground font-bold">
              Disaster Response & Lifecycle Precautions
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-subtle-foreground">
            <span className="text-border">•</span>
            <span>
              Target Hazard: <strong className="text-foreground">{hazard.name}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowHelplines((v) => !v)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                showHelplines
                  ? "bg-hazard-critical text-white shadow-sm"
                  : "bg-panel text-muted-foreground hover:text-foreground border border-border hover:bg-panel-muted"
              }`}
            >
              <PhoneCall className="size-3" />
              <span>SOS Helplines</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSheltersModal(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
            >
              <Home className="size-3" />
              <span>Relocation Shelters ({hazard.relocationHubs?.length || 0})</span>
            </button>
          </div>

          <LanguageBar hazardId={hazard.id} lang={lang} onChange={onLangChange} />
        </div>
      </div>

      {/* Disaster Lifecycle Phase Selector (Before / During / After) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DISASTER_PHASES.map((p) => {
          const isSelected = activePhase === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePhase(p.id)}
              className={`flex flex-col text-left rounded-lg p-2.5 transition border cursor-pointer ${
                isSelected
                  ? p.id === "before"
                    ? "border-sky-500/80 bg-sky-500/10 text-foreground ring-1 ring-sky-500/50 shadow-sm"
                    : p.id === "during"
                      ? "border-hazard-critical/80 bg-hazard-critical/10 text-foreground ring-1 ring-hazard-critical/50 shadow-sm"
                      : "border-emerald-500/80 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500/50 shadow-sm"
                  : "border-border bg-panel/60 text-muted-foreground hover:bg-panel hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {p.iconLabel}
                </span>
                {isSelected && <CheckCircle2 className="size-3.5 text-hazard-safe shrink-0" />}
              </div>
              <p className="mt-1 text-[11px] text-subtle-foreground line-clamp-1 leading-snug">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Helpline Tray Drawer */}
      {showHelplines && (
        <div className="mt-3 rounded-lg border border-hazard-critical/40 bg-panel p-3 animate-in fade-in duration-200 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-hazard-critical flex items-center gap-1.5">
              <PhoneCall className="size-3.5" /> Emergency SOS Contacts & National Helplines
              (Toll-Free 24x7)
            </span>
            <button
              type="button"
              onClick={() => setShowHelplines(false)}
              className="text-[10px] text-subtle-foreground hover:text-foreground uppercase tracking-wider cursor-pointer font-bold"
            >
              Close
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {EMERGENCY_HELPLINES.map((h) => (
              <a
                key={h.agency}
                href={`tel:${h.number.split(" / ")[0]}`}
                className="rounded-lg bg-background/90 p-2 border border-border flex flex-col hover:border-hazard-critical/60 transition group cursor-pointer"
              >
                <span className="font-display text-sm font-bold text-hazard-critical group-hover:underline">
                  {h.number}
                </span>
                <span className="text-[10px] font-semibold text-foreground truncate">
                  {h.agency}
                </span>
                <span className="text-[9px] text-subtle-foreground line-clamp-1">
                  {h.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Target Audience Selector Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-xs text-subtle-foreground font-semibold">
          <Users className="size-3.5 text-emerald-500" />
          <span className="uppercase tracking-wider text-[11px] font-bold text-foreground">
            Target Audience:
          </span>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {OCCUPATIONS.map((o) => {
            const isSelected = occupation === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setOccupation(o.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 shadow-sm font-bold ring-1 ring-emerald-500/20"
                    : "bg-panel text-muted-foreground hover:text-foreground border border-border hover:bg-panel-muted"
                }`}
              >
                {getOccupationIcon(o.id)}
                <span>{o.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dynamic Audience Context Banner */}
      <div className="mt-2.5 rounded-lg bg-panel/70 px-3 py-2 border border-border flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {getOccupationIcon(occupation)}
          <span className="font-bold text-foreground text-[11px] sm:text-xs">
            {getAudienceHeadline(occupation, activePhase)}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider shrink-0 bg-background/80 px-2 py-0.5 rounded border border-border">
          {cards.length} Action Directives
        </span>
      </div>

      {/* Horizontal Flashcards Container */}
      <div className="mt-3 no-scrollbar flex gap-3 overflow-x-auto pb-1">
        {cards.length === 0 ? (
          <div className="w-full rounded-lg border border-border bg-panel/40 p-4 text-center text-xs text-subtle-foreground">
            No specific advisory issued for {occupation} under {activePhaseMeta.label}.
          </div>
        ) : (
          cards.map((card) => {
            const t = translateCard(hazard.id, lang, card.label);
            return (
              <article
                key={`${card.occupation}-${card.label}`}
                className={`w-80 shrink-0 space-y-2 rounded-xl border-l-4 bg-panel/80 p-3.5 ring-1 ring-border shadow-sm flex flex-col justify-between hover:bg-panel transition ${severityBorder[card.severity]}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${severityText[card.severity]}`}
                    >
                      {t?.label ?? card.label}
                    </span>
                    <span className="rounded bg-panel-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/60">
                      {card.severity}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-bold leading-snug text-foreground">
                    {t?.action ?? card.action}
                  </p>

                  {card.details && (
                    <p className="mt-2 rounded-lg bg-background/80 p-2 text-[11px] leading-relaxed text-muted-foreground border border-border/60">
                      {card.details}
                    </p>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-border/80 flex items-center justify-between text-[10px] text-subtle-foreground">
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    {getOccupationIcon(card.occupation)}
                    <span>{card.occupation}</span>
                  </span>
                  <span className="font-mono">{card.phase || activePhase}</span>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* EMERGENCY SHELTER DIRECTORY MODAL */}
      <ShelterDirectoryModal
        isOpen={showSheltersModal}
        onClose={() => setShowSheltersModal(false)}
        hazard={hazard}
      />
    </div>
  );
}
