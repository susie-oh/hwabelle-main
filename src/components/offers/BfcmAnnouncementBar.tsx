import { Link, useLocation } from "react-router-dom";
import { PRODUCT_PATH } from "@/lib/site";
import { useBfcmCampaign } from "@/lib/bfcmCampaign";
import BfcmCountdown from "./BfcmCountdown";

export const BfcmAnnouncementBar = () => {
  const location = useLocation();
  const campaign = useBfcmCampaign();

  // Do not display promotional bar on admin routes or once campaign has ended
  if (!campaign.isActive || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      to={PRODUCT_PATH}
      data-testid="bfcm-announcement-bar"
      className="block w-full bg-[#141414] text-[#FAF9F5] hover:bg-[#2F3E32] transition-colors border-b border-white/10"
    >
      <div className="container py-2 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="hidden md:inline text-xs sm:text-[13px] tracking-[0.04em] leading-snug">
          {campaign.announcementDesktop}
        </span>
        <span className="md:hidden text-xs tracking-[0.03em] leading-snug">
          {campaign.announcementMobile}
        </span>
        <BfcmCountdown countdown={campaign.countdown} variant="inline" />
      </div>
    </Link>
  );
};

export default BfcmAnnouncementBar;
