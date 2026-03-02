"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Check, Plus, Minus, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { sendSponsorReview, notifyAdmin } from "@/lib/emails";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const PACKS = [
  {
    id: "leader",
    name: "Leader",
    price: 9_000_000,
    standSize: "18 m²",
    invitations: 16,
    highlights: [
      "Stand premium 18 m² (meilleur emplacement)",
      "16 invitations officielles",
      "Logo sur tous les supports de communication",
      "Prise de parole en plénière (15 min)",
      "Article dédié dans le magazine officiel",
      "Kakémono dans l'espace principal",
      "Visibilité maximale : site, réseaux, presse",
    ],
    badge: "Exclusif",
  },
  {
    id: "diamant",
    name: "Diamant",
    price: 7_000_000,
    standSize: "18 m²",
    invitations: 15,
    highlights: [
      "Stand 18 m² (emplacement privilégié)",
      "15 invitations officielles",
      "Logo sur les supports de communication",
      "Prise de parole en atelier (10 min)",
      "Visibilité : site, réseaux sociaux, roll-up",
    ],
    badge: null,
  },
  {
    id: "or",
    name: "Or",
    price: 5_000_000,
    standSize: "9 m²",
    invitations: 8,
    highlights: [
      "Stand 9 m²",
      "8 invitations officielles",
      "Logo sur le site web et la signalétique",
      "Mention dans le programme officiel",
    ],
    badge: null,
  },
  {
    id: "bronze",
    name: "Bronze",
    price: 3_000_000,
    standSize: "9 m²",
    invitations: 5,
    highlights: [
      "Stand 9 m²",
      "5 invitations officielles",
      "Logo sur le site web",
      "Mention dans le programme",
    ],
    badge: null,
  },
] as const;

type PackId = (typeof PACKS)[number]["id"];

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

