import { useState, useEffect, useRef } from "react";
import { Bell, Download, Share2, X, Smartphone, Sparkles, ExternalLink } from "lucide-react";
import { LATEST_VERSION } from "../config/appVersion";

const READ_KEY = "dmt-notif-read";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [readSet, setReadSet] = useState(new Set());
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    try {
      const saved = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
      setReadSet(new Set(saved));
    } catch { /* empty */ }

    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setOpen(false));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const notifications = [
    { id: "auto-skip-ads" },
    ...(!isStandalone ? [{ id: "pwa-install" }] : []),
    ...(!isStandalone ? [{ id: "v2-release" }] : []),
  ];

  const unreadCount = notifications.filter((n) => !readSet.has(n.id)).length;

  const handleOpen = () => {
    setOpen((p) => !p);
    if (!open) {
      const ids = notifications.map((n) => n.id);
      const next = new Set(ids);
      setReadSet(next);
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setOpen(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell icon */}
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer"
        aria-label="Thông báo"
      >
        <Bell size={19} className={open ? "text-brand-hover" : "text-ink-secondary"} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown — fixed góc phải, co theo màn hình mobile */}
      {open && (
        <div
          className="fixed right-2 top-12 sm:top-14 lg:top-[72px] z-[999] animate-slide-up"
          style={{ width: "min(340px, calc(100vw - 16px))" }}
        >
          <div className="glass-panel rounded-2xl shadow-cinema-lg overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-subtle">
              <div className="flex items-center gap-1.5">
                <Bell size={13} className="text-brand-hover" />
                <span className="text-ink-primary text-sm font-semibold">Thông báo</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200 text-ink-muted hover:text-ink-primary cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Danh sách thông báo */}
            <div className="divide-y divide-white/5">
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell size={28} className="text-ink-muted mb-2" />
                  <p className="text-ink-muted text-xs">Hiện tại chưa có thông báo nào.</p>
                </div>
              )}

              {/* 1. Auto skip ads */}
              <div className="p-3">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={15} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-ink-primary font-semibold text-xs">Tự động bỏ qua quảng cáo!</p>
                      <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">MỚI</span>
                    </div>
                    <p className="text-ink-muted text-[11px] leading-relaxed">
                      DMT Movie giờ tự động phát hiện và bỏ qua quảng cáo trong video, không cần bấm gì thêm.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. PWA Install — hiện nếu chưa cài */}
              {!isStandalone && (
                <div className="p-3">
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Smartphone size={15} className="text-sky-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-ink-primary font-semibold text-xs">Đã có ứng dụng cho điện thoại!</p>
                      </div>
                      <p className="text-ink-muted text-[11px] leading-relaxed mb-2">
                        Cài DMT Movie lên điện thoại để xem phim nhanh hơn, không cần mở trình duyệt.
                      </p>

                      {/* Nút cài — Android cài thẳng, iOS hiện popup */}
                      <button
                        onClick={isIOS ? () => setShowIOSGuide(true) : handleInstall}
                        className="w-full flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-[11px] font-semibold px-3 py-2 rounded-full transition-all duration-200 cursor-pointer"
                      >
                        <Download size={12} />
                        Ấn vào đây để cài đặt
                      </button>

                      {/* iOS popup hướng dẫn */}
                      {isIOS && showIOSGuide && (
                        <div className="mt-2 bg-white/5 border border-subtle rounded-xl p-2.5 flex items-start gap-2">
                          <Share2 size={13} className="text-sky-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] text-ink-secondary leading-relaxed">
                            Nhấn <span className="text-sky-400 font-medium">Chia sẻ</span>{" "}
                            ở thanh dưới → chọn{" "}
                            <span className="text-brand-hover font-medium">"Thêm vào màn hình chính"</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {/* 2. V2 Release */}
              <div className="p-3">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={15} className="text-gold-light" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-primary font-semibold text-xs mb-1">
                      DMT Movie {LATEST_VERSION.label} đã ra mắt!
                    </p>
                    <p className="text-ink-muted text-[11px] leading-relaxed mb-2">
                      {LATEST_VERSION.message}
                    </p>
                    <a
                      href={LATEST_VERSION.v2Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand-hover active:scale-95 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer"
                    >
                      <Sparkles size={11} />
                      Chuyển sang {LATEST_VERSION.label}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
