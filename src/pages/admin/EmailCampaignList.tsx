import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Trash2, Pause, Play } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const statusColors: Record<string, string> = {
  draft: "secondary",
  active: "default",
  paused: "outline",
  completed: "default",
  sending: "destructive",
};

const EmailCampaignList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["email-campaigns", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("email_campaigns")
        .select("*, campaign_schedules(*), campaign_target_groups(*, customer_groups(name)), campaign_target_customers(*, customers(name, email))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("email_campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      toast({ title: "Campaign deleted" });
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "active" ? "paused" : "active";
      const { error } = await supabase.from("email_campaigns").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["email-campaigns"] }),
  });

  const computeStatus = (c: any) => {
    if (c.status === "draft") return "draft";
    const schedules = c.campaign_schedules || [];
    if (schedules.length === 0) return c.status;
    const allDispatched = schedules.every((s: any) => s.dispatched);
    if (allDispatched) return "completed";
    const now = new Date();
    const allPast = schedules.every((s: any) => new Date(s.scheduled_at) <= now);
    const someDispatched = schedules.some((s: any) => s.dispatched);
    if (allPast && someDispatched) return "sending";
    return c.status;
  };

  const filtered = campaigns?.filter((c: any) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    const computed = computeStatus(c);
    if (statusFilter !== "all" && computed !== statusFilter) return false;
    const isIndividual = c.name.startsWith("Scheduled:");
    if (typeFilter === "group" && isIndividual) return false;
    if (typeFilter === "individual" && !isIndividual) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-display">Campaigns</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/admin/email/compose">Schedule Email</Link></Button>
            <Button asChild><Link to="/admin/email/funnel">New Campaign</Link></Button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search campaigns..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="group">Group Campaigns</SelectItem>
              <SelectItem value="individual">Individual Emails</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : !filtered?.length ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No campaigns found</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((c: any) => {
              const status = computeStatus(c);
              return (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-4">
                    <Link to={`/admin/email/campaign/${c.id}`} className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium">{c.name}</h3>
                        <Badge variant={statusColors[status] as any || "secondary"}>{status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {format(new Date(c.created_at), "MMM d, yyyy")}
                        {c.campaign_target_groups?.length > 0 && (
                          <> • {c.campaign_target_groups.map((g: any) => g.customer_groups?.name).filter(Boolean).join(", ")}</>
                        )}
                      </p>
                    </Link>
                    <div className="flex items-center gap-1">
                      {(status === "active" || status === "paused") && (
                        <Button variant="ghost" size="icon" onClick={() => toggleStatus.mutate({ id: c.id, status })}>
                          {status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently delete the campaign and all related data.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMutation.mutate(c.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EmailCampaignList;
