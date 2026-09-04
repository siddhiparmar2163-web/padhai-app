import React, { useState, useEffect, useRef, useContext, createContext } from "react";

/* ============================== CONSTANTS ============================== */

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const AVATARS = ["🦁", "🐯", "🦊", "🐼", "🐨", "🦉", "🐢", "🐬", "🦄", "🐸", "🐵", "🦅"];
const PROFILE_KEY = "padhai-profile-v1";
const DATA_KEY = "padhai-data-v1";
const FORUM_KEY = "padhai-forum-posts-v1";

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
  { id: "communityvoice", emoji: "💬", name: "Community Voice", desc: "Post on the forum", check: (d) => (d.stats.forumPosts || 0) >= 1 }
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
  { key: "rewards", label: "Rewards", icon: "🪙" },
  { key: "progress", label: "Progress", icon: "📊" }
];

const DEFAULT_DATA = {
  streak: { count: 0, lastDate: null },
  stats: { lessonsGenerated: 0, doubtsAsked: 0, sessionsDone: 0, forumPosts: 0, challengesCompleted: 0 },
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
    card: { background: "#fff", borderRadius: t.radius, border: t.cardBorder, boxShadow: t.cardShadow, animation: "padhaiCardIn 0.4s cubic-bezier(.22,1,.36,1) both" },
    label: { fontSize: 12, color: "#5B6472", fontWeight: 600 },
    input: { width: "100%", padding: 9, borderRadius: 8, border: "1px solid #DDE1E8", fontSize: 13.5, boxSizing: "border-box", fontFamily: t.bodyFont },
    heading: { fontFamily: t.headingFont, color: t.accentDark },
    primaryBtn: { padding: "10px 16px", borderRadius: 10, border: "none", background: t.accent, color: "#fff", fontWeight: 700, fontSize: 13.5 },
    ghostBtn: { padding: "9px 14px", borderRadius: 10, border: "1px solid #DDE1E8", background: "#fff", color: t.accentDark, fontWeight: 600, fontSize: 13 },
    t
  };
}

/* ============================== ROOT APP ============================== */

export default function App() {
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(PROFILE_KEY, false);
        if (r) setProfile(JSON.parse(r.value));
      } catch (e) { /* no profile yet */ }
      setProfileLoaded(true);
    })();
  }, []);

  async function handleLogin(p) {
    try { await window.storage.set(PROFILE_KEY, JSON.stringify(p), false); } catch (e) {}
    setLeaving(true);
    setTimeout(() => { setProfile(p); setLeaving(false); }, 500);
  }
  async function handleLogout() {
    try { await window.storage.delete(PROFILE_KEY, false); } catch (e) {}
    setProfile(null);
  }

  if (!profileLoaded) {
    return <div style={{ minHeight: "100vh", background: "#0E2142", display: "flex", alignItems: "center", justifyContent: "center", color: "#AEB7C7", fontFamily: "Inter, sans-serif" }}>Loading PadhAI…</div>;
  }
  if (!profile) return <LoginScreen onLogin={handleLogin} leaving={leaving} />;
  return <MainApp profile={profile} onLogout={handleLogout} />;
}

/* ============================== LOGIN SCREEN ============================== */

