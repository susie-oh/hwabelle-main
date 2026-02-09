import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useParams, Link } from "react-router-dom";
import { Loader2, BarChart3, Settings, Mail } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";

const EmailCampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign-detail", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("email_campaigns")
        .select("*, email_templates(*), campaign_schedules(*, email_templates(subject)), campaign_target_groups(*, customer_groups(name)), campaign_target_customers(*, customers(name, email))")
        .eq("id", id!)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user && !!id,
  });

  const { data: sendStats } = useQuery({
    queryKey: ["campaign-send-stats", id],
    queryFn: async () => {
      const templateIds = campaign?.email_templates?.map((t: any) => t.id) || [];
      if (!templateIds.length) return { total: 0, opened: 0, clicked: 0 };
      const { data } = await supabase.from("email_sends").select("*").in("template_id", templateIds);
      const sends = data || [];
      return {
        total: sends.length,
        opened: sends.filter((s: any) => s.opened).length,
        clicked: sends.filter((s: any) => s.clicked).length,
      };
    },
    enabled: !!campaign?.email_templates?.length,
  });

  if (isLoading) return <AdminLayout><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></AdminLayout>;
  if (!campaign) return <AdminLayout><div className="text-center py-12 text-muted-foreground">Campaign not found</div></AdminLayout>;

  const templates = campaign.email_templates || [];
  const schedules = campaign.campaign_schedules || [];
  const openRate = sendStats?.total ? ((sendStats.opened / sendStats.total) * 100).toFixed(1) : "0";
  const clickRate = sendStats?.total ? ((sendStats.clicked / sendStats.total) * 100).toFixed(1) : "0";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-display mb-1">{campaign.name}</h1>
            <div className="flex items-center gap-2">
              <Badge>{campaign.status}</Badge>
              <span className="text-sm text-muted-foreground">Created {format(new Date(campaign.created_at), "MMM d, yyyy")}</span>
            </div>
          </div>
          {campaign.status === "draft" && (
            <Button asChild><Link to={`/admin/email/campaign/${id}/setup`}>Setup Campaign</Link></Button>
          )}
        </div>

        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1" /> Analytics</TabsTrigger>
            <TabsTrigger value="emails"><Mail className="h-4 w-4 mr-1" /> Emails</TabsTrigger>
            {campaign.status === "draft" && <TabsTrigger value="setup"><Settings className="h-4 w-4 mr-1" /> Setup</TabsTrigger>}
          </TabsList>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Emails Sent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{sendStats?.total || 0}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Open Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{openRate}%</div><p className="text-xs text-muted-foreground">{sendStats?.opened || 0} opens</p></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Click Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{clickRate}%</div><p className="text-xs text-muted-foreground">{sendStats?.clicked || 0} clicks</p></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="emails" className="mt-4">
            <Accordion type="multiple" className="space-y-2">
              {templates.sort((a: any, b: any) => a.sequence_order - b.sequence_order).map((t: any) => {
                const schedule = schedules.find((s: any) => s.email_template_id === t.id);
                return (
                  <AccordionItem key={t.id} value={t.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{t.sequence_order}</Badge>
                        <span className="font-medium">{t.subject}</span>
                        {schedule && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {format(new Date(schedule.scheduled_at), "MMM d, h:mm a")} —
                            <Badge variant={schedule.dispatched ? "default" : "secondary"} className="ml-1">
                              {schedule.dispatched ? "Sent" : "Scheduled"}
                            </Badge>
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none p-4 bg-secondary/30 rounded-lg" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t.content) }} />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          {campaign.status === "draft" && (
            <TabsContent value="setup" className="mt-4">
              <Card><CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">Set up targeting and scheduling for this campaign</p>
                <Button asChild><Link to={`/admin/email/campaign/${id}/setup`}>Go to Setup Wizard</Link></Button>
              </CardContent></Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailCampaignDetail;
