import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import { initGA } from "./utils/analytics";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ResourcesHub from "./pages/ResourcesHub";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import FreeGuideLandingPage from "./pages/FreeGuideLandingPage";
import { FreeResourceOffer } from "./components/resources/FreeResourceOffer";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DataProtection from "./pages/DataProtection";
import NotFound from "./pages/NotFound";
import Designer from "./pages/Designer";
import FlowerQuizPage from "./pages/FlowerQuiz";
import FlowerQuizResult from "./pages/FlowerQuizResult";
import DesignerChat from "./pages/DesignerChat";
// DesignerTestFlow archived — route removed for production security
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import UnlockPage from "./pages/Unlock";
import ClaimSuccess from "./pages/ClaimSuccess";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import OrdersManager from "./pages/admin/OrdersManager";
import OrderDetail from "./pages/admin/OrderDetail";
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
import CommunityHub from "./pages/CommunityHub";
import CommunityCreation from "./pages/CommunityCreation";
import CommunitySubmit from "./pages/CommunitySubmit";
import CommunityQueue from "./pages/admin/CommunityQueue";
import CommunityDetail from "./pages/admin/CommunityDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize Google Analytics
initGA();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CartDrawer />
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsTracker />
            <FreeResourceOffer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<ResourcesHub />} />
              <Route path="/resources/:slug" element={<ResourceDetailPage />} />
              <Route path="/free-flower-pressing-guide" element={<FreeGuideLandingPage />} />
              <Route path="/community" element={<CommunityHub />} />
              <Route path="/community/submit" element={<CommunitySubmit />} />
              <Route path="/community/:slug" element={<CommunityCreation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/flower-quiz" element={<FlowerQuizPage />} />
              <Route path="/flower-quiz/result/:slug" element={<FlowerQuizResult />} />
              <Route path="/designer" element={<Designer />} />
              {/* /designer-test route removed — see src/pages/_archive/DesignerTestFlow.tsx */}
              <Route path="/designer-chat" element={<DesignerChat />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/data-protection" element={<DataProtection />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Account />} />
              <Route path="/my-orders" element={<Navigate to="/account" replace />} />
              <Route path="/unlock" element={<UnlockPage />} />
              <Route path="/claim-success" element={<ClaimSuccess />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/community" element={<CommunityQueue />} />
              <Route path="/admin/community/:submissionId" element={<CommunityDetail />} />
              <Route path="/admin/orders" element={<OrdersManager />} />
              <Route path="/admin/orders/:id" element={<OrderDetail />} />
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
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
