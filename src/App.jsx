import React, { useState, useEffect, useRef, useContext, createContext } from "react";

/* ============================== CONSTANTS ============================== */

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const AVATARS = ["🦁", "🐯", "🦊", "🐼", "🐨", "🦉", "🐢", "🐬", "🦄", "🐸", "🐵", "🦅"];
const PROFILE_KEY = "padhai-profile-v1";
const DATA_KEY = "padhai-data-v1";
const FORUM_KEY = "padhai-forum-posts-v1";
const LEADERBOARD_KEY = "padhai-leaderboard-v1";

/* -------- Multi-language support --------
   UI chrome (nav, buttons, labels) is translated locally so the app feels native
   in each language instantly. AI-generated content (lessons, doubt answers,
   quizzes, PYQ sets) is produced live in the chosen language by instructing the
   model, since that text can't be pre-translated. */
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "mr", name: "मराठी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "ur", name: "اردو" },
  { code: "as", name: "অসমীয়া" }
];
const LANG_FULL_NAME = { en: "English", hi: "Hindi", gu: "Gujarati", mr: "Marathi", bn: "Bengali", ta: "Tamil", te: "Telugu", kn: "Kannada", ml: "Malayalam", pa: "Punjabi", or: "Odia", ur: "Urdu", as: "Assamese" };
const LANG_BCP47 = { en: "en-IN", hi: "hi-IN", gu: "gu-IN", mr: "mr-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN", or: "or-IN", ur: "ur-IN", as: "as-IN" };

