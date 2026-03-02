"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, UserCircle, Check, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const SECTORS = [
  "Technologies de l'information",
  "Télécommunications",
  "Finance / Banque / Assurance",
  "Éducation / Formation",
  "Santé",
  "Énergie",
  "Administration publique",
  "Commerce / Distribution",
  "Conseil / Audit",
  "Start-up / Entrepreneuriat",
  "Média / Communication",
  "Autre",
];

const SOURCES = [
  "Réseaux sociaux",
  "Bouche à oreille",
  "Email / Newsletter",
  "Site web ExpoTic",
  "Presse / Média",
  "Partenaire / Sponsor",
  "Autre",
];

const STEPS = ["Identité", "Profil & Journées", "Confirmation"];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ParticipantRegister() {
  const [step, setStep] = useState(0);

  // Step 0 – Identity
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Step 1 – Profile
  const [company, setCompany] = useState("");
  const [fonction, setFonction] = useState("");
  const [sector, setSector] = useState("");
  const [jour1, setJour1] = useState(true);
  const [jour2, setJour2] = useState(true);
  const [source, setSource] = useState("");
  const [acceptCGU, setAcceptCGU] = useState(false);

  function canContinue() {
    if (step === 0) return firstName.trim() && lastName.trim() && email.includes("@") && phone.trim();
    if (step === 1) return (jour1 || jour2) && acceptCGU;
    return true;
  }

  function handleSubmit() {
    const payload = {
      firstName, lastName, email, phone,
      company, fonction, sector,
      jours: [jour1 && "Jour 1", jour2 && "Jour 2"].filter(Boolean),
      source,
    };
    console.log("Participant registration:", payload);
    alert("Votre inscription a bien été enregistrée. Un email de confirmation vous sera envoyé.");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
          <Image src="/expoTic.jpeg" alt="ExpoTic" width={100} height={30} className="object-contain" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600 mb-4">
            <UserCircle size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Inscription Participant</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Obtenez votre pass gratuit pour Abidjan Expo Tic 2026 — 7 et 8 mai, Sofitel Hôtel Ivoire.
          </p>
        </div>

        {/* STEPPER */}
        <nav className="flex items-center justify-center gap-1 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <button
                onClick={() => { if (i < step) setStep(i); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  i === step
                    ? "bg-blue-600 text-white"
                    : i < step
                    ? "bg-blue-100 text-blue-600 cursor-pointer"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-blue-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </nav>

        {/* STEP CONTENT */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ---- STEP 0 : IDENTITÉ ---- */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Vos coordonnées</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Prénom <span className="text-destructive">*</span></Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Nom <span className="text-destructive">*</span></Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Kouassi" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Adresse email <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean.kouassi@email.com" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 00 00 00 00" className="h-11" />
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 1 : PROFIL & JOURNÉES ---- */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Profil professionnel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Entreprise / Organisation</Label>
                    <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nom de votre structure" className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fonction">Fonction / Poste</Label>
                    <Input id="fonction" value={fonction} onChange={(e) => setFonction(e.target.value)} placeholder="Directeur, Ingénieur, Étudiant..." className="h-11" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="sector">Secteur d'activité</Label>
                    <select
                      id="sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Sélectionnez un secteur</option>
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Journées */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Journées de participation <span className="text-destructive">*</span></h3>
                <p className="text-sm text-slate-500 mb-4">Sélectionnez au moins une journée.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                      jour1 ? "border-blue-500 bg-blue-50" : "border-slate-200"
                    }`}
                  >
                    <Checkbox checked={jour1} onCheckedChange={(v) => setJour1(v === true)} />
                    <div>
                      <p className="font-medium text-slate-800 text-sm">Jour 1 — 7 mai 2026</p>
                      <p className="text-xs text-slate-500">Conférences & panels</p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                      jour2 ? "border-blue-500 bg-blue-50" : "border-slate-200"
                    }`}
                  >
                    <Checkbox checked={jour2} onCheckedChange={(v) => setJour2(v === true)} />
                    <div>
                      <p className="font-medium text-slate-800 text-sm">Jour 2 — 8 mai 2026</p>
                      <p className="text-xs text-slate-500">Ateliers & networking</p>
                    </div>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Source */}
              <div className="space-y-1.5">
                <Label htmlFor="source">Comment avez-vous connu ExpoTic ?</Label>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Sélectionnez une source</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* CGU */}
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="cgu"
                  checked={acceptCGU}
                  onCheckedChange={(v) => setAcceptCGU(v === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="cgu" className="text-sm font-normal text-slate-600 cursor-pointer leading-relaxed">
                  J'accepte que mes données soient utilisées dans le cadre de l'organisation d'Abidjan Expo Tic 2026.
                  <span className="text-destructive"> *</span>
                </Label>
              </div>
            </div>
          )}

          {/* ---- STEP 2 : CONFIRMATION ---- */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Récapitulatif de votre inscription</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div><span className="text-slate-500">Prénom :</span> <span className="font-medium text-slate-800">{firstName}</span></div>
                <div><span className="text-slate-500">Nom :</span> <span className="font-medium text-slate-800">{lastName}</span></div>
                <div><span className="text-slate-500">Email :</span> <span className="font-medium text-slate-800">{email}</span></div>
                <div><span className="text-slate-500">Téléphone :</span> <span className="font-medium text-slate-800">{phone}</span></div>
                {company && <div><span className="text-slate-500">Entreprise :</span> <span className="font-medium text-slate-800">{company}</span></div>}
                {fonction && <div><span className="text-slate-500">Fonction :</span> <span className="font-medium text-slate-800">{fonction}</span></div>}
                {sector && <div><span className="text-slate-500">Secteur :</span> <span className="font-medium text-slate-800">{sector}</span></div>}
                {source && <div><span className="text-slate-500">Source :</span> <span className="font-medium text-slate-800">{source}</span></div>}
              </div>

              <Separator className="my-6" />

              <div>
                <p className="text-sm text-slate-500 mb-2">Journées sélectionnées :</p>
                <div className="flex flex-wrap gap-2">
                  {jour1 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      <Check size={12} /> Jour 1 — 7 mai
                    </span>
                  )}
                  {jour2 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                      <Check size={12} /> Jour 2 — 8 mai
                    </span>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-600">Entrée gratuite</p>
                <p className="text-xs text-slate-500 mt-1">Un QR code d'accès vous sera envoyé par email après confirmation.</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft size={16} /> Précédent
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue()}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Suivant <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="gap-2 px-8 bg-blue-600 hover:bg-blue-700">
              Confirmer l'inscription <Check size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
