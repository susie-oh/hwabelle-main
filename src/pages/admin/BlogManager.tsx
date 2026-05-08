import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Edit, Trash2, Sparkles, Eye, ChevronDown, ChevronUp, FileText, Search } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  seo_keywords: string[];
  long_tail_queries: string[];
  author_name: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const initialFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  meta_description: "",
  featured_image_url: "",
  seo_keywords: "",
  long_tail_queries: "",
  author_name: "",
  status: "draft" as "draft" | "published",
};

type PostFilter = "all" | "published" | "draft";

const BlogManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [aiTopic, setAiTopic] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [filter, setFilter] = useState<PostFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const publishedCount = posts?.filter(p => p.status === "published").length || 0;
  const draftCount = posts?.filter(p => p.status === "draft").length || 0;

  const filteredPosts = posts?.filter(post => {
    if (filter === "published" && post.status !== "published") return false;
    if (filter === "draft" && post.status !== "draft") return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return post.title.toLowerCase().includes(term) || post.slug.toLowerCase().includes(term);
    }
    return true;
  }) || [];

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        meta_description: data.meta_description,
        featured_image_url: data.featured_image_url || null,
        seo_keywords: data.seo_keywords.split(",").map(k => k.trim()).filter(Boolean),
        long_tail_queries: data.long_tail_queries.split(",").map(q => q.trim()).filter(Boolean),
        author_name: data.author_name || null,
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      };

      if (data.id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert(postData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Success", description: "Blog post saved successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Success", description: "Blog post deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPost(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content || "",
      excerpt: post.excerpt || "",
      meta_description: post.meta_description || "",
      featured_image_url: post.featured_image_url || "",
      seo_keywords: post.seo_keywords?.join(", ") || "",
      long_tail_queries: post.long_tail_queries?.join(", ") || "",
      author_name: post.author_name || "",
      status: post.status as "draft" | "published",
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug) {
      toast({ title: "Error", description: "Title and slug are required", variant: "destructive" });
      return;
    }
    saveMutation.mutate({ ...formData, id: editingPost?.id });
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) {
      toast({ title: "Error", description: "Please enter a topic", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog", {
        body: { topic: aiTopic, additionalContext: aiContext },
      });

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          excerpt: data.excerpt || "",
          meta_description: data.metaDescription || "",
          featured_image_url: "",
          seo_keywords: data.seoKeywords?.join(", ") || "",
          long_tail_queries: data.longTailQueries?.join(", ") || "",
          author_name: "",
          status: "draft",
        });
        setAiPanelOpen(false);
        setIsDialogOpen(true);
        toast({ title: "Success", description: "Blog post generated! Review and edit before publishing." });
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to generate blog post", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-display mb-2">Blog Manager</h1>
            <p className="text-muted-foreground">Create SEO-optimized content with AI assistance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAiPanelOpen(!aiPanelOpen)} className="gap-2">
              <Sparkles size={14} />
              AI Generate
              {aiPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* AI Generation Panel — collapsible */}
        {aiPanelOpen && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate SEO-optimized blog content using AI. The post will open in the editor for review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., How to press wedding flowers"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (optional)</Label>
                  <Input
                    id="context"
                    placeholder="e.g., Focus on beginners, include tips for roses"
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleGenerateAI} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Blog Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle>All Posts</CardTitle>
              <div className="flex items-center gap-2">
                {/* Filter tabs */}
                <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
                  {([
                    { key: "all" as PostFilter, label: "All", count: posts?.length || 0 },
                    { key: "published" as PostFilter, label: "Published", count: publishedCount },
                    { key: "draft" as PostFilter, label: "Drafts", count: draftCount },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        filter === tab.key
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                      <span className="text-[10px] opacity-60">({tab.count})</span>
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search posts..."
                    className="pl-8 h-9 w-48 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
                <h3 className="text-lg font-medium mb-1">No posts found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Create your first post to get started!"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 border border-divider rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium truncate">{post.title}</h3>
                        <Badge variant={post.status === "published" ? "default" : "secondary"} className="shrink-0">
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /{post.slug} • {format(new Date(post.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-3">
                      {post.status === "published" && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteMutation.mutate(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Post" : "New Post"}</DialogTitle>
              <DialogDescription>
                {editingPost ? "Update your blog post" : "Create a new blog post"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value)
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  rows={2}
                  placeholder="Brief preview for listings"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  rows={2}
                  placeholder="SEO description (max 160 chars)"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  rows={12}
                  placeholder="Write your blog post in Markdown..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo_keywords">SEO Keywords (comma-separated)</Label>
                  <Input
                    id="seo_keywords"
                    placeholder="flower pressing, botanical art, dried flowers"
                    value={formData.seo_keywords}
                    onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="long_tail_queries">Long-tail Queries (comma-separated)</Label>
                  <Input
                    id="long_tail_queries"
                    placeholder="how to press flowers at home"
                    value={formData.long_tail_queries}
                    onChange={(e) => setFormData({ ...formData, long_tail_queries: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <Input
                    id="featured_image_url"
                    placeholder="https://..."
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author_name">Author Name</Label>
                  <Input
                    id="author_name"
                    placeholder="Suzie Oh"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="status">Published</Label>
                <Switch
                  id="status"
                  checked={formData.status === "published"}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, status: checked ? "published" : "draft" })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Post"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BlogManager;
