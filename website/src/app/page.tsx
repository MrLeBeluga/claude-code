import SceneLoader from "@/components/SceneLoader";
import Hero from "@/components/Hero";
import { Reveal, TiltCard } from "@/components/motion";
import { boutique, boutiqueCategories, carte, contact, menus } from "@/lib/content";

const nav = [
  { href: "#maison", label: "La Maison" },
  { href: "#carte", label: "Carte" },
  { href: "#menus", label: "Menus" },
  { href: "#boutique", label: "Boutique" },
  { href: "#evenements", label: "Événements" },
  { href: "#reservation", label: "Contact" },
];

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p className={`mb-6 flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-gold ${center ? "justify-center" : ""}`}>
      <span className="h-px w-10 bg-gold/60" />
      {children}
      {center && <span className="h-px w-10 bg-gold/60" />}
    </p>
  );
}

export default function Home() {
  return (
    <div className="grain relative">
      <SceneLoader />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#" className="font-display text-2xl tracking-wide">
            La Truffe <span className="italic text-gold">Noire</span>
          </a>
          <ul className="hidden gap-8 text-xs uppercase tracking-[0.25em] text-muted lg:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors duration-300 hover:text-gold">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reservation"
            className="rounded-full border border-gold/50 px-5 py-2 text-xs uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
          >
            Réserver
          </a>
        </nav>
      </header>

      <main className="relative z-10">
        <Hero />

        <section id="maison" className="relative py-32 md:py-48">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:px-12">
            <div className="hidden md:block" />
            <div>
              <Reveal>
                <Eyebrow>La Maison</Eyebrow>
                <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
                  La truffe, <span className="italic text-gold">depuis 1988</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-8 text-lg leading-relaxed text-muted">
                  Fondée en 1988, La Truffe Noire consacre sa cuisine au plus précieux des diamants de la terre : la
                  truffe, noire comme blanche. Une cuisine classique, parsemée de touches de modernité, guidée par une
                  même recherche d&apos;excellence.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-8">
                  {[
                    ["1988", "Fondation"],
                    ["Noire & Blanche", "Truffes"],
                    ["Bruxelles", "La Cambre"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <dt className="font-display text-2xl text-cream md:text-3xl">{v}</dt>
                      <dd className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted">{l}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="carte" className="relative bg-gradient-to-b from-transparent via-ink/85 to-ink/85 py-32">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal className="text-center">
              <Eyebrow center>Extraits de la carte</Eyebrow>
              <h2 className="font-display text-5xl font-light md:text-6xl">
                La <span className="italic text-gold">Carte</span>
              </h2>
            </Reveal>
            <div className="mt-20 grid gap-16 md:grid-cols-2">
              {carte.map((group, gi) => (
                <Reveal key={group.section} delay={gi * 0.15}>
                  <h3 className="mb-8 border-b border-line pb-4 text-xs uppercase tracking-[0.35em] text-gold">
                    {group.section}
                  </h3>
                  <ul className="space-y-8">
                    {group.items.map((item) => (
                      <li key={item.name} className="group">
                        <div className="flex items-baseline gap-4">
                          <span className="font-display text-2xl transition-colors duration-300 group-hover:text-gold">
                            {item.name}
                          </span>
                          <span className="mb-1 flex-1 border-b border-dotted border-line" />
                          <span className="font-display text-2xl text-gold">{item.price} €</span>
                        </div>
                        {item.detail && <p className="mt-1 text-sm italic text-muted">{item.detail}</p>}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="menus" className="relative bg-ink/85 py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Reveal>
              <Eyebrow>Menus & formules</Eyebrow>
              <h2 className="max-w-2xl font-display text-5xl font-light leading-tight md:text-6xl">
                Des menus pour <span className="italic text-gold">chaque moment</span>.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {menus.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.06}>
                  <TiltCard className="rounded-2xl border border-line bg-char/80 p-8">
                    <div style={{ transform: "translateZ(40px)" }}>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-muted">{m.note}</p>
                      <p className="mt-6 font-display text-3xl">{m.name}</p>
                      <span className="mt-8 block h-px w-8 bg-gold" />
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
              <Reveal delay={menus.length * 0.06}>
                <a
                  href="#reservation"
                  className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-gold/40 p-8 text-center text-xs uppercase tracking-[0.3em] text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
                >
                  Détails & réservation
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="boutique" className="relative bg-ink/85 py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <Reveal>
                <Eyebrow>E-Boutique</Eyebrow>
                <h2 className="max-w-xl font-display text-5xl font-light leading-tight md:text-6xl">
                  La truffe, <span className="italic text-gold">chez vous</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <ul className="flex flex-wrap gap-3">
                  {boutiqueCategories.map((c) => (
                    <li key={c} className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {boutique.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.1}>
                  <TiltCard className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-char to-ink">
                    <div className="relative flex aspect-square items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
                      <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(200,169,106,0.22),transparent_65%)]" />
                      <span
                        className="gold-text font-display text-[9rem] italic leading-none"
                        style={{ transform: "translateZ(70px)" }}
                      >
                        {p.glyph}
                      </span>
                    </div>
                    <div className="border-t border-line p-8" style={{ transform: "translateZ(30px)" }}>
                      <p className="font-display text-2xl">{p.name}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-muted">{p.size}</span>
                        <span className="font-display text-2xl text-gold">{p.price} €</span>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-teal/40 bg-teal/10 p-8 md:flex-row md:items-center md:p-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-teal">Take-away</p>
                  <p className="mt-3 font-display text-3xl">{contact.takeAwayHours}</p>
                </div>
                <a
                  href={contact.phoneHref}
                  className="rounded-full border border-cream/30 px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  Commander · {contact.phone}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="evenements" className="relative bg-ink/85 py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:px-12">
            <Reveal>
              <Eyebrow>Événements professionnels</Eyebrow>
              <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
                Recevoir avec <span className="italic text-gold">distinction</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-lg leading-relaxed text-muted">
                Déjeuners d&apos;affaires et événements professionnels : le menu Corporate et la formule Business Lunch
                sont pensés pour vos rendez-vous et vos invités.
              </p>
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent("Événement professionnel")}`}
                className="mt-10 inline-block rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-gold-soft"
              >
                Nous contacter
              </a>
            </Reveal>
          </div>
        </section>

        <section id="reservation" className="relative bg-ink py-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Reveal className="text-center">
              <Eyebrow center>Réservation</Eyebrow>
              <h2 className="font-display text-5xl font-light md:text-7xl">
                Votre table <span className="italic text-gold">vous attend</span>.
              </h2>
            </Reveal>
            <div className="mt-20 grid gap-6 md:grid-cols-3">
              {[
                { label: "Téléphone", value: contact.phone, href: contact.phoneHref },
                { label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
                { label: "Adresse", value: `${contact.address}, ${contact.city}`, href: contact.mapsHref },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 0.1}>
                  <TiltCard className="rounded-2xl border border-line bg-char">
                    <a
                      href={c.href}
                      target={c.label === "Adresse" ? "_blank" : undefined}
                      rel={c.label === "Adresse" ? "noopener noreferrer" : undefined}
                      className="block p-10"
                    >
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{c.label}</p>
                      <p className="mt-4 break-words font-display text-2xl">{c.value}</p>
                    </a>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 text-xs uppercase tracking-[0.25em] text-muted md:flex-row md:px-12">
          <p className="font-display text-xl normal-case tracking-wide text-cream">
            La Truffe <span className="italic text-gold">Noire</span>
          </p>
          <p>
            {contact.address} · {contact.city}
          </p>
          <p>© {new Date().getFullYear()} La Truffe Noire</p>
        </div>
      </footer>
    </div>
  );
}
