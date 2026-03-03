"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, UserCircle, Briefcase, Building2,
  MapPin, CalendarDays, Users,
  Target, CheckCircle2, ChevronRight, Mail, Phone, Calendar,
  Wifi, Cpu, Rocket, Globe, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  THEME OFFICIEL                                                     */
/*  Le thème officiel est :                                            */
/*  "LA TECH AU SERVICE DE L'INNOVATION"                               */
/*  Couleurs : Vert (primary), Blanc, avec accents par profil         */
/*  Participant = bleu | Sponsor = ambre/or | Exposant = violet        */
/* ------------------------------------------------------------------ */

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ---------- DATA ---------- */
  const stats = [
    { value: "+5000", label: "Visiteurs attendus" },
    { value: "4 packs", label: "Sponsoring disponibles" },
    { value: "2 jours", label: "Conférences & Panels" },
    { value: "100%", label: "Secteur TIC & Numérique" },
  ];

  const highlights = [
    { icon: Wifi, title: "Connectivité", text: "IoT, 5G, Smart City et infrastructures de demain" },
    { icon: Cpu, title: "Intelligence Artificielle", text: "IA générative, automatisation et aide à la décision" },
    { icon: Rocket, title: "Start-ups & Innovation", text: "Pitchs, incubateurs et écosystème entrepreneurial" },
    { icon: Globe, title: "Transformation Digitale", text: "Cloud, ERP, e-gov et modernisation des process" },
  ];

  const advantages = [
    "Développer votre réseau professionnel avec les acteurs clés du secteur",
    "Découvrir les dernières innovations technologiques et tendances",
    "Rencontrer des partenaires commerciaux potentiels",
    "Assister à des conférences et ateliers de haut niveau",
    "Accroître la visibilité de votre entreprise et de vos solutions",
    "Échanger avec des experts et décideurs du secteur TIC",
    "Identifier de nouvelles opportunités d'investissement",
    "Participer à la transformation digitale de la Côte d'Ivoire",
  ];

  const targets = [
    "Opérateurs télécoms et fournisseurs de solutions TIC",
    "Chefs d'entreprises et Décideurs (CEO, DSI, CTO)",
    "Experts et consultants du secteur numérique",
    "Start-ups et porteurs de projets innovants",
    "Investisseurs et partenaires financiers",
    "Décideurs publics et privés du secteur TIC",
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden text-slate-800">

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  HEADER                                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <header className="w-full bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/expoTic.jpeg"
              alt="Logo Abidjan Expo Tic 2026"
              width={120}
              height={36}
              className="object-contain w-[100px] sm:w-[120px]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#programme" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Programme</Link>
            <Link href="#pourquoi" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pourquoi venir</Link>
            <Link href="#inscription" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">S'inscrire</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              <Link href="/register/participant">Participer</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="#inscription">S'inscrire</Link>
            </Button>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3"
          >
            <Link href="#programme" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-2">Programme</Link>
            <Link href="#pourquoi" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-2">Pourquoi venir</Link>
            <Link href="#inscription" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-slate-700 py-2">S'inscrire</Link>
            <div className="flex flex-col gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="w-full text-blue-600 border-blue-200">
                <Link href="/register/participant">Participer</Link>
              </Button>
              <Button asChild size="sm" className="w-full bg-amber-600 hover:bg-amber-700">
                <Link href="/register/sponsor">Sponsoring</Link>
              </Button>
              <Button asChild size="sm" className="w-full bg-violet-600 hover:bg-violet-700">
                <Link href="/register/exhibitor">Réserver un stand</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1 w-full">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  HERO — Full-bleed image with overlay                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/hero-tech.jpg"
            alt="Événement technologique"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          {/* Green accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
            <motion.div initial="hidden" animate="visible" variants={stagger}>

              <motion.div variants={fade} className="mb-6 sm:mb-8">
                <Image
                  src="/expoTic.jpeg"
                  alt="Abidjan Expo Tic"
                  width={220}
                  height={110}
                  className="mx-auto rounded-xl border border-white/20 shadow-2xl w-[160px] sm:w-[220px]"
                />
              </motion.div>

              <motion.p variants={fade} className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary mb-4 sm:mb-6">
                Thème officiel 2026
              </motion.p>

              <motion.h1 variants={fade} className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-3 sm:mb-4 max-w-4xl mx-auto">
                L&apos;Intelligence Artificielle au service de{" "}
                <span className="text-primary">la transformation des TIC</span>
              </motion.h1>

              <motion.p variants={fade} className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto italic mb-2 sm:mb-3 px-2">
                Enjeux, opportunités et perspectives pour les opérateurs
              </motion.p>

              <motion.p variants={fade} className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                Le grand rendez-vous des acteurs de la transformation numérique en Côte d&apos;Ivoire.
                Conférences, expositions, networking B2B et rencontres opérateurs.
              </motion.p>

              {/* Date / Lieu / Visiteurs badges */}
              <motion.div variants={fade} className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-8 sm:mb-12">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
                  <CalendarDays size={16} className="text-primary shrink-0" />
                  <span className="text-white text-sm font-semibold">7 - 8 Mai 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span className="text-white text-sm font-semibold">CRRAE-Riviera, Bonoumin, Abidjan</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
                  <Users size={16} className="text-primary shrink-0" />
                  <span className="text-white text-sm font-semibold">Secteur TIC & Numérique</span>
                </div>
              </motion.div>

              {/* CTA Buttons — Color-coded */}
              <motion.div variants={fade} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30 h-12 px-8">
                  <Link href="/register/participant">
                    <UserCircle size={18} className="mr-2" /> Participer gratuitement
                  </Link>
                </Button>
                <Button asChild size="lg" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-lg shadow-amber-600/30 h-12 px-8">
                  <Link href="/register/sponsor">
                    <Briefcase size={18} className="mr-2" /> Devenir Sponsor
                  </Link>
                </Button>
                <Button asChild size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/30 h-12 px-8">
                  <Link href="/register/exhibitor">
                    <Building2 size={18} className="mr-2" /> Réserver un Stand
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  STATS BAR                                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="bg-primary text-white">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center py-6 sm:py-8 border-r border-white/10 last:border-r-0">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{s.value}</p>
                <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  THÈMES & SECTEURS                                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Thèmes couverts</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Les secteurs clés de l'événement</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-6 rounded-xl border border-slate-100 hover:border-primary/30 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <h.icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{h.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{h.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  GALLERY / ACTIVITÉS                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Au programme</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">2 jours d'immersion technologique</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { img: "/images/conference.jpg", title: "Conférences & Panels", desc: "Keynotes, tables rondes avec des leaders du secteur TIC africain et international." },
                { img: "/stand.png", title: "Stands & Expositions", desc: "Visitez de nombreux stands et découvrez les dernières solutions, produits et innovations présentés par les acteurs TIC." },
                { img: "/networking.png", title: "Networking & B2B", desc: "Rencontres qualifiées entre décideurs, investisseurs et porteurs de projets." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  PROGRAMME DÉTAILLÉ                                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="programme" className="py-16 sm:py-24 bg-slate-900 text-white px-4 sm:px-6 relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:40px_40px]" />

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Agenda</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Programme des 2 Jours</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Jour 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Jour 1</h3>
                    <p className="text-sm text-slate-400">Mercredi 7 Mai 2026</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { time: "08:00", label: "Accueil et enregistrement des participants" },
                    { time: "09:30", label: "Cérémonie d'ouverture officielle", bold: true },
                    { time: "11:00", label: "Ouverture des stands et expositions" },
                    { time: "14:00", label: "Panels thématiques et Keynotes" },
                    { time: "16:30", label: "Sessions de networking ouvertes" },
                  ].map((e, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="font-mono text-sm text-primary w-12 shrink-0 pt-0.5">{e.time}</span>
                      <span className={`text-sm sm:text-base ${e.bold ? "text-white font-semibold" : "text-slate-300"}`}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jour 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Jour 2</h3>
                    <p className="text-sm text-slate-400">Jeudi 8 Mai 2026</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { time: "09:00", label: "Ateliers techniques et Masterclasses" },
                    { time: "11:00", label: "Rencontres B2B exclusives", bold: true },
                    { time: "14:00", label: "Panels thématiques IA & transformation des TIC" },
                    { time: "16:00", label: "Sessions B2B et rencontres opérateurs" },
                    { time: "17:00", label: "Cérémonie de clôture", bold: true },
                  ].map((e, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="font-mono text-sm text-primary w-12 shrink-0 pt-0.5">{e.time}</span>
                      <span className={`text-sm sm:text-base ${e.bold ? "text-white font-semibold" : "text-slate-300"}`}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  POURQUOI PARTICIPER                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="pourquoi" className="py-16 sm:py-24 bg-white px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Bénéfices</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">8 raisons de ne pas manquer ExpoTic</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {advantages.map((adv, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-start gap-3 bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-primary/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-snug">{adv}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  CIBLES                                                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-slate-50 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image side */}
            <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-full min-h-[300px]">
              <Image
                src="/images/innovation.jpg"
                alt="Innovation technologique"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
            </div>

            {/* Text side */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Public cible</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">À qui s'adresse l'événement ?</h2>
              <div className="space-y-3">
                {targets.map((target, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-100">
                    <ChevronRight size={16} className="text-primary shrink-0" />
                    <span className="text-sm sm:text-base font-medium text-slate-700">{target}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  INSCRIPTION — 3 PROFILS (COLOR-CODED)                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="inscription" className="py-16 sm:py-24 bg-white px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Inscription</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Choisissez votre profil</h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">Sélectionnez le parcours qui vous correspond pour accéder au formulaire d'inscription adapté.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* PARTICIPANT — Blue */}
              <Link href="/register/participant" className="block group">
                <div className="relative border-2 border-blue-100 rounded-2xl p-6 sm:p-8 bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/10 transition-all h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <UserCircle size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Participant</h3>
                  <p className="text-sm text-slate-500 flex-1 mb-6 leading-relaxed">Accédez aux conférences, visitez les stands d'exposition et développez votre réseau professionnel.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Gratuit</span>
                    <span className="text-blue-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                      S'inscrire <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>

              {/* SPONSOR — Amber */}
              <Link href="/register/sponsor" className="block group">
                <div className="relative border-2 border-amber-100 rounded-2xl p-6 sm:p-8 bg-white hover:border-amber-400 hover:shadow-xl hover:shadow-amber-600/10 transition-all h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Briefcase size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Sponsor</h3>
                  <p className="text-sm text-slate-500 flex-1 mb-6 leading-relaxed">Associez votre image à l'événement et bénéficiez d'une visibilité maximale auprès des acteurs du secteur TIC.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">Payant</span>
                    <span className="text-amber-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                      Voir les packs <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>

              {/* EXPOSANT — Violet */}
              <Link href="/register/exhibitor" className="block group">
                <div className="relative border-2 border-violet-100 rounded-2xl p-6 sm:p-8 bg-white hover:border-violet-400 hover:shadow-xl hover:shadow-violet-600/10 transition-all h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-5 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <Building2 size={28} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Exposant</h3>
                  <p className="text-sm text-slate-500 flex-1 mb-6 leading-relaxed">Réservez votre stand pour présenter vos produits et solutions face à des milliers de visiteurs qualifiés.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full">Payant</span>
                    <span className="text-violet-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                      Réserver <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  PARTENAIRES                                                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="py-14 sm:py-20 bg-white px-4 sm:px-6 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Ils nous font confiance</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Partenaires officiels</h2>
            </div>
            <div className="flex flex-wrap gap-12 sm:gap-20 items-center justify-center">
              <Image src="/gotic_new.png" alt="GOTIC" width={220} height={110} className="object-contain max-h-28" />
              <Image src="/dsi_club.png" alt="Club DSI" width={220} height={110} className="object-contain max-h-28" />
              <Image src="/abidjanmagazine.png" alt="Abidjan Magazine" width={160} height={110} className="object-contain max-h-28" />
              <Image src="/exias.png" alt="EXIAS" width={220} height={110} className="object-contain max-h-28" />
              <Image src="/LOGO-off.jpg.jpeg" alt="La Maison de l'Entrepreneur" width={220} height={110} className="object-contain max-h-28" />
              <Image src="/LOGO PDE 1(1).jpg.jpeg" alt="PDE - Programme de Développement Entrepreneurial" width={220} height={110} className="object-contain max-h-28" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  FOOTER                                                       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <footer className="bg-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <Image
                  src="/expoTic.jpeg"
                  alt="Abidjan Expo Tic"
                  width={110}
                  height={40}
                  className="rounded-lg border border-white/10 mb-3"
                />
                <p className="text-sm text-slate-400">7 - 8 Mai 2026 — CRRAE-Riviera, Bonoumin, Abidjan</p>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <a href="mailto:commercial@differencegroup.info" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <Mail size={16} /> commercial@differencegroup.info
                </a>
                <a href="tel:+2272722308348" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
                  <Phone size={16} /> 27 22 30 83 48 &nbsp;/&nbsp; 05 65 17 36 63 &nbsp;/&nbsp; 05 02 87 67 05
                </a>
                <p className="text-slate-500 text-xs mt-1">Cocody deux plateaux vallon, Rue BURIDA &mdash; Abidjan</p>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <span>&copy; 2026 Abidjan Expo Tic. Organisé par DIFFERENCE GROUP. Tous droits réservés.</span>
              <div className="flex gap-4">
                <Link href="/register/participant" className="text-blue-400 hover:text-blue-300">Participer</Link>
                <Link href="/register/sponsor" className="text-amber-400 hover:text-amber-300">Sponsoring</Link>
                <Link href="/register/exhibitor" className="text-violet-400 hover:text-violet-300">Exposer</Link>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
