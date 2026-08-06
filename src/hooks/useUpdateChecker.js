import { useState, useEffect } from 'react';

const CURRENT_VERSION = '1.0.0'; // Cập nhật version này khi phát hành phiên bản mới
const VERSION_CHECK_URL = 'https://raw.githubusercontent.com/your-username/dmt-movie/main/public/version.json'; // ⚠️ CẬP NHẬT USERNAME GITHUB CỦA BẠN
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 giờ
const STORAGE_KEY = 'last_version_check';
const DISMISSED_VERSION_KEY = 'dismissed_version';

/**
 * Hook kiểm tra phiên bản mới từ GitHub
 * @returns {Object} { hasUpdate, newVersion, loading, error, changelog, updateUrl, dismissUpdate }
 */
export const useUpdateChecker = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [newVersion, setNewVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changelog, setChangelog] = useState([]);
  const [updateUrl, setUpdateUrl] = useState('');

  const compareVersions = (v1, v2) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    return 0;
  };

  const dismissUpdate = () => {
    if (newVersion) {
      localStorage.setItem(DISMISSED_VERSION_KEY, newVersion);
      setHasUpdate(false);
    }
  };

  const checkForUpdates = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(VERSION_CHECK_URL, {
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kiểm tra cập nhật');
      }

      const data = await response.json();
      const latestVersion = data.version;
      const dismissedVersion = localStorage.getItem(DISMISSED_VERSION_KEY);

      // Kiểm tra xem version mới có lớn hơn version hiện tại không
      // và không phải là version đã bị dismiss
      if (
        compareVersions(latestVersion, CURRENT_VERSION) > 0 &&
        latestVersion !== dismissedVersion
      ) {
        setHasUpdate(true);
        setNewVersion(latestVersion);
        setChangelog(data.changelog || []);
        setUpdateUrl(data.updateUrl || '');
      } else {
        setHasUpdate(false);
      }

      // Lưu thời gian check lần cuối
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch (err) {
      console.error('Error checking for updates:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lastCheck = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    // Kiểm tra nếu chưa check lần nào hoặc đã quá thời gian interval
    if (!lastCheck || now - parseInt(lastCheck) > CHECK_INTERVAL) {
      checkForUpdates();
    } else {
      setLoading(false);
    }

    // Setup interval để check định kỳ
    const intervalId = setInterval(checkForUpdates, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return {
    hasUpdate,
    newVersion,
    currentVersion: CURRENT_VERSION,
    loading,
    error,
    changelog,
    updateUrl,
    dismissUpdate,
    checkForUpdates
  };
};