function LoginScreen({ onLogin, leaving }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Class 8");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function submit() {
    if (!name.trim()) { setError("Please enter your name first."); return; }
    onLogin({ name: name.trim(), grade, avatar, joinedAt: new Date().toISOString() });
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0E2142 0%, #16305C 60%, #0E2142 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", position: "relative", overflow: "hidden", opacity: leaving ? 0 : 1, transition: "opacity 0.5s ease" }}>
      <style>{`
        ${GLOBAL_ANIMATIONS}
        @keyframes padhaiFloat { 0% { transform: translateY(0px); opacity: 0.12; } 50% { transform: translateY(-24px); opacity: 0.22; } 100% { transform: translateY(0px); opacity: 0.12; } }
        @keyframes padhaiSlideUp { 0% { transform: translateY(16px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes padhaiDotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-8px); opacity: 1; } }
        .padhai-avatar-btn:hover { transform: translateY(-2px) scale(1.08); }
        .padhai-loader-dot { width: 8px; height: 8px; border-radius: 50%; background: #F2A93B; display: inline-block; animation: padhaiDotBounce 1.1s ease-in-out infinite; }
      `}</style>
      {["📘", "✏️", "🎓", "🧮", "🔬", "🌟"].map((e, i) => (
        <div key={i} style={{ position: "absolute", fontSize: 34 + (i % 3) * 10, top: `${12 + i * 14}%`, left: i % 2 === 0 ? `${6 + i * 4}%` : "auto", right: i % 2 === 1 ? `${6 + i * 3}%` : "auto", animation: `padhaiFloat ${5 + i}s ease-in-out infinite ${i * 0.3}s` }}>{e}</div>
      ))}
      {step === 0 && (
        <div style={{ display: "flex", gap: 6, position: "relative", zIndex: 2 }}>
          <span className="padhai-loader-dot" style={{ animationDelay: "0s" }} />
          <span className="padhai-loader-dot" style={{ animationDelay: "0.15s" }} />
          <span className="padhai-loader-dot" style={{ animationDelay: "0.3s" }} />
        </div>
      )}
      {step >= 1 && (
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 380, padding: 24 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 46 }}>🎓</div>
            <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 26, color: "#fff", marginTop: 8 }}>Padh<span style={{ color: "#F2A93B" }}>AI</span></div>
            <div style={{ fontSize: 12.5, color: "#AEB7C7", marginTop: 4 }}>Your AI study companion</div>
          </div>
          {step === 2 && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 22, animation: "padhaiSlideUp 0.4s ease" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#F2A93B", marginBottom: 12 }}>LET'S GET STARTED</div>
              <label style={{ fontSize: 12, color: "#5B6472", fontWeight: 600 }}>Your name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="e.g. Aarav" style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #DDE1E8", fontSize: 13.5, boxSizing: "border-box", marginTop: 4, marginBottom: 12 }} autoFocus />
              <label style={{ fontSize: 12, color: "#5B6472", fontWeight: 600 }}>Class</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: "100%", padding: 9, borderRadius: 8, border: "1px solid #DDE1E8", fontSize: 13.5, boxSizing: "border-box", marginTop: 4, marginBottom: 12 }}>
                {CLASSES.map((g) => <option key={g}>{g}</option>)}
              </select>
              <label style={{ fontSize: 12, color: "#5B6472", fontWeight: 600 }}>Choose an avatar</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6, marginBottom: 16 }}>
                {AVATARS.map((a) => (
                  <button key={a} className="padhai-avatar-btn" onClick={() => setAvatar(a)} style={{ fontSize: 22, width: 42, height: 42, borderRadius: 10, border: avatar === a ? "2px solid #F2A93B" : "1px solid #DDE1E8", background: avatar === a ? "#FFF8EC" : "#fff", transition: "transform 0.15s ease" }}>{a}</button>
                ))}
              </div>
              {error && <div style={{ color: "#C0392B", fontSize: 12.5, marginBottom: 10 }}>{error}</div>}
              <button onClick={submit} style={{ width: "100%", padding: 13, borderRadius: 10, border: "none", background: "#F2A93B", color: "#0E2142", fontWeight: 700, fontSize: 14 }}>Enter PadhAI →</button>
              <div style={{ fontSize: 10.5, color: "#8E97AB", marginTop: 10, textAlign: "center" }}>Your profile is saved only on this device.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== MAIN APP ============================== */

