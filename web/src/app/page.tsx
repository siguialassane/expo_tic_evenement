"use client";

import { motion } from "framer-motion";
import { ArrowRight, UserCircle, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-12 overflow-hidden">
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-col items-center justify-center text-center mb-20 relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
             <div className="w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
              Édition 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 font-sans">
              Rejoignez <span className="text-primary">ExpoTic</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Le rendez-vous incontournable des technologies et de l'innovation. 
              Sélectionnez votre profil pour commencer votre inscription ou demander plus d'informations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card Participant */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={variants}>
            <Link href="/register/participant" className="block h-full group">
              <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <UserCircle size={120} />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <UserCircle size={24} />
                  </div>
                  <CardTitle className="text-2xl">Participant</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Vous souhaitez assister aux conférences, découvrir les stands et développer votre réseau.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Accès aux pavillons
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Conférences & Ateliers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Application de networking
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                    S'inscrire <ArrowRight size={18} />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* Card Sponsor */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={variants}>
            <Link href="/register/sponsor" className="block h-full group">
              <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Briefcase size={120} />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Briefcase size={24} />
                  </div>
                  <CardTitle className="text-2xl">Sponsor</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Associez votre image à l'événement tech de l'année et bénéficiez d'une visibilité maximale.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Visibilité premium globale
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Mention dans les communications
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Accès VIP exclusif
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                    Devenir sponsor <ArrowRight size={18} />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* Card Exhibitor */}
          <motion.div custom={3} initial="hidden" animate="visible" variants={variants}>
            <Link href="/register/exhibitor" className="block h-full group">
              <Card className="h-full border-2 border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 size={120} />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Building2 size={24} />
                  </div>
                  <CardTitle className="text-2xl">Exposant</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Réservez votre stand pour présenter vos produits et services directement au public.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Espace stand personnalisable
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Badges équipe inclus
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Inscription au catalogue
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto pt-6">
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                    Réserver un stand <ArrowRight size={18} />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
