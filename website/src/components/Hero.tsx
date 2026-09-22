"use client";

import { motion, useScroll, useTransform } from "framer-motion";

const title = "La Truffe Noire";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative flex min-h-[100svh] items-end pb-24 md:items-center md:pb-0">
      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-xs uppercase text-gold"
        >
          Bruxelles · Depuis 1988
        </motion.p>
        <h1 className="font-display text-6xl font-light leading-[0.95] sm:text-7xl md:max-w-2xl md:text-8xl lg:text-9xl">
          {title.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
              <motion.span
                className={`inline-block ${wi === 2 ? "italic text-gold" : ""}`}
                initial={{ y: "110%", rotateX: -60 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.3 + wi * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 max-w-md text-base leading-relaxed text-muted md:text-lg"
        >
          Restaurant gastronomique dédié à la truffe noire et blanche. Une cuisine classique, parsemée de touches
          de modernité.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <a
            href="#reservation"
            className="bg-cream px-8 py-4 text-[11px] font-medium uppercase tracking-[0.25em] text-ink transition-colors duration-300 hover:bg-gold"
          >
            Réserver une table
          </a>
          <a
            href="#carte"
            className="px-2 py-4 text-[11px] uppercase tracking-[0.25em] text-muted transition-colors duration-300 hover:text-cream"
          >
            La carte →
          </a>
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted md:flex"
      >
        Défiler
        <motion.span
          className="block h-12 w-px bg-gradient-to-b from-gold to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
