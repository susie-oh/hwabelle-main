import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Check,
  Shield,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_LABELS } from "@/components/community/CommunityCard";

const STATUS_TABS = [
  { id: "all", label: "All Submissions" },
  { id: "pending_review", label: "Pending Review" },
  { id: "approved", label: "Approved" },
  { id: "published", label: "Published" },
  { id: "changes_requested", label: "Changes Requested" },
  { id: "rejected", label: "Rejected" },
  { id: "archived", label: "Archived" },
];

export default function CommunityQueue() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("pending_review");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    published: 0,
  });

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from("community_submissions")
        .select("moderation_status");

      if (data) {
        setStats({
          total: data.length,
          pending: data.filter((s) => s.moderation_status === "pending_review" || s.moderation_status === "received").length,
          approved: data.filter((s) => s.moderation_status === "approved").length,
          published: data.filter((s) => s.moderation_status === "published").length,
        });
      }
    } catch (e) {
      console.error("Error loading moderation stats:", e);
    }
  };

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No active session.");
      }

      const { data, error } = await supabase.functions.invoke("community-moderate", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          action: "get_queue",
          status: statusTab === "all" ? undefined : statusTab,
          category: categoryFilter === "all" ? undefined : categoryFilter,
          page: 1,
          limit: 50,
        },
      });

      if (error) throw error;

      setSubmissions(data?.submissions || []);
      setTotalCount(data?.total || 0);
    } catch (err) {
      console.error("Error loading community queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [statusTab, categoryFilter]);

  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.project_title?.toLowerCase().includes(q) ||
      sub.first_name?.toLowerCase().includes(q) ||
      sub.email?.toLowerCase().includes(q) ||
      sub.category?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
      case "received":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300 gap-1"><CheckCircle className="w-3 h-3" /> Approved</Badge>;
      case "published":
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300 gap-1"><Sparkles className="w-3 h-3" /> Published</Badge>;
      case "changes_requested":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-300 gap-1"><AlertTriangle className="w-3 h-3" /> Changes Req.</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      case "archived":
        return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-normal text-foreground">
              Hwabelle in Bloom Moderation
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review visitor submissions, edit sanitized public copy, approve, publish, and manage live creations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchStats();
                fetchQueue();
              }}
              className="gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button size="sm" asChild>
              <Link to="/community" target="_blank">
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Public Gallery
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Pending Review</p>
                <p className="text-2xl font-serif text-amber-700 font-normal mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500/20" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Approved Drafts</p>
                <p className="text-2xl font-serif text-blue-700 font-normal mt-1">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500/20" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Live Published</p>
                <p className="text-2xl font-serif text-emerald-700 font-normal mt-1">{stats.published}</p>
              </div>
              <Sparkles className="w-8 h-8 text-emerald-500/20" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Total Submissions</p>
                <p className="text-2xl font-serif text-foreground font-normal mt-1">{stats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground/20" />
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="bg-background rounded-xl border border-border p-4 space-y-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-border scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const active = statusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, creator, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="weddings">Weddings</SelectItem>
                  <SelectItem value="garden_flowers">Garden Flowers</SelectItem>
                  <SelectItem value="gifts_memorials">Gifts & Memorials</SelectItem>
                  <SelectItem value="before_after">Before & After</SelectItem>
                  <SelectItem value="finished_piece">Finished Piece</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="unboxing">Unboxing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">Creator Info (Private)</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Category & Stage</th>
                  <th className="p-4">Media</th>
                  <th className="p-4">Consents</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Loading submission queue...
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No submissions found in this status.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const mediaCount = sub.community_submission_media?.length || 0;
                    const hasVideo = sub.community_submission_media?.some(
                      (m: any) => m.media_type === "video"
                    );

                    return (
                      <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4 text-muted-foreground whitespace-nowrap">
                          {new Date(sub.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-foreground">{sub.first_name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[150px]">
                            {sub.email}
                          </p>
                          {sub.social_handle && (
                            <p className="text-[10px] text-primary">{sub.social_handle}</p>
                          )}
                        </td>

                        <td className="p-4 max-w-[200px]">
                          <p className="font-medium text-foreground truncate">{sub.project_title}</p>
                          {sub.flowers_used && (
                            <p className="text-[10px] text-muted-foreground italic truncate">
                              {sub.flowers_used}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-medium">{CATEGORY_LABELS[sub.category] || sub.category}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {sub.stage?.replace("_", " ")}
                          </p>
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-[11px]">
                            {hasVideo ? "1 Video" : `${mediaCount} ${mediaCount === 1 ? "Photo" : "Photos"}`}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span
                              title="Rights Confirmed"
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                sub.rights_confirmed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              ✓
                            </span>
                            <span
                              title="Feature Permission"
                              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                sub.feature_permission ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              ✓
                            </span>
                            {sub.social_tag_permission && (
                              <span
                                title="Social Tag Permission"
                                className="px-1 rounded bg-blue-50 text-blue-700 font-mono"
                              >
                                tag
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {getStatusBadge(sub.moderation_status)}
                        </td>

                        <td className="p-4 text-right whitespace-nowrap">
                          <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                            <Link to={`/admin/community/${sub.id}`}>
                              Review & Edit →
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
