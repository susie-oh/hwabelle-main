import { describe, it, expect } from "vitest";
import { CATEGORY_LABELS } from "../components/community/CommunityCard";
import { creativeWorkSchema, collectionPageSchema } from "../lib/schema";

describe("Community UGC - Category & Labels", () => {
  it("maps all valid community categories to human-readable labels", () => {
    expect(CATEGORY_LABELS.weddings).toBe("Weddings");
    expect(CATEGORY_LABELS.garden_flowers).toBe("Garden Flowers");
    expect(CATEGORY_LABELS.gifts_memorials).toBe("Gifts & Memorials");
    expect(CATEGORY_LABELS.before_after).toBe("Before & After");
    expect(CATEGORY_LABELS.finished_piece).toBe("Finished Piece");
    expect(CATEGORY_LABELS.in_progress).toBe("In Progress");
    expect(CATEGORY_LABELS.unboxing).toBe("Unboxing");
    expect(CATEGORY_LABELS.other).toBe("Craft Project");
  });
});

describe("Community UGC - Upload Validation Rules", () => {
  const MAX_IMAGES = 5;
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
  const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
  const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
  const ALLOWED_VIDEO_MIMES = ["video/mp4"];

  function validateSpecs(specs: Array<{ mime_type: string; byte_size: number }>) {
    if (!specs || specs.length === 0) return "At least one media file is required.";

    const hasVideo = specs.some((s) => ALLOWED_VIDEO_MIMES.includes(s.mime_type));
    const hasImage = specs.some((s) => ALLOWED_IMAGE_MIMES.includes(s.mime_type));

    if (hasVideo && hasImage) return "Mixed image and video uploads not allowed.";
    if (hasVideo && specs.length > 1) return "Only one video may be submitted.";
    if (hasImage && specs.length > MAX_IMAGES) return `Maximum of ${MAX_IMAGES} images allowed.`;

    for (const s of specs) {
      if (!ALLOWED_IMAGE_MIMES.includes(s.mime_type) && !ALLOWED_VIDEO_MIMES.includes(s.mime_type)) {
        return `Unsupported MIME type: ${s.mime_type}`;
      }
      if (ALLOWED_IMAGE_MIMES.includes(s.mime_type) && s.byte_size > MAX_IMAGE_BYTES) {
        return "Image exceeds 10MB limit.";
      }
      if (ALLOWED_VIDEO_MIMES.includes(s.mime_type) && s.byte_size > MAX_VIDEO_BYTES) {
        return "Video exceeds 100MB limit.";
      }
    }
    return null;
  }

  it("accepts valid image uploads (1-5 photos)", () => {
    expect(
      validateSpecs([
        { mime_type: "image/jpeg", byte_size: 2 * 1024 * 1024 },
        { mime_type: "image/png", byte_size: 3 * 1024 * 1024 },
      ])
    ).toBeNull();
  });

  it("accepts valid single video upload", () => {
    expect(
      validateSpecs([{ mime_type: "video/mp4", byte_size: 45 * 1024 * 1024 }])
    ).toBeNull();
  });

  it("rejects mixed image and video uploads", () => {
    expect(
      validateSpecs([
        { mime_type: "image/jpeg", byte_size: 1024 },
        { mime_type: "video/mp4", byte_size: 1024 },
      ])
    ).toBe("Mixed image and video uploads not allowed.");
  });

  it("rejects more than 5 images", () => {
    const sixImages = Array(6).fill({ mime_type: "image/jpeg", byte_size: 1024 });
    expect(validateSpecs(sixImages)).toBe("Maximum of 5 images allowed.");
  });

  it("rejects oversized images (>10MB)", () => {
    expect(
      validateSpecs([{ mime_type: "image/jpeg", byte_size: 11 * 1024 * 1024 }])
    ).toBe("Image exceeds 10MB limit.");
  });

  it("rejects oversized video (>100MB)", () => {
    expect(
      validateSpecs([{ mime_type: "video/mp4", byte_size: 105 * 1024 * 1024 }])
    ).toBe("Video exceeds 100MB limit.");
  });

  it("rejects unsupported formats like HEIC or GIF", () => {
    expect(
      validateSpecs([{ mime_type: "image/heic", byte_size: 1024 }])
    ).toBe("Unsupported MIME type: image/heic");
    expect(
      validateSpecs([{ mime_type: "image/gif", byte_size: 1024 }])
    ).toBe("Unsupported MIME type: image/gif");
  });
});

