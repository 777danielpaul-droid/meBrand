// Zentrale Profil-Daten — ausschließlich DANIELs eigene Daten (keine Unternehmens-
// Referenzen). Alle Werte stammen aus den Bewerbungsvorlagen im Ordner "Bewerbung_neu".
// Diese Daten fließen als ergänzende CV-Sektion in die Space-Theme-Seite ein.

export const cvData = {
  name: { de: "Daniel Paul", en: "Daniel Paul" },
  role: {
    de: "Technical Prototyper — schnelle, produktionsnahe Demos mit React, Python und KI",
    en: "Technical Prototyper — rapid, production-ready demos with React, Python & AI",
  },

  contact: {
    address: { de: "Imhoffstücken 18, 21423 Winsen", en: "Imhoffstücken 18, 21423 Winsen, Germany" },
    phone: "+49 151 67575229",
    email: "paul-daniel@t-online.de",
    github: "https://github.com/777danielpaul-droid",
  },

  portrait: "/portrait.png",

  // --- Skill-Balken (aus cv_diag.png / resume_en.html) ---
  // Werte sind Profil-Angaben von Daniel selbst.
  // Icon-Pfade: stilisiert, farbig (currentColor übernimmt neon/cyan/gold)
  skills: [
    { name: { de: "HTML / CSS / JavaScript", en: "HTML / CSS / JavaScript" }, level: 90, color: "#c026d3", icon: "M12 2L3 6v12c0 4 5 8 9 8s9-4 9-8V6l-9-4z M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" },
    { name: { de: "React / Tailwind / Vite", en: "React / Tailwind / Vite" }, level: 80, color: "#7c3aed", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
    { name: { de: "Python", en: "Python" }, level: 75, color: "#22d3ee", icon: "M6 2h12v2H6zm0 20h12v2H6zm8-22l2 4H8l2-4zm-8 8h12v12H6zm6 2c-2.2 0-4-1.8-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.2-1.8 4-4 4zm-2 6c-2.2 0-4-1.8-4-4h2c0 1.1.9 2 2 2s2-.9 2-2h2c0 2.2-1.8 4-4 4z" },
    { name: { de: "Git / GitHub / CI/CD", en: "Git / GitHub / CI/CD" }, level: 85, color: "#f5c542", icon: "M12 0C8.5 0 5.6 2.9 5.6 6.4 5.6 9.3 7.8 11.7 11 12.4V18H16V12.4c3.2-.7 5.4-3.1 5.4-6.4S15.5 0 12 0zm0 2.2c2.9 0 5.3 2.4 5.3 5.3s-2.4 5.3-5.3 5.3-5.3-2.4-5.3-5.3S9.1 2.2 12 2.2zM6 14.8c-2.4-.6-4 2.8-4 5.3v3.5h10v-1.7c0-1.4-.3-2.7-.9-3.9-.2-.5-.5-.9-.9-1.3l-.2-.3c-1.1-.6-1.6-1.9-1-3.1.6-1.2 1.9-1.8 3.1-1.3.2.1.5.2.7.3.1 0 .3-.1.4-.1h.1c.8-.1 1.5-.5 1.9-1.1.4-.6.4-1.3.2-2s-.7-1.3-1.5-1.5l-.2-.1c-.2 0-.3-.1-.5-.1h-.2c-1.2-.8-2.6-1.2-4-.8-1.5.4-2.5 1.6-2.5 3.1 0 1.6 1.2 2.9 2.8 3.3z" },
    { name: { de: "KI-Grundlagen / Prototyping", en: "AI Fundamentals / Prototyping" }, level: 70, color: "#c026d3", icon: "M12 3C9.8 3 8 4.8 8 7c0 1.7 1.1 3.1 2.6 3.7.3.1.5.3.7.5.1-.2.2-.3.3-.5.3-.7.5-1.4.5-2.2 0-1.9-1.6-3.4-3.5-3.4S6 5.1 6 7s1.6 3.5 3.5 3.5c.7 0 1.4-.2 2-.5l-.2-.2c-.2.2-.4.4-.6.6-.4-.6-.6-1.3-.6-2.1 0-1.7 1.4-3 3.1-3s3.1 1.4 3.1 3.1c0 1.6-1.3 2.9-3 3.1v2c2.2-.2 4-2 4-4.2C19 6.8 15.2 3 12 3z" },
  ],

  softSkills: [
    { name: { de: "Deutsch — Muttersprache", en: "German — native" }, level: 100, color: "#f5c542", icon: "M8 3v2c2.3 0 4.5.6 6.4 1.8l1.2-1.2C14.3 5 11.2 4 8 4V2c0 .1-.1.1-.2.2L6 4l-2 2v10l2 2 .8-.2c.2 0 .4-.1.4-.2V8c0-.1-.1-.1-.2-.2L6 6l2-2V4c3.2 0 6.3 1 8.7 2.8l1.2-1.2C15.7 4.8 12 3 8 3zm8 12c-.5 0-1-.2-1.4-.5l-4.2 4.2c-.2 0-.4.1-.5.2l-.2.2v-3.4c-.9-.4-1.5-1.3-1.5-2.4 0-1.4 1.1-2.5 2.5-2.5.9 0 1.7.6 2.2 1.4l3.8-3.8c.2-.3.4-.5.7-.7.4.5.5 1.2.2 1.9-.3.7-1 1.3-1.7 1.5.4.6.7 1.2.7 1.9 0 1.4-1.1 2.5-2.5 2.5zm-8 6c-.6 0-1-.5-1-1s.4-1 1-1 1 .4 1 1-.4 2-1 2z" },
    { name: { de: "Englisch — gute Kenntnisse", en: "English — good command" }, level: 80, color: "#c026d3", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
  ],

  tools: [
    { name: "VS Code", icon: "M6 2h12v2H6zm0 20h12v2H6zm8-22l2 4H8l2-4zm-8 8h12v12H6z" },
    { name: "GitHub", icon: "M12 0C8.5 0 5.6 2.9 5.6 6.4 5.6 9.3 7.8 11.7 11 12.4V18H16V12.4c3.2-.7 5.4-3.1 5.4-6.4S15.5 0 12 0zm0 2.2c2.9 0 5.3 2.4 5.3 5.3s-2.4 5.3-5.3 5.3-5.3-2.4-5.3-5.3S9.1 2.2 12 2.2z" },
    { name: "Vite", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
    { name: "Shopify", icon: "M8 3v2c2.3 0 4.5.6 6.4 1.8l1.2-1.2C14.3 5 11.2 4 8 4V2c0 .1-.1.1-.2.2L6 4l-2 2v10l2 2 .8-.2c.2 0 .4-.1.4-.2V8c0-.1-.1-.1-.2-.2L6 6l2-2V4c3.2 0 6.3 1 8.7 2.8l1.2-1.2C15.7 4.8 12 3 8 3zm8 12c-.5 0-1-.2-1.4-.5l-4.2 4.2c-.2 0-.4.1-.5.2l-.2.2v-3.4c-.9-.4-1.5-1.3-1.5-2.4 0-1.4 1.1-2.5 2.5-2.5.9 0 1.7.6 2.2 1.4l3.8-3.8c.2-.3.4-.5.7-.7.4.5.5 1.2.2 1.9-.3.7-1 1.3-1.7 1.5.4.6.7 1.2.7 1.9 0 1.4-1.1 2.5-2.5 2.5z" },
    { name: "Figma", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
  ],

  // --- Projekte ---
  projects: [
    {
      id: "erdbaeren2",
      title: { de: "ErdBaeren2 — Interaktive Web-Anwendung", en: "ErdBaeren2 — Interactive Web App" },
      role: { de: "Fullstack-Entwicklung", en: "Fullstack Development" },
      tech: ["React", "Vite", "Tailwind", "GitHub Pages", "GitHub Actions"],
      date: { de: "laufend", en: "ongoing" },
      desc: {
        de: "Konzeption und vollständige Umsetzung einer responsiven SPA mit wiederverwendbaren Komponenten, iterativer UX-Optimierung und automatischem CI/CD-Deployment.",
        en: "Concept and full implementation of a responsive SPA with reusable components, iterative UX optimization and automatic CI/CD deployment.",
      },
      url: "https://777danielpaul-droid.github.io/ErdBaeren2/",
    },
    {
      id: "humblebee",
      title: { de: "HumbleBee.de — Naturschutzplattform", en: "HumbleBee.de — Conservation Platform" },
      role: { de: "Frontend-Entwicklung", en: "Frontend Development" },
      tech: ["HTML", "CSS", "JavaScript", "Responsive Design", "Performance"],
      date: { de: "produktiv", en: "live" },
      desc: {
        de: "Konzeption, Design und technische Umsetzung einer Informationsplattform für lokalen Naturschutz mit Fokus auf klarer Nutzerführung und Ladeperformance.",
        en: "Concept, design and technical implementation of an information platform for local nature conservation with focus on clear user guidance and loading performance.",
      },
      url: "https://humble-bee.de",
    },
    {
      id: "hitisop",
      title: { de: "Hit-Is-Op — Indie-Game-Demo", en: "Hit-Is-Op — Indie Game Demo" },
      role: { de: "Game Prototyping", en: "Game Prototyping" },
      tech: ["Mechanikdesign", "Iteration", "Vercel"],
      date: { de: "laufend", en: "ongoing" },
      desc: {
        de: "Eigenentwickelte Spiel-Demo mit wiederholbaren Game-Loops, schneller Mechanikvalidierung und iterativem Balancing.",
        en: "Self-developed game demo with repeatable game loops, rapid mechanic validation and iterative balancing.",
      },
      url: "https://hit-is-op-website-21oxq4fg0-chozen-core.vercel.app/",
    },
    {
      id: "roidz",
      title: { de: "Roidz.de — E-Commerce Shop", en: "Roidz.de — E-Commerce Shop" },
      role: { de: "Shopify-Entwicklung", en: "Shopify Development" },
      tech: ["Shopify", "Produktpflege", "Release-Rhythmus", "Conversion"],
      date: { de: "Phase 1 live", en: "Phase 1 live" },
      desc: {
        de: "Kompletter Aufbau eines Onlineshops für Nahrungsergänzung und Sportbekleidung inklusive Design, Produktpflege und technischer Konfiguration.",
        en: "Complete setup of an online shop for supplements and sportswear including design, product care and technical configuration.",
      },
    },
  ],

  // --- Ausbildung ---
  education: [
    {
      title: { de: "WBS Coding School — Software Engineer & AI", en: "WBS Coding School — Software Engineer & AI" },
      org: { de: "Intensiv-Weiterbildung", en: "Intensive full-time programme" },
      date: { de: "04.2026 – 05.2027", en: "Apr 2026 – May 2027" },
      desc: {
        de: "Fullstack-Webentwicklung (HTML, CSS, JavaScript, React), Python, Grundlagen der KI, Versionskontrolle mit Git/GitHub.",
        en: "Full-stack web development (HTML, CSS, JavaScript, React), Python, AI fundamentals, version control with Git/GitHub.",
      },
    },
    {
      title: { de: "BBS Winsen — Mittlere Reife (BFST)", en: "Vocational School of Technology" },
      org: { de: "Berufsfachschule Technik", en: "" },
      date: { de: "2003 – 2005", en: "Aug 2003 – Jul 2005" },
    },
    {
      title: { de: "Berufsgrundjahr Metall", en: "Pre-Vocational Year (Metalwork)" },
      org: { de: "BBS Winsen", en: "BBS Winsen" },
      date: { de: "2002 – 2003", en: "Aug 2002 – Jul 2003" },
    },
    {
      title: { de: "Hauptschulabschluss", en: "Secondary School Certificate" },
      org: { de: "Johann-Peter-Eckermann-Realschule, Winsen", en: "Johann-Peter-Eckermann-Realschule, Winsen" },
      date: { de: "bis 2002", en: "Aug 1996 – May 2002" },
    },
  ],

  // --- Berufserfahrung ---
  workExperience: [
    {
      title: { de: "Pflege einer schwerbehinderten Angehörigen", en: "Care for my severely disabled grandmother" },
      date: { de: "01.2014 – 07.2024", en: "Jan 2014 – Jul 2024" },
      desc: {
        de: "10 Jahre verantwortungsvolle Betreuung und Organisation — Resilienz, Zuverlässigkeit und lösungsorientiertes Handeln unter hoher Belastung.",
        en: "Long-term, responsible caregiving — reliability, organisation & resilience under sustained pressure.",
      },
    },
    {
      title: { de: "Autosattler", en: "Auto Upholsterer" },
      date: { de: "05.2013 – 09.2014", en: "May 2013 – Sep 2014" },
      org: { de: "Autoleder Toczek, Meckelfeld", en: "" },
      desc: {
        de: "Präziser Zuschnitt und Montage von Lederinterieur — Qualitätskontrolle, termingerechte Fertigung und handwerkliche Genauigkeit.",
        en: "Cutting & processing of leather parts, interior assembly — precision & craftsmanship under tight deadlines.",
      },
    },
    {
      title: { de: "Lagerarbeiter", en: "Warehouse Worker" },
      date: { de: "02.2012 – 05.2013", en: "Feb 2012 – May 2013" },
      org: { de: "Kühne + Nagel, Hamburg", en: "" },
      desc: {
        de: "Wareneingang/-ausgang, Kommissionierung, Staplereinsatz (Schubmast/Frontstapler).",
        en: "Goods in/out, order picking, forklift operation (reach & counterbalance trucks).",
      },
    },
    {
      title: { de: "Produktionshelfer", en: "Production Assistant" },
      date: { de: "01.2010 – 03.2011", en: "Jan 2010 – Mar 2011" },
      org: { de: "HQ Patronen, Meckelfeld", en: "" },
    },
    {
      title: { de: "Ausbildung Zweiradmechaniker", en: "Apprenticeship as Two-Wheel Mechanic" },
      date: { de: "08.2005 – 01.2009", en: "Aug 2005 – Jan 2009" },
      org: { de: "Motors Vick GbR, Winsen", en: "" },
      desc: {
        de: "Spezialfahrzeugbau, Harley-Davidson-Umbauten, Reparatur und Wartung.",
        en: "Special vehicle construction, customising Harley-Davidson motorcycles, repair & maintenance.",
      },
    },
  ],
}
