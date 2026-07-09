import { useState, useEffect } from "react";
import { Download, X, Bell, Share2, Zap } from "lucide-react";

// Key để check đã hiện thông báo chưa
const FEATURE_NOTIF_KEY = "dmt_adskip_notif_shown";

const FeatureNotification = ({ onClose }) => (
  <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up max-w-lg mx-auto">
    <div className="glass-panel rounded-2xl shadow-cinema-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-subtle">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-sky-400" />
          <span className="text-ink-muted text-xs font-medium uppercase tracking-wider">
            Tính năng mới
          </span>
          <span className="bg-sky-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ĐANG PHÁT TRIỂN
            </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200 text-ink-muted hover:text-ink-primary cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
      <div className="flex items-start gap-3 p-4">
        <div className="w-11 h-11 rounded-xl flex-shrink-0 mt-0.5 bg-sky-500/15 flex items-center justify-center">
          <Zap size={22} className="text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-ink-primary font-semibold text-sm mb-1">
            Tự động bỏ qua quảng cáo!
          </p>
          <p className="text-ink-muted text-xs leading-relaxed">
            DMT Movie giờ tự động phát hiện và bỏ qua quảng cáo trong video, không cần bấm gì thêm.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const V2Notification = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showFeatureNotif, setShowFeatureNotif] = useState(false);

  useEffect(() => {
    // Hiện thông báo tính năng mới nếu chưa từng thấy
    const alreadyShown = localStorage.getItem(FEATURE_NOTIF_KEY);
    if (!alreadyShown) {
      setTimeout(() => setShowFeatureNotif(true), 1500);
    }
  }, []);

  const handleFeatureNotifClose = () => {
    setShowFeatureNotif(false);
    localStorage.setItem(FEATURE_NOTIF_KEY, "1");
  };

  useEffect(() => {
    // Nếu đã cài (standalone) → không hiện
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // iOS không có beforeinstallprompt → hiện hướng dẫn luôn
      setTimeout(() => setVisible(true), 2000);
    } else {
      // Android / Desktop
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTimeout(() => setVisible(true), 2000);
      };
      window.addEventListener("beforeinstallprompt", handler);

      // Khi đã cài xong thì ẩn
      window.addEventListener("appinstalled", () => setVisible(false));

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => setVisible(false);

  if (showFeatureNotif) {
    return <FeatureNotification onClose={handleFeatureNotifClose} />;
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up max-w-lg mx-auto">
      <div className="glass-panel rounded-2xl shadow-cinema-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-subtle">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-brand-hover" />
            <span className="text-ink-muted text-xs font-medium uppercase tracking-wider">
              Thông báo
            </span>
            <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ĐANG PHÁT TRIỂN
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200 text-ink-muted hover:text-ink-primary cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex items-start gap-3 p-4">
          <img
            src="/icon-192x192.png"
            alt="DMT Movie"
            className="w-11 h-11 rounded-xl flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <p className="text-ink-primary font-semibold text-sm mb-1">
              Đã có phiên bản dành cho điện thoại!
            </p>
            {isIOS ? (
              <p className="text-ink-muted text-xs leading-relaxed">
                Nhấn{" "}
                <Share2 size={11} className="inline mb-0.5 text-sky-400" />{" "}
                <span className="text-sky-400 font-medium">Chia sẻ</span> rồi chọn{" "}
                <span className="text-brand-hover font-medium">"Thêm vào màn hình chính"</span>{" "}
                để cài DMT Movie V1 lên điện thoại.
              </p>
            ) : (
              <p className="text-ink-muted text-xs leading-relaxed">
                Đã có phiên bản DMT Movie V1 dành cho điện thoại, chọn vào đây để tải về!
              </p>
            )}
          </div>
        </div>

        {/* Footer — chỉ hiện nút Tải về trên Android */}
        {!isIOS && deferredPrompt && (
          <div className="px-4 pb-4 flex justify-end">
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 bg-brand hover:bg-brand-hover active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 cursor-pointer shadow-cinema"
            >
              <Download size={15} />
              Tải về
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default V2Notification;