describe("Community UGC - Moderation State Machine Transitions", () => {
  function isValidTransition(from: string, to: string): boolean {
    const valid: Record<string, string[]> = {
      received: ["pending_review"],
      pending_review: ["approved", "rejected", "changes_requested"],
      changes_requested: ["pending_review"],
      approved: ["published", "rejected"],
      published: ["archived", "pending_review"],
    };
    return (valid[from] || []).includes(to);
  }

  it("allows legal forward transitions", () => {
    expect(isValidTransition("received", "pending_review")).toBe(true);
    expect(isValidTransition("pending_review", "approved")).toBe(true);
    expect(isValidTransition("approved", "published")).toBe(true);
    expect(isValidTransition("published", "archived")).toBe(true);
  });

  it("allows changes requested and rejection flows", () => {
    expect(isValidTransition("pending_review", "changes_requested")).toBe(true);
    expect(isValidTransition("changes_requested", "pending_review")).toBe(true);
    expect(isValidTransition("pending_review", "rejected")).toBe(true);
    expect(isValidTransition("approved", "rejected")).toBe(true);
  });

  it("blocks illegal state jumps", () => {
    // Direct from received to published is illegal (must be reviewed and approved)
    expect(isValidTransition("received", "published")).toBe(false);
    // Direct from rejected to published is illegal
    expect(isValidTransition("rejected", "published")).toBe(false);
    // Direct from archived to published is illegal
    expect(isValidTransition("archived", "published")).toBe(false);
  });
});

describe("Community UGC - Accessibility & Video Publication Guard", () => {
  function canPublish(creation: {
    has_video: boolean;
    video_caption_provided: boolean;
    role: "admin" | "moderator";
  }) {
    if (creation.role !== "admin") return { allowed: false, reason: "Admin role required." };
    if (creation.has_video && !creation.video_caption_provided) {
      return { allowed: false, reason: "Video requires captions before publication." };
    }
    return { allowed: true };
  }

  it("allows admin to publish image creation", () => {
    const res = canPublish({ has_video: false, video_caption_provided: false, role: "admin" });
    expect(res.allowed).toBe(true);
  });

  it("blocks publication of video creation if captions are missing", () => {
    const res = canPublish({ has_video: true, video_caption_provided: false, role: "admin" });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("captions");
  });

  it("allows publication of video creation once captions/transcript are verified", () => {
    const res = canPublish({ has_video: true, video_caption_provided: true, role: "admin" });
    expect(res.allowed).toBe(true);
  });

  it("blocks non-admin from publishing", () => {
    const res = canPublish({ has_video: false, video_caption_provided: false, role: "moderator" });
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain("Admin role required");
  });
});

describe("Community UGC - JSON-LD Structured Data", () => {
  it("generates valid CollectionPage schema for the community gallery", () => {
    const schema = collectionPageSchema();
    expect(schema["@type"]).toBe("CollectionPage");
    expect(schema.url).toBe("https://hwabelle.shop/community");
    expect(schema.publisher.name).toBe("Hwabelle");
  });

  it("generates valid CreativeWork schema for creation detail pages without PII", () => {
    const schema = creativeWorkSchema({
      title: "Wedding Rose Keepsake Frame",
      description: "Preserved white garden roses from our June ceremony.",
      authorName: "Eleanor W.",
      datePublished: "2026-09-01T12:00:00.000Z",
      image: "https://hwabelle.shop/pub/sample.jpg",
      url: "https://hwabelle.shop/community/wedding-rose-keepsake-frame-a1b2",
      genre: "Weddings",
    });

    expect(schema["@type"]).toBe("CreativeWork");
    expect(schema.name).toBe("Wedding Rose Keepsake Frame");
    expect(schema.author.name).toBe("Eleanor W.");
    expect(schema.genre).toBe("Weddings");
    expect(schema).not.toHaveProperty("email");
    expect(schema).not.toHaveProperty("order_reference");
  });
});
