import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, AlertCircle, Plus, Trash2 } from "lucide-react";

const EmailSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  // Sender Identity
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");

  const { data: identity, isLoading: identityLoading } = useQuery({
    queryKey: ["sender-identity", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("sender_identities").select("*").eq("user_id", user!.id).maybeSingle();
      if (data) { setFromName(data.from_name); setFromEmail(data.from_email); }
      return data;
    },
    enabled: !!user,
  });

  const saveIdentity = useMutation({
    mutationFn: async () => {
      const domain = fromEmail.split("@")[1];
      if (identity) {
        await supabase.from("sender_identities").update({ from_name: fromName, from_email: fromEmail, domain }).eq("id", identity.id);
      } else {
        await supabase.from("sender_identities").insert({ user_id: user!.id, from_name: fromName, from_email: fromEmail, domain });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sender-identity"] }); toast({ title: "Sender identity saved" }); },
  });

  // Suppressions
  const [suppressEmail, setSuppressEmail] = useState("");
  const [suppressReason, setSuppressReason] = useState("unsubscribe");

  const { data: suppressions } = useQuery({
    queryKey: ["suppressions", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("suppressions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const addSuppression = useMutation({
    mutationFn: async () => {
      await supabase.from("suppressions").insert({ user_id: user!.id, email: suppressEmail, reason: suppressReason });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["suppressions"] }); setSuppressEmail(""); toast({ title: "Added to suppression list" }); },
  });

  const removeSuppression = useMutation({
    mutationFn: async (id: string) => { await supabase.from("suppressions").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["suppressions"] }); toast({ title: "Removed" }); },
  });

  const domain = fromEmail.includes("@") ? fromEmail.split("@")[1] : null;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="font-serif text-display">Email Settings</h1>

        <Tabs defaultValue="sender">
          <TabsList><TabsTrigger value="sender">Sender Identity</TabsTrigger><TabsTrigger value="suppression">Suppression List</TabsTrigger></TabsList>

          <TabsContent value="sender" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>From Address</CardTitle>
                <CardDescription>Configure who emails appear to come from</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>From Name</Label><Input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your Company" /></div>
                  <div className="space-y-2"><Label>From Email</Label><Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} placeholder="hello@yourdomain.com" /></div>
                </div>
                <Button onClick={() => saveIdentity.mutate()} disabled={!fromName || !fromEmail}>
                  {identity ? "Update" : "Save"}
                </Button>
              </CardContent>
            </Card>

            {domain && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Domain Verification</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">Domain: <strong>{domain}</strong></p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">SPF:</span>
                    <Badge variant={identity?.spf_verified ? "default" : "secondary"}>{identity?.spf_verified ? "Verified" : "Not Verified"}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">DKIM:</span>
                    <Badge variant={identity?.dkim_verified ? "default" : "secondary"}>{identity?.dkim_verified ? "Verified" : "Not Verified"}</Badge>
                  </div>
                  {(!identity?.spf_verified || !identity?.dkim_verified) && (
                    <div className="flex items-center gap-2 p-3 bg-accent rounded text-sm">
                      <AlertCircle className="h-4 w-4" />
                      Domain verification requires DNS configuration. Contact support for setup.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="suppression" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle>Add to Suppression List</CardTitle></CardHeader>
              <CardContent className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Email</Label>
                  <Input value={suppressEmail} onChange={(e) => setSuppressEmail(e.target.value)} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={suppressReason} onValueChange={setSuppressReason}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unsubscribe">Unsubscribe</SelectItem>
                      <SelectItem value="bounce">Bounce</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => addSuppression.mutate()} disabled={!suppressEmail.includes("@")}><Plus className="h-4 w-4" /></Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                {!suppressions?.length ? (
                  <div className="py-8 text-center text-muted-foreground">No suppressed emails</div>
                ) : (
                  <div className="divide-y">
                    {suppressions.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium text-sm">{s.email}</p>
                          <p className="text-xs text-muted-foreground">{s.reason} • {new Date(s.created_at).toLocaleDateString()}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeSuppression.mutate(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailSettings;
