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
import { translateCard, translateOccupation, translatePhase, type LangCode } from "@/lib/i18n";

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
  const translatedActivePhase = translatePhase(activePhase, lang);

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
    if (lang === "hi") {
      switch (occ) {
        case "farmer":
          return phase === "before"
            ? "किसान दिशा-निर्देश: कटाई, फसल सुरक्षा, पंपसेट व पशुधन को सुरक्षित स्थान पर पहुंचाना"
            : phase === "during"
              ? "किसान दिशा-निर्देश: आकाशीय बिजली व बाढ़ से बचाव, खुले खेतों से तुरंत सुरक्षित शेड में जाएं"
              : "किसान दिशा-निर्देश: खेतों से खारे पानी की निकासी, चारे का कीटाणुशोधन व पीएमएफबीवाई क्लेम";
        case "business":
          return phase === "before"
            ? "व्यापार व एमएसएमई: इन्वेंट्री वॉटरप्रूफिंग, जनरेटर सुरक्षित करना व डेटा बैकअप"
            : phase === "during"
              ? "व्यापार व एमएसएमई: काम बंद, बिजली आइसोलेशन व कर्मचारियों की सुरक्षा सत्यापन"
              : "व्यापार व एमएसएमई: विद्युत ग्रिड पुनर्बहाली जांच व बीमा क्षतिपूर्ति क्लेम";
        case "commuter":
          return phase === "before"
            ? "यातायात व रसद: तटीय हाईवे व अंडरपास अलर्ट, पेड़ गिरने का खतरा व सुरक्षित पार्किंग"
            : phase === "during"
              ? "यातायात व रसद: जलमग्न पुल व कॉजवे पार न करें — यात्रा तुरंत रोकें"
              : "यातायात व रसद: सड़क निकासी सत्यापन, गड्ढों से बचाव व रूट स्टेटस";
        case "government":
          return phase === "before"
            ? "प्रशासन व आपदा बल: अनिवार्य निकासी आदेश, सायरन अलर्ट व सैटेलाइट फोन टेस्टिंग"
            : phase === "during"
              ? "प्रशासन व आपदा बल: जिला आपदा केंद्र 1077 लाइव मॉनिटरिंग, एनडीआरएफ बोट व आपातकालीन राहत"
              : "प्रशासन व आपदा बल: क्लोरीन/ओआरएस वितरण, राहत शिविर स्वच्छता व महामारी रोकथाम";
        default:
          return phase === "before"
            ? "नागरिक व निवासी: 72 घंटे का राशन, शुद्ध पानी, दवाएं, टॉर्च व निकासी बैग तैयार रखें"
            : phase === "during"
              ? "नागरिक व निवासी: सुरक्षित कमरे में रहें, बिजली/गैस बंद रखें व 112/1077 हेल्पलाइन पर संपर्क करें"
              : "नागरिक व निवासी: पानी उबालकर पिएं, टूटे बिजली तारों से दूर रहें व नुकसान दर्ज कराएं";
      }
    }

    if (lang === "bn") {
      switch (occ) {
        case "farmer":
          return "কৃষক ও কৃষি সুরক্ষা নির্দেশিকা: ফসল, গবাদি পশু ও পাম্পসেট রক্ষা";
        case "business":
          return "ব্যবসা ও বাণিজ্য: পণ্যসামগ্রী ও বিদ্যুৎ সুরক্ষা নির্দেশিকা";
        case "commuter":
          return "পরিবহন ও যাত্রী: প্লাবিত রাস্তা ও উপকূলীয় এলাকা পরিহার";
        case "government":
          return "প্রশাসন ও উদ্ধারকারী দল: জরুরি ত্রাণ ও সহায়তা পরিচালনা";
        default:
          return "নাগরিক ও বাসিন্দা: জরুরি রসদ, পানীয় জল ও আশ্রয় প্রস্তুতি";
      }
    }

    if (lang === "or") {
      switch (occ) {
        case "farmer":
          return "କୃଷକ ପରାମର୍ଶ: ଫସଲ ଅମଳ, ପମ୍ପସେଟ୍ ସୁରକ୍ଷା ଓ ଗୋରୁଗାଈ ସ୍ଥାନାନ୍ତର";
        case "business":
          return "ବ୍ୟବସାୟ ଓ ଶିଳ୍ପ: ସାମଗ୍ରୀ ସୁରକ୍ଷା ଓ ବିଦ୍ୟୁତ ବିଚ୍ଛିନ୍ନତା";
        case "commuter":
          return "ପରିବହନ ଓ ଯାତ୍ରୀ: ବନ୍ୟା ପ୍ରଭାବିତ ରାସ୍ତାରୁ ଦୂରେଇ ରୁହନ୍ତୁ";
        case "government":
          return "ପ୍ରଶାସନ ଓ ଉଦ୍ଧାରକାରୀ ଦଳ: ରିଲିଫ୍ ଓ ଆଶ୍ରୟସ୍ଥଳୀ ପରିଚାଳନା";
        default:
          return "ସାଧାରଣ ନାଗରିକ: ଶୁଖିଲା ଖାଦ୍ୟ, ପିଇବା ପାଣି ଓ ଆଶ୍ରୟସ୍ଥଳୀ ପ୍ରସ୍ତୁତି";
      }
    }

    if (lang === "mr") {
      switch (occ) {
        case "farmer":
          return "शेतकरी मार्गदर्शक: पीक संरक्षण, जनावरांची निगा व शेती कामे";
        case "business":
          return "उद्योग व व्यापारी: यंत्रसामग्री व वीज जोडणी सुरक्षितता";
        case "commuter":
          return "वाहतूक व प्रवासी: पाणी साचलेले रस्ते व दरड कोसळण्यापासून बचाव";
        case "government":
          return "प्रशासन व मदत कार्य: आपत्कालीन प्रतिसाद व नियंत्रण कक्ष";
        default:
          return "नागरिक व रहिवासी: सुरक्षित निवारा, पिण्याचे पाणी व आपत्कालीन मदत";
      }
    }

    if (lang === "gu") {
      switch (occ) {
        case "farmer":
          return "ખેડૂત માર્ગદર્શિકા: પાક રક્ષણ, પશુધન સ્થળાંતર અને પિયત વ્યવસ્થા";
        case "business":
          return "વેપાર અને ઉદ્યોગ: માલસામાન રક્ષણ અને વીજ નિયંત્રણ";
        case "commuter":
          return "વાહનવ્યવહાર: પાણી ભરાયેલા રસ્તાઓ ટાળો અને સલામત રહો";
        case "government":
          return "તંત્ર અને આપત્તિ વ્યવસ્થાપન: કટોકટી બચાવ અને રાહત કામગીરી";
        default:
          return "નાગરિકો અને રહેવાસીઓ: રાશન, પીવાનું પાણી અને આશ્રય તૈયારી";
      }
    }

    if (lang === "ta") {
      switch (occ) {
        case "farmer":
          return "விவசாயிகள் வழிகாட்டுதல்: பயிர் பாதுகாப்பு & கால்நடை பராமரிப்பு";
        case "business":
          return "வணிகம் & தொழில்கள்: சொத்து பாதுகாப்பு & மின் இணைப்பு துண்டிப்பு";
        case "commuter":
          return "போக்குவரத்து: நீர் தேங்கிய சாலைகளைத் தவிர்த்தல்";
        case "government":
          return "அரசு & மீட்புப் பணி: கட்டுப்பாட்டு அறை & நிவாரண முகாம்கள்";
        default:
          return "பொதுமக்கள்: அவசரத் தேவைகள், குடிநீர் & முகாம் பாதுகாப்பு";
      }
    }

    if (lang === "te") {
      switch (occ) {
        case "farmer":
          return "రైతుల మార్గదర్శకాలు: పంటల రక్షణ & పశువుల తరలింపు";
        case "business":
          return "వ్యాపార సంస్థలు: ఆస్తుల రక్షణ & విద్యుత్ నియంత్రణ";
        case "commuter":
          return "రవాణా & ప్రయాణాలు: ముంపునకు గురైన మార్గాలను నివారించండి";
        case "government":
          return "ప్రభుత్వ యంత్రాంగం: పునరావాస చర్యలు & సహాయక బృందాలు";
        default:
          return "పౌరుల భద్రత: తాగునీరు, నిత్యావసరాలు & షెల్టర్ సంసిద్ధత";
      }
    }

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
              {lang === "hi"
                ? "आपदा प्रबंधन व जीवन चक्र सावधानियां"
                : lang === "bn"
                  ? "দুর্যোগ প্রতিক্রিয়া ও সতর্কতা নির্দেশিকা"
                  : lang === "or"
                    ? "ବିପର୍ଯ୍ୟୟ ପ୍ରତିକ୍ରିୟା ଓ ସତର୍କତା ନିୟମାବଳୀ"
                    : lang === "mr"
                      ? "आपत्ती प्रतिसाद व सुरक्षा उपाययोजना"
                      : lang === "gu"
                        ? "આપત્તિ વ્યવસ્થાપન અને સાવચેતીનાં પગલાં"
                        : lang === "ta"
                          ? "பேரிடர் முன்னெச்சரிக்கை வழிகாட்டுதல்கள்"
                          : lang === "te"
                            ? "విపత్తు నిర్వహణ & ముందస్తు జాగ్రత్తలు"
                            : "Disaster Response & Lifecycle Precautions"}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-subtle-foreground">
            <span className="text-border">•</span>
            <span>
              {lang === "hi"
                ? "चिह्नित आपदा: "
                : lang === "bn"
                  ? "নির্দিষ্ট দুর্যোগ: "
                  : lang === "or"
                    ? "ଚିହ୍ନିତ ବିପର୍ଯ୍ୟୟ: "
                    : "Target Hazard: "}
              <strong className="text-foreground">{hazard.name}</strong>
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
              <span>
                {lang === "hi"
                  ? "आपातकालीन हेल्पलाइन"
                  : lang === "bn"
                    ? "জরুরি হেল্পলাইন"
                    : lang === "or"
                      ? "ଜରୁରୀ ହେଲ୍ପଲାଇନ୍"
                      : lang === "mr"
                        ? "आपत्कालीन संपर्क"
                        : lang === "gu"
                          ? "ઇમરજન્સી હેલ્પલાઇન"
                          : lang === "ta"
                            ? "அவசர எண்கள்"
                            : lang === "te"
                              ? "అత్యవసర హెల్ప్‌లైన్"
                              : "SOS Helplines"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSheltersModal(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition cursor-pointer bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
            >
              <Home className="size-3" />
              <span>
                {lang === "hi"
                  ? `राहत आश्रय केंद्र (${hazard.relocationHubs?.length || 0})`
                  : lang === "bn"
                    ? `আশ্রয় কেন্দ্র (${hazard.relocationHubs?.length || 0})`
                    : lang === "or"
                      ? `ଆଶ୍ରୟସ୍ଥଳୀ (${hazard.relocationHubs?.length || 0})`
                      : lang === "mr"
                        ? `निवारा केंद्र (${hazard.relocationHubs?.length || 0})`
                        : lang === "gu"
                          ? `આશ્રય કેન્દ્રો (${hazard.relocationHubs?.length || 0})`
                          : lang === "ta"
                            ? `நிவாரண முகாம்கள் (${hazard.relocationHubs?.length || 0})`
                            : lang === "te"
                              ? `పునరావాస కేంద్రాలు (${hazard.relocationHubs?.length || 0})`
                              : `Relocation Shelters (${hazard.relocationHubs?.length || 0})`}
              </span>
            </button>
          </div>

          <LanguageBar hazardId={hazard.id} lang={lang} onChange={onLangChange} />
        </div>
      </div>

      {/* Disaster Lifecycle Phase Selector (Before / During / After) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DISASTER_PHASES.map((p) => {
          const isSelected = activePhase === p.id;
          const phaseTrans = translatePhase(p.id, lang);
          const displayLabel = phaseTrans?.iconLabel || p.iconLabel;
          const displayDesc = phaseTrans?.desc || p.desc;

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
                  {displayLabel}
                </span>
                {isSelected && <CheckCircle2 className="size-3.5 text-hazard-safe shrink-0" />}
              </div>
              <p className="mt-1 text-[11px] text-subtle-foreground line-clamp-1 leading-snug">
                {displayDesc}
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
              <PhoneCall className="size-3.5" />{" "}
              {lang === "hi"
                ? "राष्ट्रीय आपातकालीन हेल्पलाइन व राहत संपर्क (टोल-फ्री 24x7)"
                : lang === "bn"
                  ? "জরুরি এসওএস ও জাতীয় হেল্পলাইন নম্বর (২৪x৭)"
                  : lang === "or"
                    ? "ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍ ନମ୍ବର (୨୪x୭ ଟୋଲ୍-ଫ୍ରି)"
                    : lang === "mr"
                      ? "आपत्कालीन संपर्क व राष्ट्रीय हेल्पलाईन (२४x७)"
                      : lang === "gu"
                        ? "રાષ્ટ્રીય ઇમરજન્સી હેલ્પલાઇન અને સંપર્ક (૨૪x૭)"
                        : lang === "ta"
                          ? "தேசிய அவசர உதவி எண்கள் (24x7)"
                          : lang === "te"
                            ? "జాతీయ అత్యవసర హెల్ప్‌లైన్ నంబర్లు (24x7)"
                            : "Emergency SOS Contacts & National Helplines (Toll-Free 24x7)"}
            </span>
            <button
              type="button"
              onClick={() => setShowHelplines(false)}
              className="text-[10px] text-subtle-foreground hover:text-foreground uppercase tracking-wider cursor-pointer font-bold"
            >
              {lang === "hi" ? "बंद करें" : "Close"}
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
            {lang === "hi"
              ? "लक्षित वर्ग:"
              : lang === "bn"
                ? "উদ্দিষ্ট দল:"
                : lang === "or"
                  ? "ଲକ୍ଷ୍ୟଧାର୍ଯ୍ୟ ବର୍ଗ:"
                  : lang === "mr"
                    ? "लक्षित गट:"
                    : lang === "gu"
                      ? "લક્ષિત જૂથ:"
                      : lang === "ta"
                        ? "பிரிவு:"
                        : lang === "te"
                          ? "వర్గం:"
                          : "Target Audience:"}
          </span>
        </div>
        <nav className="flex flex-wrap gap-1.5">
          {OCCUPATIONS.map((o) => {
            const isSelected = occupation === o.id;
            const translatedOccLabel = translateOccupation(o.id, lang) || o.label;
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
                <span>{translatedOccLabel}</span>
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
          {cards.length}{" "}
          {lang === "hi"
            ? "सुरक्षा निर्देश"
            : lang === "bn"
              ? "নির্দেশিকা"
              : lang === "or"
                ? "ନିର୍ଦ୍ଦେଶାବଳୀ"
                : "Action Directives"}
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
            const t = translateCard(
              hazard.id,
              lang,
              card.label,
              card.action,
              card.details,
              card.occupation,
              card.phase,
            );
            const translatedOccName = translateOccupation(card.occupation, lang) || card.occupation;

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

                  {(t?.details || card.details) && (
                    <p className="mt-2 rounded-lg bg-background/80 p-2 text-[11px] leading-relaxed text-muted-foreground border border-border/60">
                      {t?.details ?? card.details}
                    </p>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-border/80 flex items-center justify-between text-[10px] text-subtle-foreground">
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    {getOccupationIcon(card.occupation)}
                    <span>{translatedOccName}</span>
                  </span>
                  <span className="font-mono">
                    {translatedActivePhase?.iconLabel || card.phase || activePhase}
                  </span>
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
