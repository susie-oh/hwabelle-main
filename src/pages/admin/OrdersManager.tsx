import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Package, Search, ChevronRight, ShoppingCart, Key,
  DollarSign, Sparkles, LayoutList,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderChannel = "all" | "website" | "amazon";

interface OrderRow {
  id: string;
  order_number: string | null;
  customer_email: string | null;
  total_amount: number;
  currency: string | null;
  status: string;
  created_at: string;
  stripe_session_id: string | null;
  user_id: string | null;
  mcf_order_id: string | null;
  items: any;
}

interface EntitlementRow {
  order_id: string;
  status: string;
  product_type: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isAmazonOrder = (order: OrderRow) =>
  order.stripe_session_id?.startsWith("amz_") || false;

const statusBadge = (status: string) => {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    pending:    { variant: "secondary" },
    paid:       { variant: "default", className: "bg-emerald-600 hover:bg-emerald-700" },
    processing: { variant: "default", className: "bg-blue-600 hover:bg-blue-700" },
    shipped:    { variant: "outline" },
    delivered:  { variant: "outline", className: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400" },
    cancelled:  { variant: "destructive" },
  };
  const cfg = map[status] || { variant: "outline" as const };
  return <Badge variant={cfg.variant} className={`capitalize ${cfg.className || ""}`}>{status}</Badge>;
};

const entitlementBadge = (status: string | undefined) => {
  if (!status) return <Badge variant="outline" className="text-muted-foreground">Unclaimed</Badge>;
  if (status === "active") return <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>;
  if (status === "expired") return <Badge variant="secondary">Expired</Badge>;
  return <Badge variant="outline" className="capitalize">{status}</Badge>;
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS: { key: OrderChannel; label: string; icon: React.ReactNode }[] = [
  { key: "all",     label: "All Orders",       icon: <LayoutList size={14} /> },
  { key: "website", label: "Website Orders",    icon: <ShoppingCart size={14} /> },
  { key: "amazon",  label: "Amazon Redeems",    icon: <Key size={14} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────
const OrdersManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [channel, setChannel] = useState<OrderChannel>("all");

  // Fetch all orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  // Fetch entitlements for access status
  const { data: entitlements } = useQuery({
    queryKey: ["admin-entitlements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entitlements")
        .select("order_id, status, product_type");
      if (error) throw error;
      return data as EntitlementRow[];
    },
  });

  // Build entitlement lookup by order_id
  const entitlementMap = useMemo(() => {
    const map = new Map<string, EntitlementRow>();
    entitlements?.forEach((e) => map.set(e.order_id, e));
    return map;
  }, [entitlements]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      // Channel filter
      if (channel === "website" && isAmazonOrder(order)) return false;
      if (channel === "amazon" && !isAmazonOrder(order)) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          (order.order_number?.toLowerCase() || "").includes(term) ||
          (order.customer_email?.toLowerCase() || "").includes(term) ||
          order.id.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [orders, channel, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    if (!orders) return { total: 0, websiteCount: 0, websiteRevenue: 0, amazonCount: 0, activeRedeems: 0 };
    const website = orders.filter((o) => !isAmazonOrder(o));
    const amazon = orders.filter((o) => isAmazonOrder(o));
    const activeRedeems = amazon.filter((o) => entitlementMap.get(o.id)?.status === "active").length;
    return {
      total: orders.length,
      websiteCount: website.length,
      websiteRevenue: website.reduce((sum, o) => sum + o.total_amount, 0),
      amazonCount: amazon.length,
      activeRedeems,
    };
  }, [orders, entitlementMap]);

  const isLoading = ordersLoading;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-display mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and manage purchases and AI Designer redemptions.</p>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(stats.websiteRevenue / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Website Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Key size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.amazonCount}</p>
                  <p className="text-xs text-muted-foreground">Amazon Redeems</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeRedeems}</p>
                  <p className="text-xs text-muted-foreground">Active AI Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Orders Table ── */}
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Browse purchases and redemptions across all channels.</CardDescription>

            {/* Channel Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setChannel(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      channel === tab.key
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.key !== "all" && (
                      <span className="ml-1 text-[10px] opacity-60">
                        ({tab.key === "website" ? stats.websiteCount : stats.amazonCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by order number or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium">No orders found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search query." : "When customers place orders, they will appear here."}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>{channel === "amazon" ? "Access" : "Amount"}</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const amazon = isAmazonOrder(order);
                      const ent = entitlementMap.get(order.id);
                      return (
                        <TableRow key={order.id}>
                          {/* Channel badge */}
                          <TableCell>
                            {amazon ? (
                              <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                                <Key size={10} />
                                Amazon
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1 border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400">
                                <ShoppingCart size={10} />
                                Website
                              </Badge>
                            )}
                          </TableCell>
                          {/* Order number */}
                          <TableCell className="font-medium font-mono text-xs">
                            {order.order_number || `HW-${order.id.substring(0, 8).toUpperCase()}`}
                          </TableCell>
                          {/* Date */}
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          {/* Customer */}
                          <TableCell className="text-sm">{order.customer_email || "—"}</TableCell>
                          {/* Amount or Access */}
                          <TableCell>
                            {amazon
                              ? entitlementBadge(ent?.status)
                              : <span className="font-medium">${(order.total_amount / 100).toFixed(2)}</span>
                            }
                          </TableCell>
                          {/* Status */}
                          <TableCell>{statusBadge(order.status)}</TableCell>
                          {/* Action */}
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/orders/${order.id}`}>
                                View <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrdersManager;
