import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FallingPetals from "@/components/animations/FallingPetals";
import ScrollFlowerBurst from "@/components/animations/ScrollFlowerBurst";
import CookieConsent from "../CookieConsent";
import { useBfcmCampaign } from "@/lib/bfcmCampaign";

interface LayoutProps {
  children: ReactNode;
  showPetals?: boolean;
}

const Layout = ({ children, showPetals = true }: LayoutProps) => {
  const { isActive: isBfcmActive } = useBfcmCampaign();

  return (
    <div className="min-h-screen flex flex-col relative">
      <FallingPetals enabled={showPetals} />
      <ScrollFlowerBurst />
      <Header />
      <main
        className={`flex-1 relative z-10 ${
          isBfcmActive ? "pt-[6.75rem] md:pt-[7.5rem]" : "pt-[4.5rem] md:pt-[5.25rem]"
        }`}
      >
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;
