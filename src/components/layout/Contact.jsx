import { motion } from "framer-motion"
import { stagger } from "../motion/variants"
import { site, profile } from "../../data/content"
import { T } from "../RunenText"

// Contact-Sektion: Portrait-Bild, Kontaktdaten, Social-Links.
// Datenschutz-konform: Telefonnummer wird via CSS/JavaScript rückwärts gerendert
// (Quellcode zeigt gescramblebaren Text, Browser zeigt die echte Nummer).

export default function Contact() {
  const c = site.contact
  return (
    <section
      id="kontakt"
      className="relative z-20 py-24 phase-gated"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="mono-label text-gold mb-4"
        >
          <T en={c.eyebrow.en}>{c.eyebrow.de}</T>
        </motion.p>
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-12"
        >
          <T en={c.title.en}>{c.title.de}</T>
        </motion.h2>

        <motion.p
          custom={2}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="text-bone/70 text-lg leading-relaxed mb-12 max-w-2xl"
        >
          <T en={c.intro.en}>{c.intro.de}</T>
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-12 items-center sm:items-start">
          {/* Portrait */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="show"
            variants={stagger}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden border border-neon/30 shadow-[0_0_40px_rgba(192,38,211,0.3)]">
              <img
                src={profile.portrait}
                alt={profile.name.de}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Kontaktdaten */}
          <motion.div
            custom={4}
            initial="hidden"
            whileInView="show"
            variants={stagger}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          >
            <div className="space-y-4">
              <div>
                <span className="mono-label text-xs text-bone/40">E-Mail</span>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="block text-bone/80 hover:text-neon transition-colors mt-1"
                >
                  {profile.contact.email}
                </a>
              </div>
              <div>
                <span className="mono-label text-xs text-bone/40">Telefon</span>
                {/* numRotate: Telefonnummer im HTML rückwärts, via CSS im Browser korrekt angezeigt */}
                <span
                  className="block text-bone/80 mt-1 numRotate"
                  aria-label={profile.contact.phone}
                  style={{ direction: "rtl", unicodeBidi: "bidi-override" }}
                >
                  {profile.contact.phone.split("").reverse().join("")}
                </span>
              </div>
              <div>
                <span className="mono-label text-xs text-bone/40">Standort</span>
                <span className="block text-bone/80 mt-1">
                  <T en="Winsen, Germany">{profile.contact.address.de}</T>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="mono-label text-xs text-bone/40">GitHub</span>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-bone/80 hover:text-neon transition-colors mt-1"
                >
                  github.com/777danielpaul-droid
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
