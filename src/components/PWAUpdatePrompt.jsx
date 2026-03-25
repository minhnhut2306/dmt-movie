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

    // Khi user bấm "Cập nhật" → SW mới lên thay → reload
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    // User đồng ý → kích hoạt SW mới ngay
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    setNeedRefresh(false);
  };

  const handleDismiss = () => {
    // User không muốn cập nhật → ẩn banner, SW mới chờ đến lần mở app sau
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-sm mx-auto animate-slide-up">
      <div className="bg-[#1a1f2e] border border-sky-500/40 rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
            <RefreshCw size={17} className="text-sky-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Có bản cập nhật mới!</p>
            <p className="text-gray-400 text-xs mt-0.5">Cập nhật ngay hoặc để lần sau.</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            Cập nhật ngay
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-white/5 hover:bg-white/10 active:scale-95 text-gray-300 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            Để lần sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
