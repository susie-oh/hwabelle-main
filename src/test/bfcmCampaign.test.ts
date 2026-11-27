import { describe, it, expect } from "vitest";
import {
  BFCM_CYBER_MONDAY_START_UTC_MS,
  BFCM_END_UTC_MS,
  computeCountdown,
  getBfcmCampaignState,
} from "@/lib/bfcmCampaign";

describe("BFCM 2026 Campaign & Pacific Time Countdown", () => {
  it("computes exact remaining days, hours, minutes, and seconds before Nov 30 11:59:59 p.m. PT", () => {
    // Sat Nov 28, 2026 00:00:00 PST = 2026-11-28T08:00:00.000Z -> 2d 23h 59m 59s left
    const satMidnightPst = Date.parse("2026-11-28T08:00:00.000Z");
    const parts = computeCountdown(satMidnightPst);
    expect(parts.expired).toBe(false);
    expect(parts.days).toBe(2);
    expect(parts.hours).toBe(23);
    expect(parts.minutes).toBe(59);
    expect(parts.seconds).toBe(59);
  });

  it("returns Black Friday Weekend copy prior to Cyber Monday midnight PT", () => {
    const sunEveningPst = Date.parse("2026-11-30T07:59:59.000Z"); // Sun Nov 29 11:59:59 p.m. PST
    const state = getBfcmCampaignState(sunEveningPst);
    expect(state.isActive).toBe(true);
    expect(state.phase).toBe("weekend");
    expect(state.isCyberMonday).toBe(false);
    expect(state.announcementDesktop).toBe(
      "Black Friday Weekend · 20% Off The Hwabelle Flower Press Kit · Ends Nov 30",
    );
    expect(state.heroHeadlineLines).toEqual(["Preserve The Flowers", "Keep The Story"]);
    expect(state.deadlineLine).toBe("Offer ends November 30 at 11:59 p.m. Pacific.");
  });

  it("switches automatically to Cyber Monday final-day copy on Mon Nov 30 00:00:00 PT", () => {
    const state = getBfcmCampaignState(BFCM_CYBER_MONDAY_START_UTC_MS);
    expect(state.isActive).toBe(true);
    expect(state.phase).toBe("cyber-monday");
    expect(state.isCyberMonday).toBe(true);
    expect(state.announcementDesktop).toBe(
      "Cyber Monday · 20% Off The Hwabelle Flower Press Kit · Ends Tonight",
    );
    expect(state.heroHeadlineLines).toEqual(["Last Day To Save 20%"]);
    expect(state.heroPrimaryCta).toBe("Shop Before The Offer Ends");
    expect(state.deadlineLine).toBe("Offer ends tonight at 11:59 p.m. Pacific.");
  });

  it("remains active right up to Nov 30 11:59:59 p.m. PT and automatically ends at Dec 1 12:00:00 a.m. PT", () => {
    const lastSecond = getBfcmCampaignState(BFCM_END_UTC_MS - 1000);
    expect(lastSecond.isActive).toBe(true);
    expect(lastSecond.countdown.expired).toBe(false);

    const decFirstMidnightPst = Date.parse("2026-12-01T08:00:00.000Z");
    const ended = getBfcmCampaignState(decFirstMidnightPst);
    expect(ended.isActive).toBe(false);
    expect(ended.phase).toBe("ended");
    expect(ended.countdown.expired).toBe(true);
  });
});
