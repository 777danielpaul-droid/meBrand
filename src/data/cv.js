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
  // Icon-Pfade: echte Marken-Icons (Simple Icons), farblich angepasst
  skills: [
    { name: { de: "HTML / CSS / JavaScript", en: "HTML / CSS / JavaScript" }, level: 90, color: "#22d3ee", icon: "M12 2L3 6v12c0 4 5 8 9 8s9-4 9-8V6l-9-4z" },
    { name: { de: "React / Tailwind / Vite", en: "React / Tailwind / Vite" }, level: 80, color: "#7c3aed", icon: "M12 2L3 6v12c0 4 5 8 9 8s9-4 9-8V6l-9-4z" },
    { name: { de: "Python", en: "Python" }, level: 80, color: "#22d3ee", icon: "M9.95 1.34A7.5 7.5 0 0 1 17 8.42a6.5 6.5 0 0 1-4.27 6.09c.76.23 1.52.39 2.29.39a6.5 6.5 0 0 1 5.65-3.28c.02-.41.03-.83.03-1.25a8.5 8.5 0 0 0-5-7.82C14.85 3.76 14.5 3.75 14.5 3.25a5.5 5.5 0 0 0-5.5-5.5c-.95-.02-1.88.17-2.77.49a5.5 5.5 0 0 0-2.87 1.93.03.03 0 0 0 .04.04z" },
    { name: { de: "Git / GitHub / CI/CD", en: "Git / GitHub / CI/CD" }, level: 85, color: "#6d28d9", icon: "M12 .296c-6.306 0-11.376 5.07-11.818 11.35A8.438 8.438 0 0 0 6.5 20.418c.553.093.762-.24 0-.806A8.418 8.418 0 0 1 4.5 14.47c-.553.093-.762-.24-1.003-.677A9 9 0 0 1 0 12.68c-.007-5.104 4.137-9.34 9.25-9.34 2.444.012 4.785.964 6.583 2.573A5.5 5.5 0 0 1 17.5 5.5c0-.247.01-2.254.01-4.658 0-.296.082-.637.29-2a.19.19 0 0 0-.03.016c-2.693 1.144-4.65 3.687-5.372 6.79-.02.068-.03.134-.03.2z" },
    { name: { de: "KI Prototyping / Spec-driven Development", en: "AI Prototyping / Spec-driven Development" }, level: 85, color: "#6d28d9", icon: "M12 2L3 6v12c0 4 5 8 9 8s9-4 9-8V6l-9-4z" },
  ],

  softSkills: [
    { name: { de: "Deutsch — Muttersprache", en: "German — native" }, level: 100, color: "#6d28d9", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
    { name: { de: "Englisch — gute Kenntnisse", en: "English — good command" }, level: 80, color: "#22d3ee", icon: "M12 3c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4s-4-1.8-4-4V7c0-2.2 1.8-4 4-4zm0 14c3.3 0 6-2.7 6-6h-2c0 2.2-1.8 4-4 4s-4-1.8-4-4H6c0 3.3 2.7 6 6 6z" },
  ],

  tools: [
    { name: "VS Code", icon: "M6 2h12v2H6zm0 20h12v2H6zm8-22l2 4H8l2-4zm-8 8h12v12H6z" },
    { name: "GitHub", icon: "M12 .296c-6.306 0-11.376 5.07-11.818 11.35A8.438 8.438 0 0 0 6.5 20.418c.553.093.762-.24 0-.806A8.418 8.418 0 0 1 4.5 14.47c-.553.093-.762-.24-1.003-.677A9 9 0 0 1 0 12.68c-.007-5.104 4.137-9.34 9.25-9.34 2.444.012 4.785.964 6.583 2.573A5.5 5.5 0 0 1 17.5 5.5c0-.247.01-2.254.01-4.658 0-.296.082-.637.29-2a.19.19 0 0 0-.03.016c-2.693 1.144-4.65 3.687-5.372 6.79-.02.068-.03.134-.03.2z" },
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
