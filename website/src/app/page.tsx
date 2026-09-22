import Image from "next/image";
import SceneLoader from "@/components/SceneLoader";
import Hero from "@/components/Hero";
import { ParallaxImage, Reveal, TiltCard } from "@/components/motion";
import { boutique, boutiqueCategories, carte, contact, menus } from "@/lib/content";

const nav = [
  { href: "#maison", label: "La Maison" },
  { href: "#carte", label: "Carte" },
  { href: "#menus", label: "Menus" },
  { href: "#boutique", label: "Boutique" },
  { href: "#evenements", label: "Événements" },
  { href: "#reservation", label: "Contact" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-gold">{children}</p>;
}

export default function Home() {
  return (
    <div className="relative">
      <SceneLoader />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <a href="#" className="font-display text-2xl tracking-wide">
            La Truffe <span className="italic">Noire</span>
          </a>
          <ul className="hidden gap-8 text-[11px] uppercase tracking-[0.25em] text-muted lg:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors duration-300 hover:text-cream">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#reservation"
            className="border-b border-gold/60 pb-1 text-[11px] uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:border-cream hover:text-cream"
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
                  La truffe, <span className="italic">depuis 1988</span>.
                </h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
                  Fondée en 1988, La Truffe Noire consacre sa cuisine au plus précieux des diamants de la terre : la
                  truffe, noire comme blanche. Une cuisine classique, parsemée de touches de modernité, guidée par une
                  même recherche d&apos;excellence.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-8">
                  {[
                    ["1988", "Fondation"],
                    ["Noire & Blanche", "Truffes"],
                    ["Bruxelles", "La Cambre"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <dt className="font-display text-2xl md:text-3xl">{v}</dt>
                      <dd className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted">{l}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        <section aria-label="Truffe noire tranchée" className="relative bg-ink">
          <ParallaxImage
            src="/images/truffe-coupe.jpg"
            alt="Truffe noire du Périgord coupée en deux et tranchée sur une ardoise, chair marbrée de veines blanches"
            sizes="100vw"
            className="h-[70svh] min-h-[420px] w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/60" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-16 md:px-12">
            <Reveal>
              <p className="max-w-2xl font-display text-3xl font-light italic leading-snug md:text-5xl">
                « Une cuisine classique, parsemée de touches de modernité. »
              </p>
            </Reveal>
          </div>
        </section>

        <section id="carte" className="relative bg-ink py-32 md:py-40">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-12">
            <div className="md:col-span-5">
              <Reveal className="md:sticky md:top-32">
                <TiltCard className="overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src="/images/assiette.jpg"
                      alt="Assiette gastronomique garnie de fines lamelles de truffe noire"
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover object-[50%_62%]"
                    />
                  </div>
                </TiltCard>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal>
                <Eyebrow>Extraits de la carte</Eyebrow>
                <h2 className="font-display text-5xl font-light md:text-6xl">
                  La <span className="italic">Carte</span>
                </h2>
              </Reveal>
              <div className="mt-16 space-y-16">
                {carte.map((group, gi) => (
                  <Reveal key={group.section} delay={gi * 0.1}>
                    <h3 className="mb-6 border-b border-line pb-4 text-[11px] uppercase tracking-[0.35em] text-muted">
                      {group.section}
                    </h3>
                    <ul className="space-y-7">
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <div className="flex items-baseline justify-between gap-6">
                            <span className="font-display text-2xl">{item.name}</span>
                            <span className="shrink-0 font-display text-xl text-gold">{item.price} €</span>
                          </div>
                          {item.detail && <p className="mt-1 text-sm italic text-muted">{item.detail}</p>}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="menus" className="relative border-t border-line bg-ink py-32">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-12">
            <Reveal className="md:col-span-5 md:sticky md:top-32 md:self-start">
              <Eyebrow>Menus & formules</Eyebrow>
              <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
                Des menus pour <span className="italic">chaque moment</span>.
              </h2>
              <a
                href="#reservation"
                className="mt-10 inline-block border-b border-gold/60 pb-1 text-[11px] uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:border-cream hover:text-cream"
              >
                Détails & réservation
              </a>
            </Reveal>
            <ul className="border-t border-line md:col-span-6 md:col-start-7">
              {menus.map((m, i) => (
                <Reveal
                  as="li"
                  key={m.name}
                  delay={i * 0.05}
                  className="group flex items-baseline justify-between border-b border-line py-6"
                >
                  <span className="font-display text-3xl transition-transform duration-500 group-hover:translate-x-2">
                    {m.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-muted">{m.note}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="boutique" className="relative border-t border-line bg-ink py-32 md:py-40">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-12 md:px-12">
            <div className="md:col-span-6 md:col-start-7 md:row-start-1">
              <Reveal>
                <TiltCard className="overflow-hidden">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/images/truffe-entiere.jpg"
                      alt="Truffe noire entière posée sur une ardoise"
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover object-bottom"
                    />
                  </div>
                </TiltCard>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:row-start-1">
              <Reveal>
                <Eyebrow>E-Boutique</Eyebrow>
                <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
                  La truffe, <span className="italic">chez vous</span>.
                </h2>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">{boutiqueCategories.join(" · ")}</p>
              </Reveal>
              <ul className="mt-12 border-t border-line">
                {boutique.map((p, i) => (
                  <Reveal
                    as="li"
                    key={p.name}
                    delay={i * 0.08}
                    className="flex items-baseline justify-between gap-6 border-b border-line py-6"
                  >
                    <div>
                      <p className="font-display text-2xl">{p.name}</p>
                      {p.size && <p className="mt-1 text-sm text-muted">{p.size}</p>}
                    </div>
                    <span className="shrink-0 font-display text-xl text-gold">{p.price} €</span>
                  </Reveal>
                ))}
              </ul>
              <Reveal delay={0.2}>
                <div className="mt-12">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-teal">Take-away</p>
                  <p className="mt-3 font-display text-2xl">{contact.takeAwayHours}</p>
                  <a
                    href={contact.phoneHref}
                    className="mt-4 inline-block border-b border-line pb-1 text-sm text-muted transition-colors duration-300 hover:border-cream hover:text-cream"
                  >
                    Commander au {contact.phone}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="evenements" className="relative border-t border-line bg-ink py-32">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-12 md:px-12">
            <Reveal className="md:col-span-5">
              <Eyebrow>Événements professionnels</Eyebrow>
              <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
                Recevoir avec <span className="italic">distinction</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.15} className="md:col-span-6 md:col-start-7">
              <p className="text-lg leading-relaxed text-muted">
                Déjeuners d&apos;affaires et événements professionnels : le menu Corporate et la formule Business Lunch
                sont pensés pour vos rendez-vous et vos invités.
              </p>
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent("Événement professionnel")}`}
                className="mt-10 inline-block border-b border-gold/60 pb-1 text-[11px] uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:border-cream hover:text-cream"
              >
                Nous contacter
              </a>
            </Reveal>
          </div>
        </section>

        <section id="reservation" className="relative border-t border-line bg-ink py-32 md:py-40">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <Reveal>
              <Eyebrow>Réservation</Eyebrow>
              <h2 className="max-w-3xl font-display text-5xl font-light leading-tight md:text-7xl">
                Votre table <span className="italic">vous attend</span>.
              </h2>
            </Reveal>
            <div className="mt-20 grid border-t border-line md:grid-cols-3">
              {[
                { label: "Téléphone", value: contact.phone, href: contact.phoneHref },
                { label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
                { label: "Adresse", value: `${contact.address}, ${contact.city}`, href: contact.mapsHref, external: true },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 0.08}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className={`group block border-b border-line py-10 md:border-b-0 md:px-10 ${i === 0 ? "md:pl-0" : "md:border-l"}`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-muted">{c.label}</p>
                    <p className="mt-4 break-words font-display text-2xl transition-colors duration-300 group-hover:text-gold">
                      {c.value}
                    </p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-12 text-[11px] uppercase tracking-[0.25em] text-muted md:flex-row md:px-12">
          <p className="font-display text-xl normal-case tracking-wide text-cream">
            La Truffe <span className="italic">Noire</span>
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
