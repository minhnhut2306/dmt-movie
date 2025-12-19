// utils/watchHistory.js
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

export const saveWatchHistory = (slug, episodeIndex, serverIndex) => {
  if (!slug) return;
  
  if (!watchHistory[slug]) {
    watchHistory[slug] = {
      lastEpisode: episodeIndex,
      lastServer: serverIndex,
      watchedEpisodes: new Set(),
      timestamp: Date.now()
    };
  }
  
  watchHistory[slug].lastEpisode = episodeIndex;
  watchHistory[slug].lastServer = serverIndex;
  watchHistory[slug].watchedEpisodes.add(`${serverIndex}-${episodeIndex}`);
  watchHistory[slug].timestamp = Date.now();
  
  saveToStorage(watchHistory);
};

export const getWatchHistory = (slug) => {
  if (!slug || !watchHistory[slug]) return null;
  
  return {
    lastEpisode: watchHistory[slug].lastEpisode,
    lastServer: watchHistory[slug].lastServer,
    watchedEpisodes: Array.from(watchHistory[slug].watchedEpisodes || []),
    timestamp: watchHistory[slug].timestamp
  };
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

export const clearWatchHistory = (slug) => {
  if (slug) {
    delete watchHistory[slug];
  } else {
    watchHistory = {};
  }
  saveToStorage(watchHistory);
};