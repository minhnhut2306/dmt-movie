import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Kiểm tra đã dismiss chưa (lưu 3 ngày)
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < 3 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Kiểm tra đã cài chưa
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // iOS không có beforeinstallprompt, hiện hướng dẫn thủ công
      setTimeout(() => setShowPrompt(true), 3000);
    } else {
      // Android/Desktop: lắng nghe sự kiện
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setShowPrompt(true), 3000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="glass-panel rounded-2xl shadow-cinema-lg p-4 flex items-center gap-3">
        <img
          src="/icon-192x192.png"
          alt="DMT Movie"
          className="w-12 h-12 rounded-xl flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="text-ink-primary font-semibold text-sm">Cài đặt DMT Movie</p>
          {isIOS ? (
            <p className="text-ink-muted text-xs mt-0.5 leading-relaxed">
              Nhấn <Share size={11} className="inline mb-0.5" /> rồi chọn{" "}
              <strong className="text-brand-hover">"Thêm vào màn hình chính"</strong>
            </p>
          ) : (
            <p className="text-ink-muted text-xs mt-0.5">
              Xem phim nhanh hơn, không cần mạng mạnh
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold px-3 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-cinema"
            >
              <Download size={14} />
              Tải về
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors duration-200 text-ink-muted hover:text-ink-primary cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
