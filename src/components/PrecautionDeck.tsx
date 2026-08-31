import { useState } from "react";

import { LanguageBar } from "@/components/LanguageBar";
import {
  OCCUPATIONS,
  severityBorder,
  severityText,
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
  const [occupation, setOccupation] = useState<Occupation>("civilian");
  const cards = hazard.cards.filter((c) => c.occupation === occupation);

  return (
    <div className="h-64 shrink-0 border-t border-border bg-background/90 p-6 backdrop-blur-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
          Operational Precautions
        </h2>
        <LanguageBar hazardId={hazard.id} lang={lang} onChange={onLangChange} />
        <nav className="flex gap-4">
          {OCCUPATIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setOccupation(o.id)}
              className={`text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                occupation === o.id
                  ? "border-b border-hazard-safe text-hazard-safe"
                  : "text-subtle-foreground hover:text-muted-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        {cards.length === 0 && (
          <p className="text-xs text-subtle-foreground">
            No specific advisory issued for this group under the current event.
          </p>
        )}
        {cards.map((card) => {
          const t = translateCard(hazard.id, lang, card.label);
          return (
            <article
              key={card.label}
              className={`w-72 shrink-0 space-y-2 rounded-lg border-l-2 bg-panel/50 p-4 ring-1 ring-border ${severityBorder[card.severity]}`}
            >
              <p
                className={`text-[10px] font-medium uppercase tracking-widest ${severityText[card.severity]}`}
              >
                {t?.label ?? card.label}
              </p>
              <p className="text-sm font-medium leading-snug">{t?.action ?? card.action}</p>
              {t && (
                <p className="border-t border-border pt-2 text-[11px] leading-snug text-subtle-foreground">
                  {card.action}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
