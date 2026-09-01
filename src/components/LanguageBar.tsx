import { HAZARD_LANGUAGES, LANGUAGES, type LangCode } from "@/lib/i18n";
import type { HazardId } from "@/lib/hazards";

export function LanguageBar({
  hazardId,
  lang,
  onChange,
}: {
  hazardId: HazardId;
  lang: LangCode;
  onChange: (l: LangCode) => void;
}) {
  const codes = HAZARD_LANGUAGES[hazardId];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[9px] font-semibold uppercase tracking-wider text-subtle-foreground mr-0.5">
        Language:
      </span>
      {codes.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          className={`cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-all ${
            lang === code
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/50 shadow-sm"
              : "bg-panel text-muted-foreground hover:text-foreground border border-border/60 hover:bg-panel-muted"
          }`}
        >
          {LANGUAGES[code].native}
        </button>
      ))}
    </div>
  );
}
