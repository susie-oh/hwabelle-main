import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CommunityUploader,
  SelectedMediaFile,
} from "@/components/community/CommunityUploader";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function CommunitySubmit() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("weddings");
  const [stage, setStage] = useState("finished");
  const [flowersUsed, setFlowersUsed] = useState("");
  const [story, setStory] = useState("");
  const [orderReference, setOrderReference] = useState("");

  // Consents
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [featurePermission, setFeaturePermission] = useState(false);
  const [socialTagPermission, setSocialTagPermission] = useState(false);

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  // Media
  const [mediaFiles, setMediaFiles] = useState<SelectedMediaFile[]>([]);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const hasStartedRef = useRef(false);

  const handleFirstInteraction = () => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "community_submit_start");
      }
    }
  };

  const uploadFileToSignedUrl = async (
    file: File,
    signedUrl: string,
    fileId: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, uploadProgress: percent, uploadStatus: "uploading" }
                : f
            )
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, uploadProgress: 100, uploadStatus: "success" }
                : f
            )
          );
          resolve(true);
        } else {
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, uploadStatus: "error", errorMessage: "Upload failed" }
                : f
            )
          );
          resolve(false);
        }
      };

      xhr.onerror = () => {
        setMediaFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, uploadStatus: "error", errorMessage: "Network error" }
              : f
          )
        );
        resolve(false);
      };

      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client checks
    if (!firstName.trim()) return setErrorMessage("Please enter your name.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setErrorMessage("Please enter a valid email address.");
    }
    if (!projectTitle.trim()) return setErrorMessage("Please enter a project title.");
    if (!story.trim() || story.trim().length < 10) {
      return setErrorMessage("Please share a short story (at least 10 characters).");
    }
    if (!rightsConfirmed) {
      return setErrorMessage("You must confirm you hold the rights to this creation.");
    }
    if (!featurePermission) {
      return setErrorMessage("Permission to feature on Hwabelle is required.");
    }
    if (mediaFiles.length === 0) {
      return setErrorMessage("Please attach at least one photo or video.");
    }

    setIsSubmitting(true);

    try {
      // Step 1: Initialize submission on Edge Function
      const mediaSpecs = mediaFiles.map((m) => ({
        mime_type: m.file.type,
        byte_size: m.file.size,
      }));

      const { data: initData, error: initError } = await supabase.functions.invoke(
        "community-submit",
        {
          body: {
            action: "init",
            first_name: firstName.trim(),
            email: email.trim().toLowerCase(),
            social_handle: socialHandle.trim() || undefined,
            project_title: projectTitle.trim(),
            category,
            stage,
            flowers_used: flowersUsed.trim() || undefined,
            original_story: story.trim(),
            order_reference: orderReference.trim() || undefined,
            rights_confirmed: rightsConfirmed,
            feature_permission: featurePermission,
            social_tag_permission: socialTagPermission,
            honeypot,
            media_specs: mediaSpecs,
          },
        }
      );

      if (initError || !initData?.success) {
        throw new Error(initData?.error || initError?.message || "Failed to initialize submission.");
      }

      const { submission_id, upload_session_id, authorized_uploads } = initData;
      setSubmissionId(submission_id);

      // Step 2: Upload each media file directly to private Supabase Storage
      for (let i = 0; i < mediaFiles.length; i++) {
        const fileObj = mediaFiles[i];
        const authItem = authorized_uploads[i];
        if (!authItem?.signed_url) {
          throw new Error("Missing upload authorization from server.");
        }

        const ok = await uploadFileToSignedUrl(
          fileObj.file,
          authItem.signed_url,
          fileObj.id
        );
        if (!ok) {
          throw new Error(
            `Failed to upload "${fileObj.file.name}". Please check your connection and try again.`
          );
        }
      }

      // Step 3: Finalize submission
      const { data: finalData, error: finalError } = await supabase.functions.invoke(
        "community-submit",
        {
          body: {
            action: "finalize",
            submission_id,
            upload_session_id,
          },
        }
      );

      if (finalError || !finalData?.success) {
        throw new Error(finalData?.error || finalError?.message || "Failed to finalize submission.");
      }

      // Track completion
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "community_submit_complete", {
          category,
        });
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Share Your Creation | Hwabelle in Bloom Community"
        description="Submit your DIY pressed flower wedding bouquet, floral keepsake, or botanical craft project to be featured in the Hwabelle community gallery."
        path="/community/submit"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Community", path: "/community" },
            { name: "Share Creation", path: "/community/submit" },
          ]),
        ]}
      />

      <div className="container max-w-3xl py-12 md:py-20">
        {/* Success View */}
        {isSuccess ? (
          <div className="bg-background border border-border/80 rounded-3xl p-8 md:p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)] space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Submission Received
              </span>
              <h1 className="font-serif text-3xl font-normal text-foreground">
                Thank You, {firstName}!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your creation <strong>"{projectTitle}"</strong> has been safely uploaded and submitted for review.
              </p>
            </div>

            <div className="bg-secondary/60 rounded-2xl p-6 max-w-lg mx-auto text-left text-xs text-muted-foreground space-y-2 border border-border/60">
              <p className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" /> What happens next?
              </p>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>Our team reviews every submission to ensure beautiful presentation and quality.</li>
                <li>Once approved, your creation gets a permanent live feature URL in the gallery.</li>
                <li>We'll send an email to <strong>{email}</strong> the moment your flowers are in bloom!</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="default" asChild>
                <Link to="/community">Explore Community Gallery</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setMediaFiles([]);
                  setProjectTitle("");
                  setStory("");
                }}
              >
                Submit Another Creation
              </Button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <span className="caption">Hwabelle in Bloom</span>
              <h1 className="font-serif text-display md:text-display-lg text-foreground">
                Share Your Creation
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Whether it's a preserved wedding bouquet, a framed garden bloom, or your unboxing in progress — share your botanical story with our community.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-3 bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Submission error</p>
                  <p className="text-xs mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onChange={handleFirstInteraction}
              className="bg-background border border-border/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8"
            >
              {/* Honeypot anti-spam field */}
              <input
                type="text"
                name="user_note_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* 1. Creator Info */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center font-sans font-medium">
                    1
                  </span>
                  About You
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Eleanor"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="eleanor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={320}
                      required
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Private — used only to notify you when your creation goes live.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Instagram / Social Handle <span className="text-muted-foreground text-[10px]">(Optional)</span>
                    </label>
                    <Input
                      placeholder="@yourhandle"
                      value={socialHandle}
                      onChange={(e) => setSocialHandle(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Order / Reference # <span className="text-muted-foreground text-[10px]">(Optional)</span>
                    </label>
                    <Input
                      placeholder="e.g. HW-202609-AB12"
                      value={orderReference}
                      onChange={(e) => setOrderReference(e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Adds a "Made with Hwabelle" badge to your creation card.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Creation Details */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center font-sans font-medium">
                    2
                  </span>
                  Your Creation
                </h2>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Project Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Wedding Rose Keepsake Frame"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weddings">Weddings</SelectItem>
                        <SelectItem value="garden_flowers">Garden Flowers</SelectItem>
                        <SelectItem value="gifts_memorials">Gifts & Memorials</SelectItem>
                        <SelectItem value="before_after">Before & After</SelectItem>
                        <SelectItem value="finished_piece">Finished Piece</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="unboxing">Unboxing</SelectItem>
                        <SelectItem value="other">Other Craft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">
                      Stage of Process <span className="text-destructive">*</span>
                    </label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="finished">Finished Piece</SelectItem>
                        <SelectItem value="before_after">Before & After</SelectItem>
                        <SelectItem value="in_progress">In Progress / Layering</SelectItem>
                        <SelectItem value="unboxing">Unboxing the Kit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Flowers / Botanicals Used <span className="text-muted-foreground text-[10px]">(Optional)</span>
                  </label>
                  <Input
                    placeholder="e.g. White Roses, Lavender sprigs, Eucalyptus"
                    value={flowersUsed}
                    onChange={(e) => setFlowersUsed(e.target.value)}
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Your Story & Memory <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell us about these flowers. Where did they come from? How was your pressing experience? What advice would you give to other flower preservers?"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    required
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                    <span>Minimum 10 characters</span>
                    <span>{story.length} / 2000</span>
                  </div>
                </div>
              </div>

              {/* 3. Media Upload */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center font-sans font-medium">
                    3
                  </span>
                  Photos or Video <span className="text-destructive">*</span>
                </h2>
                <CommunityUploader
                  files={mediaFiles}
                  onChange={setMediaFiles}
                  disabled={isSubmitting}
                />
              </div>

              {/* 4. Permissions & Consent */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-secondary text-xs flex items-center justify-center font-sans font-medium">
                    4
                  </span>
                  Permissions & Rights
                </h2>

                <div className="space-y-3 bg-secondary/30 p-5 rounded-2xl border border-border/60">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="rights"
                      checked={rightsConfirmed}
                      onCheckedChange={(checked) => setRightsConfirmed(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="rights" className="text-xs text-foreground leading-relaxed cursor-pointer">
                      <strong>Rights Confirmation:</strong> I confirm that I own or hold all rights to the photos/videos and story submitted, and they do not violate any copyright or privacy rights. <span className="text-destructive">*</span>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="feature"
                      checked={featurePermission}
                      onCheckedChange={(checked) => setFeaturePermission(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="feature" className="text-xs text-foreground leading-relaxed cursor-pointer">
                      <strong>Feature Permission:</strong> I grant Hwabelle permission to feature this creation on the Hwabelle website, community gallery, and educational guides. <span className="text-destructive">*</span>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="socialTag"
                      checked={socialTagPermission}
                      onCheckedChange={(checked) => setSocialTagPermission(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="socialTag" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      <strong>Social Tagging (Optional):</strong> Hwabelle may mention my social handle when sharing this creation on Instagram or Pinterest.
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>
                    Your private email is never published. You can request changes or removal at any time by contacting support.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/community"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Gallery
                </Link>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading & Submitting...
                    </>
                  ) : (
                    <>
                      Submit My Creation <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