function MainApp({ profile, onLogout }) {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [studyPick, setStudyPick] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    (async () => {
      let d = DEFAULT_DATA;
      try {
        const r = await window.storage.get(DATA_KEY, false);
        if (r) d = { ...DEFAULT_DATA, ...JSON.parse(r.value) };
      } catch (e) { /* first run */ }

      const today = todayKey();
      if (d.streak.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const newCount = d.streak.lastDate === yesterday ? d.streak.count + 1 : 1;
        d = { ...d, streak: { count: newCount, lastDate: today } };
      }
      if (d.dailyChallenges.date !== today) d = { ...d, dailyChallenges: pickDailyChallenges() };
      setData(d);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.storage.set(DATA_KEY, JSON.stringify(data), false).catch(() => {});
  }, [data, loaded]);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }

  function award(coins, xp, note) {
    setData((d) => ({ ...d, coins: (d.coins || 0) + coins, xp: (d.xp || 0) + xp }));
    if (note) showToast(note);
  }

  function completeChallenge(text) {
    setData((d) => {
      const items = d.dailyChallenges.items.map((c) => (c.text === text && !c.done ? { ...c, done: true } : c));
      const wasAlready = d.dailyChallenges.items.find((c) => c.text === text)?.done;
      if (wasAlready) return { ...d, dailyChallenges: { ...d.dailyChallenges, items } };
      return { ...d, dailyChallenges: { ...d.dailyChallenges, items }, stats: { ...d.stats, challengesCompleted: (d.stats.challengesCompleted || 0) + 1 }, coins: (d.coins || 0) + 5 };
    });
  }

  const theme = THEME_PACKS[data.theme] || THEME_PACKS.gold;
  const level = levelFromXp(data.xp);
  const xpIntoLevel = (data.xp || 0) % 100;
  const earnedBadges = BADGES.filter((b) => b.check(data));

  const ctx = { profile, data, setData, showToast, award, completeChallenge, theme, level, xpIntoLevel, earnedBadges, studyPick, setStudyPick };

  if (!loaded) {
    return <div style={{ minHeight: "100vh", background: theme.appBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#5B6472" }}>Loading your data…</div>;
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: theme.appBg, backgroundImage: theme.appPattern, fontFamily: theme.bodyFont, color: "#16305C", display: "flex" }}>
        <style>{GLOBAL_ANIMATIONS}</style>

        {/* Sidebar (desktop) */}
        <div style={{ width: 210, background: theme.navBg, color: "#fff", padding: "20px 12px", display: "none" }} className="padhai-sidebar">
          <SidebarContent tab={tab} setTab={setTab} profile={profile} onLogout={onLogout} theme={theme} />
        </div>

        {/* Mobile top bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 20, background: theme.navBg, color: "#fff", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="padhai-topbar">
          <div style={{ fontFamily: theme.headingFont, fontWeight: 700, fontSize: 18 }}>Padh<span style={{ color: theme.accent }}>AI</span></div>
          <button onClick={() => setNavOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20 }}>☰</button>
        </div>
        {navOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 30 }} onClick={() => setNavOpen(false)}>
            <div style={{ width: 230, height: "100%", background: theme.navBg, padding: "20px 12px" }} onClick={(e) => e.stopPropagation()}>
              <SidebarContent tab={tab} setTab={(t) => { setTab(t); setNavOpen(false); }} profile={profile} onLogout={onLogout} theme={theme} />
            </div>
          </div>
        )}

        <div style={{ flex: 1, padding: "16px 18px 40px", maxWidth: 900, margin: "0 auto", width: "100%", paddingTop: 66 }} className="padhai-content">
          <style>{`
            @media (min-width: 860px) {
              .padhai-sidebar { display: flex !important; flex-direction: column; }
              .padhai-topbar { display: none !important; }
              .padhai-content { padding-top: 24px !important; }
            }
          `}</style>
          <div className="padhai-tab-panel" key={tab}>
            {tab === "home" && <HomeTab ctx={ctx} setTab={setTab} />}
            {tab === "study" && <StudyTab ctx={ctx} />}
            {tab === "library" && <LibraryTab ctx={ctx} setTab={setTab} />}
            {tab === "pyq" && <PyqTab ctx={ctx} />}
            {tab === "doubt" && <DoubtTab ctx={ctx} />}
            {tab === "flashcards" && <FlashcardsTab ctx={ctx} />}
            {tab === "quiz" && <QuizTab ctx={ctx} />}
            {tab === "planner" && <PlannerTab ctx={ctx} />}
            {tab === "timer" && <TimerTab ctx={ctx} />}
            {tab === "notes" && <NotesTab ctx={ctx} />}
            {tab === "skills" && <SkillsTab ctx={ctx} />}
            {tab === "community" && <CommunityTab ctx={ctx} />}
            {tab === "rewards" && <RewardsTab ctx={ctx} />}
            {tab === "progress" && <ProgressTab ctx={ctx} />}
          </div>
        </div>

        {toast && (
          <div style={{ position: "fixed", bottom: 20, right: 20, background: "#16305C", color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 13, zIndex: 50, animation: "padhaiCardIn 0.3s ease both", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}>{toast}</div>
        )}
      </div>
    </ThemeContext.Provider>
  );
}

function SidebarContent({ tab, setTab, profile, onLogout, theme }) {
  return (
    <>
      <div style={{ fontFamily: theme.headingFont, fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Padh<span style={{ color: theme.accent }}>AI</span></div>
      <div style={{ fontSize: 11.5, color: "#AEB7C7", marginBottom: 18 }}>{profile.avatar} {profile.name} · {profile.grade}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none",
            background: tab === t.key ? "rgba(255,255,255,0.14)" : "transparent", color: "#fff", textAlign: "left", fontSize: 13, fontWeight: tab === t.key ? 700 : 500
          }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>
      <button onClick={onLogout} style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "#fff", fontSize: 12 }}>Switch profile</button>
    </>
  );
}

/* ============================== HOME ============================== */

function HomeTab({ ctx, setTab }) {
  const s = useThemeStyles();
  const { profile, data, level, xpIntoLevel } = ctx;
  const quote = QUOTES[seededIndex(todayKey(), QUOTES.length)];
  const doneChallenges = data.dailyChallenges.items.filter((c) => c.done).length;

  return (
    <div className="padhai-stagger" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontSize: 20, ...s.heading, fontWeight: 700 }}>Hey {profile.avatar} {profile.name},</div>
        <div style={{ fontSize: 13, color: "#5B6472", marginTop: 4 }}>{quote}</div>
        <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap" }}>
          <Stat label="Streak" value={`${data.streak.count} 🔥`} />
          <Stat label="Level" value={`${level} ⭐`} />
          <Stat label="Coins" value={`${data.coins} 🪙`} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: "#8E97AB", marginBottom: 4 }}>XP to next level ({xpIntoLevel}/100)</div>
          <div style={{ height: 8, background: "#EEF1F5", borderRadius: 6, overflow: "hidden" }}>
            <div className="padhai-bar-fill" style={{ height: "100%", width: `${xpIntoLevel}%`, background: ctx.theme.accent }} />
          </div>
        </div>
      </div>

      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, ...s.heading }}>Today's challenges ({doneChallenges}/4)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.dailyChallenges.items.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: c.done ? "#8E97AB" : "#16305C", textDecoration: c.done ? "line-through" : "none" }}>
              <span>{c.done ? "✅" : "⬜"}</span>{c.text}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
        <QuickLink icon="🎓" label="Generate a lesson" onClick={() => setTab("study")} s={s} />
        <QuickLink icon="🤖" label="Ask a doubt" onClick={() => setTab("doubt")} s={s} />
        <QuickLink icon="❓" label="Take a quiz" onClick={() => setTab("quiz")} s={s} />
        <QuickLink icon="⏰" label="Start focus timer" onClick={() => setTab("timer")} s={s} />
      </div>
    </div>
  );
}
function Stat({ label, value }) {
  return <div><div style={{ fontSize: 11, color: "#8E97AB" }}>{label}</div><div style={{ fontSize: 16, fontWeight: 700 }}>{value}</div></div>;
}
function QuickLink({ icon, label, onClick, s }) {
  return (
    <button onClick={onClick} style={{ ...s.card, padding: 14, textAlign: "left", border: s.card.border, display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 20 }}>{icon}</span><span style={{ fontSize: 12.5, fontWeight: 600, color: "#16305C" }}>{label}</span>
    </button>
  );
}