const TRANSLATIONS = {
  en: { home: "Home", study: "AI Study", library: "Library", pyq: "PYQ Practice", doubt: "Doubt Solver", flashcards: "Flashcards", quiz: "Quiz", planner: "Planner", timer: "Focus Timer", notes: "Notes", skills: "Skills", community: "Community", leaderboard: "Leaderboard",rewards: "Rewards", progress: "Progress", certificate: "Certificate",
    switchProfile: "Switch profile", language: "Language", hey: "Hey", streak: "Streak", level: "Level", coins: "Coins", todaysChallenges: "Today's challenges", generateLesson: "Generate a lesson", askDoubt: "Ask a doubt", takeQuiz: "Take a quiz", startTimer: "Start focus timer", loading: "Loading…", generate: "Generate", save: "Save", add: "Add", delete: "Delete", cancel: "Cancel" },
  hi: { home: "होम", study: "एआई अध्ययन", library: "पुस्तकालय", pyq: "पुराने प्रश्नपत्र", doubt: "प्रश्न समाधान", flashcards: "फ्लैशकार्ड", quiz: "क्विज़", planner: "योजनाकार", timer: "फोकस टाइमर", notes: "नोट्स", skills: "कौशल", community: "समुदाय", leaderboard: "लीडरबोर्ड",rewards: "इनाम", progress: "प्रगति", certificate: "प्रमाणपत्र",
    switchProfile: "प्रोफ़ाइल बदलें", language: "भाषा", hey: "नमस्ते", streak: "स्ट्रीक", level: "स्तर", coins: "सिक्के", todaysChallenges: "आज की चुनौतियाँ", generateLesson: "पाठ बनाएं", askDoubt: "प्रश्न पूछें", takeQuiz: "क्विज़ दें", startTimer: "फोकस टाइमर शुरू करें", loading: "लोड हो रहा है…", generate: "बनाएं", save: "सहेजें", add: "जोड़ें", delete: "हटाएं", cancel: "रद्द करें" },
  gu: { home: "હોમ", study: "એઆઈ અભ્યાસ", library: "લાઇબ્રેરી", pyq: "જૂના પ્રશ્નપત્રો", doubt: "શંકા સમાધાન", flashcards: "ફ્લેશકાર્ડ", quiz: "ક્વિઝ", planner: "પ્લાનર", timer: "ફોકસ ટાઈમર", notes: "નોંધ", skills: "કૌશલ્ય", community: "સમુદાય", leaderboard: "લીડરબોર્ડ",rewards: "ઇનામ", progress: "પ્રગતિ", certificate: "પ્રમાણપત્ર",
    switchProfile: "પ્રોફાઇલ બદલો", language: "ભાષા", hey: "નમસ્તે", streak: "સ્ટ્રીક", level: "લેવલ", coins: "કોઈન્સ", todaysChallenges: "આજના પડકારો", generateLesson: "પાઠ બનાવો", askDoubt: "શંકા પૂછો", takeQuiz: "ક્વિઝ આપો", startTimer: "ફોકસ ટાઈમર શરૂ કરો", loading: "લોડ થઈ રહ્યું છે…", generate: "બનાવો", save: "સેવ કરો", add: "ઉમેરો", delete: "કાઢી નાખો", cancel: "રદ કરો" },
  mr: { home: "मुख्यपृष्ठ", study: "एआय अभ्यास", library: "ग्रंथालय", pyq: "जुनी प्रश्नपत्रिका", doubt: "शंका निरसन", flashcards: "फ्लॅशकार्ड", quiz: "प्रश्नमंजुषा", planner: "नियोजक", timer: "फोकस टायमर", notes: "नोंदी", skills: "कौशल्ये", community: "समुदाय", leaderboard: "लीडरबोर्ड",rewards: "बक्षिसे", progress: "प्रगती", certificate: "प्रमाणपत्र",
    switchProfile: "प्रोफाइल बदला", language: "भाषा", hey: "नमस्कार", streak: "स्ट्रीक", level: "स्तर", coins: "नाणी", todaysChallenges: "आजची आव्हाने", generateLesson: "धडा तयार करा", askDoubt: "शंका विचारा", takeQuiz: "प्रश्नमंजुषा द्या", startTimer: "फोकस टायमर सुरू करा", loading: "लोड होत आहे…", generate: "तयार करा", save: "जतन करा", add: "जोडा", delete: "काढा", cancel: "रद्द करा" },
  bn: { home: "হোম", study: "এআই অধ্যয়ন", library: "গ্রন্থাগার", pyq: "পুরনো প্রশ্নপত্র", doubt: "সন্দেহ সমাধান", flashcards: "ফ্ল্যাশকার্ড", quiz: "কুইজ", planner: "পরিকল্পনাকারী", timer: "ফোকাস টাইমার", notes: "নোট", skills: "দক্ষতা", community: "সম্প্রদায়", leaderboard: "লিডারবোর্ড",rewards: "পুরস্কার", progress: "অগ্রগতি", certificate: "সার্টিফিকেট",
    switchProfile: "প্রোফাইল পরিবর্তন করুন", language: "ভাষা", hey: "নমস্কার", streak: "স্ট্রিক", level: "লেভেল", coins: "কয়েন", todaysChallenges: "আজকের চ্যালেঞ্জ", generateLesson: "পাঠ তৈরি করুন", askDoubt: "প্রশ্ন জিজ্ঞাসা করুন", takeQuiz: "কুইজ দিন", startTimer: "ফোকাস টাইমার শুরু করুন", loading: "লোড হচ্ছে…", generate: "তৈরি করুন", save: "সংরক্ষণ করুন", add: "যোগ করুন", delete: "মুছুন", cancel: "বাতিল করুন" },
  ta: { home: "முகப்பு", study: "AI படிப்பு", library: "நூலகம்", pyq: "பழைய வினாத்தாள்கள்", doubt: "சந்தேக தீர்வு", flashcards: "ஃபிளாஷ்கார்டு", quiz: "வினாடி வினா", planner: "திட்டமிடுபவர்", timer: "கவனத் திரையகம்", notes: "குறிப்புகள்", skills: "திறன்கள்", community: "சமூகம்", leaderboard: "லீடர்போர்டு",rewards: "பரிசுகள்", progress: "முன்னேற்றம்", certificate: "சான்றிதழ்",
    switchProfile: "சுயவிவரத்தை மாற்று", language: "மொழி", hey: "வணக்கம்", streak: "தொடர்ச்சி", level: "நிலை", coins: "நாணயங்கள்", todaysChallenges: "இன்றைய சவால்கள்", generateLesson: "பாடம் உருவாக்கு", askDoubt: "சந்தேகம் கேள்", takeQuiz: "வினாடி வினா எடு", startTimer: "டைமரைத் தொடங்கு", loading: "ஏற்றுகிறது…", generate: "உருவாக்கு", save: "சேமி", add: "சேர்", delete: "நீக்கு", cancel: "ரத்து செய்" },
  te: { home: "హోమ్", study: "AI అధ్యయనం", library: "గ్రంథాలయం", pyq: "పాత ప్రశ్నపత్రాలు", doubt: "సందేహ నివృత్తి", flashcards: "ఫ్లాష్‌కార్డులు", quiz: "క్విజ్", planner: "ప్రణాళిక", timer: "ఫోకస్ టైమర్", notes: "గమనికలు", skills: "నైపుణ్యాలు", community: "సంఘం", leaderboard: "లీడర్‌బోర్డ్",rewards: "బహుమతులు", progress: "పురోగతి", certificate: "ధృవీకరణ పత్రం",
    switchProfile: "ప్రొఫైల్ మార్చండి", language: "భాష", hey: "నమస్తే", streak: "స్ట్రీక్", level: "స్థాయి", coins: "నాణేలు", todaysChallenges: "నేటి సవాళ్లు", generateLesson: "పాఠం తయారు చేయండి", askDoubt: "సందేహం అడగండి", takeQuiz: "క్విజ్ తీసుకోండి", startTimer: "టైమర్ ప్రారంభించండి", loading: "లోడ్ అవుతోంది…", generate: "తయారు చేయండి", save: "సేవ్ చేయండి", add: "జోడించండి", delete: "తొలగించండి", cancel: "రద్దు చేయండి" },
  kn: { home: "ಮುಖಪುಟ", study: "AI ಅಧ್ಯಯನ", library: "ಗ್ರಂಥಾಲಯ", pyq: "ಹಳೆಯ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳು", doubt: "ಸಂದೇಹ ಪರಿಹಾರ", flashcards: "ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್", quiz: "ರಸಪ್ರಶ್ನೆ", planner: "ಯೋಜಕ", timer: "ಫೋಕಸ್ ಟೈಮರ್", notes: "ಟಿಪ್ಪಣಿಗಳು", skills: "ಕೌಶಲ್ಯಗಳು", community: "ಸಮುದಾಯ", leaderboard: "ಲೀಡರ್‌ಬೋರ್ಡ್",rewards: "ಬಹುಮಾನಗಳು", progress: "ಪ್ರಗತಿ", certificate: "ಪ್ರಮಾಣಪತ್ರ",
    switchProfile: "ಪ್ರೊಫೈಲ್ ಬದಲಿಸಿ", language: "ಭಾಷೆ", hey: "ನಮಸ್ಕಾರ", streak: "ಸ್ಟ್ರೀಕ್", level: "ಹಂತ", coins: "ನಾಣ್ಯಗಳು", todaysChallenges: "ಇಂದಿನ ಸವಾಲುಗಳು", generateLesson: "ಪಾಠ ರಚಿಸಿ", askDoubt: "ಸಂದೇಹ ಕೇಳಿ", takeQuiz: "ರಸಪ್ರಶ್ನೆ ತೆಗೆದುಕೊಳ್ಳಿ", startTimer: "ಟೈಮರ್ ಪ್ರಾರಂಭಿಸಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…", generate: "ರಚಿಸಿ", save: "ಉಳಿಸಿ", add: "ಸೇರಿಸಿ", delete: "ಅಳಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ" },
  ml: { home: "ഹോം", study: "AI പഠനം", library: "ലൈബ്രറി", pyq: "പഴയ ചോദ്യപ്പേപ്പറുകൾ", doubt: "സംശയപരിഹാരം", flashcards: "ഫ്ലാഷ്കാർഡുകൾ", quiz: "ക്വിസ്", planner: "പ്ലാനർ", timer: "ഫോക്കസ് ടൈമർ", notes: "കുറിപ്പുകൾ", skills: "കഴിവുകൾ", community: "സമൂഹം", leaderboard: "ലീഡർബോർഡ്",rewards: "സമ്മാനങ്ങൾ", progress: "പുരോഗതി", certificate: "സർട്ടിഫിക്കറ്റ്",
    switchProfile: "പ്രൊഫൈൽ മാറ്റുക", language: "ഭാഷ", hey: "നമസ്കാരം", streak: "സ്ട്രീക്ക്", level: "ലെവൽ", coins: "നാണയങ്ങൾ", todaysChallenges: "ഇന്നത്തെ വെല്ലുവിളികൾ", generateLesson: "പാഠം സൃഷ്ടിക്കുക", askDoubt: "സംശയം ചോദിക്കുക", takeQuiz: "ക്വിസ് എടുക്കുക", startTimer: "ടൈമർ ആരംഭിക്കുക", loading: "ലോഡ് ചെയ്യുന്നു…", generate: "സൃഷ്ടിക്കുക", save: "സേവ് ചെയ്യുക", add: "ചേർക്കുക", delete: "ഇല്ലാതാക്കുക", cancel: "റദ്ദാക്കുക" },
  pa: { home: "ਹੋਮ", study: "ਏਆਈ ਅਧਿਐਨ", library: "ਲਾਇਬ੍ਰੇਰੀ", pyq: "ਪੁਰਾਣੇ ਪ੍ਰਸ਼ਨ ਪੱਤਰ", doubt: "ਸ਼ੰਕਾ ਹੱਲ", flashcards: "ਫਲੈਸ਼ਕਾਰਡ", quiz: "ਕਵਿਜ਼", planner: "ਯੋਜਨਾਕਾਰ", timer: "ਫੋਕਸ ਟਾਈਮਰ", notes: "ਨੋਟਸ", skills: "ਹੁਨਰ", community: "ਭਾਈਚਾਰਾ", leaderboard: "ਲੀਡਰਬੋਰਡ",rewards: "ਇਨਾਮ", progress: "ਤਰੱਕੀ", certificate: "ਸਰਟੀਫਿਕੇਟ",
    switchProfile: "ਪ੍ਰੋਫਾਈਲ ਬਦਲੋ", language: "ਭਾਸ਼ਾ", hey: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", streak: "ਸਟ੍ਰੀਕ", level: "ਪੱਧਰ", coins: "ਸਿੱਕੇ", todaysChallenges: "ਅੱਜ ਦੀਆਂ ਚੁਣੌਤੀਆਂ", generateLesson: "ਪਾਠ ਬਣਾਓ", askDoubt: "ਸ਼ੰਕਾ ਪੁੱਛੋ", takeQuiz: "ਕਵਿਜ਼ ਦਿਓ", startTimer: "ਟਾਈਮਰ ਸ਼ੁਰੂ ਕਰੋ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…", generate: "ਬਣਾਓ", save: "ਸੰਭਾਲੋ", add: "ਜੋੜੋ", delete: "ਹਟਾਓ", cancel: "ਰੱਦ ਕਰੋ" },
  or: { home: "ହୋମ୍", study: "AI ଅଧ୍ୟୟନ", library: "ଗ୍ରନ୍ଥାଗାର", pyq: "ପୁରୁଣା ପ୍ରଶ୍ନପତ୍ର", doubt: "ସନ୍ଦେହ ସମାଧାନ", flashcards: "ଫ୍ଲାସକାର୍ଡ", quiz: "କୁଇଜ୍", planner: "ଯୋଜକ", timer: "ଫୋକସ୍ ଟାଇମର", notes: "ଟିପ୍ପଣୀ", skills: "ଦକ୍ଷତା", community: "ସମ୍ପ୍ରଦାୟ", leaderboard: "ଲିଡରବୋର୍ଡ",rewards: "ପୁରସ୍କାର", progress: "ପ୍ରଗତି", certificate: "ପ୍ରମାଣପତ୍ର",
    switchProfile: "ପ୍ରୋଫାଇଲ ବଦଳାନ୍ତୁ", language: "ଭାଷା", hey: "ନମସ୍କାର", streak: "ଷ୍ଟ୍ରିକ୍", level: "ସ୍ତର", coins: "କୋଇନ୍", todaysChallenges: "ଆଜିର ଚ୍ୟାଲେଞ୍ଜ", generateLesson: "ପାଠ ତିଆରି କରନ୍ତୁ", askDoubt: "ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ", takeQuiz: "କୁଇଜ୍ ଦିଅନ୍ତୁ", startTimer: "ଟାଇମର ଆରମ୍ଭ କରନ୍ତୁ", loading: "ଲୋଡ୍ ହେଉଛି…", generate: "ତିଆରି କରନ୍ତୁ", save: "ସେଭ୍ କରନ୍ତୁ", add: "ଯୋଡନ୍ତୁ", delete: "ଡିଲିଟ୍ କରନ୍ତୁ", cancel: "ବାତିଲ୍ କରନ୍ତୁ" },
  ur: { home: "ہوم", study: "اے آئی مطالعہ", library: "لائبریری", pyq: "پرانے سوالیہ پرچے", doubt: "شبہ حل", flashcards: "فلیش کارڈز", quiz: "کوئز", planner: "منصوبہ ساز", timer: "فوکس ٹائمر", notes: "نوٹس", skills: "مہارتیں", community: "برادری", leaderboard: "لیڈر بورڈ",rewards: "انعامات", progress: "پیش رفت", certificate: "سرٹیفکیٹ",
    switchProfile: "پروفائل تبدیل کریں", language: "زبان", hey: "السلام علیکم", streak: "سٹریک", level: "سطح", coins: "سکے", todaysChallenges: "آج کے چیلنجز", generateLesson: "سبق بنائیں", askDoubt: "سوال پوچھیں", takeQuiz: "کوئز دیں", startTimer: "ٹائمر شروع کریں", loading: "لوڈ ہو رہا ہے…", generate: "بنائیں", save: "محفوظ کریں", add: "شامل کریں", delete: "حذف کریں", cancel: "منسوخ کریں" },
  as: { home: "হোম", study: "AI অধ্যয়ন", library: "গ্ৰন্থাগাৰ", pyq: "পুৰণি প্ৰশ্নকাকত", doubt: "সন্দেহ সমাধান", flashcards: "ফ্লেশকাৰ্ড", quiz: "কুইজ", planner: "পৰিকল্পক", timer: "ফোকাছ টাইমাৰ", notes: "টোকা", skills: "দক্ষতা", community: "সমাজ", leaderboard: "লিডাৰবৰ্ড",rewards: "পুৰস্কাৰ", progress: "প্ৰগতি", certificate: "প্ৰমাণপত্ৰ",
    switchProfile: "প্ৰ'ফাইল সলনি কৰক", language: "ভাষা", hey: "নমস্কাৰ", streak: "স্ট্ৰীক", level: "স্তৰ", coins: "মুদ্ৰা", todaysChallenges: "আজিৰ প্ৰত্যাহ্বান", generateLesson: "পাঠ তৈয়াৰ কৰক", askDoubt: "প্ৰশ্ন সোধক", takeQuiz: "কুইজ দিয়ক", startTimer: "টাইমাৰ আৰম্ভ কৰক", loading: "লোড হৈ আছে…", generate: "তৈয়াৰ কৰক", save: "ছেভ কৰক", add: "যোগ কৰক", delete: "মচক", cancel: "বাতিল কৰক" }
};
function t(lang, key) { return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key; }

const QUOTES = [
  "Small progress is still progress — one more step forward today.",
  "What feels hard today becomes tomorrow's strength.",
  "Consistency matters more than talent.",
  "One concept, one day at a time — that's the way.",
  "Rest is part of studying too — take breaks between sessions."
];

const THEME_PACKS = {
  gold: { label: "Classic Gold", desc: "Warm serif headings, soft rounded cards.", motif: "☀️", cost: 0,
    headingFont: "'Georgia', serif", bodyFont: "'Inter', system-ui, sans-serif", radius: "14px",
    cardBorder: "1px solid #EAEDF2", cardShadow: "none", navBg: "linear-gradient(160deg,#0E2142,#16305C)",
    accent: "#F2A93B", accentDark: "#16305C", appBg: "#F7F8FA", appPattern: "none" },
  teal: { label: "Emerald Teal", desc: "Elegant serif, pill cards, leafy texture.", motif: "🌿", cost: 80,
    headingFont: "'Georgia', serif", bodyFont: "'Inter', system-ui, sans-serif", radius: "22px",
    cardBorder: "none", cardShadow: "0 8px 20px rgba(20,110,95,0.10)", navBg: "linear-gradient(160deg,#0B3B33,#0F5147)",
    accent: "#2FB3A3", accentDark: "#0B3B33", appBg: "#F2FAF7",
    appPattern: "radial-gradient(circle at 18px 18px, rgba(47,179,163,0.10) 2px, transparent 2px)" },
  purple: { label: "Royal Purple", desc: "Sharp borders, display serif, regal texture.", motif: "👑", cost: 120,
    headingFont: "'Georgia', serif", bodyFont: "'Inter', system-ui, sans-serif", radius: "4px",
    cardBorder: "1px solid #8B6FD1", cardShadow: "0 0 0 3px rgba(139,111,209,0.08) inset", navBg: "linear-gradient(160deg,#241640,#3B2166)",
    accent: "#8B6FD1", accentDark: "#241640", appBg: "#F7F5FC",
    appPattern: "radial-gradient(rgba(139,111,209,0.14) 1px, transparent 1px)" },
  rose: { label: "Sunset Rose", desc: "Bubbly rounded headings, warm gradient wash.", motif: "🌸", cost: 120,
    headingFont: "'Georgia', serif", bodyFont: "'Inter', system-ui, sans-serif", radius: "26px",
    cardBorder: "none", cardShadow: "0 10px 24px rgba(224,116,143,0.14)", navBg: "linear-gradient(160deg,#4A1630,#7A2749)",
    accent: "#E0748F", accentDark: "#4A1630", appBg: "#FFF5F7",
    appPattern: "radial-gradient(circle at 0 0, rgba(224,116,143,0.10), transparent 55%)" },
  sky: { label: "Ocean Sky", desc: "Crisp geometry, thin accent borders.", motif: "🌊", cost: 100,
    headingFont: "'Georgia', serif", bodyFont: "'Inter', system-ui, sans-serif", radius: "10px",
    cardBorder: "2px solid #CFE6F5", cardShadow: "none", navBg: "linear-gradient(160deg,#0B2A40,#0F3D5C)",
    accent: "#4A9BD1", accentDark: "#0B2A40", appBg: "#F2FAFF",
    appPattern: "repeating-linear-gradient(115deg, rgba(74,155,209,0.07) 0px, rgba(74,155,209,0.07) 2px, transparent 2px, transparent 22px)" }
};

const CHALLENGE_POOL = ["Generate an AI lesson", "Revise 5 flashcards", "Complete a focus session", "Take a quiz",
  "Complete 2 tasks", "Ask AI a doubt", "Write a note", "Update a skill", "Post on the forum", "Add an exam date"];

const TEXTBOOK_CHAPTERS = {
  "Class 6": {
    Math: ["Knowing Our Numbers", "Whole Numbers", "Basic Geometrical Ideas", "Integers", "Fractions", "Decimals", "Mensuration", "Algebra Basics", "Ratio and Proportion", "Symmetry"],
    Science: ["Food Sources", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "Air Around Us", "Water"],
    "Social Science": ["What, Where, How and When", "The Earliest People", "In the Earliest Cities", "The Earth in the Solar System", "Latitudes and Longitudes", "Diversity and Discrimination", "Local Government", "Rural Livelihoods"],
    English: ["Prose and Poem Basics", "Grammar — Nouns and Pronouns", "Tenses Overview", "Comprehension Skills", "Letter Writing"]
  },
  "Class 7": {
    Math: ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Comparing Quantities", "Rational Numbers", "Perimeter and Area", "Algebraic Expressions"],
    Science: ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms"],
    "Social Science": ["Tracing Changes Through a Thousand Years", "Environment", "Inside Our Earth", "Our Changing Earth", "New Kings and Kingdoms", "The Delhi Sultans", "Equality in Indian Democracy", "Role of the Government in Health"],
    English: ["Grammar — Tenses and Clauses", "Comprehension Skills", "Story Elements", "Formal Letter Writing"]
  },
  "Class 8": {
    Math: ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Mensuration", "Algebraic Expressions and Identities", "Exponents and Powers"],
    Science: ["Crop Production and Management", "Microorganisms", "Coal and Petroleum", "Combustion and Flame", "Metals and Non-Metals", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Light"],
    "Social Science": ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "The Indian Constitution", "Understanding Secularism", "Resources", "Agriculture", "Industries"],
    English: ["Grammar — Voice and Reported Speech", "Comprehension Skills", "Essay Writing", "Poetic Devices"]
  },
  "Class 9": {
    Math: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Lines and Angles", "Triangles", "Areas of Parallelograms and Triangles", "Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    Science: ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Natural Resources"],
    "Social Science": ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "India — Size and Location", "Physical Features of India", "Climate", "Democracy in the Contemporary World", "What is Democracy? Why Democracy?", "Poverty as a Challenge", "The Story of Village Palampur"],
    English: ["Grammar — Modals and Determiners", "Comprehension Skills", "Formal and Informal Writing", "Literary Devices"]
  },
  "Class 10": {
    Math: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics and Probability"],
    Science: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-Metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce", "Heredity and Evolution", "Light — Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"],
    "Social Science": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "Resources and Development", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Power-Sharing", "Federalism", "Political Parties", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation"],
    English: ["Grammar — Complex Sentences", "Comprehension Skills", "Formal Writing (Letters, Notices, Reports)", "Prose and Poetry Analysis"]
  },
  "Class 11": {
    Physics: ["Physical World and Measurement", "Kinematics", "Laws of Motion", "Work, Energy and Power", "Motion of System of Particles", "Gravitation", "Properties of Bulk Matter", "Thermodynamics", "Oscillations and Waves"],
    Chemistry: ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", "Chemical Bonding", "States of Matter", "Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry Basics", "Hydrocarbons"],
    Biology: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Cell — The Unit of Life", "Plant Physiology", "Human Physiology"],
    Math: ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Limits and Derivatives", "Statistics", "Probability"],
    Accountancy: ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions", "Bank Reconciliation Statement", "Trial Balance and Rectification of Errors", "Depreciation", "Financial Statements"],
    "Business Studies": ["Nature and Purpose of Business", "Forms of Business Organisation", "Private and Public Sector Enterprises", "Business Services", "Emerging Modes of Business", "Social Responsibility of Business"],
    Economics: ["Introduction to Statistics", "Collection and Organisation of Data", "Presentation of Data", "Measures of Central Tendency", "Indian Economy on the Eve of Independence", "Indian Economic Development"],
    History: ["From the Beginning of Time", "Writing and City Life", "An Empire Across Three Continents", "The Central Islamic Lands", "Nomadic Empires", "The Three Orders", "Changing Cultural Traditions"],
    "Political Science": ["Constitution — Why and How", "Rights in the Indian Constitution", "Election and Representation", "Executive", "Legislature", "Judiciary", "Federalism", "Local Governments"]
  },
  "Class 12": {
    Physics: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms and Nuclei", "Semiconductor Electronics"],
    Chemistry: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"],
    Biology: ["Reproduction in Organisms", "Genetics and Evolution", "Human Health and Disease", "Biotechnology", "Ecology and Environment"],
    Math: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three-Dimensional Geometry", "Linear Programming", "Probability"],
    Accountancy: ["Accounting for Partnership Firms", "Reconstitution of a Partnership Firm", "Accounting for Share Capital", "Issue and Redemption of Debentures", "Financial Statements Analysis", "Cash Flow Statement"],
    "Business Studies": ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Marketing Management", "Consumer Protection"],
    Economics: ["Introduction to Macroeconomics", "National Income Accounting", "Money and Banking", "Determination of Income and Employment", "Government Budget and the Economy", "Balance of Payments", "Indian Economic Development"],
    History: ["Bricks, Beads and Bones — Harappan Civilisation", "Kings, Farmers and Towns", "Kinship, Caste and Class", "The Mughal Empire", "Colonialism and the Countryside", "Framing the Constitution"],
    "Political Science": ["The Cold War Era", "The End of Bipolarity", "Contemporary South Asia", "International Organisations", "Security in Contemporary World", "Challenges of Nation Building", "Era of One-Party Dominance", "Politics of Planned Development"]
  }
};

