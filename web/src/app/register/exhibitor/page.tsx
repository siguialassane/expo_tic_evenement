"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, Check, Plus, Minus, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { sendExposantReview, notifyAdmin } from "@/lib/emails";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const STANDS = [
  {
    id: "18m2",
    size: "18 m²",
    price: 800_000,
    description: "Grand stand — idéal pour les démonstrations et un affichage étendu",
    features: ["Espace d'exposition large", "Configuration flexible", "4 badges exposant inclus"],
  },
  {
    id: "9m2",
    size: "9 m²",
    price: 500_000,
    description: "Stand intermédiaire — bon compromis espace / budget",
    features: ["Espace suffisant pour vitrine", "Agencement modulable", "4 badges exposant inclus"],
  },
  {
    id: "6m2",
    size: "6 m²",
    price: 300_000,
    description: "Stand compact — parfait pour les start-ups et petites structures",
    features: ["Format optimisé", "Accès aux espaces communs", "4 badges exposant inclus"],
  },
] as const;

type StandId = (typeof STANDS)[number]["id"];

interface Option {
  id: string;
  label: string;
  unitPrice: number;
}

const OPTIONS: Option[] = [
  { id: "kakemono", label: "Kakémono (2 m)", unitPrice: 80_000 },
  { id: "presentation", label: "Présentation mobile (écran)", unitPrice: 50_000 },
  { id: "chaise", label: "Chaise supplémentaire", unitPrice: 10_000 },
  { id: "table", label: "Table supplémentaire", unitPrice: 10_000 },
  { id: "comptoir", label: "Comptoir + tabouret", unitPrice: 100_000 },
  { id: "hotesse", label: "Hôtesse d'accueil / jour", unitPrice: 100_000 },
];

const SECTORS = [
  "Intelligence Artificielle",
  "Cybersécurité",
  "FinTech / Mobile Money",
  "Cloud & Infrastructure",
  "E-commerce / Marketplace",
  "EdTech / Formation",
  "HealthTech / Santé digitale",
  "AgriTech",
  "Télécommunications",
  "Énergie & GreenTech",
  "Logistique & Transport",
  "Autre",
];

