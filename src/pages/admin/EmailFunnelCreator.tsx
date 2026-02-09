import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Sparkles, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

interface GeneratedEmail {
  sequence_order: number;
  subject: string;
  content: string;
}

const ageGroups = [
  "18-24 (Gen Z)", "25-34 (Millennials)", "35-44 (Gen X)",
  "45-54", "55-64", "65+ (Seniors)", "All Ages",
];

const EmailFunnelCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [embedLink, setEmbedLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [emails, setEmails] = useState<GeneratedEmail[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!purpose || !ageGroup) {
      toast({ title: "Error", description: "Purpose and age group are required", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-email-funnel", {
        body: { purpose, ageGroup, embedLink, feedback: feedback || undefined },
      });
      if (error) throw error;
      if (data?.emails) {
        setEmails(data.emails);
        setShowPreview(true);
        setCampaignName("");
        toast({ title: "Success", description: "5-email sequence generated!" });
      } else {
        throw new Error("No emails returned");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to generate", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!campaignName.trim()) {
      toast({ title: "Error", description: "Please enter a campaign name", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { data: campaign, error: cErr } = await supabase
        .from("email_campaigns")
        .insert({ name: campaignName, user_id: user!.id, status: "draft" })
        .select("id")
        .single();
      if (cErr) throw cErr;

      const templates = emails.map((e) => ({
        campaign_id: campaign.id,
        user_id: user!.id,
        sequence_order: e.sequence_order,
        subject: e.subject,
        content: e.content,
      }));
      const { error: tErr } = await supabase.from("email_templates").insert(templates);
      if (tErr) throw tErr;

      toast({ title: "Saved!", description: "Campaign created. Set up targeting and schedule next." });
      navigate(`/admin/email/campaign/${campaign.id}/setup`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="font-serif text-display mb-2">AI Email Funnel Creator</h1>
          <p className="text-muted-foreground">Generate a 5-email marketing sequence with AI</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Campaign Details</CardTitle>
            <CardDescription>Describe your campaign and AI will craft a 5-email funnel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Purpose *</Label>
              <Textarea placeholder="e.g., Promote our new fitness app..." value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Age Group *</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger>
                  <SelectContent>
                    {ageGroups.map((ag) => <SelectItem key={ag} value={ag}>{ag}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link to Embed (optional)</Label>
                <Input placeholder="https://your-link.com" value={embedLink} onChange={(e) => setEmbedLink(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
              {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-2" /> Generate 5-Email Sequence</>}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generated Email Sequence</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {emails.map((email) => (
                <Card key={email.sequence_order}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge>{email.sequence_order}</Badge>
                      <CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> {email.subject}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none border rounded-lg p-4 bg-secondary/30" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.content) }} />
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardHeader><CardTitle className="text-sm">Feedback & Regenerate</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Textarea placeholder="Provide feedback to improve..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} />
                  <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Regenerating...</> : "Regenerate with Feedback"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm">Save Campaign</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Campaign name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save & Setup Campaign"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EmailFunnelCreator;
