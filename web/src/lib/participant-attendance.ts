"use client";

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export type ParticipantAttendanceStatus = "present" | "absent";

export interface ParticipantAttendanceRecord {
  firstBadgeDownloadedAt: string | null;
  status: ParticipantAttendanceStatus;
  updatedAt: string;
}

type ParticipantAttendanceMap = Record<string, ParticipantAttendanceRecord>;
type AttendanceStorageMode = "unknown" | "remote" | "local";

interface ParticipantAttendanceRow {
  participant_id: string;
  status: ParticipantAttendanceStatus;
  first_badge_downloaded_at: string | null;
  updated_at: string;
}

const STORAGE_KEY = "expotic:participant-attendance";
const STORAGE_EVENT = "expotic:participant-attendance-changed";
const ATTENDANCE_TABLE = "participant_attendance";

let attendanceStorageMode: AttendanceStorageMode = "unknown";

function isBrowserReady() {
  return typeof window !== "undefined";
}

function sanitizeAttendanceMap(value: unknown): ParticipantAttendanceMap {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<ParticipantAttendanceMap>((accumulator, [participantId, record]) => {
    if (!record || typeof record !== "object") {
      return accumulator;
    }

    const nextRecord = record as Partial<ParticipantAttendanceRecord>;
    const status = nextRecord.status === "present" ? "present" : "absent";
    const firstBadgeDownloadedAt = typeof nextRecord.firstBadgeDownloadedAt === "string"
      ? nextRecord.firstBadgeDownloadedAt
      : null;
    const updatedAt = typeof nextRecord.updatedAt === "string"
      ? nextRecord.updatedAt
      : new Date().toISOString();

    accumulator[participantId] = {
      firstBadgeDownloadedAt,
      status,
      updatedAt,
    };

    return accumulator;
  }, {});
}

function sanitizeAttendanceRow(row: ParticipantAttendanceRow): ParticipantAttendanceRecord {
  return {
    firstBadgeDownloadedAt: row.first_badge_downloaded_at,
    status: row.status === "present" ? "present" : "absent",
    updatedAt: row.updated_at,
  };
}

function mapAttendanceRows(rows: ParticipantAttendanceRow[]) {
  return rows.reduce<ParticipantAttendanceMap>((accumulator, row) => {
    accumulator[row.participant_id] = sanitizeAttendanceRow(row);
    return accumulator;
  }, {});
}

function isMissingAttendanceTableError(error: { code?: string; message?: string } | null | undefined) {
  return error?.code === "PGRST205" || error?.message?.includes("participant_attendance") === true;
}

