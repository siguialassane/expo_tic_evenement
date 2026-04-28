"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, RefreshCw, Search, Users } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { ParticipantBadgePreview } from "@/components/admin/participant-badge-preview";
import { useAdminSession } from "@/components/admin/use-admin-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getParticipantAttendanceStatus,
  markParticipantPresentOnFirstBadgeDownload,
  useParticipantAttendanceMap,
} from "@/lib/participant-attendance";
import { supabase } from "@/lib/supabase";

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
  created_at: string;
}

function toFileNamePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBadgesPage() {
  const { checkingAuth, userEmail, handleLogout } = useAdminSession();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const pdfBadgeSheetRef = useRef<HTMLDivElement | null>(null);
  const { attendanceMap, reloadAttendanceMap } = useParticipantAttendanceMap();

  const deferredSearch = useDeferredValue(search);

  const loadParticipants = useCallback(async () => {
    const { data, error } = await supabase
      .from("participants")
      .select("id, first_name, last_name, email, phone, company, fonction, sector, jour1, jour2, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setParticipants([]);
      setErrorMessage("Impossible de charger la liste des participants pour le moment.");
      setLoading(false);
      return;
    }

    const nextParticipants = data ?? [];

    setParticipants(nextParticipants);
    setErrorMessage(null);
    setSelectedParticipantId((current) => current ?? nextParticipants[0]?.id ?? null);
    setLoading(false);
  }, []);

  const refreshParticipants = useCallback(() => {
    setLoading(true);
    setErrorMessage(null);
    void loadParticipants();
  }, [loadParticipants]);

  useEffect(() => {
    if (checkingAuth) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadParticipants();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [checkingAuth, loadParticipants]);

  const filteredParticipants = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return participants;
    }

    return participants.filter((participant) => {
      return [
        participant.first_name,
        participant.last_name,
        participant.email,
        participant.company ?? "",
        participant.fonction ?? "",
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [deferredSearch, participants]);

  const effectiveSelectedParticipantId = useMemo(() => {
    const selectedStillExists = filteredParticipants.some((participant) => participant.id === selectedParticipantId);

    if (selectedStillExists) {
      return selectedParticipantId;
    }

    return filteredParticipants[0]?.id ?? null;
  }, [filteredParticipants, selectedParticipantId]);

  const selectedParticipant = useMemo(() => {
    return filteredParticipants.find((participant) => participant.id === effectiveSelectedParticipantId) ?? null;
  }, [effectiveSelectedParticipantId, filteredParticipants]);

  const handleDownloadPdf = useCallback(async () => {
    if (!pdfBadgeSheetRef.current || !selectedParticipant) {
      return;
    }

    try {
      setIsExportingPdf(true);
      setExportErrorMessage(null);

      const [{ toPng }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);

      const badgeImage = await toPng(pdfBadgeSheetRef.current, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 3,
      });

      const pdf = new jsPDF({
        format: "a4",
        orientation: "portrait",
        unit: "mm",
      });

      pdf.addImage(badgeImage, "PNG", 0, 0, 210, 297, undefined, "FAST");

      const firstName = toFileNamePart(selectedParticipant.first_name || "participant");
      const lastName = toFileNamePart(selectedParticipant.last_name || "badge");

      pdf.save(`badge-${lastName}-${firstName}.pdf`);
      await markParticipantPresentOnFirstBadgeDownload(selectedParticipant.id);
      await reloadAttendanceMap();
    } catch (error) {
      console.error("PDF export failed", error);
      setExportErrorMessage("Impossible de telecharger le badge en PDF pour le moment.");
    } finally {
      setIsExportingPdf(false);
    }
  }, [reloadAttendanceMap, selectedParticipant]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminShell
      userEmail={userEmail}
      onLogout={handleLogout}
      title="Génération de badge"
      subtitle="Choisissez un participant dans la liste. Son badge s'affiche a droite sur un modele fixe, simple et pret pour l'export PDF."
      headerNote={null}
      showPageIntro={false}
      contentClassName="px-4 py-4 md:px-6 lg:py-4 xl:px-8"
    >
      <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white lg:h-[calc(100vh-8rem)]">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <Users size={16} className="text-emerald-600" />
                  Participants
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {search.trim()
                    ? `${filteredParticipants.length} affiche${filteredParticipants.length > 1 ? "s" : ""} sur ${participants.length}`
                    : `${participants.length} inscrit${participants.length > 1 ? "s" : ""}`}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={refreshParticipants}
                className="gap-2 text-slate-600"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Actualiser
              </Button>
            </div>

            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un participant..."
                className="h-11 border-slate-200 bg-white pl-9"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : errorMessage ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-medium text-slate-700">{errorMessage}</p>
                <Button variant="outline" size="sm" onClick={refreshParticipants} className="mt-4">
                  Réessayer
                </Button>
              </div>
            ) : filteredParticipants.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-medium text-slate-700">Aucun participant ne correspond à cette recherche.</p>
                <p className="mt-1 text-xs text-slate-500">Effacez le filtre pour réafficher toute la liste.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredParticipants.map((participant) => {
                  const isSelected = participant.id === effectiveSelectedParticipantId;
                  const attendanceRecord = attendanceMap[participant.id];
                  const attendanceStatus = getParticipantAttendanceStatus(attendanceRecord);
                  const isPresent = attendanceStatus === "present";

                  return (
                    <button
                      key={participant.id}
                      type="button"
                      onClick={() => setSelectedParticipantId(participant.id)}
                      className={`w-full border-l-4 px-6 py-5 text-left transition-colors ${
                        isSelected
                          ? "border-l-emerald-600 bg-emerald-50/70"
                          : "border-l-transparent bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold text-slate-900">
                            {participant.first_name} {participant.last_name}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-600">
                            {participant.fonction || "Fonction non renseignée"}
                          </p>
                          <p className="mt-2 truncate text-sm text-slate-500">
                            {participant.company || participant.email}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                          <div className="text-[11px] font-medium text-slate-400">
                            {formatDate(participant.created_at)}
                          </div>
                          <div
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isPresent ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isPresent ? "Présent" : "Absent"}
                          </div>
                          {isSelected ? (
                            <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                              En cours
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        {attendanceRecord?.firstBadgeDownloadedAt ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                            Badge téléchargé
                          </span>
                        ) : null}
                        {participant.jour1 && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                            Jour 1
                          </span>
                        )}
                        {participant.jour2 && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                            Jour 2
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white lg:h-[calc(100vh-8rem)]">
          {selectedParticipant ? (
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center justify-end border-b border-slate-200 px-6 py-4">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isExportingPdf ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Télécharger PDF A4
                </Button>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f6faf7_100%)] p-6 xl:p-8">
                <div className="flex h-full w-full items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
                  <div className="w-full max-w-[430px]">
                    <ParticipantBadgePreview
                      firstName={selectedParticipant.first_name}
                      lastName={selectedParticipant.last_name}
                      role={selectedParticipant.fonction}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -left-[9999px] top-0">
                <div
                  ref={pdfBadgeSheetRef}
                  className="relative aspect-[210/297] w-[1240px] overflow-hidden bg-white"
                >
                  <div className="absolute left-0 top-0 w-1/2 origin-top-left">
                    <ParticipantBadgePreview
                      firstName={selectedParticipant.first_name}
                      lastName={selectedParticipant.last_name}
                      role={selectedParticipant.fonction}
                    />
                  </div>
                </div>
              </div>

              {exportErrorMessage ? (
                <p className="px-6 pb-4 text-sm text-red-600">{exportErrorMessage}</p>
              ) : null}
            </div>
          ) : (
            <div className="px-6 py-14 text-center text-sm text-slate-500">
              Sélectionnez un participant à gauche pour afficher son badge.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}