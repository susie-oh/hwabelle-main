import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  Shield,
  Clock,
  FileText,
  Save,
  Lock,
  ExternalLink,
  Loader2,
  Layers,
  Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORY_LABELS } from "@/components/community/CommunityCard";

export default function CommunityDetail() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [publication, setPublication] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("moderator");

  // Editable public copy state
  const [displayName, setDisplayName] = useState("");
  const [approvedSocialHandle, setApprovedSocialHandle] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("weddings");
  const [stage, setStage] = useState("finished");
  const [flowersUsed, setFlowersUsed] = useState("");
  const [editedStory, setEditedStory] = useState("");
  const [sourceType, setSourceType] = useState("customer_submission");
  const [relatedResourceSlug, setRelatedResourceSlug] = useState("");
  const [relatedProductUrl, setRelatedProductUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [videoCaptionProvided, setVideoCaptionProvided] = useState(false);

  // Media alt text / captions editing
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  // Moderation notes
  const [moderationNote, setModerationNote] = useState("");

  const loadDetail = async () => {
    if (!submissionId) return;
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No active session.");
      }

      const { data, error } = await supabase.functions.invoke("community-moderate", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: "get_detail",
          submission_id: submissionId,
        },
      });

      if (error) throw error;

      const sub = data?.submission;
      const pub = data?.publication;
      setSubmission(sub);
      setPublication(pub);
      setEvents(data?.events || []);
      setUserRole(data?.user_role || "moderator");

      // Initialize form with publication data if present, otherwise with submission data
      setDisplayName(pub?.public_display_name || sub?.first_name || "");
      setApprovedSocialHandle(pub?.approved_social_handle || (sub?.social_tag_permission ? sub?.social_handle : "") || "");
      setProjectTitle(pub?.project_title || sub?.project_title || "");
      setCategory(pub?.category || sub?.category || "weddings");
      setStage(pub?.stage || sub?.stage || "finished");
      setFlowersUsed(pub?.flowers_used || sub?.flowers_used || "");
      setEditedStory(pub?.edited_story || sub?.original_story || "");
      setSourceType(pub?.source_type || "customer_submission");
      setRelatedResourceSlug(pub?.related_resource_slug || "");
      setRelatedProductUrl(pub?.related_product_url || "");
      setSeoTitle(pub?.seo_title || "");
      setSeoDescription(pub?.seo_description || "");
      setVideoCaptionProvided(pub?.video_caption_provided || false);

      setMediaItems(pub?.community_publication_media || []);
    } catch (err: any) {
      console.error("Error loading community detail:", err);
      toast.error(err.message || "Failed to load submission.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [submissionId]);

  const callModerateAction = async (action: string, extraPayload: Record<string, any> = {}) => {
    setIsProcessing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) throw new Error("No active session.");

      const { data, error } = await supabase.functions.invoke("community-moderate", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action,
          submission_id: submissionId,
          publication_id: publication?.id,
          notes: moderationNote.trim() || undefined,
          ...extraPayload,
        },
      });

      if (error || !data?.success) {
        throw new Error(data?.error || error?.message || "Action failed.");
      }

      toast.success(`Action "${action}" completed successfully!`);
      setModerationNote("");
      await loadDetail();
    } catch (err: any) {
      console.error(`Error performing ${action}:`, err);
      toast.error(err.message || "Moderation action failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSavePublicCopy = async () => {
    await callModerateAction("edit_publication", {
      public_display_name: displayName,
      approved_social_handle: approvedSocialHandle || null,
      project_title: projectTitle,
      category,
      stage,
      flowers_used: flowersUsed || null,
      edited_story: editedStory,
      source_type: sourceType,
      related_resource_slug: relatedResourceSlug || null,
      related_product_url: relatedProductUrl || null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      video_caption_provided: videoCaptionProvided,
      media_items: mediaItems,
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
          Loading submission review...
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-sm text-destructive">Submission not found.</p>
          <Button asChild variant="outline">
            <Link to="/admin/community">Back to Queue</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const isAdmin = userRole === "admin";
  const hasVideo = submission.community_submission_media?.some((m: any) => m.media_type === "video");

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/community">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Queue
              </Link>
            </Button>
            <Badge variant="outline" className="text-xs uppercase">
              {submission.moderation_status}
            </Badge>
            {publication?.publication_status === "published" && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                Live in Gallery
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {publication?.slug && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/community/${publication.slug}`} target="_blank">
                  <Eye className="w-3.5 h-3.5 mr-1" /> Public Preview <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Two-panel Grid: Left = Original Submission (Immutable) | Right = Editable Public Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT PANEL: Original Submission (Source of Truth) */}
          <Card className="border-border">
            <CardHeader className="bg-secondary/40 border-b border-border p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Original Submission (Private)
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                  Immutable
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Submitted on {new Date(submission.created_at).toLocaleString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-5 text-xs">
              {/* Creator info */}
              <div className="bg-secondary/30 p-3.5 rounded-xl border border-border/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">First Name:</span>
                  <span className="font-semibold text-foreground">{submission.first_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Private Email:</span>
                  <span className="font-mono text-foreground">{submission.email}</span>
                </div>
                {submission.social_handle && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Social Handle:</span>
                    <span className="text-primary font-mono">{submission.social_handle}</span>
                  </div>
                )}
                {submission.order_reference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Order Reference:</span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 rounded">
                      {submission.order_reference}
                    </span>
                  </div>
                )}
              </div>

              {/* Consent records */}
              <div className="space-y-1.5 border border-border/60 p-3 rounded-xl">
                <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider mb-1">
                  Consent & Legal Audit
                </p>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Rights Confirmed:</span>
                  <span className={submission.rights_confirmed ? "text-emerald-600 font-bold" : "text-red-600"}>
                    {submission.rights_confirmed ? "Yes (✓)" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Feature Permission:</span>
                  <span className={submission.feature_permission ? "text-emerald-600 font-bold" : "text-red-600"}>
                    {submission.feature_permission ? "Granted (✓)" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Social Tag Permission:</span>
                  <span>{submission.social_tag_permission ? "Allowed (✓)" : "Declined"}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[10px] pt-1 border-t border-border/40">
                  <span>Consent Version:</span>
                  <span className="font-mono">{submission.consent_version}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[10px]">
                  <span>Consent Timestamp:</span>
                  <span className="font-mono">{new Date(submission.consent_timestamp).toISOString()}</span>
                </div>
              </div>

              {/* Original Story */}
              <div>
                <p className="font-semibold text-foreground mb-1">Original Story & Memory:</p>
                <div className="p-3 bg-secondary/50 rounded-xl border border-border/60 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {submission.original_story}
                </div>
              </div>

              {/* Uploaded Media Previews */}
              <div>
                <p className="font-semibold text-foreground mb-2">Original Uploaded Media:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(submission.community_submission_media || []).map((m: any, idx: number) => (
                    <div key={m.id || idx} className="border border-border rounded-lg overflow-hidden bg-black/5 aspect-square relative">
                      {m.media_type === "image" ? (
                        <img
                          src={m.preview_url}
                          alt={`Submission media ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-2 text-center">
                          <span className="text-[10px]">Video File</span>
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                        {(m.byte_size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT PANEL: Editable Public Copy (Moderator Workspace) */}
          <Card className="border-border">
            <CardHeader className="bg-secondary/40 border-b border-border p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Sanitized Public Publication Copy
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  Editable by Moderator
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Changes here are public-facing and do not overwrite the original submission.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Public Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="e.g. Eleanor W."
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">Approved Social Tag</label>
                  <Input
                    value={approvedSocialHandle}
                    onChange={(e) => setApprovedSocialHandle(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="@eleanor"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Public Project Title</label>
                <Input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground block mb-1">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
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
                  <label className="font-medium text-foreground block mb-1">Source Label Type</label>
                  <Select value={sourceType} onValueChange={setSourceType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer_submission">Customer Submission</SelectItem>
                      <SelectItem value="team_created">Created by Hwabelle Team</SelectItem>
                      <SelectItem value="inspiration">Inspiration Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Flowers Used</label>
                <Input
                  value={flowersUsed}
                  onChange={(e) => setFlowersUsed(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="e.g. Gardenia, White Rose, Baby's Breath"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Public Story</label>
                <Textarea
                  value={editedStory}
                  onChange={(e) => setEditedStory(e.target.value)}
                  rows={4}
                  className="text-xs"
                />
              </div>

              {/* Video Accessibility Notice & Caption requirement */}
              {hasVideo && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Video Accessibility Requirement
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Under WCAG 2.2 AA and Hwabelle policy, publication of video creations is strictly blocked until a caption or transcript is entered below.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Checkbox
                      id="videoCaption"
                      checked={videoCaptionProvided}
                      onCheckedChange={(c) => setVideoCaptionProvided(c === true)}
                    />
                    <label htmlFor="videoCaption" className="text-xs text-amber-950 font-medium cursor-pointer">
                      Verified: Captions / Transcript entered in media details
                    </label>
                  </div>
                </div>
              )}

              {/* SEO and Cross-linking */}
              <div className="pt-2 border-t border-border/60 space-y-3">
                <p className="font-semibold text-foreground">SEO & Cross-Linking</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">Related Guide Slug</label>
                    <Input
                      value={relatedResourceSlug}
                      onChange={(e) => setRelatedResourceSlug(e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder="e.g. flower-pressing-guide"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">SEO Title Override</label>
                    <Input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="h-8 text-xs"
                      placeholder="Custom <title> text"
                    />
                  </div>
                </div>
              </div>

              {/* Save Edits button */}
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSavePublicCopy}
                  disabled={isProcessing || !publication}
                  className="w-full gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Public Copy Edits
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Actions Workspace */}
        <Card className="border-primary/40 bg-background shadow-sm">
          <CardHeader className="bg-secondary/40 border-b border-border p-4">
            <CardTitle className="text-base font-serif">Moderator Actions</CardTitle>
            <CardDescription className="text-xs">
              Execute workflow state transitions. Every change is permanently recorded in the audit trail.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Moderation Notes / Reason:
              </label>
              <Input
                placeholder="Optional notes for this action (logged to audit trail)..."
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Approve */}
              <Button
                variant="default"
                size="sm"
                onClick={() => callModerateAction("approve")}
                disabled={isProcessing || submission.moderation_status === "approved" || submission.moderation_status === "published"}
                className="gap-1.5 bg-blue-700 hover:bg-blue-800"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Prepare Draft
              </Button>

              {/* Publish (Admin only) */}
              <Button
                variant="default"
                size="sm"
                onClick={() => callModerateAction("publish")}
                disabled={
                  isProcessing ||
                  !isAdmin ||
                  !publication ||
                  publication.publication_status === "published" ||
                  (hasVideo && !videoCaptionProvided)
                }
                className="gap-1.5 bg-emerald-700 hover:bg-emerald-800"
                title={!isAdmin ? "Requires Admin Role" : ""}
              >
                <Sparkles className="w-4 h-4" /> Publish to Live Gallery
              </Button>

              {/* Request Changes */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => callModerateAction("request_changes")}
                disabled={isProcessing}
                className="gap-1.5 border-orange-300 text-orange-800 hover:bg-orange-50"
              >
                <AlertTriangle className="w-4 h-4" /> Request Changes
              </Button>

              {/* Reject */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => callModerateAction("reject")}
                disabled={isProcessing || submission.moderation_status === "rejected"}
                className="gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject
              </Button>

              {/* Unpublish / Archive */}
              {publication?.publication_status === "published" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => callModerateAction("archive")}
                  disabled={isProcessing || !isAdmin}
                  className="gap-1.5 text-muted-foreground"
                >
                  Unpublish / Archive
                </Button>
              )}

              {/* Feature Toggle */}
              {publication?.publication_status === "published" && isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => callModerateAction(publication.featured ? "unfeature" : "feature")}
                  disabled={isProcessing}
                  className="gap-1.5"
                >
                  {publication.featured ? "Remove Featured" : "★ Mark as Featured"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader className="bg-secondary/40 border-b border-border p-4">
            <CardTitle className="text-sm font-serif">Audit Log & Event History</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-secondary/30 text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Transition</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No moderation events recorded yet.
                    </td>
                  </tr>
                ) : (
                  events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-secondary/20">
                      <td className="p-3 whitespace-nowrap text-muted-foreground">
                        {new Date(ev.created_at).toLocaleString()}
                      </td>
                      <td className="p-3 font-semibold text-foreground">{ev.action}</td>
                      <td className="p-3 text-muted-foreground">
                        {ev.previous_status ? `${ev.previous_status} → ${ev.new_status}` : ev.new_status || "—"}
                      </td>
                      <td className="p-3 text-muted-foreground">{ev.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