const PYQ_YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

const BADGES = [
  { id: "starter", emoji: "🌱", name: "Getting Started", desc: "Generate your first AI lesson", check: (d) => d.stats.lessonsGenerated >= 1 },
  { id: "streak3", emoji: "🔥", name: "3-Day Streak", desc: "Open the app 3 days in a row", check: (d) => d.streak.count >= 3 },
  { id: "streak7", emoji: "🔥🔥", name: "7-Day Streak", desc: "Open the app 7 days in a row", check: (d) => d.streak.count >= 7 },
  { id: "quizwhiz", emoji: "🏆", name: "Quiz Whiz", desc: "Score full marks in a quiz", check: (d) => d.quizHistory.some((q) => q.score === q.total) },
  { id: "taskmaster", emoji: "✅", name: "Task Master", desc: "Complete 10 tasks", check: (d) => d.tasks.filter((t) => t.done).length >= 10 },
  { id: "focused", emoji: "⏰", name: "Focused Mind", desc: "Complete 5 focus sessions", check: (d) => d.stats.sessionsDone >= 5 },
  { id: "notetaker", emoji: "📚", name: "Note Taker", desc: "Save 5 notes", check: (d) => d.notes.length >= 5 },
  { id: "cardmaster", emoji: "🃏", name: "Card Master", desc: "Build a deck of 8+ cards", check: (d) => d.decks.some((dk) => dk.cards.length >= 8) },
  { id: "doubtbuster", emoji: "🤖", name: "Doubt Buster", desc: "Ask AI 5 doubts", check: (d) => d.stats.doubtsAsked >= 5 },
  { id: "examready", emoji: "⏳", name: "Planner Pro", desc: "Add an exam date", check: (d) => d.exams.length >= 1 },
  { id: "richie", emoji: "🪙", name: "Coin Collector", desc: "Collect 150 coins", check: (d) => (d.coins || 0) >= 150 },
  { id: "leveledup", emoji: "⭐", name: "Level 5", desc: "Reach Level 5", check: (d) => levelFromXp(d.xp) >= 5 },
  { id: "skillbuilder", emoji: "🛠️", name: "Skill Builder", desc: "Add 3 skills", check: (d) => (d.skills || []).length >= 3 },
  { id: "communityvoice", emoji: "💬", name: "Community Voice", desc: "Post on the forum", check: (d) => (d.stats.forumPosts || 0) >= 1 },
  { id: "certified", emoji: "🎖️", name: "Certified", desc: "Generate your first certificate", check: (d) => (d.stats.certificatesGenerated || 0) >= 1 }
];

