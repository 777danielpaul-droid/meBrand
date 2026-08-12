// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
export const site = {
  // --- BRAND & NAVIGATION ---
  brand: { de: "Daniel Paul", en: "Daniel Paul" },

  nav: [
    { label: { de: "Start", en: "Home" }, href: "#hero" },
    { label: { de: "Terminal", en: "Terminal" }, href: "#terminal" },
    { label: { de: "Profil", en: "Profile" }, href: "#profile" },
    { label: { de: "Projekte", en: "Projects" }, href: "#archiv" },
  ],

  // --- HERO ---
  hero: {
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
    primaryCta: { label: { de: "Jetzt kontaktieren", en: "Get in touch" }, href: "#hero" },
    secondaryCta: {
      label: { de: "Zur Battle-Ansicht", en: "To battle view" },
      href: "#battle",
    },
  },

  // --- SCROLL-REVEAL SECTIONS (SecretWeapon + Battle) ---
  // Beide Sektionen nutzen dasselbe Scroll-Enthüllungs-Muster (ScrollRevealSection.jsx).
  revealSections: [
    {
      id: "secret-weapon",
      image: "hitisop-cover.png",
      link: { de: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/", en: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/" },
      linkLabel: { de: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/", en: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/" },
      titleCover: { de: "My first game", en: "My first game" },
      coverBody: { de: "Eine Indie-Game-Demo mit wiederholbaren Game-Loops und schneller Mechanikvalidierung.", en: "An indie game demo with repeatable loops and rapid mechanic validation." },
    },
    {
      id: "battle",
      image: "battle-cover.png",
      link: { de: "https://humble-bee.de", en: "https://humble-bee.de" },
      linkLabel: { de: "Save the bees — humble-bee.de", en: "Save the bees — humble-bee.de" },
      titleCover: { de: "Humble-Bee", en: "Humble-Bee" },
      coverBody: { de: "Naturschutzplattform für lokale Imkerei und Bienenschutz.", en: "A conservation platform for local beekeeping and bee protection." },
    },
  ],

  // --- BOTTLENECK RONDELL (neu unten, kein Scroll-Reveal) ---
  rondellSections: [
    {
      id: "spiderz",
      title: { de: "SpiderZ — Web-Game", en: "SpiderZ — Web Game" },
      desc: { de: "Interaktives Schere-Stein-Papier-Logik-Spiel in React + Vite — Scroll-getriebene Animationen, WebGL-Hintergrund.", en: "Interactive rock-paper-scissors logic game in React + Vite. Scroll-driven animations, WebGL background." },
      tech: ["React", "Vite", "Three.js", "TypeScript"],
      url: "https://777danielpaul-droid.github.io/SpiderZ/",
      image: "/spiderz-screenshot.png",
      accent: "#7c3aed",
    },
    {
      id: "roidz",
      title: { de: "Roidz.de — E-Commerce", en: "Roidz.de — E-Commerce" },
      desc: { de: "Shopify-Shop für Nahrungsergänzung & Sportbekleidung.", en: "Shopify store for supplements & sportswear." },
      tech: ["Shopify", "Produktpflege", "Conversion"],
      url: "https://www.roidz.de",
      image: "/roidz-screenshot.png",
      accent: "#f59e0b",
    },
    {
      id: "onyxboard",
      title: { de: "Onyxboard — 3D-Brettspiel", en: "Onyxboard — 3D Board Game" },
      desc: { de: "Interaktives 3D-Brettspiel mit Schach-Logik in React + Vite. WebGL-Animationen, scroll-getriebene Interaktion.", en: "Interactive 3D board game with chess logic in React + Vite. WebGL animations, scroll-driven interaction." },
      tech: ["React", "Vite", "Three.js", "TypeScript"],
      url: "https://github.com/777danielpaul-droid/onyxboard",
      image: "/onyxboard-screenshot.png",
      accent: "#22d3ee",
    },
    {
      id: "github-repos",
      title: { de: "...und noch mehr Projekte.", en: "...and more projects." },
      desc: { de: "Alle öffentlichen Repositories auf GitHub — von Indie-Game-Demos über KI-Prototypen bis zu Web-Apps.", en: "All public GitHub repos — from indie game demos to AI prototypes and web apps." },
      tech: ["GitHub", "Open Source", "Prototyping"],
      url: "https://github.com/777danielpaul-droid?tab=repositories",
      accent: "#ef4444",
    },
  ],

  // --- FOOTER ---
  footer: {
    note: { de: "© 2025 Daniel Paul — alle Rechte vorbehalten.", en: "© 2025 Daniel Paul — all rights reserved." },
    links: [
      { label: { de: "Impressum", en: "Imprint" }, href: "/impressum.html" },
      { label: { de: "Datenschutz", en: "Privacy" }, href: "/datenschutz.html" },
      { label: { de: "AGB", en: "Terms" }, href: "/agb.html" },
    ],
  },
};

// --- PROFIL ---
export const profile = {
  name: { de: "Daniel Paul", en: "Daniel Paul" },
  portrait: "portrait.png",
  contact: {
    phone: "+49 151 67575229",
    phoneReverse: "92257576 151 94+",
    email: "paul-daniel@t-online.de",
    address: {
      de: "Imhoffstücken 18, 21423 Winsen",
      en: "Imhoffstücken 18, 21423 Winsen, Germany",
    },
    github: "https://github.com/777danielpaul-droid",
  },
};
