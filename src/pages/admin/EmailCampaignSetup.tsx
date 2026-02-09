import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, CalendarIcon, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

const timezones = [
  "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles", "America/Denver",
  "America/Chicago", "America/New_York", "America/Sao_Paulo", "Europe/London",
  "Europe/Paris", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore",
  "Asia/Tokyo", "Asia/Shanghai", "Australia/Sydney", "Pacific/Auckland",
];

const EmailCampaignSetup = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [targetMode, setTargetMode] = useState("all");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState("daily");
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 1));
  const [defaultTime, setDefaultTime] = useState("09:00");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [customSchedules, setCustomSchedules] = useState<{ templateId: string; date: Date; time: string }[]>([]);

  const { data: campaign } = useQuery({
    queryKey: ["campaign-setup", id],
    queryFn: async () => {
      const { data } = await supabase.from("email_campaigns").select("*, email_templates(*)").eq("id", id!).eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user && !!id,
  });

  const { data: groups } = useQuery({
    queryKey: ["customer-groups-setup", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customer_groups").select("*, customer_group_memberships(id)").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: customers } = useQuery({
    queryKey: ["customers-setup", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("*").eq("user_id", user!.id).order("name");
      return data || [];
    },
    enabled: !!user,
  });

  const templates = (campaign?.email_templates || []).sort((a: any, b: any) => a.sequence_order - b.sequence_order);

  useEffect(() => {
    if (templates.length > 0 && customSchedules.length === 0) {
      setCustomSchedules(templates.map((t: any, i: number) => ({
        templateId: t.id,
        date: addDays(startDate, scheduleType === "daily" ? i : scheduleType === "every_other" ? i * 2 : i),
        time: defaultTime,
      })));
    }
  }, [templates.length]);

  useEffect(() => {
    if (templates.length > 0 && scheduleType !== "custom") {
      setCustomSchedules(templates.map((t: any, i: number) => ({
        templateId: t.id,
        date: addDays(startDate, scheduleType === "daily" ? i : i * 2),
        time: defaultTime,
      })));
    }
  }, [scheduleType, startDate, defaultTime]);

  const hasPastSchedule = customSchedules.some((s) => {
    const dt = new Date(`${format(s.date, "yyyy-MM-dd")}T${s.time}:00`);
    return dt <= new Date();
  });

  const launchMutation = useMutation({
    mutationFn: async () => {
      // Save targets
      if (targetMode === "groups") {
        const targets = selectedGroups.map((gid) => ({ campaign_id: id!, group_id: gid }));
        await supabase.from("campaign_target_groups").delete().eq("campaign_id", id!);
        if (targets.length) await supabase.from("campaign_target_groups").insert(targets);
      } else if (targetMode === "customers") {
        const targets = selectedCustomers.map((cid) => ({ campaign_id: id!, customer_id: cid }));
        await supabase.from("campaign_target_customers").delete().eq("campaign_id", id!);
        if (targets.length) await supabase.from("campaign_target_customers").insert(targets);
      }

      // Save schedules
      await supabase.from("campaign_schedules").delete().eq("campaign_id", id!);
      const scheduleInserts = customSchedules.map((s, i) => ({
        campaign_id: id!,
        email_template_id: s.templateId,
        sequence_order: i + 1,
        scheduled_at: new Date(`${format(s.date, "yyyy-MM-dd")}T${s.time}:00`).toISOString(),
        timezone,
        approved: true,
      }));
      const { error } = await supabase.from("campaign_schedules").insert(scheduleInserts);
      if (error) throw error;

      // Activate campaign
      await supabase.from("email_campaigns").update({ status: "active" }).eq("id", id!);
    },
    onSuccess: () => {
      toast({ title: "Campaign launched!" });
      navigate(`/admin/email/campaign/${id}`);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!campaign) return <AdminLayout><div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="font-serif text-display">Setup: {campaign.name}</h1>

        {/* Step indicators */}
        <div className="flex gap-4">
          <Badge variant={step >= 1 ? "default" : "secondary"}>1. Recipients</Badge>
          <Badge variant={step >= 2 ? "default" : "secondary"}>2. Schedule</Badge>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader><CardTitle>Select Recipients</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={targetMode} onValueChange={setTargetMode}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="all" /><Label htmlFor="all">All customers</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="groups" id="groups" /><Label htmlFor="groups">Specific groups</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="customers" id="customers" /><Label htmlFor="customers">Individual customers</Label></div>
              </RadioGroup>

              {targetMode === "groups" && (
                <div className="space-y-2 ml-6">
                  {groups?.map((g: any) => (
                    <div key={g.id} className="flex items-center space-x-2">
                      <Checkbox checked={selectedGroups.includes(g.id)} onCheckedChange={(c) => setSelectedGroups(c ? [...selectedGroups, g.id] : selectedGroups.filter((x) => x !== g.id))} />
                      <span>{g.name} ({g.customer_group_memberships?.length || 0} members)</span>
                    </div>
                  ))}
                  {!groups?.length && <p className="text-sm text-muted-foreground">No groups yet</p>}
                </div>
              )}

              {targetMode === "customers" && (
                <div className="space-y-2 ml-6 max-h-60 overflow-y-auto">
                  {customers?.map((c: any) => (
                    <div key={c.id} className="flex items-center space-x-2">
                      <Checkbox checked={selectedCustomers.includes(c.id)} onCheckedChange={(ch) => setSelectedCustomers(ch ? [...selectedCustomers, c.id] : selectedCustomers.filter((x) => x !== c.id))} />
                      <span>{c.name || c.email}</span>
                    </div>
                  ))}
                  {!customers?.length && <p className="text-sm text-muted-foreground">No customers yet</p>}
                </div>
              )}

              <Button onClick={() => setStep(2)}>Next: Schedule</Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader><CardTitle>Set Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={scheduleType} onValueChange={setScheduleType}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="daily" id="daily" /><Label htmlFor="daily">Daily</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="every_other" id="every_other" /><Label htmlFor="every_other">Every other day</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="custom" id="custom" /><Label htmlFor="custom">Custom</Label></div>
              </RadioGroup>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left")}><CalendarIcon className="mr-2 h-4 w-4" />{format(startDate, "PPP")}</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={startDate} onSelect={(d) => d && setStartDate(d)} disabled={(d) => d < new Date()} /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Default Time</Label>
                  <Input type="time" value={defaultTime} onChange={(e) => setDefaultTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              {/* Schedule Preview */}
              <div className="space-y-2">
                <Label>Email Schedule Preview</Label>
                {customSchedules.map((s, i) => {
                  const template = templates.find((t: any) => t.id === s.templateId);
                  return (
                    <div key={s.templateId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Badge variant="outline">{i + 1}</Badge>
                      <span className="flex-1 text-sm">{template?.subject}</span>
                      {scheduleType === "custom" ? (
                        <>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm"><CalendarIcon className="mr-1 h-3 w-3" />{format(s.date, "MMM d")}</Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar mode="single" selected={s.date} onSelect={(d) => {
                                if (d) {
                                  const updated = [...customSchedules];
                                  updated[i] = { ...updated[i], date: d };
                                  setCustomSchedules(updated);
                                }
                              }} />
                            </PopoverContent>
                          </Popover>
                          <Input type="time" value={s.time} onChange={(e) => {
                            const updated = [...customSchedules];
                            updated[i] = { ...updated[i], time: e.target.value };
                            setCustomSchedules(updated);
                          }} className="w-28" />
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">{format(s.date, "MMM d")} at {s.time}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasPastSchedule && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertTriangle className="h-4 w-4" /> Some scheduled times are in the past
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => launchMutation.mutate()} disabled={launchMutation.isPending || hasPastSchedule}>
                  {launchMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Launching...</> : "Launch Campaign"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmailCampaignSetup;