const STEPS = ["Entreprise", "Pack Sponsor", "Options", "Récapitulatif"];

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function SponsorRegister() {
  const [step, setStep] = useState(0);

  // Step 1 – Company info
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [fonction, setFonction] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2 – Pack
  const [selectedPack, setSelectedPack] = useState<PackId | null>(null);

  // Step 3 – Options
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(OPTIONS.map((o) => [o.id, 0]))
  );

  const selectedPackData = PACKS.find((p) => p.id === selectedPack) ?? null;

  const optionsTotal = useMemo(
    () => OPTIONS.reduce((sum, o) => sum + o.unitPrice * (quantities[o.id] ?? 0), 0),
    [quantities]
  );

  const grandTotal = (selectedPackData?.price ?? 0) + optionsTotal;
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
    if (step === 0) return company.trim() && contact.trim() && email.includes("@") && phone.trim();
    if (step === 1) return selectedPack !== null;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setErrorMsg("");
    try {
      // 1. Insert sponsor (UUID généré côté client pour éviter un SELECT retour)
      const sponsorId = crypto.randomUUID();
      const { error } = await supabase.from("sponsors").insert({
        id: sponsorId,
        company_name: company,
        contact_name: contact,
        fonction: fonction || null,
        email,
        phone,
        website: website || null,
        pack_type: selectedPack,
        pack_price: selectedPackData?.price ?? 0,
        options_total: optionsTotal,
        grand_total: grandTotal,
      });

      if (error) {
        if (error.code === "23505") {
          setErrorMsg("Cet email est déjà inscrit comme sponsor.");
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
          sponsor_id: sponsorId,
          option_id: o.id,
          quantity: quantities[o.id],
          unit_price: o.unitPrice,
        }));
      if (optionsToInsert.length > 0) {
        await supabase.from("sponsor_options").insert(optionsToInsert);
      }

      // 3. Email au sponsor (inscription en étude)
      await sendSponsorReview({
        company,
        contact,
        email,
        packName: selectedPackData?.name ?? "",
        total: formatCFA(grandTotal),
      }).catch((err) => console.error("Email sponsor:", err));

      // 4. Notification admin
      await notifyAdmin("sponsor", {
        "Entreprise": company,
        "Contact": contact,
        "Fonction": fonction || "—",
        "Email": email,
        "Téléphone": phone,
        "Site web": website || "—",
        "Pack": selectedPackData?.name ?? "",
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-100 text-amber-600 mb-4">
            <Briefcase size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Devenir Sponsor</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Associez votre marque à Abidjan Expo Tic 2026 et bénéficiez d'une visibilité exceptionnelle auprès de +5 000 décideurs.
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
                    ? "bg-amber-600 text-white"
                    : i < step
                    ? "bg-amber-100 text-amber-600 cursor-pointer"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? "bg-amber-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </nav>

        {/* SUCCESS SCREEN */}
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Demande de sponsoring enregistrée !</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Merci <strong>{contact}</strong> ! Votre demande de sponsoring pour <strong>{company}</strong> est en cours d'étude.
              Un email de confirmation a été envoyé à <strong>{email}</strong>.
            </p>
            <p className="text-sm text-slate-400 mb-8">L'équipe Difference Group vous contactera sous 48 heures pour finaliser votre partenariat.</p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">Retour à l'accueil</Button>
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
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ex: TechVision CI" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact">Nom du contact <span className="text-destructive">*</span></Label>
                  <Input id="contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Nom et prénom" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fonction">Fonction / Poste</Label>
                  <Input id="fonction" value={fonction} onChange={(e) => setFonction(e.target.value)} placeholder="Directeur Général, DG..." className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email professionnel <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@entreprise.com" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone <span className="text-destructive">*</span></Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+225 07 00 00 00 00" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Site web</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://entreprise.com" className="h-11" />
                </div>
              </div>
            </div>
          )}

          {/* ---- STEP 1 : PACK SELECTION ---- */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Choisissez votre pack de sponsoring</h2>
              <p className="text-sm text-slate-500 mb-6">Chaque pack inclut un stand équipé, des invitations et une visibilité adaptée.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PACKS.map((pack) => {
                  const active = selectedPack === pack.id;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedPack(pack.id)}
                      className={`relative text-left rounded-xl border-2 p-6 transition-all ${
                        active
                          ? "border-amber-500 bg-amber-50 ring-1 ring-amber-200"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      {pack.badge && !active && (
                        <Badge className="absolute top-4 right-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
                          {pack.badge}
                        </Badge>
                      )}
                      {active && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Pack {pack.name}</h3>
                      <p className="text-2xl font-extrabold text-amber-600 mb-4">{formatCFA(pack.price)}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span>Stand {pack.standSize}</span>
                        <span className="w-px h-3 bg-slate-300" />
                        <span>{pack.invitations} invitations</span>
                      </div>
                      <ul className="space-y-1.5">
                        {pack.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                            <Check size={14} className="text-amber-600 mt-0.5 shrink-0" />
                            <span>{h}</span>
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
              <p className="text-sm text-slate-500 mb-6">Personnalisez votre présence. Ajoutez du mobilier, de la signalétique ou des services supplémentaires.</p>
              <div className="space-y-3">
                {OPTIONS.map((opt) => {
                  const qty = quantities[opt.id] ?? 0;
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center justify-between border rounded-lg px-5 py-4 transition-colors ${
                        qty > 0 ? "border-amber-300 bg-amber-50" : "border-slate-200"
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
                          className="w-8 h-8 rounded-full border border-amber-500 text-amber-600 flex items-center justify-center hover:bg-amber-50 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        {qty > 0 && (
                          <span className="text-sm font-semibold text-amber-600 ml-2 min-w-[100px] text-right">
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
                  Sous-total options : <span className="text-amber-600">{formatCFA(optionsTotal)}</span>
                </div>
              )}
            </div>
          )}

          {/* ---- STEP 3 : RECAP ---- */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={20} className="text-amber-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Récapitulatif de votre inscription</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-6">
                  <div><span className="text-slate-500">Entreprise :</span> <span className="font-medium text-slate-800">{company}</span></div>
                  <div><span className="text-slate-500">Contact :</span> <span className="font-medium text-slate-800">{contact}</span></div>
                  <div><span className="text-slate-500">Email :</span> <span className="font-medium text-slate-800">{email}</span></div>
                  <div><span className="text-slate-500">Téléphone :</span> <span className="font-medium text-slate-800">{phone}</span></div>
                  {fonction && <div><span className="text-slate-500">Fonction :</span> <span className="font-medium text-slate-800">{fonction}</span></div>}
                  {website && <div><span className="text-slate-500">Site web :</span> <span className="font-medium text-slate-800">{website}</span></div>}
                </div>

                <Separator className="my-6" />

                {selectedPackData && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-slate-900">Pack {selectedPackData.name}</p>
                      <p className="text-xs text-slate-500">Stand {selectedPackData.standSize} — {selectedPackData.invitations} invitations</p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{formatCFA(selectedPackData.price)}</p>
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
                  <p className="text-2xl font-extrabold text-amber-600">{formatCFA(grandTotal)}</p>
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
              className="gap-2 bg-amber-600 hover:bg-amber-700"
            >
              Suivant <ArrowRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2 px-8 bg-amber-600 hover:bg-amber-700">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <>Confirmer l'inscription <Check size={16} /></>}
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
