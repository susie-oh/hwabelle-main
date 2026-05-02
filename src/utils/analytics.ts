export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!gaId) {
    console.warn("GA Measurement ID is missing. Google Analytics will not be initialized.");
    return;
  }

  // Prevent multiple injections
  if (document.getElementById("ga-script")) return;

  const script = document.createElement('script');
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  
  // Disable default page view to avoid double tracking since we handle it in AnalyticsTracker
  window.gtag('config', gaId, { send_page_view: false });
};
