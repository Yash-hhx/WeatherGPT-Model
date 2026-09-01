import type { CardText, LangCode } from "./i18n";
import { CYCLONE_CARD_TRANSLATIONS } from "./translations/cyclone";
import { FLOOD_CARD_TRANSLATIONS } from "./translations/flood";
import { HEAT_CARD_TRANSLATIONS } from "./translations/heat";
import { THUNDERSTORM_CARD_TRANSLATIONS } from "./translations/thunderstorm";
import { AIRQUALITY_CARD_TRANSLATIONS } from "./translations/airquality";
import { LANDSLIDE_CARD_TRANSLATIONS } from "./translations/landslide";

/** Comprehensive multi-lingual translation dictionary for all 90 flashcards, actions, and main tips */
export const CARD_TIPS_TRANSLATIONS: Record<string, Partial<Record<LangCode, CardText>>> = {
  ...CYCLONE_CARD_TRANSLATIONS,
  ...FLOOD_CARD_TRANSLATIONS,
  ...HEAT_CARD_TRANSLATIONS,
  ...THUNDERSTORM_CARD_TRANSLATIONS,
  ...AIRQUALITY_CARD_TRANSLATIONS,
  ...LANDSLIDE_CARD_TRANSLATIONS,
};
