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
    <div className="flex items-center gap-2">
      <span className="text-[9px] uppercase tracking-widest text-subtle-foreground">Language</span>
      {codes.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          className={`rounded px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors ${
            lang === code
              ? "bg-hazard-safe/20 text-hazard-safe ring-1 ring-hazard-safe/50"
              : "text-subtle-foreground hover:text-muted-foreground"
          }`}
        >
          {LANGUAGES[code].native}
        </button>
      ))}
    </div>
  );
}