const STEPS = ["Entreprise", "Stand", "Options", "Récapitulatif"];

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function ExhibitorRegister() {
  const [step, setStep] = useState(0);

  // Step 0 – Company
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [wantB2B, setWantB2B] = useState(false);

  // Step 1 – Stand
  const [selectedStand, setSelectedStand] = useState<StandId | null>(null);

  // Step 2 – Options
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(OPTIONS.map((o) => [o.id, 0]))
  );

  const selectedStandData = STANDS.find((s) => s.id === selectedStand) ?? null;

  const optionsTotal = useMemo(
    () => OPTIONS.reduce((sum, o) => sum + o.unitPrice * (quantities[o.id] ?? 0), 0),
    [quantities]
  );

  const grandTotal = (selectedStandData?.price ?? 0) + optionsTotal;
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function updateQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  }

  function canContinue() {
    if (step === 0) return company.trim() && contact.trim() && email.includes("@") && phone.trim() && sector;
    if (step === 1) return selectedStand !== null;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrorMsg("");
    try {
      // 1. Insert exposant (UUID généré côté client pour éviter un SELECT retour)
      const exposantId = crypto.randomUUID();
      const { error } = await supabase.from("exposants").insert({
        id: exposantId,
        company_name: company,
        contact_name: contact,
        email,
        phone,
        sector,
        description: description || null,
        want_b2b: wantB2B,
        stand_type: selectedStand,
        stand_price: selectedStandData?.price ?? 0,
        options_total: optionsTotal,
        grand_total: grandTotal,
      });

      if (error) {
        if (error.code === "23505") {
          setErrorMsg("Cet email est déjà inscrit comme exposant.");
        } else {
          setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
        }
        setSubmitting(false);
        return;
      }

      // 2. Insert options
      const optionsToInsert = OPTIONS
        .filter((o) => (quantities[o.id] ?? 0) > 0)
        .map((o) => ({
          exposant_id: exposantId,
          option_id: o.id,
          quantity: quantities[o.id],
          unit_price: o.unitPrice,
        }));
      if (optionsToInsert.length > 0) {
        await supabase.from("exposant_options").insert(optionsToInsert);
      }

      // 3. Email à l'exposant (inscription en étude)
      await sendExposantReview({
        company,
        contact,
        email,
        standSize: selectedStandData?.size ?? "",
        total: formatCFA(grandTotal),
      }).catch((err) => console.error("Email exposant:", err));

      // 4. Notification admin
      await notifyAdmin("exposant", {
        "Entreprise": company,
        "Contact": contact,
        "Email": email,
        "Téléphone": phone,
        "Secteur": sector,
        "Stand": selectedStandData?.size ?? "",
        "B2B": wantB2B ? "Oui" : "Non",
        "Total": formatCFA(grandTotal),
      }).catch((err) => console.error("Email admin:", err));

      setSubmitted(true);
    } catch {
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
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

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-100 text-violet-600 mb-4">
            <Building2 size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Réserver un Stand</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Exposez vos solutions et technologies lors d'Abidjan Expo Tic 2026. 4 badges exposant inclus avec chaque stand.
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
                    ? "bg-violet-600 text-white"
                    : i < step
                    ? "bg-violet-100 text-violet-600 cursor-pointer"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-violet-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </nav>

        {/* SUCCESS SCREEN */}
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Demande de stand enregistrée !</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Merci <strong>{contact}</strong> ! Votre demande pour <strong>{company}</strong> est en cours d'étude.
              Un email de confirmation a été envoyé à <strong>{email}</strong>.
            </p>
            <p className="text-sm text-slate-400 mb-8">L'équipe Difference Group vous contactera sous 48 heures pour finaliser votre réservation.</p>
            <Link href="/">
              <Button className="bg-violet-600 hover:bg-violet-700">Retour à l'accueil</Button>
            </Link>
          </motion.div>
        ) : (
        <>
        {/* STEP CONTENT */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ---- STEP 0 : ENTREPRISE ---- */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Informations de l'entreprise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="company">Nom de l'entreprise <span className="text-destructive">*</span></Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ex: InnovTech CI" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact">Personne à contacter <span className="text-destructive">*</span></Label>
                  <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Nom et prénom" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email professionnel <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@entreprise.com" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 00 00 00 00" className="h-11" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="sector">Secteur d'activité <span className="text-destructive">*</span></Label>
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
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="description">Description de votre activité</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez brièvement vos produits / services à exposer..."
                    className="min-h-[80px] resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <Checkbox
                    id="b2b"
                    checked={wantB2B}
                    onCheckedChange={(v) => setWantB2B(v === true)}
                  />
                  <Label htmlFor="b2b" className="text-sm font-normal text-slate-600 cursor-pointer">
                    Je souhaite participer aux sessions B2B (rencontres acheteurs)
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 1 : STAND SELECTION ---- */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Choisissez votre stand</h2>
              <p className="text-sm text-slate-500 mb-6">
                Chaque stand comprend : cloisons, éclairage, moquette, 1 table, 2 chaises, branchement électrique et 4 badges exposant.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STANDS.map((stand) => {
                  const active = selectedStand === stand.id;
                  return (
                    <button
                      key={stand.id}
                      type="button"
                      onClick={() => setSelectedStand(stand.id)}
                      className={`relative text-left rounded-xl border-2 p-6 transition-all ${
                        active
                          ? "border-violet-500 bg-violet-50 ring-1 ring-violet-200"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      {active && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <p className="text-3xl font-extrabold text-slate-900 mb-1">{stand.size}</p>
                      <p className="text-2xl font-bold text-violet-600 mb-3">{formatCFA(stand.price)}</p>
                      <p className="text-sm text-slate-500 mb-4">{stand.description}</p>
                      <ul className="space-y-1.5">
                        {stand.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <Check size={14} className="text-violet-600 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- STEP 2 : OPTIONS ---- */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Options additionnelles</h2>
              <p className="text-sm text-slate-500 mb-6">Personnalisez votre stand avec du mobilier, de la signalétique ou des services.</p>
              <div className="space-y-3">
                {OPTIONS.map((opt) => {
                  const qty = quantities[opt.id] ?? 0;
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center justify-between border rounded-lg px-5 py-4 transition-colors ${
                        qty > 0 ? "border-violet-300 bg-violet-50" : "border-slate-200"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-800">{opt.label}</p>
                        <p className="text-sm text-slate-500">{formatCFA(opt.unitPrice)} / unité</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQty(opt.id, -1)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold text-slate-900">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(opt.id, 1)}
                          className="w-8 h-8 rounded-full border border-violet-500 text-violet-600 flex items-center justify-center hover:bg-violet-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        {qty > 0 && (
                          <span className="text-sm font-semibold text-violet-600 ml-2 min-w-[100px] text-right">
                            {formatCFA(opt.unitPrice * qty)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {optionsTotal > 0 && (
                <div className="mt-6 text-right text-sm font-semibold text-slate-700">
                  Sous-total options : <span className="text-violet-600">{formatCFA(optionsTotal)}</span>
                </div>
              )}
            </div>
          )}

          {/* ---- STEP 3 : RECAP ---- */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={20} className="text-violet-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Récapitulatif de votre réservation</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
                  <div><span className="text-slate-500">Entreprise :</span> <span className="font-medium text-slate-800">{company}</span></div>
                  <div><span className="text-slate-500">Contact :</span> <span className="font-medium text-slate-800">{contact}</span></div>
                  <div><span className="text-slate-500">Email :</span> <span className="font-medium text-slate-800">{email}</span></div>
                  <div><span className="text-slate-500">Téléphone :</span> <span className="font-medium text-slate-800">{phone}</span></div>
                  <div><span className="text-slate-500">Secteur :</span> <span className="font-medium text-slate-800">{sector}</span></div>
                  {wantB2B && <div><span className="text-slate-500">B2B :</span> <span className="font-medium text-violet-600">Oui, intéressé</span></div>}
                </div>

                {description && (
                  <div className="text-sm mb-6">
                    <span className="text-slate-500">Activité :</span>
                    <p className="font-medium text-slate-800 mt-1">{description}</p>
                  </div>
                )}

                <Separator className="my-6" />

                {selectedStandData && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-900">Stand {selectedStandData.size}</p>
                      <p className="text-xs text-slate-500">4 badges exposant inclus</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{formatCFA(selectedStandData.price)}</p>
                  </div>
                )}

                {Object.entries(quantities).filter(([, v]) => v > 0).length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-sm font-semibold text-slate-700 mb-3">Options additionnelles</p>
                    <div className="space-y-2">
                      {OPTIONS.filter((o) => (quantities[o.id] ?? 0) > 0).map((o) => {
                        const qty = quantities[o.id];
                        return (
                          <div key={o.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">{o.label} x{qty}</span>
                            <span className="font-medium text-slate-800">{formatCFA(o.unitPrice * qty)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-slate-900">TOTAL TTC</p>
                  <p className="text-2xl font-extrabold text-violet-600">{formatCFA(grandTotal)}</p>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl p-6 text-sm text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800 mb-3">Modalités de paiement</p>
                <p>50 % à la confirmation de l'inscription</p>
                <p>50 % au plus tard le <span className="font-medium text-slate-800">1er mai 2026</span></p>
                <Separator className="my-3" />
                <p className="text-xs text-slate-500">
                  Paiement par virement bancaire au nom de <span className="font-medium">DIFFERENCE GROUP</span>. 
                  Les coordonnées vous seront communiquées par email après validation.
                </p>
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
              className="gap-2 bg-violet-600 hover:bg-violet-700"
            >
              Suivant <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 px-8 bg-violet-600 hover:bg-violet-700">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <>Confirmer la réservation <Check size={16} /></>}
            </Button>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {errorMsg}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
