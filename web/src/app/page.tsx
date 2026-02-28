"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, UserCircle, Briefcase, Building2, 
  MapPin, CalendarDays, Users, Star, 
  Target, CheckCircle2, ChevronRight, Mail, Phone, Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
  const advantages = [
    "Développer votre réseau professionnel avec les acteurs clés",
    "Découvrir les dernières innovations technologiques et tendances",
    "Rencontrer des partenaires commerciaux potentiels",
    "Assister à des conférences et ateliers de haut niveau",
    "Accroître la visibilité de votre entreprise et de vos solutions",
    "Échanger avec des experts et décideurs du secteur TIC",
    "Identifier de nouvelles opportunités d'investissement",
    "Participer activement à la transformation digitale de la région"
  ];

  const targets = [
    "Professionnels des TIC et du Numérique",
    "Chefs d'entreprises et Décideurs (CEO, DSI, CTO)",
    "Start-ups et Porteurs de projets innovants",
    "Investisseurs et Partenaires financiers",
    "Étudiants et Chercheurs en technologies",
    "Grand public passionné par l'innovation"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden text-slate-800">
      
      {/* HEADER / NAVIGATION */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Image 
            src="/expoTic.jpeg" 
            alt="Logo Abidjan Expo Tic 2026" 
            width={140} 
            height={40} 
            className="object-contain"
          />
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm animate-pulse">
              <Star size={16} fill="currentColor" /> Réservation de stands en cours
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full relative">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px] -z-10" />
          
          <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              <motion.div variants={fadeUp} className="mb-8">
                <Image 
                  src="/expoTic.jpeg" 
                  alt="Abidjan Expo Tic" 
                  width={300} 
                  height={150} 
                  className="mx-auto rounded-xl shadow-lg mix-blend-multiply border border-slate-100"
                />
              </motion.div>
              
              <motion.div variants={fadeUp} className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-4 py-1.5 text-sm font-bold text-destructive mb-6 shadow-sm">
                Places limitées — Événement majeur de l'année 2026
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
                La Tech au service de <span className="text-primary">l'innovation</span>
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
                Le carrefour incontournable de la transformation digitale. Connectez-vous avec les leaders de demain et découvrez les solutions qui façonneront l'avenir.
              </motion.p>

              {/* INFO BADGES */}
              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CalendarDays size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-medium">Dates</p>
                    <p className="font-bold text-sm md:text-base">7 - 8 Mai 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-medium">Lieu</p>
                    <p className="font-bold text-sm md:text-base">Sofitel Hôtel Ivoire</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Users size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-medium">Affluence</p>
                    <p className="font-bold text-sm md:text-base">5 000+ Visiteurs</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* HUB REGISTRATION CARDS */}
          <div className="max-w-6xl mx-auto" id="registration-hub">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800">Choisissez votre profil pour continuer</h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Participant */}
              <Link href="/register/participant" className="block h-full group focus:outline-none">
                <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 bg-white relative overflow-hidden group-focus:border-primary">
                  <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <UserCircle size={150} />
                  </div>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <UserCircle size={28} />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">Participant</CardTitle>
                    <CardDescription className="text-base mt-2">Accédez aux conférences, visitez les stands et réseautez avec les professionnels.</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <span className="text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Je m'inscris <ArrowRight size={18} />
                    </span>
                  </CardFooter>
                </Card>
              </Link>

              {/* Sponsor */}
              <Link href="/register/sponsor" className="block h-full group focus:outline-none">
                <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 bg-white relative overflow-hidden group-focus:border-primary">
                  <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Briefcase size={150} />
                  </div>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Briefcase size={28} />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">Sponsor</CardTitle>
                    <CardDescription className="text-base mt-2">Visibilité maximale globale : associez votre image à l'événement de l'année.</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <span className="text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Devenir Sponsor <ArrowRight size={18} />
                    </span>
                  </CardFooter>
                </Card>
              </Link>

              {/* Exhibitor */}
              <Link href="/register/exhibitor" className="block h-full group focus:outline-none">
                <Card className="h-full border-2 border-destructive/20 shadow-lg transition-all duration-300 hover:border-destructive/60 hover:shadow-2xl hover:shadow-destructive/10 bg-white relative overflow-hidden group-focus:border-destructive">
                  <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-destructive">
                    <Building2 size={150} />
                  </div>
                  <div className="absolute top-4 right-4 bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                    Urgent
                  </div>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4 text-destructive group-hover:bg-destructive group-hover:text-white transition-colors duration-300">
                      <Building2 size={28} />
                    </div>
                    <CardTitle className="text-2xl text-slate-800">Exposant</CardTitle>
                    <CardDescription className="text-base mt-2">Réservez vite votre stand pour présenter vos produits face à 5 000 visiteurs.</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-6">
                    <span className="text-destructive font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                      Réserver un Stand <ArrowRight size={18} />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* POURQUOI PARTICIPER */}
        <section className="py-24 bg-white px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Pourquoi participer à l'ExpoTic ?</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Découvrez les 8 raisons majeures de ne pas manquer ce rendez-vous technologique.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {advantages.map((adv, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-50 border border-slate-100 p-6 rounded-2xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="text-slate-700 font-medium leading-snug">{adv}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PROGRAMME & CIBLES */}
        <section className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            {/* Programme */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-xl"><Calendar size={24} className="text-primary" /></div>
                <h2 className="text-3xl font-bold">Programme Détaillé</h2>
              </div>
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-primary mb-4 border-b border-white/10 pb-2">Jour 1 - 7 Mai 2026</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">08:00</span>
                      <span className="text-slate-200">Accueil et enregistrement des participants</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">09:30</span>
                      <span className="text-slate-200 font-medium">Cérémonie d'ouverture officielle</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">11:00</span>
                      <span className="text-slate-200">Ouverture des stands et expositions</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">14:00</span>
                      <span className="text-slate-200">Début des Panels thématiques et Keynotes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-primary mb-4 border-b border-white/10 pb-2">Jour 2 - 8 Mai 2026</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">09:00</span>
                      <span className="text-slate-200">Ateliers techniques et Masterclasses</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">11:00</span>
                      <span className="text-slate-200 font-medium">Rencontres B2B Exclusives</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm text-slate-400 w-12 shrink-0 pt-1">14:00</span>
                      <span className="text-slate-200">Pitch des Startups & Concours d'innovation</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-sm inline-block text-slate-400 w-12 shrink-0 pt-1">17:00</span>
                      <span className="text-slate-200 font-medium text-destructive">Cérémonie de clôture et Mots de fin</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cibles */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-xl"><Target size={24} className="text-primary" /></div>
                <h2 className="text-3xl font-bold">À qui s'adresse l'événement ?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {targets.map((target, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                    <ChevronRight size={18} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-sm font-medium">{target}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-primary/20 border border-primary/50 p-8 rounded-2xl text-center">
                <div className="text-5xl font-extrabold text-white mb-2">5 000+</div>
                <div className="text-primary font-medium text-lg uppercase tracking-wider">Visiteurs attendus</div>
                <p className="text-slate-300 mt-4 text-sm">Devenez l'un des acteurs majeurs de ce chiffre impressionnant.</p>
                <Button className="mt-6 font-bold shadow-lg" size="lg" asChild>
                  <Link href="#registration-hub">Rejoindre l'événement</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* PARTENAIRES */}
        <section className="py-20 bg-slate-50 px-6 border-b border-slate-200">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Nos Partenaires Officiels</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {["GOTIG", "LubDSI", "Abidjan Magazine", "EXIAS"].map((partner, idx) => (
                <div key={idx} className="text-2xl md:text-3xl font-extrabold text-slate-300 grayscale hover:grayscale-0 hover:text-slate-800 transition-all cursor-default">
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
               <Image 
                  src="/expoTic.jpeg" 
                  alt="Abidjan Expo Tic" 
                  width={100} 
                  height={50} 
                  className="grayscale opacity-60"
                />
            </div>
            <div className="flex flex-col md:flex-row gap-6 text-sm text-slate-500 font-medium">
              <a href="mailto:contact@expotic.ci" className="flex items-center gap-2 hover:text-primary transition-colors hover:underline">
                <Mail size={16} /> contact@expotic.ci
              </a>
              <span className="hidden md:inline text-slate-300">|</span>
              <a href="tel:+22500000000" className="flex items-center gap-2 hover:text-primary transition-colors hover:underline">
                <Phone size={16} /> +225 00 00 00 00
              </a>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; 2026 ExpoTic. Tous droits réservés.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