const TABS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "study", label: "AI Study", icon: "🎓" },
  { key: "library", label: "Library", icon: "📖" },
  { key: "pyq", label: "PYQ Practice", icon: "📝" },
  { key: "doubt", label: "Doubt Solver", icon: "🤖" },
  { key: "flashcards", label: "Flashcards", icon: "🃏" },
  { key: "quiz", label: "Quiz", icon: "❓" },
  { key: "planner", label: "Planner", icon: "📅" },
  { key: "timer", label: "Focus Timer", icon: "⏰" },
  { key: "notes", label: "Notes", icon: "📝" },
  { key: "skills", label: "Skills", icon: "🛠️" },
  { key: "community", label: "Community", icon: "👥" },
  { key: "leaderboard", label: "Leaderboard", icon: "🏆" },
  { key: "rewards", label: "Rewards", icon: "🪙" },
  { key: "progress", label: "Progress", icon: "📊" },
  { key: "certificate", label: "Certificate", icon: "🎖️" }
];

const DEFAULT_DATA = {
  streak: { count: 0, lastDate: null },
  stats: { lessonsGenerated: 0, doubtsAsked: 0, sessionsDone: 0, forumPosts: 0, challengesCompleted: 0, certificatesGenerated: 0 },
  tasks: [], exams: [], decks: [], notes: [], quizHistory: [],
  coins: 20, xp: 0, theme: "gold", unlockedThemes: ["gold"], skills: [],
  dailyChallenges: { date: null, items: [] }
};

