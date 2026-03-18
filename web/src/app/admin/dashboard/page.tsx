"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Briefcase, DollarSign,
  LogOut, Loader2, Search, RefreshCw,
  UserCircle, ChevronDown, ChevronLeft, ChevronRight, Eye, X, MapPin, Phone, Mail, Globe, Calendar, Package,
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

interface ExposantOption {
  id: string;
  option_id: string;
  quantity: number;
  unit_price: number;
}

interface SponsorOption {
  id: string;
  option_id: string;
  quantity: number;
  unit_price: number;
}

type DetailItem =
  | { type: "participant"; data: Participant }
  | { type: "exposant"; data: Exposant; options: ExposantOption[] }
  | { type: "sponsor"; data: Sponsor; options: SponsorOption[] };

const OPTION_LABELS: Record<string, string> = {
  kakemono: "Kak\u00e9mono (2m)",
  presentation: "Pr\u00e9sentation mobile",
  chaise: "Chaise suppl\u00e9mentaire",
  table: "Table suppl\u00e9mentaire",
  comptoir: "Comptoir + tabouret",
  hotesse: "H\u00f4tesse d'accueil / jour",
};

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
  const [selectedDetail, setSelectedDetail] = useState<DetailItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Pagination
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

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

  // Open detail panel
  async function openDetail(type: "participant" | "exposant" | "sponsor", id: string) {
    setLoadingDetail(true);
    if (type === "participant") {
      const item = participants.find((p) => p.id === id);
      if (item) setSelectedDetail({ type: "participant", data: item });
      setLoadingDetail(false);
    } else if (type === "exposant") {
      const item = exposants.find((e) => e.id === id);
      const { data: opts } = await supabase.from("exposant_options").select("*").eq("exposant_id", id);
      if (item) setSelectedDetail({ type: "exposant", data: item, options: opts ?? [] });
      setLoadingDetail(false);
    } else {
      const item = sponsors.find((s) => s.id === id);
      const { data: opts } = await supabase.from("sponsor_options").select("*").eq("sponsor_id", id);
      if (item) setSelectedDetail({ type: "sponsor", data: item, options: opts ?? [] });
      setLoadingDetail(false);
    }
  }

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

  // Pagination helper
  function paginate<T>(items: T[]) {
    const start = (currentPage - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }
  function totalPages(items: { length: number }) {
    return Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  }

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
        <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/expoTic.jpeg" alt="ExpoTic" width={100} height={30} className="object-contain" />
            </Link>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Administration</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 py-1.5 px-3 rounded-full">
              <UserCircle size={18} className="text-slate-500" />
              <span className="hidden sm:inline">{userEmail}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors">
              <LogOut size={14} /> <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10 py-8 lg:py-12">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Participants</span>
            </div>
            <p className="text-4xl lg:text-5xl font-extrabold text-slate-900">{participants.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Exposants</span>
            </div>
            <p className="text-4xl lg:text-5xl font-extrabold text-slate-900">{exposants.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Sponsors</span>
            </div>
            <p className="text-4xl lg:text-5xl font-extrabold text-slate-900">{sponsors.length}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">CA estimé</span>
            </div>
            <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 truncate" title={formatCFA(totalCA)}>{formatCFA(totalCA)}</p>
          </motion.div>
        </div>

        {/* TABS + SEARCH */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                  onClick={() => { setActiveTab(tab.key); setSearch(""); setStatusFilter("all"); setCurrentPage(1); }}
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
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher par nom, email, entreprise..."
                className="h-9 pl-9 bg-white"
              />
            </div>
            {activeTab !== "participants" && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
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
                <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nom complet</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Entreprise</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Secteur</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jours</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date Inscription</th>
                      <th className="px-4 py-3 w-28"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredParticipants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                          {search ? "Aucun participant trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      paginate(filteredParticipants).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">{p.first_name} {p.last_name}</div>
                            <div className="text-xs text-slate-500 sm:hidden block mt-0.5">{p.email}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{p.email}</td>
                          <td className="px-4 py-3 text-slate-600 hidden md:table-cell whitespace-nowrap">{p.phone}</td>
                          <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{p.company ?? "—"}</td>
                          <td className="px-4 py-3 text-slate-500 hidden xl:table-cell max-w-[180px] truncate" title={p.sector || ""}>{p.sector ?? "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-nowrap gap-1">
                              {p.jour1 && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">Jour 1</span>}
                              {p.jour2 && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">Jour 2</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatDate(p.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openDetail("participant", p.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                            >
                              <Eye size={14} />
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination participants */}
                {totalPages(filteredParticipants) > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                    <span className="text-xs text-slate-500">
                      {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredParticipants.length)}–{Math.min(currentPage * PAGE_SIZE, filteredParticipants.length)} sur {filteredParticipants.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages(filteredParticipants) }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[28px] h-7 text-xs rounded-md border ${
                            pg === currentPage
                              ? "bg-blue-600 text-white border-blue-600 font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages(filteredParticipants)}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}

              {/* EXPOSANTS TABLE */}
              {activeTab === "exposants" && (
                <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Entreprise / Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Email / Tél</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stand</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">B2B</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total (TTC)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date Inscription</th>
                      <th className="px-4 py-3 w-28"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExposants.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-16 text-center text-slate-400">
                          {search || statusFilter !== "all" ? "Aucun exposant trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      paginate(filteredExposants).map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors whitespace-nowrap">{e.company_name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{e.contact_name}</div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="text-slate-700">{e.email}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{e.phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100 font-bold whitespace-nowrap">
                              {e.stand_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            {e.want_b2b 
                              ? <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Oui</span> 
                              : <span className="text-[10px] uppercase font-bold text-slate-400">Non</span>
                            }
                          </td>
                          <td className="px-4 py-3 font-extrabold text-slate-900 whitespace-nowrap">
                            {formatCFA(e.grand_total)}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={e.status}
                              onChange={(ev) => updateExposantStatus(e.id, ev.target.value)}
                              className={`appearance-none text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-violet-500 ${STATUS_LABELS[e.status]?.className ?? "bg-slate-100 text-slate-700"}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell whitespace-nowrap">
                            {formatDate(e.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openDetail("exposant", e.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                            >
                              <Eye size={14} />
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination exposants */}
                {totalPages(filteredExposants) > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                    <span className="text-xs text-slate-500">
                      {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredExposants.length)}–{Math.min(currentPage * PAGE_SIZE, filteredExposants.length)} sur {filteredExposants.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages(filteredExposants) }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[28px] h-7 text-xs rounded-md border ${
                            pg === currentPage
                              ? "bg-violet-600 text-white border-violet-600 font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages(filteredExposants)}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}

              {/* SPONSORS TABLE */}
              {activeTab === "sponsors" && (
                <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Entreprise / Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Email / Tél</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pack</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total (TTC)</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date Inscription</th>
                      <th className="px-4 py-3 w-28"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSponsors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                          {search || statusFilter !== "all" ? "Aucun sponsor trouvé." : "Aucune inscription pour le moment."}
                        </td>
                      </tr>
                    ) : (
                      paginate(filteredSponsors).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors whitespace-nowrap">{s.company_name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{s.contact_name}</div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="text-slate-700">{s.email}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{s.phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                              s.pack_type === "leader"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : s.pack_type === "diamant"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : s.pack_type === "or"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            } whitespace-nowrap`}>
                              {s.pack_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-extrabold text-slate-900 whitespace-nowrap">
                            {formatCFA(s.grand_total)}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={s.status}
                              onChange={(ev) => updateSponsorStatus(s.id, ev.target.value)}
                              className={`appearance-none text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-amber-500 ${STATUS_LABELS[s.status]?.className ?? "bg-slate-100 text-slate-700"}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs hidden md:table-cell whitespace-nowrap">
                            {formatDate(s.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => openDetail("sponsor", s.id)}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                            >
                              <Eye size={14} />
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination sponsors */}
                {totalPages(filteredSponsors) > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                    <span className="text-xs text-slate-500">
                      {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredSponsors.length)}–{Math.min(currentPage * PAGE_SIZE, filteredSponsors.length)} sur {filteredSponsors.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages(filteredSponsors) }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`min-w-[28px] h-7 text-xs rounded-md border ${
                            pg === currentPage
                              ? "bg-amber-500 text-white border-amber-500 font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages(filteredSponsors)}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedDetail(null)} />
          {/* Panel */}
          <div className="relative z-10 w-full max-w-7xl max-h-[95vh] bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col mt-8 sm:mt-0">
            {/* Header */}
            <div className="shrink-0 bg-[#0d1b2a] text-white px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-[#4cc9f0] font-bold mb-1">
                  {selectedDetail.type === "participant" ? "Détails Participant" : selectedDetail.type === "exposant" ? "Détails Exposant" : "Détails Sponsor"}
                </p>
                <h2 className="text-2xl font-bold">
                  {selectedDetail.type === "participant"
                    ? `${(selectedDetail.data as Participant).first_name} ${(selectedDetail.data as Participant).last_name}`
                    : (selectedDetail.data as Exposant | Sponsor).company_name}
                </h2>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 hover:rotate-90 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
              {/* PARTICIPANT DETAIL */}
              {selectedDetail.type === "participant" && (() => {
                const p = selectedDetail.data as Participant;
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <Section title="Informations personnelles">
                        <Row icon={<UserCircle size={14} />} label="Nom complet" value={`${p.first_name} ${p.last_name}`} />
                        <Row icon={<Mail size={14} />} label="Email" value={p.email} wide />
                        <Row icon={<Phone size={14} />} label="Téléphone" value={p.phone} />
                      </Section>
                    </div>
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <Section title="Profil professionnel">
                        <Row icon={<Briefcase size={14} />} label="Fonction" value={p.fonction ?? "—"} />
                        <Row icon={<Building2 size={14} />} label="Entreprise" value={p.company ?? "—"} />
                        <Row icon={<Package size={14} />} label="Secteur" value={p.sector ?? "—"} wide />
                      </Section>
                    </div>
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-1 md:col-span-1">
                        <Section title="Participation">
                          <div className="col-span-2 flex flex-wrap gap-2">
                            {p.jour1 && <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Jour 1 — 18 Sept.</span>}
                            {p.jour2 && <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Jour 2 — 19 Sept.</span>}
                          </div>
                        </Section>
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        {p.source && (
                          <Section title="Source">
                            <p className="col-span-2 text-sm text-slate-600">{p.source}</p>
                          </Section>
                        )}
                      </div>
                      <div className="col-span-1 md:col-span-1">
                        <Section title="Inscription">
                          <Row icon={<Calendar size={14} />} label="Date" value={formatDate(p.created_at)} />
                        </Section>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* EXPOSANT DETAIL */}
              {selectedDetail.type === "exposant" && (() => {
                const e = selectedDetail.data as Exposant;
                const opts = selectedDetail.options as ExposantOption[];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 lg:col-span-1">
                      <Section title="Entreprise & Contact">
                        <Row icon={<Building2 size={14} />} label="Entreprise" value={e.company_name} />
                        <Row icon={<UserCircle size={14} />} label="Contact" value={e.contact_name} />
                        <Row icon={<Mail size={14} />} label="Email" value={e.email} wide />
                        <Row icon={<Phone size={14} />} label="Téléphone" value={e.phone} />
                        <Row icon={<Package size={14} />} label="Secteur" value={e.sector ?? "—"} wide />
                      </Section>
                      <Section title="Statut & Inscription">
                        <Row label="Statut" value={STATUS_LABELS[e.status]?.label ?? e.status} />
                        <Row icon={<Calendar size={14} />} label="Date" value={formatDate(e.created_at)} />
                      </Section>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 lg:col-span-1">
                      <Section title="Stand & Options">
                        <Row icon={<MapPin size={14} />} label="Type de stand" value={e.stand_type} />
                        <Row icon={<DollarSign size={14} />} label="Prix du stand" value={formatCFA(e.stand_price)} />
                        <Row label="B2B (Rencontres dir.)" value={e.want_b2b ? "Oui" : "Non"} />
                        
                        {opts.length > 0 && (
                          <div className="col-span-2 mt-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 mb-3 border-b border-slate-100">Options sélectionnées</p>
                            <div className="rounded-lg border border-slate-100 overflow-hidden text-sm">
                              {opts.map((o) => (
                                <div key={o.id} className="flex justify-between items-center px-3 py-2.5 bg-slate-50 border-b border-slate-100 last:border-0">
                                  <span className="text-slate-600 text-sm">{OPTION_LABELS[o.option_id] ?? o.option_id} × <span className="font-bold">{o.quantity}</span></span>
                                  <span className="font-bold text-slate-900 ml-4 shrink-0">{formatCFA(o.unit_price * o.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Section>
                      <Section title="Récapitulatif financier">
                        <Row label="Sous-total Options" value={formatCFA(e.options_total)} />
                        <Row label="TOTAL TTC" value={formatCFA(e.grand_total)} bold wide />
                      </Section>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 md:col-span-2 lg:col-span-1">
                      {e.description ? (
                        <Section title="Description / Activité">
                          <p className="col-span-2 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">{e.description}</p>
                        </Section>
                      ) : (
                        <Section title="Description / Activité">
                          <p className="col-span-2 text-sm text-slate-400 italic">Aucune description fournie.</p>
                        </Section>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* SPONSOR DETAIL */}
              {selectedDetail.type === "sponsor" && (() => {
                const s = selectedDetail.data as Sponsor;
                const opts = selectedDetail.options as SponsorOption[];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <Section title="Entreprise & Contact">
                        <Row icon={<Building2 size={14} />} label="Entreprise" value={s.company_name} />
                        <Row icon={<UserCircle size={14} />} label="Contact" value={s.contact_name} />
                        <Row icon={<Briefcase size={14} />} label="Fonction" value={s.fonction ?? "—"} />
                        <Row icon={<Mail size={14} />} label="Email" value={s.email} wide />
                        <Row icon={<Phone size={14} />} label="Téléphone" value={s.phone} />
                        {s.website && <Row icon={<Globe size={14} />} label="Site web" value={s.website} wide />}
                      </Section>
                      <Section title="Statut & Inscription">
                        <Row label="Statut" value={STATUS_LABELS[s.status]?.label ?? s.status} />
                        <Row icon={<Calendar size={14} />} label="Date" value={formatDate(s.created_at)} />
                      </Section>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <Section title="Pack Sponsor & Options">
                        <Row icon={<Package size={14} />} label="Pack choisi" value={s.pack_type.toUpperCase()} />
                        <Row icon={<DollarSign size={14} />} label="Prix du pack" value={formatCFA(s.pack_price)} />
                        
                        {opts.length > 0 && (
                          <div className="col-span-2 mt-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 mb-3 border-b border-slate-100">Options sélectionnées</p>
                            <div className="rounded-lg border border-slate-100 overflow-hidden text-sm">
                              {opts.map((o) => (
                                <div key={o.id} className="flex justify-between items-center px-3 py-2.5 bg-slate-50 border-b border-slate-100 last:border-0">
                                  <span className="text-slate-600 text-sm">{OPTION_LABELS[o.option_id] ?? o.option_id} × <span className="font-bold">{o.quantity}</span></span>
                                  <span className="font-bold text-slate-900 ml-4 shrink-0">{formatCFA(o.unit_price * o.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Section>
                      <Section title="Récapitulatif financier">
                        <Row label="Sous-total Options" value={formatCFA(s.options_total)} />
                        <Row label="TOTAL TTC" value={formatCFA(s.grand_total)} bold wide />
                      </Section>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-xl shadow-xl p-6 flex items-center gap-3">
            <Loader2 className="animate-spin text-slate-600" size={20} />
            <span className="text-sm font-medium text-slate-700">Chargement des détails…</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helper sub-components ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 pb-2 mb-3 border-b border-slate-100">{title}</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">{children}</div>
    </div>
  );
}

function Row({
  icon, label, value, bold, wide,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  bold?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : "col-span-1 min-w-0"}>
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
      </div>
      <p
        className={`text-sm leading-snug ${
          bold ? "font-extrabold text-slate-900 text-base" : "font-medium text-slate-800"
        } ${wide ? "break-all" : "truncate"}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
