// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
export const site = {
  brand: { de: "text", en: "text" },
  tagline: { de: "text", en: "text" },
  nav: [
    { label: { de: "text", en: "text" }, href: "#fraktionen" },
    { label: { de: "text", en: "text" }, href: "#doktrin" },
    { label: { de: "text", en: "text" }, href: "#konflikt" },
    { label: { de: "text", en: "text" }, href: "#schlacht" },
    { label: { de: "text", en: "text" }, href: "#kriegskonsole" },
    { label: { de: "text", en: "text" }, href: "#archive" },
  ],

  hero: {
    eyebrow: { de: "text", en: "text" },
    title: {
      de: "text\ntext",
      en: "text\ntext",
    },
    lead: {
      de: "text",
      en: "text",
    },
    primaryCta: { label: { de: "text", en: "text" }, href: "#doktrin" },
    secondaryCta: { label: { de: "text", en: "text" }, href: "#konflikt" },
    milchmaeuseBase: 17171,
    stats: [
      { value: { de: "text", en: "text" }, label: { de: "text", en: "text" } },
      { value: { de: "text", en: "text" }, label: { de: "text", en: "text" } },
      { value: { de: "text", en: "text" }, label: { de: "text", en: "text" } },
      { value: { de: "text", en: "text" }, label: { de: "text", en: "text" } },
    ],
  },

  factions: [
    {
      id: "erdbaeren",
      name: { de: "text", en: "text" },
      role: { de: "text", en: "text" },
      image: "/erdbaer-bear.jpg",
      accent: "neon",
      quote: {
        de: "text",
        en: "text",
      },
      traits: [
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
      ],
    },
    {
      id: "milchmaeuse",
      name: { de: "text", en: "text" },
      role: { de: "text", en: "text" },
      image: "/erdbaer-mouse.jpg",
      accent: "cyan",
      quote: {
        de: "text",
        en: "text",
      },
      traits: [
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
        { de: "text", en: "text" },
      ],
    },
  ],

  doctrine: {
    eyebrow: { de: "text", en: "text" },
    title: {
      de: "text\ntext",
      en: "text\ntext",
    },
    body: {
      de: "text",
      en: "text",
    },
    points: [
      {
        k: "01",
        t: { de: "text", en: "text" },
        d: {
          de: "text",
          en: "text",
        },
      },
      {
        k: "02",
        t: { de: "text", en: "text" },
        d: {
          de: "text",
          en: "text",
        },
      },
      {
        k: "03",
        t: { de: "text", en: "text" },
        d: {
          de: "text",
          en: "text",
        },
      },
    ],
  },

  battle: "/erdbaer-battle.jpg",
  battleMeta: {
    eyebrow: { de: "text", en: "text" },
    titleCover: { de: "text", en: "text" },
    coverBody: {
      de: "text",
      en: "text",
    },
    caption: {
      de: "text",
      en: "text",
    },
  },
  secret: {
    eyebrow: { de: "text", en: "text" },
    titleCover: { de: "text", en: "text" },
    coverBody: {
      de: "text",
      en: "text",
    },
    name: { de: "text", en: "text" },
    subtitle: {
      de: "text",
      en: "text",
    },
    body: {
      de: "text",
      en: "text",
    },
  },
  conflict: {
    eyebrow: { de: "text", en: "text" },
    title: { de: "text", en: "text" },
    body: {
      de: "text",
      en: "text",
    },
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

  archive: {
    eyebrow: { de: "text", en: "text" },
    title: { de: "text", en: "text" },
    entries: [
      {
        code: "text-1",
        title: { de: "text", en: "text" },
        text: {
          de: "text",
          en: "text",
        },
      },
      {
        code: "text-2",
        title: { de: "text", en: "text" },
        text: {
          de: "text",
          en: "text",
        },
      },
      {
        code: "text-3",
        title: { de: "text", en: "text" },
        text: {
          de: "text",
          en: "text",
        },
      },
      {
        code: "text-4",
        title: { de: "text", en: "text" },
        text: {
          de: "text",
          en: "text",
        },
      },
    ],
    // Abgefangene Milchmaus-Funkspruecze (Runen-Schrift). 'cipher' wird in Glyphen
    // gerendert (nur a-z zaehlt), 'plain' ist die entschluesselte Klartext-Uebersetzung.
    intercepts: {
      eyebrow: { de: "text", en: "text" },
      title: { de: "text", en: "text" },
      hint: {
        de: "text",
        en: "text",
      },
      messages: [
        {
          code: "text-1",
          cipher: "text",
          plain: { de: "text", en: "text" },
        },
        {
          code: "text-2",
          cipher: "text",
          plain: { de: "text", en: "text" },
        },
        {
          code: "text-3",
          cipher: "text",
          plain: { de: "text", en: "text" },
        },
        {
          code: "text-4",
          cipher: "text",
          plain: { de: "text", en: "text" },
        },
      ],
    },
  },

  footer: {
    note: {
      de: "text",
      en: "text",
    },
    links: [
      { label: { de: "text", en: "text" }, href: "./impressum.html" },
      { label: { de: "text", en: "text" }, href: "./agb.html" },
      { label: { de: "text", en: "text" }, href: "./datenschutz.html" },
      { label: { de: "text", en: "text" }, href: "#top" },
    ],
  },

  // --- RECHTLICHES (privat / non-kommerziell) --- (nur DE, unübersetzt belassen)
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
      "text",
      "text",
      "text",
    ],
    agb: [
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
    ],
    privacy: [
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
      { h: "text", t: "text" },
    ],
  },
};
