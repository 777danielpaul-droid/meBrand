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
  skills: [
    { name: { de: "HTML / CSS / JavaScript", en: "HTML / CSS / JavaScript" }, level: 90, color: "#c026d3" },
    { name: { de: "React / Tailwind / Vite", en: "React / Tailwind / Vite" }, level: 80, color: "#7c3aed" },
    { name: { de: "Python", en: "Python" }, level: 75, color: "#22d3ee" },
    { name: { de: "Git / GitHub / CI/CD", en: "Git / GitHub / CI/CD" }, level: 85, color: "#f5c542" },
    { name: { de: "KI-Grundlagen / Prototyping", en: "AI Fundamentals / Prototyping" }, level: 70, color: "#c026d3" },
  ],

  softSkills: [
    { name: { de: "Deutsch — Muttersprache", en: "German — native" }, level: 100, color: "#f5c542" },
    { name: { de: "Englisch — gute Kenntnisse", en: "English — good command" }, level: 80, color: "#c026d3" },
  ],

  tools: ["VS Code", "GitHub", "Vite", "Shopify", "Figma"],

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
