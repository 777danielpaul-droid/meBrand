// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
export const site = {
  brand: { de: "ErdBären", en: "Earth Bears" },
  tagline: { de: "Wo die alten Wälder flüstern.", en: "Where the ancient forests whisper." },
  nav: [
    { label: { de: "Start", en: "Home" }, href: "#top" },
    { label: { de: "Terminal", en: "Terminal" }, href: "#terminal" },
    { label: { de: "Fraktionen", en: "Factions" }, href: "#fraktionen" },
    { label: { de: "Konflikt", en: "Conflict" }, href: "#konflikt" },
    { label: { de: "Kriegskonsole", en: "War Room" }, href: "#kriegskonsole" },
  ],

  hero: {
    eyebrow: { de: "// Überwacht Erdung //", en: "// Monitoring Terra //" },
    title: {
      de: "Zwei Mächte.\nEine Erde.",
      en: "Two powers.\nOne Earth.",
    },
    lead: { de: "Die Bären wachen. Die Mäuse laufen. Unter der Erde bewahren sie das Geheimnis der Wurzeln.", en: "The bears awaken. The mice scurry. Beneath the earth they guard the secret of the roots." },
    primaryCta: { label: { de: "Zum Terminal", en: "To Terminal" }, href: "#terminal" },
    secondaryCta: { label: { de: "Tauchen ein", en: "Dive in" }, href: "#fraktionen" },
  },

  factions: [
    {
      id: "erdbaeren",
      accent: "neon",
      name: { de: "Erdbären", en: "Earth Bears" },
      role: { de: "Bodenwache", en: "Soil Guardians" },
      quote: { de: "Was wächst, das bewahren wir.", en: "What grows, we preserve." },
      traits: [
        { de: "Wurzelverbunden", en: "Rootbound" },
        { de: "Stille Kraft", en: "Silent Strength" },
        { de: "Erdverbunden", en: "Earthbound" },
        { de: "Langsam aber sicher", en: "Slow but Steady" },
      ],
      image: "/erdbaer-bear.jpg",
    },
    {
      id: "milchmaeuse",
      accent: "cyan",
      name: { de: "Milchmäuse", en: "Milk Mice" },
      role: { de: "Speisekurve", en: "Supply Curve" },
      quote: { de: "Schnell durch, aber nie still.", en: "Swift through, never still." },
      traits: [
        { de: "Neon-Geschwindigkeit", en: "Neon Speed" },
        { de: "Schattenschritt", en: "Shadow Step" },
        { de: "Datensturm", en: "Data Storm" },
        { de: "Null Wartezeit", en: "Zero Wait" },
      ],
      image: "/milchmaus-mouse.jpg",
    },
  ],

  conflict: {
    eyebrow: { de: "Der Kampf um die Wurzeln", en: "The Battle for the Roots" },
    title: { de: "Unter der Erde", en: "Below the Earth" },
    body: { de: "Die Milchmäuse haben die oberflächlichen Ressourcen ausgebeutet. Die Erdbären bewachen die tiefen Wurzeln, die wahre Macht der Erde. Der Konflikt eskalierte in die Dunkelheit unter unseren Füßen.", en: "The Milk Mice have exhausted the surface resources. The Earth Bears guard the deep roots, the true power of the earth. The conflict has escalated into the darkness beneath our feet." },
    aspects: [
      {
        side: { de: "MILCHMÄUSE", en: "MILK MICE" },
        items: [
          { de: "Schnelle Infiltration der oberflächlichen Schichten", en: "Rapid infiltration of surface layers" },
          { de: "Neon-Markierungen für Navigationsrouten", en: "Neon markers for navigation routes" },
          { de: "Abfuhr der Ressourcen für den Oberflächenhandel", en: "Diversion of resources for surface trade" },
        ],
      },
      {
        side: { de: "ERDBÄREN", en: "EARTH BEARS" },
        items: [
          { de: "Langsame, aber unerschütterliche Wurzelverteidigung", en: "Slow but unshakable root defense" },
          { de: "Schlafende Vitalität in den Tiefen", en: "Slumbering vitality in the depths" },
          { de: "Ritual der alten Bäume", en: "Ritual of the ancient trees" },
        ],
      },
    ],
  },

  secret: {
    name: { de: "Milch-Wurzel-Protokoll", en: "Milk-Root Protocol" },
    subtitle: { de: "Das Herz der Konfrontation", en: "The Heart of Confrontation" },
    body: { de: "In den Tiefen unter der Erde liegt das Geheimnis: ein Herz aus Kristall, das die Milch der Milchmäuse mit der Wurzel des Erdrauschs verbindet. Beide Fraktionen wissen, dass der, wer das Herz kontrolliert, die Zukunft der Erde bestimmt.", en: "In the depths below the earth lies the secret: a heart of crystal that binds the milk of the Milk Mice with the root of the Earth's force. Both factions know that whoever controls the heart determines the future of the earth." },
    titleCover: { de: "Die Geheimwaffe", en: "The Secret Weapon" },
    coverBody: { de: "Was die Bären und Mäuse trennt, ist nicht die Oberfläche — sondern das, was darunter liegt. Ein uralter Kern, der nur in der Tiefe erwacht.", en: "What separates the bears and mice is not the surface — but what lies beneath. An ancient core that only awakens in the depths." },
  },

  battleMeta: {
    eyebrow: { de: "// Schlachtsequenz //", en: "// Battle Sequence //" },
    caption: { de: "Die Milchmäuse rücken vor, die Erdbären stellen sich. Unter der Erde bricht die Schlacht aus.", en: "The Milk Mice advance, the Earth Bears stand firm. Beneath the earth, the battle erupts." },
    titleCover: { de: "Schlacht", en: "Battle" },
    coverBody: { de: "Die Fronten sind klar. Die Waffen sind bereit. Die Erde bebt unter dem Gewicht der Konfrontation.", en: "The front lines are clear. Weapons are ready. The earth trembles under the weight of confrontation." },
  },
  battle: "/erdbaer-battle.jpg",

  archive: {
    eyebrow: { de: "// Archiv //", en: "// Archive //" },
    title: { de: "Kriegstagebuch", en: "War Journal" },
    entries: [
      { code: "EB-01", title: { de: "Erster Kontakt", en: "First Contact" }, text: { de: "Die Bären entdecken die Mausspuren in den Wurzeln.", en: "Bears discover mouse tracks in the roots." } },
      { code: "MM-02", title: { de: "Neon-Aktivität", en: "Neon Activity" }, text: { de: "Die Mäuse haben das Licht in die Tiefe gebracht.", en: "Mice have brought light into the depths." } },
      { code: "EB-03", title: { de: "Wurzel-Blockade", en: "Root Blockade" }, text: { de: "Die alten Bäume schließen die Pässe.", en: "Ancient trees seal the passes." } },
      { code: "MM-04", title: { de: "Dateninjektion", en: "Data Injection" }, text: { de: "Sie durchdringen die Wurzelnetze.", en: "They penetrate the root networks." } },
    ],
    intercepts: {
      eyebrow: { de: "Abfangprotokolle", en: "Intercepted Protocols" },
      title: { de: "Verschlüsselte Botschaften", en: "Encrypted Messages" },
      hint: { de: "Klicke auf einen Eintrag, um die Verschlüsselung zu lösen.", en: "Click an entry to decrypt." },
      messages: [
        { code: "X-1", cipher: "𐌰ᛗbrᛗᛗᛗ𐌰", plain: { de: "Die Wurzel ist das Zentrum.", en: "The root is the center." } },
        { code: "X-2", cipher: "𐍃𐌷ᛗ𐌹𐍄", plain: { de: "Neon führt sie blind.", en: "Neon leads them blind." } },
        { code: "X-3", cipher: "ᛗᛗ𐌰𐌷𐌹𐍃", plain: { de: "Bären schlafen tief.", en: "Bears sleep deeply." } },
        { code: "X-4", cipher: "𐍃𐌷𐌰𐌹𐍄", plain: { de: "Schnittstelle aktiv.", en: "Interface active." } },
      ],
    },
  },

  footer: {
    note: { de: "© 2026 ErdBären. Alle Wurzeln vorbehalten.", en: "© 2026 Earth Bears. All roots reserved." },
    links: [
      { label: { de: "Impressum", en: "Legal" }, href: "#impressum" },
      { label: { de: "Datenschutz", en: "Privacy" }, href: "#privacy" },
      { label: { de: "Kontakt", en: "Contact" }, href: "#terminal" },
    ],
  },

  // --- RECHTLICHES (privat / non-kommerziell) ---
  legal: {
    provider: {
      name: "Daniel Paul",
      street: "Musterstraße 1",
      city: "Winsen (Luhe)",
      email: "kontakt@erdbaeren.dev",
    },
    impressum: [
      "Angaben gemäß § 55 Abs. 2 RStV",
      "Name: Daniel Paul",
      "Adresse: Musterstraße 1, 21465 Winsen (Luhe)",
      "E-Mail: kontakt@erdbaeren.dev",
      "Dies ist ein privates, nicht-kommerzielles Projekt.",
    ],
    agb: [
      { h: "§ 1 Geltung", t: "Diese Seite bietet rein nicht-kommerzielle Inhalte zur spielerischen Erzählung." },
      { h: "§ 2 Urheberrecht", t: "Alle Inhalte stehen unter eigenen Lizzenzen, sofern nicht anders gekennzeichnet." },
      { h: "§ 3 Haftung", t: "Für die Richtigkeit der Inhalte wird keine Gewähr übernommen." },
      { h: "§ 4 Externe Links", t: "Verlinkte Inhalte fremder Anbieter sind nicht Bestandteil dieses Angebots." },
      { h: "§ 5 Änderungen", t: "Wir behalten uns das Recht vor, Inhalte zu ändern." },
    ],
    privacy: [
      { h: "Datenverarbeitung", t: "Es werden keine personenbezogenen Daten erhoben oder verarbeitet." },
      { h: "Cookies", t: "Es werden keine Tracking-Cookies gesetzt." },
      { h: "Speicherung", t: "Keine Daten werden dauerhaft gespeichert." },
      { h: "Analyse-Dienste", t: "Es kommen keine Analyse-Dienste zum Einsatz." },
      { h: "Soziale Medien", t: "Es gibt keine Social-Media-Plugins." },
      { h: "Kontakt", t: "Bei Fragen nutzen Sie die angegebene E-Mail-Adresse." },
    ],
  },
}
