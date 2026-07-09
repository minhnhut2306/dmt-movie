import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

const PWAUpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (!isStandalone) return;

    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);

      const checkUpdate = () => {
        if (reg.waiting) setNeedRefresh(true);
      };
      checkUpdate();

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            setNeedRefresh(true);
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    setNeedRefresh(false);
  };

  const handleDismiss = () => setNeedRefresh(false);

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-sm mx-auto animate-slide-up">
      <div className="glass-panel rounded-2xl shadow-cinema-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
            <RefreshCw size={17} className="text-sky-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink-primary font-semibold text-sm">Có bản cập nhật mới!</p>
            <p className="text-ink-muted text-xs mt-0.5">Cập nhật ngay hoặc để lần sau.</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 text-ink-muted hover:text-ink-primary flex-shrink-0 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            Cập nhật ngay
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 text-ink-secondary text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 border border-subtle cursor-pointer"
          >
            Để lần sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
