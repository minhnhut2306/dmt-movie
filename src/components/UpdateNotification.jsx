import { Download, X, RefreshCw } from 'lucide-react';
import { useUpdateChecker } from '../hooks/useUpdateChecker';

export const UpdateNotification = () => {
  const {
    hasUpdate,
    newVersion,
    currentVersion,
    loading,
    changelog,
    updateUrl,
    dismissUpdate
  } = useUpdateChecker();

  if (loading || !hasUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-2xl p-4 border border-white/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Phiên bản mới!</h3>
              <p className="text-sm text-white/90">
                v{currentVersion} → v{newVersion}
              </p>
            </div>
          </div>
          <button
            onClick={dismissUpdate}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Đóng thông báo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Changelog */}
        {changelog && changelog.length > 0 && (
          <div className="mb-3 bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Có gì mới:
            </p>
            <ul className="text-sm space-y-1 text-white/90">
              {changelog.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-300">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={updateUrl || 'https://github.com/your-username/dmt-movie/releases'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white text-blue-600 hover:bg-white/90 transition-colors rounded-lg py-2.5 px-4 font-medium text-center text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Tải phiên bản mới
          </a>
          <button
            onClick={dismissUpdate}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2.5 px-4 font-medium text-sm"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};
