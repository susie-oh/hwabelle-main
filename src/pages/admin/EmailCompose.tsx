import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, CalendarIcon, X, Search } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

const timezones = [
  "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles", "America/Denver",
  "America/Chicago", "America/New_York", "America/Sao_Paulo", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore",
  "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney", "Pacific/Auckland",
];

const EmailCompose = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipientTab, setRecipientTab] = useState("individuals");
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleDate, setScheduleDate] = useState<Date>(addDays(new Date(), 1));
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [isSaving, setIsSaving] = useState(false);

  const { data: customers } = useQuery({
    queryKey: ["compose-customers", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("*").eq("user_id", user!.id).order("name");
      return data || [];
    },
    enabled: !!user,
  });

  const { data: groups } = useQuery({
    queryKey: ["compose-groups", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customer_groups").select("*, customer_group_memberships(id)").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const filteredCustomers = customers?.filter((c: any) =>
    (c.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomers = customers?.filter((c: any) => selectedCustomerIds.includes(c.id)) || [];

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({ title: "Error", description: "Subject and content are required", variant: "destructive" });
      return;
    }
    if (selectedCustomerIds.length === 0 && selectedGroupIds.length === 0) {
      toast({ title: "Error", description: "Select at least one recipient", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const campaignName = `Scheduled: ${subject.substring(0, 40)}`;
      const { data: campaign, error: cErr } = await supabase
        .from("email_campaigns")
        .insert({ name: campaignName, user_id: user!.id, status: "active" })
        .select("id")
        .single();
      if (cErr) throw cErr;

      const { data: template, error: tErr } = await supabase
        .from("email_templates")
        .insert({ campaign_id: campaign.id, user_id: user!.id, sequence_order: 1, subject, content })
        .select("id")
        .single();
      if (tErr) throw tErr;

      // Save targets
      if (selectedGroupIds.length > 0) {
        await supabase.from("campaign_target_groups").insert(
          selectedGroupIds.map((gid) => ({ campaign_id: campaign.id, group_id: gid }))
        );
      }
      if (selectedCustomerIds.length > 0) {
        await supabase.from("campaign_target_customers").insert(
          selectedCustomerIds.map((cid) => ({ campaign_id: campaign.id, customer_id: cid }))
        );
      }

      // Create schedule
      const scheduledAt = new Date(`${format(scheduleDate, "yyyy-MM-dd")}T${scheduleTime}:00`).toISOString();
      await supabase.from("campaign_schedules").insert({
        campaign_id: campaign.id,
        email_template_id: template.id,
        sequence_order: 1,
        scheduled_at: scheduledAt,
        timezone,
        approved: true,
      });

      toast({ title: "Email scheduled!" });
      navigate("/admin/email/campaigns");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="font-serif text-display">Schedule Email</h1>

        {/* Recipients */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recipients</CardTitle></CardHeader>
          <CardContent>
            {(selectedCustomers.length > 0 || selectedGroupIds.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCustomers.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="gap-1">
                    {c.name || c.email}
                    <button onClick={() => setSelectedCustomerIds(selectedCustomerIds.filter((x) => x !== c.id))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                {selectedGroupIds.map((gid) => {
                  const g = groups?.find((x: any) => x.id === gid);
                  return g ? (
                    <Badge key={gid} className="gap-1">
                      {g.name}
                      <button onClick={() => setSelectedGroupIds(selectedGroupIds.filter((x) => x !== gid))}><X className="h-3 w-3" /></button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            <Tabs value={recipientTab} onValueChange={setRecipientTab}>
              <TabsList><TabsTrigger value="individuals">Individuals</TabsTrigger><TabsTrigger value="groups">Groups</TabsTrigger></TabsList>
              <TabsContent value="individuals" className="mt-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name or email..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredCustomers?.map((c: any) => (
                    <div key={c.id} className="flex items-center space-x-2 p-2 rounded hover:bg-secondary">
                      <Checkbox checked={selectedCustomerIds.includes(c.id)} onCheckedChange={(ch) => setSelectedCustomerIds(ch ? [...selectedCustomerIds, c.id] : selectedCustomerIds.filter((x) => x !== c.id))} />
                      <span className="text-sm">{c.name || c.email} {c.name && <span className="text-muted-foreground">({c.email})</span>}</span>
                    </div>
                  ))}
                  {!filteredCustomers?.length && <p className="text-sm text-muted-foreground p-2">No customers found</p>}
                </div>
              </TabsContent>
              <TabsContent value="groups" className="mt-3 space-y-1">
                {groups?.map((g: any) => (
                  <div key={g.id} className="flex items-center space-x-2 p-2 rounded hover:bg-secondary">
                    <Checkbox checked={selectedGroupIds.includes(g.id)} onCheckedChange={(ch) => setSelectedGroupIds(ch ? [...selectedGroupIds, g.id] : selectedGroupIds.filter((x) => x !== g.id))} />
                    <span className="text-sm">{g.name} ({g.customer_group_memberships?.length || 0} members)</span>
                  </div>
                ))}
                {!groups?.length && <p className="text-sm text-muted-foreground p-2">No groups yet</p>}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader><CardTitle className="text-base">Email Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Email subject line" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Content (HTML supported)</Label>
              <Textarea placeholder="Write your email content..." rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader><CardTitle className="text-base">Schedule</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start")}><CalendarIcon className="mr-2 h-4 w-4" />{format(scheduleDate, "PPP")}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={scheduleDate} onSelect={(d) => d && setScheduleDate(d)} disabled={(d) => d < new Date()} /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSend} disabled={isSaving} size="lg" className="w-full">
          {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Scheduling...</> : "Schedule Email"}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default EmailCompose;
