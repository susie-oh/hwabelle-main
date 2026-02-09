import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import BlogManager from "./pages/admin/BlogManager";
import FAQManager from "./pages/admin/FAQManager";
import EmailDashboard from "./pages/admin/EmailDashboard";
import EmailFunnelCreator from "./pages/admin/EmailFunnelCreator";
import EmailCampaignList from "./pages/admin/EmailCampaignList";
import EmailCampaignDetail from "./pages/admin/EmailCampaignDetail";
import EmailCampaignSetup from "./pages/admin/EmailCampaignSetup";
import EmailCompose from "./pages/admin/EmailCompose";
import EmailCustomers from "./pages/admin/EmailCustomers";
import EmailSettings from "./pages/admin/EmailSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/blog" element={<BlogManager />} />
            <Route path="/admin/faqs" element={<FAQManager />} />
            <Route path="/admin/email" element={<EmailDashboard />} />
            <Route path="/admin/email/funnel" element={<EmailFunnelCreator />} />
            <Route path="/admin/email/campaigns" element={<EmailCampaignList />} />
            <Route path="/admin/email/campaign/:id" element={<EmailCampaignDetail />} />
            <Route path="/admin/email/campaign/:id/setup" element={<EmailCampaignSetup />} />
            <Route path="/admin/email/compose" element={<EmailCompose />} />
            <Route path="/admin/email/customers" element={<EmailCustomers />} />
            <Route path="/admin/email/settings" element={<EmailSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
