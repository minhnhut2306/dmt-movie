import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";

const PWAUpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

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

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] max-w-sm mx-auto animate-slide-up">
      <div className="bg-[#1a1f2e] border border-sky-500/40 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
          <RefreshCw size={17} className="text-sky-400 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Có bản cập nhật mới!</p>
          <p className="text-gray-400 text-xs mt-0.5">Nhấn cập nhật để dùng phiên bản mới nhất.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleUpdate}
            className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            Cập nhật
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;
