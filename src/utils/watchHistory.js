const STORAGE_KEY = 'watch_history';

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const data = JSON.parse(saved);

    Object.keys(data).forEach(slug => {
      if (data[slug].watchedEpisodes && Array.isArray(data[slug].watchedEpisodes)) {
        data[slug].watchedEpisodes = new Set(data[slug].watchedEpisodes);
      } else {
        data[slug].watchedEpisodes = new Set();
      }
    });

    return data;
  } catch (e) {
    console.error('Error loading watch history:', e);
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
};

const saveToStorage = (data) => {
  try {
    const toSave = {};
    Object.keys(data).forEach(slug => {
      toSave[slug] = {
        ...data[slug],
        watchedEpisodes: data[slug].watchedEpisodes instanceof Set
          ? Array.from(data[slug].watchedEpisodes)
          : []
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Error saving watch history:', e);
  }
};

let watchHistory = loadFromStorage();

export const saveWatchHistory = (slug, episodeIndex, serverIndex, meta = {}) => {
  if (!slug) return;

  const { title, poster, episodeName, type } = meta;
  const existing = watchHistory[slug] || {};

  const episodes = existing.watchedEpisodes instanceof Set
    ? existing.watchedEpisodes
    : new Set(Array.isArray(existing.watchedEpisodes) ? existing.watchedEpisodes : []);

  episodes.add(`${serverIndex}-${episodeIndex}`);

  watchHistory[slug] = {
    ...existing,
    slug,
    title: title || existing.title || slug,
    poster: poster || existing.poster || '',
    type: type || existing.type || '',
    lastEpisode: episodeIndex,
    lastServer: serverIndex,
    lastEpisodeName: episodeName || existing.lastEpisodeName || '',
    watchedEpisodes: episodes,
    timestamp: Date.now(),
    firstWatchedAt: existing.firstWatchedAt || Date.now(),
  };

  saveToStorage(watchHistory);
};

export const getWatchHistory = (slug) => {
  if (!slug || !watchHistory[slug]) return null;

  return {
    lastEpisode: watchHistory[slug].lastEpisode,
    lastServer: watchHistory[slug].lastServer,
    watchedEpisodes: Array.from(watchHistory[slug].watchedEpisodes || []),
    timestamp: watchHistory[slug].timestamp,
  };
};

export const getAllWatchHistory = () => {
  return Object.values(watchHistory)
    .filter(item => item.slug && item.title)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

export const isEpisodeWatched = (slug, serverIndex, episodeIndex) => {
  try {
    if (!slug || !watchHistory[slug]) return false;

    const episodes = watchHistory[slug].watchedEpisodes;
    if (!episodes) return false;

    if (episodes instanceof Set) {
      return episodes.has(`${serverIndex}-${episodeIndex}`);
    } else if (Array.isArray(episodes)) {
      return episodes.includes(`${serverIndex}-${episodeIndex}`);
    }

    return false;
  } catch (e) {
    console.error('Error checking episode watched:', e);
    return false;
  }
};

export const removeFromWatchHistory = (slug) => {
  if (slug && watchHistory[slug]) {
    delete watchHistory[slug];
    saveToStorage(watchHistory);
  }
};

export const clearWatchHistory = (slug) => {
  if (slug) {
    delete watchHistory[slug];
  } else {
    watchHistory = {};
  }
  saveToStorage(watchHistory);
};

const POSITION_KEY = 'watch_positions';

export const saveWatchPosition = (slug, episodeIndex, serverIndex, time) => {
  if (!slug || time < 10) return;
  try {
    const data = JSON.parse(localStorage.getItem(POSITION_KEY) || '{}');
    data[`${slug}-${serverIndex}-${episodeIndex}`] = { time, savedAt: Date.now() };
    localStorage.setItem(POSITION_KEY, JSON.stringify(data));
  } catch (e) {}
};

export const getWatchPosition = (slug, episodeIndex, serverIndex) => {
  if (!slug) return null;
  try {
    const data = JSON.parse(localStorage.getItem(POSITION_KEY) || '{}');
    return data[`${slug}-${serverIndex}-${episodeIndex}`]?.time || null;
  } catch (e) {
    return null;
  }
};
