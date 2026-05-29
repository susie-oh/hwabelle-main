import AdminLayout from "@/components/admin/AdminLayout";
import { AmazonOrdersCard } from "@/components/admin/AmazonOrdersCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package, DollarSign, Sparkles, FileText, Edit, HelpCircle, Mail,
  Key, ShoppingCart, ChevronRight, Eye, MessageCircle,
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

  // ── AI Designer usage analytics ───────────────────────────────────────────────
  const { data: aiUsage } = useQuery({
    queryKey: ["admin-dashboard-ai-usage"],
    queryFn: async () => {
      // 1. Fetch total counts
      const { count: sessionCount, error: sessionErr } = await supabase
        .from("ai_chat_sessions")
        .select("*", { count: "exact", head: true });
      if (sessionErr) throw sessionErr;

      const { count: messageCount, error: msgErr } = await supabase
        .from("ai_chat_messages")
        .select("*", { count: "exact", head: true });
      if (msgErr) throw msgErr;

      // 2. Fetch recent chat sessions
      const { data: recentSessions, error: recentErr } = await supabase
        .from("ai_chat_sessions")
        .select("id, title, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(5);
      if (recentErr) throw recentErr;

      // 3. Fetch message counts and user emails to match user_id
      const { data: allMessages, error: allMsgsErr } = await supabase
        .from("ai_chat_messages")
        .select("session_id");
      if (allMsgsErr) throw allMsgsErr;

      const { data: orders, error: ordersErr } = await supabase
        .from("orders")
        .select("user_id, customer_email")
        .not("user_id", "is", null);
      if (ordersErr) throw ordersErr;

      // Create maps
      const msgCountMap = new Map<string, number>();
      allMessages?.forEach((m) => {
        msgCountMap.set(m.session_id, (msgCountMap.get(m.session_id) || 0) + 1);
      });

      const userEmailMap = new Map<string, string>();
      orders?.forEach((o) => {
        if (o.user_id && o.customer_email) {
          userEmailMap.set(o.user_id, o.customer_email);
        }
      });

      const formattedSessions = recentSessions?.map((s) => ({
        id: s.id,
        title: s.title,
        created_at: s.created_at,
        email: userEmailMap.get(s.user_id) || "Unlinked User",
        messageCount: msgCountMap.get(s.id) || 0,
      })) || [];

      // Calculate unique users count
      const { data: uniqueUsersData } = await supabase
        .from("ai_chat_sessions")
        .select("user_id");
      const uniqueUsersCount = new Set(uniqueUsersData?.map(s => s.user_id)).size;

      return {
        totalSessions: sessionCount || 0,
        totalMessages: messageCount || 0,
        uniqueUsers: uniqueUsersCount || 0,
        recentSessions: formattedSessions,
      };
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

        {/* ── AI Designer Usage Analytics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Designer Stats Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                AI Designer Analytics
              </CardTitle>
              <CardDescription>Overview of client AI activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Conversations</span>
                <span className="text-lg font-bold">{aiUsage?.totalSessions || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Total Messages</span>
                <span className="text-lg font-bold">{aiUsage?.totalMessages || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-lg font-bold">{aiUsage?.uniqueUsers || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent AI Conversations List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <MessageCircle size={18} className="text-purple-600" />
                Recent Conversations
              </CardTitle>
              <CardDescription>Latest client planning sessions using the AI Floral Designer</CardDescription>
            </CardHeader>
            <CardContent>
              {!aiUsage?.recentSessions?.length ? (
                <p className="text-sm text-muted-foreground text-center py-6">No Designer activity recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {aiUsage.recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-divider bg-background/50 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle size={14} className="text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {session.title || "New Conversation"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{session.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-700 bg-purple-50/30">
                          {session.messageCount} messages
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
