import { useEffect, useState } from "react";

/**
 * Hwabelle BFCM 2026 Campaign Schedule (Pacific Time, UTC-8)
 * - Cyber Monday phase begins: Mon Nov 30, 2026 00:00:00 PST -> 2026-11-30T08:00:00.000Z
 * - Offer ends:                Mon Nov 30, 2026 23:59:59 PST -> 2026-12-01T07:59:59.999Z
 * - Evergreen auto-restore:    Tue Dec  1, 2026 00:00:00 PST -> 2026-12-01T08:00:00.000Z
 */
export const BFCM_CYBER_MONDAY_START_UTC_MS = Date.parse("2026-11-30T08:00:00.000Z");
export const BFCM_END_UTC_MS = Date.parse("2026-12-01T07:59:59.999Z");

export type BfcmPhase = "weekend" | "cyber-monday" | "ended";

export interface BfcmCountdownParts {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export interface BfcmCampaignState {
  isActive: boolean;
  phase: BfcmPhase;
  isCyberMonday: boolean;
  countdown: BfcmCountdownParts;
  announcementDesktop: string;
  announcementMobile: string;
  heroEyebrow: string;
  heroHeadlineLines: [string, string] | [string];
  heroSupporting: string;
  heroPrimaryCta: string;
  deadlineLine: string;
  productOfferLabel: string;
}

function getPreviewOverride(): BfcmPhase | null {
  if (typeof window === "undefined") return null;
  try {
    const param = new URLSearchParams(window.location.search).get("bfcm");
    if (param === "weekend") return "weekend";
    if (param === "monday" || param === "cyber-monday") return "cyber-monday";
    if (param === "ended" || param === "off") return "ended";
  } catch {
    // ignore
  }
  return null;
}

export function computeCountdown(nowMs: number, endMs = BFCM_END_UTC_MS): BfcmCountdownParts {
  const diff = Math.max(0, endMs - nowMs);
  if (diff <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { totalMs: diff, days, hours, minutes, seconds, expired: false };
}

export function getBfcmCampaignState(nowMs = Date.now()): BfcmCampaignState {
  const override = getPreviewOverride();

  let phase: BfcmPhase;
  if (override) {
    phase = override;
  } else if (nowMs > BFCM_END_UTC_MS) {
    phase = "ended";
  } else if (nowMs >= BFCM_CYBER_MONDAY_START_UTC_MS) {
    phase = "cyber-monday";
  } else {
    phase = "weekend";
  }

  // If previewing monday before Nov 30, show realistic remaining hours on Monday
  const effectiveNow =
    override === "cyber-monday" && nowMs < BFCM_CYBER_MONDAY_START_UTC_MS
      ? BFCM_CYBER_MONDAY_START_UTC_MS + (nowMs % (8 * 3600 * 1000))
      : override === "ended"
        ? BFCM_END_UTC_MS + 1000
        : nowMs;

  const countdown = computeCountdown(effectiveNow, BFCM_END_UTC_MS);
  const isActive = phase !== "ended" && !countdown.expired;
  const isCyberMonday = phase === "cyber-monday";

  if (isCyberMonday) {
    return {
      isActive,
      phase,
      isCyberMonday: true,
      countdown,
      announcementDesktop: "Cyber Monday · 20% Off The Hwabelle Flower Press Kit · Ends Tonight",
      announcementMobile: "Cyber Monday · 20% Off The Flower Press Kit · Ends Tonight",
      heroEyebrow: "CYBER MONDAY",
      heroHeadlineLines: ["Last Day To Save 20%"],
      heroSupporting:
        "Begin a meaningful flower-pressing project with the Hwabelle Acrylic Flower Press Kit.",
      heroPrimaryCta: "Shop Before The Offer Ends",
      deadlineLine: "Offer ends tonight at 11:59 p.m. Pacific.",
      productOfferLabel: "Cyber Monday · Save 20%",
    };
  }

  return {
    isActive,
    phase,
    isCyberMonday: false,
    countdown,
    announcementDesktop: "Black Friday Weekend · 20% Off The Hwabelle Flower Press Kit · Ends Nov 30",
    announcementMobile: "20% Off The Flower Press Kit · Ends Nov 30",
    heroEyebrow: "BLACK FRIDAY WEEKEND",
    heroHeadlineLines: ["Preserve The Flowers", "Keep The Story"],
    heroSupporting:
      "Save 20% on the Hwabelle Acrylic Flower Press Kit and turn selected blooms into a keepsake at home.",
    heroPrimaryCta: "Shop The Flower Press Kit",
    deadlineLine: "Offer ends November 30 at 11:59 p.m. Pacific.",
    productOfferLabel: "BFCM Weekend · Save 20%",
  };
}

export function isBfcmOfferActive(nowMs = Date.now()): boolean {
  return getBfcmCampaignState(nowMs).isActive;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function useBfcmCampaign(): BfcmCampaignState {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    const id = window.setInterval(tick, 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return getBfcmCampaignState(nowMs);
}
