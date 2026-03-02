"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Briefcase, DollarSign,
  LogOut, Loader2, Search, RefreshCw,
  UserCircle, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  fonction: string | null;
  sector: string | null;
  jour1: boolean;
  jour2: boolean;
  source: string | null;
  created_at: string;
}

interface Exposant {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  sector: string;
  description: string | null;
  want_b2b: boolean;
  stand_type: string;
  stand_price: number;
  options_total: number;
  grand_total: number;
  status: string;
  created_at: string;
}

interface Sponsor {
  id: string;
  company_name: string;
  contact_name: string;
  fonction: string | null;
  email: string;
  phone: string;
  website: string | null;
  pack_type: string;
  pack_price: number;
  options_total: number;
  grand_total: number;
  status: string;
  created_at: string;
}

function formatCFA(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmé", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function AdminDashboard() {
  const router = useRouter();

  // Auth
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // Data
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exposants, setExposants] = useState<Exposant[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  // UI
  const [activeTab, setActiveTab] = useState<"participants" | "exposants" | "sponsors">("participants");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setUserEmail(session.user.email ?? "");
        setCheckingAuth(false);
      }
    });
  }, [router]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pRes, eRes, sRes] = await Promise.all([
      supabase.from("participants").select("*").order("created_at", { ascending: false }),
      supabase.from("exposants").select("*").order("created_at", { ascending: false }),
      supabase.from("sponsors").select("*").order("created_at", { ascending: false }),
    ]);
    setParticipants(pRes.data ?? []);
    setExposants(eRes.data ?? []);
    setSponsors(sRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!checkingAuth) fetchData();
  }, [checkingAuth, fetchData]);

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  // Change status
  async function updateExposantStatus(id: string, newStatus: string) {
    await supabase.from("exposants").update({ status: newStatus }).eq("id", id);
    setExposants((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  }

  async function updateSponsorStatus(id: string, newStatus: string) {
    await supabase.from("sponsors").update({ status: newStatus }).eq("id", id);
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  }

  // Stats
  const totalCA =
    exposants.reduce((sum, e) => sum + e.grand_total, 0) +
    sponsors.reduce((sum, s) => sum + s.grand_total, 0);

  // Search filter
  const filteredParticipants = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.company ?? "").toLowerCase().includes(q)
    );
  });

  const filteredExposants = exposants.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.company_name.toLowerCase().includes(q) ||
      e.contact_name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredSponsors = sponsors.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.company_name.toLowerCase().includes(q) ||
      s.contact_name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/expoTic.jpeg" alt="ExpoTic" width={100} height={30} className="object-contain" />
            </Link>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Administration</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UserCircle size={18} />
              <span className="hidden sm:inline">{userEmail}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-slate-500">
              <LogOut size={14} /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500">Participants</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{participants.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500">Exposants</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{exposants.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500">Sponsors</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{sponsors.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <span className="text-sm font-medium text-slate-500">CA estimé</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCFA(totalCA)}</p>
          </motion.div>
        </div>

        {/* TABS + SEARCH */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 pt-4">
            <div className="flex gap-1">
              {([
                { key: "participants", label: "Participants", icon: Users, count: participants.length, color: "blue" },
                { key: "exposants", label: "Exposants", icon: Building2, count: exposants.length, color: "violet" },
                { key: "sponsors", label: "Sponsors", icon: Briefcase, count: sponsors.length, color: "amber" },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setSearch(""); setStatusFilter("all"); }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? `border-${tab.color}-600 text-${tab.color}-600`
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                  style={activeTab === tab.key ? { borderBottomColor: tab.color === "blue" ? "#2563eb" : tab.color === "violet" ? "#7c3aed" : "#d97706" } : {}}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 text-slate-500">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
            </Button>
          </div>

          {/* Search + filters */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, email, entreprise..."
                className="h-9 pl-9 bg-white"
              />
            </div>
            {activeTab !== "participants" && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none h-9 pl-3 pr-8 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* TABLE CONTENT */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* PARTICIPANTS TABLE */}
              {activeTab === "participants" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 font-semibold text-slate-600">Nom</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Téléphone</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Entreprise</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Secteur</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Jours</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          {search ? "Aucun résultat trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      filteredParticipants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-900">{p.first_name} {p.last_name}</td>
                          <td className="px-6 py-3 text-slate-600">{p.email}</td>
                          <td className="px-6 py-3 text-slate-600">{p.phone}</td>
                          <td className="px-6 py-3 text-slate-600">{p.company ?? "—"}</td>
                          <td className="px-6 py-3 text-slate-600">{p.sector ?? "—"}</td>
                          <td className="px-6 py-3">
                            <div className="flex gap-1">
                              {p.jour1 && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">J1</span>}
                              {p.jour2 && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">J2</span>}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(p.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* EXPOSANTS TABLE */}
              {activeTab === "exposants" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 font-semibold text-slate-600">Entreprise</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Contact</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Stand</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">B2B</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Total</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Statut</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExposants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                          {search || statusFilter !== "all" ? "Aucun résultat trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      filteredExposants.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-900">{e.company_name}</td>
                          <td className="px-6 py-3 text-slate-600">{e.contact_name}</td>
                          <td className="px-6 py-3 text-slate-600">{e.email}</td>
                          <td className="px-6 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                              {e.stand_type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-600">{e.want_b2b ? "Oui" : "Non"}</td>
                          <td className="px-6 py-3 font-semibold text-slate-900">{formatCFA(e.grand_total)}</td>
                          <td className="px-6 py-3">
                            <select
                              value={e.status}
                              onChange={(ev) => updateExposantStatus(e.id, ev.target.value)}
                              className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_LABELS[e.status]?.className ?? "bg-slate-100 text-slate-700"}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(e.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* SPONSORS TABLE */}
              {activeTab === "sponsors" && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 font-semibold text-slate-600">Entreprise</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Contact</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Pack</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Total</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Statut</th>
                      <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSponsors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          {search || statusFilter !== "all" ? "Aucun résultat trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      filteredSponsors.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-slate-900">{s.company_name}</td>
                          <td className="px-6 py-3 text-slate-600">{s.contact_name}</td>
                          <td className="px-6 py-3 text-slate-600">{s.email}</td>
                          <td className="px-6 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              s.pack_type === "leader"
                                ? "bg-amber-100 text-amber-800"
                                : s.pack_type === "diamant"
                                ? "bg-purple-100 text-purple-800"
                                : s.pack_type === "or"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {s.pack_type.charAt(0).toUpperCase() + s.pack_type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-900">{formatCFA(s.grand_total)}</td>
                          <td className="px-6 py-3">
                            <select
                              value={s.status}
                              onChange={(ev) => updateSponsorStatus(s.id, ev.target.value)}
                              className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_LABELS[s.status]?.className ?? "bg-slate-100 text-slate-700"}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(s.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