/* ============================== AI STUDY ============================== */

function StudyTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData, award, completeChallenge, profile } = ctx;
  const chapters = TEXTBOOK_CHAPTERS[profile.grade] || {};
  const subjects = Object.keys(chapters);
  const [subject, setSubject] = useState(ctx.studyPick?.subject || subjects[0] || "");
  const [chapter, setChapter] = useState(ctx.studyPick?.chapter || (chapters[ctx.studyPick?.subject || subjects[0]] || [])[0] || "");
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (ctx.studyPick) ctx.setStudyPick(null); }, []);
  useEffect(() => { if (!chapters[subject]?.includes(chapter)) setChapter((chapters[subject] || [])[0] || ""); }, [subject]);

  async function generate() {
    if (!chapter) return;
    setLoading(true); setError(null); setLesson(null);
    try {
      const text = await callClaude(
        `You are a friendly tutor for an Indian student in ${profile.grade}. Explain the chapter "${chapter}" (subject: ${subject}) in simple, exam-relevant terms of your own — do not quote any textbook. Structure your response with: a short intro, 3-5 key concepts with 1-2 sentence explanations each, and 3 simple example questions with answers. Keep it under 400 words. Do not use markdown headers with #, just plain text with clear paragraph breaks.`
      );
      setLesson(text);
      setData((d) => ({ ...d, stats: { ...d.stats, lessonsGenerated: (d.stats.lessonsGenerated || 0) + 1 } }));
      award(8, 15, "+8 coins, +15 XP for a new lesson!");
      completeChallenge("Generate an AI lesson");
    } catch (e) { setError("Could not generate the lesson. Please try again."); }
    setLoading(false);
  }

  function saveAsNote() {
    if (!lesson) return;
    setData((d) => ({ ...d, notes: [{ id: uid(), title: `${chapter} (${subject})`, body: lesson, createdAt: Date.now() }, ...d.notes] }));
    ctx.showToast("Saved to Notes.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>AI Study — {profile.grade}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={s.label}>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ ...s.input, marginTop: 4 }}>
              {subjects.map((sb) => <option key={sb}>{sb}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={s.label}>Chapter</label>
            <select value={chapter} onChange={(e) => setChapter(e.target.value)} style={{ ...s.input, marginTop: 4 }}>
              {(chapters[subject] || []).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading} style={{ ...s.primaryBtn, marginTop: 12 }}>
          {loading ? <span><span className="padhai-spin">⏳</span> Generating…</span> : "Generate lesson"}
        </button>
        {error && <div style={{ color: "#C0392B", fontSize: 12.5, marginTop: 8 }}>{error}</div>}
      </div>

      {lesson && (
        <div style={{ ...s.card, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{chapter}</div>
            <button onClick={saveAsNote} style={s.ghostBtn}>Save to Notes</button>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.65, whiteSpace: "pre-wrap", color: "#2B3648" }}>{lesson}</div>
        </div>
      )}
    </div>
  );
}

/* ============================== LIBRARY ============================== */

function LibraryTab({ ctx, setTab }) {
  const s = useThemeStyles();
  const { profile } = ctx;
  const chapters = TEXTBOOK_CHAPTERS[profile.grade] || {};
  const subjects = Object.keys(chapters);
  const [openSubject, setOpenSubject] = useState(subjects[0] || null);

  function openChapter(subject, chapter) {
    ctx.setStudyPick({ subject, chapter });
    setTab("study");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading }}>Library — {profile.grade} syllabus</div>
        <div style={{ fontSize: 12, color: "#8E97AB", marginTop: 4 }}>Browse the full chapter list and tap any chapter to get an AI-explained lesson. This is a table of contents guide — not scanned or copied textbook pages.</div>
      </div>
      <div className="padhai-stagger" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subjects.map((sub) => (
          <div key={sub} style={{ ...s.card, padding: 14 }}>
            <div onClick={() => setOpenSubject(openSubject === sub ? null : sub)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{sub}</div>
              <span style={{ fontSize: 12, color: "#8E97AB" }}>{chapters[sub].length} chapters {openSubject === sub ? "▲" : "▼"}</span>
            </div>
            {openSubject === sub && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {chapters[sub].map((c, i) => (
                  <button key={c} onClick={() => openChapter(sub, c)} style={{ textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "1px solid #EEF1F5", background: "#fff", fontSize: 13 }}>
                    <span style={{ color: "#8E97AB", marginRight: 8 }}>{i + 1}.</span>{c}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== PYQ PRACTICE ============================== */

function PyqTab({ ctx }) {
  const s = useThemeStyles();
  const { profile } = ctx;
  const chapters = TEXTBOOK_CHAPTERS[profile.grade] || {};
  const subjects = Object.keys(chapters);
  const [subject, setSubject] = useState(subjects[0] || "");
  const [year, setYear] = useState(PYQ_YEARS[0]);
  const [loading, setLoading] = useState(false);
  const [set, setSet] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [error, setError] = useState(null);

  async function generate() {
    setLoading(true); setError(null); setSet(null); setRevealed({});
    try {
      const text = await callClaude(
        `You are an exam-question setter for Indian school board exams. Write 6 original practice questions for a ${profile.grade} student in the subject "${subject}", in the style and difficulty typically seen in board exam papers around ${year} — but do NOT copy any real exam paper; write fresh original questions covering the standard syllabus topics for this subject and class. Mix short-answer and one numerical/application question if relevant to the subject. Respond ONLY with valid JSON: {"questions":[{"q":"...","marks":2,"answer":"a concise model answer"}]}`
      );
      const parsed = extractJson(text);
      setSet(parsed.questions || []);
    } catch (e) { setError("Could not generate practice questions. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 6 }}>PYQ-style Practice</div>
        <div style={{ fontSize: 11.5, color: "#8E97AB", marginBottom: 10 }}>These are fresh, AI-written questions modelled on the pattern and difficulty of past board papers for the year you pick — not copies of any real exam paper (those are copyrighted by the boards). For the actual official papers, check your board's website.</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ ...s.input, flex: 1, minWidth: 140 }}>
            {subjects.map((sb) => <option key={sb}>{sb}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ ...s.input, flex: 1, minWidth: 100 }}>
            {PYQ_YEARS.map((y) => <option key={y} value={y}>Pattern: {y}</option>)}
          </select>
          <button onClick={generate} disabled={loading} style={s.primaryBtn}>{loading ? "Creating…" : "Generate set"}</button>
        </div>
        {error && <div style={{ color: "#C0392B", fontSize: 12.5, marginTop: 8 }}>{error}</div>}
      </div>

      {set && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {set.map((q, i) => (
            <div key={i} style={{ ...s.card, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{i + 1}. {q.q}</div>
                <div style={{ fontSize: 11, color: "#8E97AB", whiteSpace: "nowrap" }}>{q.marks} marks</div>
              </div>
              <button onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))} style={{ ...s.ghostBtn, marginTop: 8, padding: "5px 10px", fontSize: 11.5 }}>
                {revealed[i] ? "Hide answer" : "Show model answer"}
              </button>
              {revealed[i] && <div style={{ fontSize: 13, marginTop: 8, color: "#2B3648", whiteSpace: "pre-wrap" }}>{q.answer}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== DOUBT SOLVER ============================== */

function DoubtTab({ ctx }) {
  const s = useThemeStyles();
  const { setData, award, completeChallenge, profile } = ctx;
  const [messages, setMessages] = useState([{ role: "assistant", text: `Hi ${profile.name}! Ask me anything from your ${profile.grade} syllabus.` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.text}`).join("\n");
      const reply = await callClaude(`You are a patient, encouraging tutor for an Indian student in ${profile.grade}. Continue this conversation and answer the student's latest question clearly, with a short worked example if it's a numerical/science question. Keep answers under 200 words, plain text, no markdown symbols.\n\n${history}\nStudent: ${q}\nTutor:`);
      setMessages((m) => [...m, { role: "assistant", text: reply.trim() }]);
      setData((d) => ({ ...d, stats: { ...d.stats, doubtsAsked: (d.stats.doubtsAsked || 0) + 1 } }));
      award(3, 8, null);
      completeChallenge("Ask AI a doubt");
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, I couldn't process that — please try again." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ ...s.card, padding: 16, display: "flex", flexDirection: "column", height: "70vh" }}>
      <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>Doubt Solver</div>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", background: m.role === "user" ? ctx.theme.accent : "#F1F3F7", color: m.role === "user" ? "#fff" : "#16305C", padding: "9px 13px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", fontSize: 12.5, color: "#8E97AB" }}><span className="padhai-spin">⏳</span> Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your doubt…" style={{ ...s.input, flex: 1 }} />
        <button onClick={send} disabled={loading} style={s.primaryBtn}>Send</button>
      </div>
    </div>
  );
}

/* ============================== FLASHCARDS ============================== */

function FlashcardsTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData, award, profile } = ctx;
  const [topic, setTopic] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [activeDeck, setActiveDeck] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  async function generateDeck() {
    if (!topic.trim()) return;
    setGenLoading(true);
    try {
      const text = await callClaude(`Create 8 flashcards (question and short answer) for an Indian ${profile.grade} student studying the topic "${topic}". Respond ONLY with valid JSON, no other text: {"cards":[{"q":"...","a":"..."}]}`);
      const parsed = extractJson(text);
      const cards = (parsed.cards || []).map((c) => ({ id: uid(), q: c.q, a: c.a }));
      const deck = { id: uid(), title: topic.trim(), cards, createdAt: Date.now() };
      setData((d) => ({ ...d, decks: [deck, ...d.decks] }));
      setTopic("");
      award(6, 10, "Deck created — +6 coins, +10 XP!");
    } catch (e) { ctx.showToast("Could not create the deck. Try again."); }
    setGenLoading(false);
  }

  function openDeck(deck) { setActiveDeck(deck); setIdx(0); setFlipped(false); }
  function deleteDeck(id) { setData((d) => ({ ...d, decks: d.decks.filter((dk) => dk.id !== id) })); if (activeDeck?.id === id) setActiveDeck(null); }

  if (activeDeck) {
    const c = activeDeck.cards[idx];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <button onClick={() => setActiveDeck(null)} style={s.ghostBtn}>← Back to decks</button>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{activeDeck.title} ({idx + 1}/{activeDeck.cards.length})</div>
        <div onClick={() => setFlipped((f) => !f)} style={{ ...s.card, padding: 30, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", fontSize: 15 }}>
          {flipped ? c.a : c.q}
        </div>
        <div style={{ fontSize: 11.5, color: "#8E97AB", textAlign: "center" }}>Tap the card to flip</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={s.ghostBtn} disabled={idx === 0} onClick={() => { setIdx((i) => i - 1); setFlipped(false); }}>← Prev</button>
          <button style={s.ghostBtn} disabled={idx === activeDeck.cards.length - 1} onClick={() => { setIdx((i) => i + 1); setFlipped(false); }}>Next →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>Flashcards</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, Trigonometry ratios…" style={{ ...s.input, flex: 1 }} />
          <button onClick={generateDeck} disabled={genLoading} style={s.primaryBtn}>{genLoading ? "Creating…" : "Generate deck"}</button>
        </div>
      </div>
      <div className="padhai-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
        {data.decks.map((dk) => (
          <div key={dk.id} style={{ ...s.card, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{dk.title}</div>
            <div style={{ fontSize: 11.5, color: "#8E97AB", margin: "4px 0 10px" }}>{dk.cards.length} cards</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => openDeck(dk)} style={{ ...s.primaryBtn, padding: "6px 10px", fontSize: 12 }}>Review</button>
              <button onClick={() => deleteDeck(dk.id)} style={{ ...s.ghostBtn, padding: "6px 10px", fontSize: 12 }}>Delete</button>
            </div>
          </div>
        ))}
        {data.decks.length === 0 && <div style={{ fontSize: 13, color: "#8E97AB" }}>No decks yet — generate one above.</div>}
      </div>
    </div>
  );
}

/* ============================== QUIZ ============================== */

function QuizTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData, award, profile } = ctx;
  const chapters = TEXTBOOK_CHAPTERS[profile.grade] || {};
  const subjects = Object.keys(chapters);
  const [subject, setSubject] = useState(subjects[0] || "");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  async function generate() {
    setLoading(true); setQuiz(null); setAnswers({}); setSubmitted(false);
    try {
      const text = await callClaude(`Create a 5-question multiple choice quiz for an Indian ${profile.grade} student on the subject "${subject}", covering typical syllabus topics. Respond ONLY with valid JSON: {"questions":[{"q":"...","options":["A","B","C","D"],"correct":0}]}. "correct" is the zero-based index of the right option.`);
      const parsed = extractJson(text);
      setQuiz(parsed.questions || []);
    } catch (e) { ctx.showToast("Could not create the quiz. Try again."); }
    setLoading(false);
  }

  function submit() {
    const total = quiz.length;
    const score = quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    setSubmitted(true);
    setData((d) => ({ ...d, quizHistory: [{ id: uid(), subject, score, total, date: Date.now() }, ...d.quizHistory] }));
    award(score * 3, score * 6, `Scored ${score}/${total}!`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>Quiz — {profile.grade}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ ...s.input, flex: 1 }}>
            {subjects.map((sb) => <option key={sb}>{sb}</option>)}
          </select>
          <button onClick={generate} disabled={loading} style={s.primaryBtn}>{loading ? "Creating…" : "New quiz"}</button>
        </div>
      </div>

      {quiz && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {quiz.map((q, i) => (
            <div key={i} style={{ ...s.card, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 8 }}>{i + 1}. {q.q}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map((opt, oi) => {
                  const chosen = answers[i] === oi;
                  const isCorrect = submitted && oi === q.correct;
                  const isWrongChosen = submitted && chosen && oi !== q.correct;
                  return (
                    <button key={oi} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))} style={{
                      textAlign: "left", padding: "8px 12px", borderRadius: 8, fontSize: 13,
                      border: chosen ? `2px solid ${ctx.theme.accent}` : "1px solid #DDE1E8",
                      background: isCorrect ? "#E8F7EE" : isWrongChosen ? "#FDECEC" : "#fff", color: "#16305C"
                    }}>{opt}</button>
                  );
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <button onClick={submit} disabled={Object.keys(answers).length < quiz.length} style={s.primaryBtn}>Submit quiz</button>
          ) : (
            <div style={{ ...s.card, padding: 14, fontWeight: 700, textAlign: "center" }}>
              Score: {quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0)}/{quiz.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================== PLANNER ============================== */

function PlannerTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData } = ctx;
  const [taskText, setTaskText] = useState("");
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  function addTask() {
    if (!taskText.trim()) return;
    setData((d) => ({ ...d, tasks: [{ id: uid(), text: taskText.trim(), done: false }, ...d.tasks] }));
    setTaskText("");
  }
  function toggleTask(id) { setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })); }
  function deleteTask(id) { setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })); }
  function addExam() {
    if (!examName.trim() || !examDate) return;
    setData((d) => ({ ...d, exams: [...d.exams, { id: uid(), name: examName.trim(), date: examDate }].sort((a, b) => a.date.localeCompare(b.date)) }));
    setExamName(""); setExamDate("");
  }
  function deleteExam(id) { setData((d) => ({ ...d, exams: d.exams.filter((e) => e.id !== id) })); }
  function daysUntil(dateStr) { return Math.ceil((new Date(dateStr) - new Date(todayKey())) / 86400000); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>Tasks</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={taskText} onChange={(e) => setTaskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Add a task…" style={{ ...s.input, flex: 1 }} />
          <button onClick={addTask} style={s.primaryBtn}>Add</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.tasks.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
              <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none", color: t.done ? "#8E97AB" : "#16305C" }}>{t.text}</span>
              <button onClick={() => deleteTask(t.id)} style={{ ...s.ghostBtn, padding: "3px 8px", fontSize: 11 }}>✕</button>
            </div>
          ))}
          {data.tasks.length === 0 && <div style={{ fontSize: 12.5, color: "#8E97AB" }}>No tasks yet.</div>}
        </div>
      </div>

      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>Exam countdowns</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Exam name" style={{ ...s.input, flex: 1, minWidth: 120 }} />
          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} style={{ ...s.input, flex: 1, minWidth: 140 }} />
          <button onClick={addExam} style={s.primaryBtn}>Add</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data.exams.map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, alignItems: "center" }}>
              <span>{e.name} — {e.date}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <b>{daysUntil(e.date)} days</b>
                <button onClick={() => deleteExam(e.id)} style={{ ...s.ghostBtn, padding: "3px 8px", fontSize: 11 }}>✕</button>
              </span>
            </div>
          ))}
          {data.exams.length === 0 && <div style={{ fontSize: 12.5, color: "#8E97AB" }}>No exams added yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ============================== FOCUS TIMER ============================== */

function TimerTab({ ctx }) {
  const s = useThemeStyles();
  const { setData, award } = ctx;
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s2) => {
          if (s2 <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setData((d) => ({ ...d, stats: { ...d.stats, sessionsDone: (d.stats.sessionsDone || 0) + 1 } }));
            award(10, 20, "Focus session complete! +10 coins, +20 XP");
            return 0;
          }
          return s2 - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function setPreset(m) { setMinutes(m); setSecondsLeft(m * 60); setRunning(false); }
  function reset() { setSecondsLeft(minutes * 60); setRunning(false); }
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div style={{ ...s.card, padding: 24, textAlign: "center", maxWidth: 340, margin: "0 auto" }}>
      <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 14 }}>Focus Timer</div>
      <div style={{ fontSize: 52, fontWeight: 700, fontFamily: "monospace", marginBottom: 14 }}>{mm}:{ss}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14 }}>
        {[15, 25, 45].map((m) => (
          <button key={m} onClick={() => setPreset(m)} style={{ ...s.ghostBtn, background: minutes === m ? ctx.theme.accent : "#fff", color: minutes === m ? "#fff" : "#16305C" }}>{m}m</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={() => setRunning((r) => !r)} style={s.primaryBtn}>{running ? "Pause" : "Start"}</button>
        <button onClick={reset} style={s.ghostBtn}>Reset</button>
      </div>
    </div>
  );
}

/* ============================== NOTES ============================== */

function NotesTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData } = ctx;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(null);

  function save() {
    if (!title.trim() || !body.trim()) return;
    setData((d) => ({ ...d, notes: [{ id: uid(), title: title.trim(), body: body.trim(), createdAt: Date.now() }, ...d.notes] }));
    setTitle(""); setBody("");
  }
  function del(id) { setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) })); if (open === id) setOpen(null); }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...s.card, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 16, ...s.heading, marginBottom: 10 }}>New note</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ ...s.input, marginBottom: 8 }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your note…" rows={4} style={{ ...s.input, resize: "vertical" }} />
        <button onClick={save} style={{ ...s.primaryBtn, marginTop: 10 }}>Save note</button>
      </div>
      <div className="padhai-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.notes.map((n) => (
          <div key={n.id} style={{ ...s.card, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen(open === n.id ? null : n.id)}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{n.title}</div>
              <button onClick={(e) => { e.stopPropagation(); del(n.id); }} style={{ ...s.ghostBtn, padding: "3px 8px", fontSize: 11 }}>✕</button>
            </div>
            {open === n.id && <div style={{ fontSize: 13, marginTop: 8, whiteSpace: "pre-wrap", color: "#2B3648" }}>{n.body}</div>}
          </div>
        ))}
        {data.notes.length === 0 && <div style={{ fontSize: 12.5, color: "#8E97AB" }}>No notes yet.</div>}
      </div>
    </div>
  );
}

/* ============================== SKILLS ============================== */

function SkillsTab({ ctx }) {
  const s = useThemeStyles();
  const { data, setData } = ctx;
  const [skill, setSkill] = useState("");

  function add() {
    if (!skill.trim()) return;
    setData((d) => ({ ...d, skills: [...(d.skills || []), { id: uid(), name: skill.trim(), level: 1 } ] }));
    setSkill("");
  }
  function
