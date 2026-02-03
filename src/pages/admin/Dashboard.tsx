import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HelpCircle, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: blogStats } = useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id, status");
      
      if (error) throw error;
      
      const published = posts?.filter(p => p.status === "published").length || 0;
      const drafts = posts?.filter(p => p.status === "draft").length || 0;
      
      return { total: posts?.length || 0, published, drafts };
    },
  });

  const { data: faqCount } = useQuery({
    queryKey: ["admin-faq-count"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {blogStats?.published || 0} published, {blogStats?.drafts || 0} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">FAQs</CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faqCount || 0}</div>
              <p className="text-xs text-muted-foreground">Active questions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                to="/admin/blog" 
                className="flex items-center gap-3 p-3 rounded-lg border border-divider hover:bg-secondary transition-colors"
              >
                <Edit className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Create Blog Post</p>
                  <p className="text-sm text-muted-foreground">Write a new article with AI assistance</p>
                </div>
              </Link>
              <Link 
                to="/admin/faqs" 
                className="flex items-center gap-3 p-3 rounded-lg border border-divider hover:bg-secondary transition-colors"
              >
                <HelpCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage FAQs</p>
                  <p className="text-sm text-muted-foreground">Add or edit frequently asked questions</p>
                </div>
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center gap-3 p-3 rounded-lg border border-divider hover:bg-secondary transition-colors"
              >
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Blog</p>
                  <p className="text-sm text-muted-foreground">See how your posts look to visitors</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
