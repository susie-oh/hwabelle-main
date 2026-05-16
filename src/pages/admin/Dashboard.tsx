import AdminLayout from "@/components/admin/AdminLayout";
import { AmazonOrdersCard } from "@/components/admin/AmazonOrdersCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package, DollarSign, Sparkles, FileText, Edit, HelpCircle, Mail,
  Key, ShoppingCart, ChevronRight, Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isAmazonOrder = (order: any) =>
  order?.stripe_session_id?.startsWith("amz_") || false;

const Dashboard = () => {
  // ── Orders & revenue stats ──────────────────────────────────────────────────
  const { data: orderStats } = useQuery({
    queryKey: ["admin-dashboard-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, status, total_amount, stripe_session_id, customer_email, order_number, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const website = data?.filter((o) => !isAmazonOrder(o)) || [];
      const amazon = data?.filter((o) => isAmazonOrder(o)) || [];
      const revenue = website.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      return {
        total: data?.length || 0,
        websiteCount: website.length,
        amazonCount: amazon.length,
        revenue,
        recent: (data || []).slice(0, 5),
      };
    },
  });

  // ── Entitlement stats ───────────────────────────────────────────────────────
  const { data: entitlementStats } = useQuery({
    queryKey: ["admin-dashboard-entitlements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entitlements")
        .select("status");

      if (error) throw error;

      const active = data?.filter((e) => e.status === "active").length || 0;
      return { total: data?.length || 0, active };
    },
  });

  // ── Blog stats ──────────────────────────────────────────────────────────────
  const { data: blogStats } = useQuery({
    queryKey: ["admin-dashboard-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, status");

      if (error) throw error;

      const published = data?.filter((p) => p.status === "published").length || 0;
      const drafts = data?.filter((p) => p.status === "draft").length || 0;
      return { total: data?.length || 0, published, drafts };
    },
  });

  // ── FAQ count ───────────────────────────────────────────────────────────────
  const { data: faqCount } = useQuery({
    queryKey: ["admin-dashboard-faqs"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("faqs")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-display mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Hwabelle admin panel</p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{orderStats?.total || 0}</p>
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
                  <p className="text-2xl font-bold">${((orderStats?.revenue || 0) / 100).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Website Revenue</p>
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
                  <p className="text-2xl font-bold">{entitlementStats?.active || 0}</p>
                  <p className="text-xs text-muted-foreground">Active AI Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <FileText size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{blogStats?.published || 0}</p>
                  <p className="text-xs text-muted-foreground">Published Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Actions ── */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:bg-secondary transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Package size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Manage Orders</p>
                  <p className="text-xs text-muted-foreground">View & fulfill orders</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/blog"
                className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:bg-secondary transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Edit size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Blog / SEO</p>
                  <p className="text-xs text-muted-foreground">Create AI-powered content</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/faqs"
                className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:bg-secondary transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <HelpCircle size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Manage FAQs</p>
                  <p className="text-xs text-muted-foreground">Edit questions & answers</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/admin/email"
                className="flex items-center gap-3 p-4 rounded-xl border border-divider hover:bg-secondary transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Email Campaigns</p>
                  <p className="text-xs text-muted-foreground">Send & schedule emails</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ── Recent Activity ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Recent Activity</CardTitle>
              <CardDescription>Latest orders and redemptions</CardDescription>
            </div>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            {!orderStats?.recent?.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {orderStats.recent.map((order: any) => {
                  const amazon = isAmazonOrder(order);
                  return (
                    <Link
                      key={order.id}
                      to={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-divider hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          amazon ? "bg-amber-500/10" : "bg-blue-500/10"
                        }`}>
                          {amazon
                            ? <Key size={14} className="text-amber-600" />
                            : <ShoppingCart size={14} className="text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {order.order_number || `HW-${order.id.substring(0, 8).toUpperCase()}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{order.customer_email || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {amazon ? (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                            Redeem
                          </Badge>
                        ) : (
                          <span className="text-sm font-medium">${((order.total_amount || 0) / 100).toFixed(2)}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Amazon Orders ── */}
        <AmazonOrdersCard />

        {/* ── Site Links ── */}
        <div className="flex gap-3">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye size={14} /> View Blog
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye size={14} /> View Site
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
