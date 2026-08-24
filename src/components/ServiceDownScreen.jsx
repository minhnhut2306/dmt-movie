import { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Smartphone, Trash2, Construction, Clock } from 'lucide-react';
import { V1_URL } from '../config/serviceStatus';

const ServiceDownScreen = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background animated circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Card container */}
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Icon with animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mx-auto backdrop-blur-sm border border-red-500/20">
              <AlertTriangle className="w-10 h-10 text-red-400 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full"></div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-3 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            DMT Movie Tạm Dừng
          </h1>
          {/* Description */}
          <p className="text-gray-300 text-base leading-relaxed mb-6 text-center">
            Phiên bản này đang được nâng cấp và sửa lỗi để mang đến trải nghiệm tốt hơn. 
            Vui lòng sử dụng tạm phiên bản V1 bên dưới.
          </p>

          {/* Info box */}
          <div className="mb-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 text-sm font-semibold mb-1">
                  Thời gian dự kiến
                </p>
                <p className="text-gray-400 text-sm">
                  Chúng tôi đang khắc phục nhanh nhất có thể. Cảm ơn bạn đã kiên nhẫn!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={V1_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-base px-6 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-3">
              <ExternalLink className="w-5 h-5" />
              <span>Mở DMT Movie V1</span>
            </div>
          </a>

          {/* PWA Notice */}
          {isStandalone && (
            <div className="mt-6 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-orange-400 text-sm font-bold mb-2">
                    📱 Đang dùng PWA/App đã cài?
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    App này không tự động cập nhật. Vui lòng <span className="text-orange-400 font-semibold">gỡ cài đặt</span> (nhấn giữ icon → Gỡ/Xóa), 
                    sau đó dùng <span className="text-orange-400 font-semibold">trình duyệt</span> để truy cập bản V1.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" />
              Cảm ơn bạn đã đồng hành cùng DMT Movie 💙
            </p>
          </div>
        </div>

        {/* Additional info cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
            <div className="text-2xl mb-2">🎬</div>
            <p className="text-gray-400 text-xs">Hàng nghìn phim đang chờ bạn</p>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-gray-400 text-xs">Sẽ sớm trở lại mạnh mẽ hơn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDownScreen;