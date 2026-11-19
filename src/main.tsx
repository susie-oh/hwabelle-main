import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auto-recover from stale deployment chunks when a new release is pushed
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

// Clear one-time pre-hydration recovery flag once the app bundle executes cleanly
try {
  sessionStorage.removeItem("hwb_cache_recovery");
} catch {
  // Ignore storage restrictions
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