function emitAttendanceChange() {
  if (!isBrowserReady()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function readParticipantAttendanceMap(): ParticipantAttendanceMap {
  if (!isBrowserReady()) {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    return sanitizeAttendanceMap(JSON.parse(rawValue));
  } catch {
    return {};
  }
}

function writeParticipantAttendanceMap(nextMap: ParticipantAttendanceMap) {
  if (!isBrowserReady()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
  emitAttendanceChange();
}

async function readRemoteParticipantAttendanceMap() {
  const { data, error } = await supabase
    .from(ATTENDANCE_TABLE)
    .select("participant_id, status, first_badge_downloaded_at, updated_at");

  if (error) {
    if (isMissingAttendanceTableError(error)) {
      attendanceStorageMode = "local";
      return null;
    }

    throw error;
  }

  attendanceStorageMode = "remote";

  return mapAttendanceRows((data ?? []) as ParticipantAttendanceRow[]);
}

async function upsertRemoteAttendanceRecord(
  participantId: string,
  patch: {
    status: ParticipantAttendanceStatus;
    firstBadgeDownloadedAt?: string | null;
  }
) {
  const payload = {
    participant_id: participantId,
    status: patch.status,
    first_badge_downloaded_at: patch.firstBadgeDownloadedAt ?? null,
  };

  const { data, error } = await supabase
    .from(ATTENDANCE_TABLE)
    .upsert(payload, { onConflict: "participant_id" })
    .select("participant_id, status, first_badge_downloaded_at, updated_at")
    .single();

  if (error) {
    if (isMissingAttendanceTableError(error)) {
      attendanceStorageMode = "local";
      return null;
    }

    throw error;
  }

  attendanceStorageMode = "remote";

  return sanitizeAttendanceRow(data as ParticipantAttendanceRow);
}

async function fetchRemoteAttendanceRecord(participantId: string) {
  const { data, error } = await supabase
    .from(ATTENDANCE_TABLE)
    .select("participant_id, status, first_badge_downloaded_at, updated_at")
    .eq("participant_id", participantId)
    .maybeSingle();

  if (error) {
    if (isMissingAttendanceTableError(error)) {
      attendanceStorageMode = "local";
      return null;
    }

    throw error;
  }

  attendanceStorageMode = "remote";

  return data ? sanitizeAttendanceRow(data as ParticipantAttendanceRow) : null;
}

export function getParticipantAttendanceStatus(record?: ParticipantAttendanceRecord | null): ParticipantAttendanceStatus {
  return record?.status === "present" ? "present" : "absent";
}

export async function setParticipantAttendanceStatus(participantId: string, status: ParticipantAttendanceStatus) {
  if (attendanceStorageMode !== "local") {
    try {
      const remoteRecord = await fetchRemoteAttendanceRecord(participantId);

      if (attendanceStorageMode === "remote") {
        const nextRecord = await upsertRemoteAttendanceRecord(participantId, {
          status,
          firstBadgeDownloadedAt: remoteRecord?.firstBadgeDownloadedAt ?? null,
        });

        if (nextRecord) {
          emitAttendanceChange();
          return nextRecord;
        }
      }
    } catch {
      attendanceStorageMode = "local";
    }
  }

  const currentMap = readParticipantAttendanceMap();
  const existingRecord = currentMap[participantId];
  const nextRecord: ParticipantAttendanceRecord = {
    firstBadgeDownloadedAt: existingRecord?.firstBadgeDownloadedAt ?? null,
    status,
    updatedAt: new Date().toISOString(),
  };

  writeParticipantAttendanceMap({
    ...currentMap,
    [participantId]: nextRecord,
  });

  return nextRecord;
}

export async function markParticipantPresentOnFirstBadgeDownload(participantId: string) {
  if (attendanceStorageMode !== "local") {
    try {
      const remoteRecord = await fetchRemoteAttendanceRecord(participantId);

      if (attendanceStorageMode === "remote") {
        const firstBadgeDownloadedAt = remoteRecord?.firstBadgeDownloadedAt ?? new Date().toISOString();
        const nextRecord = await upsertRemoteAttendanceRecord(participantId, {
          status: "present",
          firstBadgeDownloadedAt,
        });

        if (nextRecord) {
          emitAttendanceChange();
          return nextRecord;
        }
      }
    } catch {
      attendanceStorageMode = "local";
    }
  }

  const currentMap = readParticipantAttendanceMap();
  const existingRecord = currentMap[participantId];

  const firstBadgeDownloadedAt = existingRecord?.firstBadgeDownloadedAt ?? new Date().toISOString();
  const nextRecord: ParticipantAttendanceRecord = {
    firstBadgeDownloadedAt,
    status: "present",
    updatedAt: new Date().toISOString(),
  };

  writeParticipantAttendanceMap({
    ...currentMap,
    [participantId]: nextRecord,
  });

  return nextRecord;
}

export function useParticipantAttendanceMap() {
  const [attendanceMap, setAttendanceMap] = useState<ParticipantAttendanceMap>(() => {
    return readParticipantAttendanceMap();
  });

  const reloadAttendanceMap = useCallback(async () => {
    try {
      const remoteMap = await readRemoteParticipantAttendanceMap();

      if (remoteMap) {
        setAttendanceMap(remoteMap);
        writeParticipantAttendanceMap(remoteMap);
        return remoteMap;
      }
    } catch {
      attendanceStorageMode = "local";
    }

    const localMap = readParticipantAttendanceMap();
    setAttendanceMap(localMap);
    return localMap;
  }, []);

  useEffect(() => {
    if (!isBrowserReady()) {
      return;
    }

    const initialReloadTimeoutId = window.setTimeout(() => {
      void reloadAttendanceMap();
    }, 0);

    const handleStorageChange = () => {
      void reloadAttendanceMap();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(STORAGE_EVENT, handleStorageChange);

    return () => {
      window.clearTimeout(initialReloadTimeoutId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(STORAGE_EVENT, handleStorageChange);
    };
  }, [reloadAttendanceMap]);

  return {
    attendanceMap,
    reloadAttendanceMap,
  };
}