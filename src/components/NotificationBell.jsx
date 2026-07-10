import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Download,
  Share2,
  X,
  Smartphone,
  Sparkles,
  ExternalLink,
  Users,
  ArrowLeftCircle,
  ShieldCheck,
  History,
  PanelBottom,
  Code2,
} from "lucide-react";
import { LATEST_VERSION } from "../config/appVersion";

const READ_KEY = "dmt-notif-read";

// Changelog feed — các cập nhật gần đây của DMT Movie, mới nhất lên đầu
const CHANGELOG = [
  {
    id: "changelog-actor-cards",
    icon: Users,
    iconBg: "bg-iris-500/15",
    iconColor: "text-iris-300",
    title: "Giao diện diễn viên làm mới",
    description: "Ảnh đại diện tròn lấy từ TMDB, cuộn ngang mượt trên di động.",
    time: "2 giờ trước",
    isNew: true,
  },
  {
    id: "changelog-category-back",
    icon: ArrowLeftCircle,
    iconBg: "bg-iris-500/15",
    iconColor: "text-iris-300",
    title: "Trang danh mục dễ dùng hơn",
    description: "Thêm nút quay lại và tiêu đề thể loại rõ ràng ở đầu trang.",
    time: "5 giờ trước",
    isNew: true,
  },
  {
    id: "changelog-ad-block",
    icon: ShieldCheck,
    iconBg: "bg-ember-500/15",
    iconColor: "text-ember-400",
    title: "Nâng cấp chặn quảng cáo",
    description: "Chặn thẳng ở cấp manifest và fragment của video, không phải kiểu bấm bỏ qua.",
    time: "1 ngày trước",
  },
  {
    id: "changelog-watch-history",
    icon: History,
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    title: "Lịch sử xem lưu trên máy",
    description: "Tự động lưu tiến độ xem và gợi ý xem tiếp ngay từ nơi bạn dừng lại.",
    time: "1 ngày trước",
  },
  {
    id: "changelog-bottom-nav",
    icon: PanelBottom,
    iconBg: "bg-iris-500/15",
    iconColor: "text-iris-300",
    title: "Thanh điều hướng dưới cập nhật",
    description: "4 tab chính: Trang Chủ, Khám Phá, Tìm Kiếm, Lịch Sử — bỏ hẳn nút menu dạng hamburger.",
    time: "2 ngày trước",
  },
  {
    id: "changelog-html-content",
    icon: Code2,
    iconBg: "bg-ember-500/15",
    iconColor: "text-ember-400",
    title: "Sửa lỗi hiển thị mô tả phim",
    description: "Nội dung phim render đúng định dạng, không còn lộ thẻ HTML thô.",
    time: "3 ngày trước",
  },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [readSet, setReadSet] = useState(new Set());
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const ref = useRef(null);
  // Panel render qua portal (xem ghi chú ở phần return) nên cần ref riêng để
  // outside-click không tính nhầm click bên trong panel là click ra ngoài
  const panelRef = useRef(null);

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
      const clickedBell = ref.current && ref.current.contains(e.target);
      const clickedPanel = panelRef.current && panelRef.current.contains(e.target);
      if (!clickedBell && !clickedPanel) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const notifications = [
    ...CHANGELOG.map((item) => ({ id: item.id })),
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

  // Nội dung panel dùng chung cho cả bản dropdown (desktop) và bottom sheet (mobile)
  const PanelContent = () => (
    <div className="divide-y divide-white/5">
      {CHANGELOG.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="p-3">
            <div className="flex gap-2.5">
              <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={15} className={item.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-xs">{item.title}</p>
                  {item.isNew && (
                    <span className="bg-iris-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">MỚI</span>
                  )}
                </div>
                <p className="text-white/45 text-[11px] leading-relaxed">
                  {item.description}
                </p>
                <p className="text-white/25 text-[10px] mt-1">{item.time}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* PWA Install — hiện nếu chưa cài */}
      {!isStandalone && (
        <div className="p-3">
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-iris-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Smartphone size={15} className="text-iris-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-xs">Đã có ứng dụng cho điện thoại!</p>
              </div>
              <p className="text-white/45 text-[11px] leading-relaxed mb-2">
                Cài DMT Movie lên điện thoại để xem phim nhanh hơn, không cần mở trình duyệt.
              </p>

              {/* Nút cài — Android cài thẳng, iOS hiện popup */}
              <button
                onClick={isIOS ? () => setShowIOSGuide(true) : handleInstall}
                className="w-full min-h-[36px] flex items-center justify-center gap-1.5 btn-signature text-white text-[11px] font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Download size={12} />
                Ấn vào đây để cài đặt
              </button>

              {/* iOS popup hướng dẫn */}
              {isIOS && showIOSGuide && (
                <div className="mt-2 bg-white/[0.04] border border-white/10 rounded-lg p-2.5 flex items-start gap-2">
                  <Share2 size={13} className="text-iris-300 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Nhấn <span className="text-iris-300 font-medium">Chia sẻ</span>{" "}
                    ở thanh dưới → chọn{" "}
                    <span className="text-ember-400 font-medium">"Thêm vào màn hình chính"</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* V2 Release */}
      {!isStandalone && (
        <div className="p-3">
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ember-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles size={15} className="text-ember-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-xs mb-1">
                DMT Movie {LATEST_VERSION.label} đã ra mắt!
              </p>
              <p className="text-white/45 text-[11px] leading-relaxed mb-2">
                {LATEST_VERSION.message}
              </p>
              <a
                href={LATEST_VERSION.v2Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-ember-500 hover:bg-ember-400 active:scale-95 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Sparkles size={11} />
                Chuyển sang {LATEST_VERSION.label}
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      {/* Bell icon */}
      <button
        onClick={handleOpen}
        className="relative w-11 h-11 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
        aria-label="Thông báo"
      >
        <Bell size={19} className={open ? "text-iris-300" : "text-white/70"} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-ember-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/*
        Panel render qua portal thẳng vào document.body: Navbar dùng `.glass-strong`
        (backdrop-filter) trên <nav>, và backdrop-filter biến ancestor đó thành
        containing block cho mọi phần tử con position:fixed — khiến bottom sheet
        "inset-0" bị co lại trong chiều cao ~60px của thanh nav thay vì phủ toàn màn hình.
        Portal ra ngoài <body> để fixed luôn tính theo viewport, không bị kẹt trong nav.
      */}
      {createPortal(
        <div ref={panelRef}>
          {/* ================= DESKTOP: dropdown neo theo icon ================= */}
          {open && (
            <div
              className="hidden lg:block fixed right-2 top-16 lg:top-[72px] z-[999] animate-slide-up"
              style={{ width: "min(340px, calc(100vw - 16px))" }}
            >
              <div className="glass-strong rounded-xl2 shadow-glass-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Bell size={13} className="text-iris-300" />
                    <span className="text-white text-sm font-display font-semibold">Thông báo</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto scrollbar-thin-iris">
                  <PanelContent />
                </div>
              </div>
            </div>
          )}

          {/* ================= MOBILE: bottom sheet ================= */}
          <div className={`lg:hidden fixed inset-0 z-[999] transition-all duration-300 ${open ? 'visible' : 'invisible pointer-events-none'}`}>
            <div
              className={`absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setOpen(false)}
            />
            <div className={`absolute left-0 right-0 bottom-0 max-h-[80vh] glass-strong rounded-t-sheet shadow-glass-lg transform transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}>
              <div className="w-10 h-1.5 rounded-full bg-white/20 mx-auto mt-3" />
              <div className="flex items-center justify-between px-5 pt-3 pb-2">
                <div className="flex items-center gap-1.5">
                  <Bell size={16} className="text-iris-300" />
                  <h2 className="text-lg font-display font-bold text-white">Thông báo</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto scrollbar-thin-iris" style={{ maxHeight: 'calc(80vh - 60px)', paddingBottom: 'calc(68px + env(safe-area-inset-bottom))' }}>
                <PanelContent />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NotificationBell;
