// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
// Alle Werte sind bewusst auf "textN" neutralisiert — bitte hier mit echten Inhalten ersetzen.
// Nummerierung läuft durchgängig text1–textN über content.js und alle JSX-Komponenten.
export const site = {
  // --- BRAND & NAVIGATION ---
  brand: { de: "text1", en: "text2" },
  tagline: { de: "text3", en: "text4" },
  nav: [
    { label: { de: "Start", en: "Home" }, href: "#hero" },
    { label: { de: "Terminal", en: "Terminal" }, href: "#" },
    { label: { de: "Profil", en: "Profile" }, href: "#profile" },
    { label: { de: "HITisOP", en: "Secret Weapon" }, href: "#secret-weapon" },
    { label: { de: "HumbleBee", en: "Battle" }, href: "#battle" },
  ],

  // --- HERO ---
  hero: {
    eyebrow: { de: "", en: "" },
    title: {
      de: "",
      en: "",
    },
    lead: {
      title: {
        de: "Technical Prototyper · AI Engineer · Full-Stack Developer · AI Automation Specialist",
        en: "Technical Prototyper · AI Engineer · Full-Stack Developer · AI Automation Specialist",
      },
      body: {
        de: "Ich entwickle produktionsnahe Prototypen mit React, Python und modernen KI-Technologien. Von der ersten Idee bis zur skalierbaren Anwendung entstehen Lösungen, die Prozesse automatisieren und echte Probleme lösen bis zum fertigen Produkt.",
        en: "I turn ideas into intelligent software. With React, Python, and modern LLMs, I build powerful AI applications, agents, and automations — fast to validate, production-ready, and scalable from day one.",
      },
    },
    // Skill-Beziehungen — erscheinen als Tag-Liste unter dem Lead-Text im Hero
    skills: [
      { de: "React / Vite / Tailwind", en: "React / Vite / Tailwind" },
      { de: "Python & Backend-Logik", en: "Python & backend logic" },
      { de: "Spec-driven Prototyping", en: "Spec-driven prototyping" },
      { de: "CI/CD Deployment", en: "CI/CD deployment" },
    ],
    primaryCta: { label: { de: "text23", en: "text24" }, href: "#" },
    secondaryCta: {
      label: { de: "text25", en: "text26" },
      href: "#battle",
    },
  },

  // --- FRACTUREN ---
  factions: [
    {
      id: "erdbaeren",
      accent: "neon",
      name: { de: "text27", en: "text28" },
      role: { de: "text29", en: "text30" },
      quote: { de: "text31", en: "text32" },
      traits: [
        { de: "text33", en: "text34" },
        { de: "text35", en: "text36" },
        { de: "text37", en: "text38" },
        { de: "text39", en: "text40" },
      ],
      image: "/erdbaer-bear.jpg",
    },
    {
      id: "milchmaeuse",
      accent: "cyan",
      name: { de: "text41", en: "text42" },
      role: { de: "text43", en: "text44" },
      quote: { de: "text45", en: "text46" },
      traits: [
        { de: "text47", en: "text48" },
        { de: "text49", en: "text50" },
        { de: "text51", en: "text52" },
        { de: "text53", en: "text54" },
      ],
      image: "/milchmaus-mouse.jpg",
    },
  ],

  // --- KONFLIKT ---
  conflict: {
    eyebrow: { de: "text55", en: "text56" },
    title: { de: "text57", en: "text58" },
    body: { de: "text59", en: "text60" },
  },

  // --- GEHEIMWAFFE ---
  secret: {
    name: { de: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/", en: "text78" },
    titleCover: { de: "text83", en: "text84" },
    coverBody: { de: "text85", en: "text86" },
  },

  // --- SCHLACHT ---
  battleMeta: {
    eyebrow: { de: "Projekte • Scroll to reveal", en: "text88" },
    caption: { de: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/", en: "text90" },
    titleCover: { de: "Humble-Bee", en: "text92" },
    coverBody: { de: "Projekt", en: "text94" },
  },
  battle: "/erdbaer-battle.jpg",

  // --- ARCHIV ---
  archive: {
    eyebrow: { de: "", en: "" },
    title: { de: "", en: "" },
    entries: [
      {
        code: "text99",
        title: { de: "text100", en: "text101" },
        text: { de: "text102", en: "text103" },
      },
      {
        code: "text104",
        title: { de: "text105", en: "text106" },
        text: { de: "text107", en: "text108" },
      },
      {
        code: "text109",
        title: { de: "text110", en: "text111" },
        text: { de: "text112", en: "text113" },
      },
      {
        code: "text114",
        title: { de: "text115", en: "text116" },
        text: { de: "text117", en: "text118" },
      },
    ],
    intercepts: {
      eyebrow: { de: "", en: "" },
      title: { de: "", en: "" },
      hint: { de: "", en: "" },
      messages: [
        {
          code: "SIG-01",
          cipher: "ᛟᚠᚠ-W0R-ᛗE-ᚱU-ᚷHT",
          plain: { de: "Position Gewinnen Sie rechts", en: "Advance position right flank" },
        },
        {
          code: "SIG-02",
          cipher: "ᛗI-ᚱI-ᚷHT-ᚠL-ᚨN-ᚲ",
          plain: { de: "Mich rechts anflankieren", en: "Flank me from the right" },
        },
        {
          code: "SIG-03",
          cipher: "ᚠAL-ᛚS-ᚷO-ᚱIGHT-ᛗE",
          plain: { de: "Falle rechts mich gehen", en: "Ambush right, go for me" },
        },
        {
          code: "SIG-04",
          cipher: "ᚱI-ᚷHT-ᚠL-ᚨN-ᚲ-CO-ᛗ",
          plain: { de: "Rechts anflankieren mit CO", en: "Right flank with CO" },
        },
      ],
    },
  },

  // --- FOOTER ---
  footer: {
    note: { de: "", en: "" },
    links: [
      { label: { de: "text143", en: "text144" }, href: "/impressum.html" },
      { label: { de: "text145", en: "text146" }, href: "/datenschutz.html" },
      { label: { de: "text147", en: "text148" }, href: "#" },
    ],
  },

  // --- KONTAKT-SEKTION (Überschriften/Intro) ---
  contact: {
    eyebrow: { de: "text180", en: "text181" },
    title: { de: "text182", en: "text183" },
    intro: { de: "text184", en: "text185" },
  },

  // --- RECHTLICHES (privat / non-kommerziell) ---
  legal: {
    provider: {
      name: "text149",
      street: "text150",
      city: "text151",
      email: "text152",
    },
    impressum: ["text153", "text154", "text155"],
    agb: [
      { h: "text156", t: "text157" },
      { h: "text158", t: "text159" },
      { h: "text160", t: "text161" },
    ],
    privacy: [
      { h: "text162", t: "text163" },
      { h: "text164", t: "text165" },
      { h: "text166", t: "text167" },
    ],
  },
};

// --- PROFIL (für Contact.jsx & Portrait) ---
export const profile = {
  name: { de: "Daniel Paul", en: "Daniel Paul" },
  portrait: "/portrait.png",
  contact: {
    phone: "+49 151 67575229",
    email: "paul-daniel@t-online.de",
    address: { de: "Imhoffstücken 18, 21423 Winsen", en: "Imhoffstücken 18, 21423 Winsen, Germany" },
    github: "https://github.com/777danielpaul-droid",
  },
};
