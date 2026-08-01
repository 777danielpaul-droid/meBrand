// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
// Alle Werte sind bewusst auf "text" neutralisiert — bitte hier mit echten Inhalten ersetzen.
export const site = {
  brand: { de: "text", en: "text" },
  tagline: { de: "text", en: "text" },
  nav: [
    { label: { de: "text", en: "text" }, href: "#top" },
    { label: { de: "text", en: "text" }, href: "#terminal" },
    { label: { de: "text", en: "text" }, href: "#fraktionen" },
    { label: { de: "text", en: "text" }, href: "#konflikt" },
    { label: { de: "text", en: "text" }, href: "#kriegskonsole" },
  ],

  hero: {
    eyebrow: { de: "text", en: "text" },
    title: {
      de: "text\ntext",
      en: "text\ntext",
    },
    lead: { de: "text", en: "text" },
    primaryCta: { label: { de: "text", en: "text" }, href: "#terminal" },
    secondaryCta: { label: { de: "text", en: "text" }, href: "#fraktionen" },
  },

  factions: [
    {
      id: "erdbaeren",
      accent: "neon",
      name: { de: "text", en: "text" },
      role: { de: "text", en: "text" },
      quote: { de: "text", en: "text" },
      traits: [
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
      ],
      image: "/erdbaer-bear.jpg",
    },
    {
      id: "milchmaeuse",
      accent: "cyan",
      name: { de: "text", en: "text" },
      role: { de: "text", en: "text" },
      quote: { de: "text", en: "text" },
      traits: [
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
      ],
      image: "/milchmaus-mouse.jpg",
    },
  ],

  conflict: {
    eyebrow: { de: "text", en: "text" },
    title: { de: "text", en: "text" },
    body: { de: "text", en: "text" },
    aspects: [
      {
        side: { de: "text", en: "text" },
        items: [
          { de: "text", en: "text" },
          { de: "text", en: "text" },
          { de: "text", en: "text" },
        ],
      },
      {
        side: { de: "text", en: "text" },
        items: [
          { de: "text", en: "text" },
          { de: "text", en: "text" },
          { de: "text", en: "text" },
        ],
      },
    ],
  },

  secret: {
    name: { de: "text", en: "text" },
    subtitle: { de: "text", en: "text" },
    body: { de: "text", en: "text" },
    titleCover: { de: "text", en: "text" },
    coverBody: { de: "text", en: "text" },
  },

  battleMeta: {
    eyebrow: { de: "text", en: "text" },
    caption: { de: "text", en: "text" },
    titleCover: { de: "text", en: "text" },
    coverBody: { de: "text", en: "text" },
  },
  battle: "/erdbaer-battle.jpg",

  archive: {
    eyebrow: { de: "text", en: "text" },
    title: { de: "text", en: "text" },
    entries: [
      { code: "text", title: { de: "text", en: "text" }, text: { de: "text", en: "text" } },
      { code: "text", title: { de: "text", en: "text" }, text: { de: "text", en: "text" } },
      { code: "text", title: { de: "text", en: "text" }, text: { de: "text", en: "text" } },
      { code: "text", title: { de: "text", en: "text" }, text: { de: "text", en: "text" } },
    ],
    intercepts: {
      eyebrow: { de: "text", en: "text" },
      title: { de: "text", en: "text" },
      hint: { de: "text", en: "text" },
      messages: [
        { code: "text", cipher: "text", plain: { de: "text", en: "text" } },
        { code: "text", cipher: "text", plain: { de: "text", en: "text" } },
        { code: "text", cipher: "text", plain: { de: "text", en: "text" } },
        { code: "text", cipher: "text", plain: { de: "text", en: "text" } },
      ],
    },
  },

  footer: {
    note: { de: "text", en: "text" },
    links: [
      { label: { de: "text", en: "text" }, href: "#impressum" },
      { label: { de: "text", en: "text" }, href: "#privacy" },
      { label: { de: "text", en: "text" }, href: "#terminal" },
    ],
  },

  // --- RECHTLICHES (privat / non-kommerziell) ---
  legal: {
    provider: {
      name: "text",
      street: "text",
      city: "text",
      email: "text",
    },
    impressum: [
      "text",
      "text",
      "text",
    ],
    agb: [
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
    ],
    privacy: [
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
    ],
  },
}
