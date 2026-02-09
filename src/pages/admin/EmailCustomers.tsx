import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, Upload, X } from "lucide-react";

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#a855f7"];

const EmailCustomers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupColor, setGroupColor] = useState(COLORS[0]);
  const [viewGroup, setViewGroup] = useState<any>(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importGroupId, setImportGroupId] = useState("");

  const { data: customers } = useQuery({
    queryKey: ["email-customers", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customers").select("*, customer_group_memberships(*, customer_groups(id, name, color))").eq("user_id", user!.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: groups } = useQuery({
    queryKey: ["email-groups", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("customer_groups").select("*, customer_group_memberships(id, customer_id, customers(name, email))").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const addCustomer = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("customers").insert({ user_id: user!.id, email: newEmail, name: newName || null });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-customers"] }); setNewEmail(""); setNewName(""); setShowAddCustomer(false); toast({ title: "Customer added" }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => { await supabase.from("customers").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-customers"] }); toast({ title: "Customer removed" }); },
  });

  const saveGroup = useMutation({
    mutationFn: async () => {
      if (editGroup) {
        await supabase.from("customer_groups").update({ name: groupName, description: groupDesc, color: groupColor }).eq("id", editGroup.id);
      } else {
        await supabase.from("customer_groups").insert({ user_id: user!.id, name: groupName, description: groupDesc, color: groupColor });
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-groups"] }); setShowGroupDialog(false); setEditGroup(null); toast({ title: "Group saved" }); },
  });

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => { await supabase.from("customer_groups").delete().eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-groups"] }); toast({ title: "Group deleted" }); },
  });

  const removeMember = useMutation({
    mutationFn: async ({ customerId, groupId }: { customerId: string; groupId: string }) => {
      await supabase.from("customer_group_memberships").delete().eq("customer_id", customerId).eq("group_id", groupId);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["email-groups"] }); qc.invalidateQueries({ queryKey: ["email-customers"] }); },
  });

  const handleImport = async () => {
    const emails = importText.split(/[,\n]+/).map((e) => e.trim().toLowerCase()).filter((e) => e && e.includes("@"));
    if (!emails.length) { toast({ title: "No valid emails found", variant: "destructive" }); return; }

    const existing = customers?.map((c: any) => c.email.toLowerCase()) || [];
    const newEmails = emails.filter((e) => !existing.includes(e));

    if (newEmails.length > 0) {
      const inserts = newEmails.map((email) => ({ user_id: user!.id, email }));
      await supabase.from("customers").insert(inserts);
    }

    if (importGroupId) {
      const { data: allCustomers } = await supabase.from("customers").select("id, email").eq("user_id", user!.id).in("email", emails);
      if (allCustomers?.length) {
        const memberships = allCustomers.map((c) => ({ customer_id: c.id, group_id: importGroupId }));
        await supabase.from("customer_group_memberships").upsert(memberships, { onConflict: "customer_id,group_id" });
      }
    }

    qc.invalidateQueries({ queryKey: ["email-customers"] });
    qc.invalidateQueries({ queryKey: ["email-groups"] });
    toast({ title: `Imported ${newEmails.length} new contacts (${emails.length - newEmails.length} duplicates skipped)` });
    setShowImport(false);
    setImportText("");
  };

  const openEditGroup = (g?: any) => {
    setEditGroup(g || null);
    setGroupName(g?.name || "");
    setGroupDesc(g?.description || "");
    setGroupColor(g?.color || COLORS[0]);
    setShowGroupDialog(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-display">Customers</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImport(true)}><Upload className="h-4 w-4 mr-2" />Import</Button>
            <Button onClick={() => setShowAddCustomer(true)}><Plus className="h-4 w-4 mr-2" />Add Customer</Button>
          </div>
        </div>

        <Tabs defaultValue="contacts">
          <TabsList><TabsTrigger value="contacts">Contacts</TabsTrigger><TabsTrigger value="groups">Groups</TabsTrigger></TabsList>

          <TabsContent value="contacts" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {!customers?.length ? (
                  <div className="py-12 text-center text-muted-foreground">No customers yet</div>
                ) : (
                  <div className="divide-y">
                    {customers.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{c.name || c.email}</p>
                          {c.name && <p className="text-sm text-muted-foreground">{c.email}</p>}
                          <div className="flex gap-1 mt-1">
                            {c.customer_group_memberships?.map((m: any) => (
                              <Badge key={m.id} style={{ backgroundColor: m.customer_groups?.color }} className="text-white text-xs">{m.customer_groups?.name}</Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteCustomer.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openEditGroup()}><Plus className="h-4 w-4 mr-2" />New Group</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups?.map((g: any) => (
                <Card key={g.id} className="border-l-4" style={{ borderLeftColor: g.color }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{g.name}</CardTitle>
                      <Badge variant="secondary">{g.customer_group_memberships?.length || 0}</Badge>
                    </div>
                    {g.description && <p className="text-sm text-muted-foreground">{g.description}</p>}
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setViewGroup(g)}><Users className="h-3 w-3 mr-1" />Members</Button>
                    <Button variant="outline" size="sm" onClick={() => openEditGroup(g)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteGroup.mutate(g.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </CardContent>
                </Card>
              ))}
              {!groups?.length && <p className="text-muted-foreground col-span-full text-center py-8">No groups yet</p>}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Customer Dialog */}
        <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Customer</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Email *</Label><Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@example.com" /></div>
              <div className="space-y-2"><Label>Name</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddCustomer(false)}>Cancel</Button>
              <Button onClick={() => addCustomer.mutate()} disabled={!newEmail.includes("@")}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Group Dialog */}
        <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editGroup ? "Edit Group" : "New Group"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={groupName} onChange={(e) => setGroupName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setGroupColor(c)} className={`w-8 h-8 rounded-full border-2 ${groupColor === c ? "border-foreground" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowGroupDialog(false)}>Cancel</Button>
              <Button onClick={() => saveGroup.mutate()} disabled={!groupName.trim()}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Group Members Sheet */}
        <Sheet open={!!viewGroup} onOpenChange={() => setViewGroup(null)}>
          <SheetContent>
            <SheetHeader><SheetTitle>{viewGroup?.name} Members</SheetTitle></SheetHeader>
            <div className="mt-4 space-y-2">
              {viewGroup?.customer_group_memberships?.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">{m.customers?.name || m.customers?.email}</p>
                    {m.customers?.name && <p className="text-xs text-muted-foreground">{m.customers?.email}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeMember.mutate({ customerId: m.customer_id, groupId: viewGroup.id })}><X className="h-3 w-3" /></Button>
                </div>
              ))}
              {!viewGroup?.customer_group_memberships?.length && <p className="text-sm text-muted-foreground">No members</p>}
            </div>
          </SheetContent>
        </Sheet>

        {/* Import Dialog */}
        <Dialog open={showImport} onOpenChange={setShowImport}>
          <DialogContent>
            <DialogHeader><DialogTitle>Import Contacts</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Paste emails (comma or newline separated)</Label>
                <Textarea rows={6} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="email1@example.com, email2@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Add to group (optional)</Label>
                <select className="w-full border rounded p-2 text-sm" value={importGroupId} onChange={(e) => setImportGroupId(e.target.value)}>
                  <option value="">No group</option>
                  {groups?.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
              <Button onClick={handleImport}>Import</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EmailCustomers;