const ThemeContext = createContext(THEME_PACKS.gold);

/* ============================== HELPERS ============================== */

async function callClaude(promptText) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1200, messages: [{ role: "user", content: promptText }] })
  });
  if (!response.ok) throw new Error("Request failed: " + response.status);
  const data = await response.json();
  return data.content.map((b) => (b.type === "text" ? b.text : "")).join("\n");
}
async function callClaudeVision(base64Data, mediaType, promptText) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1200,
      messages: [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } }, { type: "text", text: promptText }] }]
    })
  });
  if (!response.ok) throw new Error("Request failed: " + response.status);
  const data = await response.json();
  return data.content.map((b) => (b.type === "text" ? b.text : "")).join("\n");
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}
function speakText(text, langCode) {
  try {
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_BCP47[langCode] || "en-IN";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) { return false; }
}
function stopSpeak() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }
function SpeakButton({ text, lang, small }) {
  const [speaking, setSpeaking] = useState(false);
  function toggle() {
    if (speaking) { stopSpeak(); setSpeaking(false); return; }
    const ok = speakText(text, lang);
    if (ok) {
      setSpeaking(true);
      const check = setInterval(() => {
        if (!window.speechSynthesis || !window.speechSynthesis.speaking) { setSpeaking(false); clearInterval(check); }
      }, 400);
    }
  }
  return (
    <button onClick={toggle} style={{ border: "1px solid #DDE1E8", background: speaking ? "#FFF3E0" : "#fff", borderRadius: 8, padding: small ? "3px 8px" : "5px 10px", fontSize: small ? 11 : 12, color: "#16305C", whiteSpace: "nowrap" }}>
      {speaking ? "⏹ Stop" : "🔊 Listen"}
    </button>
  );
}
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{"); const startArr = cleaned.indexOf("[");
  let s = start === -1 ? startArr : (startArr === -1 ? start : Math.min(start, startArr));
  const endB = cleaned.lastIndexOf("}"); const endA = cleaned.lastIndexOf("]");
  let e = Math.max(endB, endA);
  if (s === -1 || e === -1) throw new Error("No JSON found");
  return JSON.parse(cleaned.slice(s, e + 1));
}
const todayKey = () => new Date().toISOString().slice(0, 10);
const uid = () => Date.now() + "-" + Math.floor(Math.random() * 10000);
function levelFromXp(xp) { return Math.floor((xp || 0) / 100) + 1; }
function seededIndex(seedStr, mod) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  return h % mod;
}
function pickDailyChallenges() {
  const date = todayKey(); const items = [];
  for (let i = 0; i < 4; i++) items.push({ id: "c" + i, text: CHALLENGE_POOL[seededIndex(date + "-" + i, CHALLENGE_POOL.length)], done: false });
  return { date, items };
}

const GLOBAL_ANIMATIONS = `
@keyframes padhaiCardIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes padhaiFadeIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
@keyframes padhaiSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes padhaiPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
button:not(:disabled) { transition: transform 0.15s ease, filter 0.15s ease; cursor: pointer; }
button:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.04); }
button:not(:disabled):active { transform: translateY(0px) scale(0.98); }
input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
.padhai-tab-panel { animation: padhaiFadeIn 0.28s ease both; }
.padhai-spin { display: inline-block; animation: padhaiSpin 0.8s linear infinite; }
.padhai-bar-fill { transition: width 0.6s cubic-bezier(.22,1,.36,1); }
.padhai-stagger > * { animation: padhaiCardIn 0.4s cubic-bezier(.22,1,.36,1) both; }
`;

function useThemeStyles() {
  const t = useContext(ThemeContext);
  return {
    card: { background: "#fff", border
