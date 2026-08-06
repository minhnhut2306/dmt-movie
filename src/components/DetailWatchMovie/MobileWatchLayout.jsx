import React from 'react';
import { ArrowLeft, Star, Calendar, Eye, Globe, Film } from 'lucide-react';
import { lazy, Suspense } from 'react';
import MovieCastSection from './MovieCastSection';
import ServerTabs from '../ServerTabs';

const VideoPlayer = lazy(() => import('./VideoPlayer'));
const EpisodeList = lazy(() => import('../EpisodeList'));

const MobileWatchLayout = ({
  movieData,
  setActiveLayout,
  currentEpisode,
  currentServer,
  setCurrentEpisode,
  setCurrentServer,
  isFullscreen,
  setIsFullscreen
}) => {
  const currentVideoUrl = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.link_m3u8;
  const currentEmbedUrl = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.link_embed;
  const currentEpisodeName = movieData.episodes?.[currentServer]?.server_data?.[currentEpisode]?.name;
  const forceEmbed = !!movieData.episodes?.[currentServer]?.forceEmbed;

  return (
    <div className="min-h-screen">
      <div className="px-3 py-3 border-b border-white/5 glass">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-white/70 hover:text-iris-300 transition-colors duration-200 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 cursor-pointer flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-display font-bold text-white truncate">{movieData.name}</h1>
            <p className="text-xs text-white/45 truncate">{movieData.origin_name}</p>
          </div>
        </div>
        <p className="text-xs text-white/35 px-1">
          Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
        </p>
      </div>

      <div className="px-3 pt-3">
        <ServerTabs
          episodes={movieData.episodes}
          currentServer={currentServer}
          onServerChange={(serverIndex) => {
            setCurrentServer(serverIndex);
            setCurrentEpisode(0);
          }}
        />
      </div>

      <Suspense fallback={<div className="aspect-video bg-ink-900 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-iris-400" /></div>}>
        <VideoPlayer
          currentVideoUrl={currentVideoUrl}
          currentEmbedUrl={currentEmbedUrl}
          forceEmbed={forceEmbed}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          slug={movieData.slug}
          episodeIndex={currentEpisode}
          serverIndex={currentServer}
        />
      </Suspense>

      {!isFullscreen && currentVideoUrl && (
        <div className="px-3 py-3 glass border-b border-white/5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Đang phát: {currentEpisodeName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-iris-300" />
              <span>{movieData.episodes?.[currentServer]?.server_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-ember-400" />
              <span>{movieData.quality}</span>
            </div>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <div className="px-3 py-4">
          <Suspense fallback={<div className="h-20 skeleton rounded-xl2 mb-4" />}>
            <EpisodeList
              episodes={movieData.episodes}
              currentServer={currentServer}
              currentEpisode={currentEpisode}
              setCurrentServer={setCurrentServer}
              setCurrentEpisode={setCurrentEpisode}
              isMobile={true}
            />
          </Suspense>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="glass p-3 rounded-xl2 shadow-glass">
              <h3 className="text-xs font-display font-bold text-white mb-2">Thông Tin</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-ember-400" fill="currentColor" />
                  <span className="text-white/45">Đánh giá:</span>
                  <span className="text-white font-medium">{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-iris-300" />
                  <span className="text-white/45">Năm:</span>
                  <span className="text-white font-medium">{movieData.year}</span>
                </div>
              </div>
            </div>

            <div className="glass p-3 rounded-xl2 shadow-glass">
              <h3 className="text-xs font-display font-bold text-white mb-2">Chi Tiết</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-ember-400" />
                  <span className="text-white/45">Chất lượng:</span>
                  <span className="text-white font-medium">{movieData.quality}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-iris-300" />
                  <span className="text-white/45">Số tập:</span>
                  <span className="text-white font-medium">{movieData.episode_current}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl2 shadow-glass mb-4">
            <h3 className="text-sm font-display font-bold text-white mb-2">Nội Dung Phim</h3>
            <p className="text-white/55 leading-relaxed text-xs" dangerouslySetInnerHTML={{ __html: movieData.content }} />
          </div>

          <div className="glass p-4 rounded-xl2 shadow-glass mb-4">
            <h3 className="text-sm font-display font-bold text-white mb-2">Thể Loại</h3>
            <div className="flex flex-wrap gap-1.5">
              {movieData.category?.map((cat, index) => (
                <span
                  key={index}
                  className="bg-iris-500/20 text-iris-200 border border-iris-400/20 px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <MovieCastSection slug={movieData.slug} fallbackActors={movieData.actor} />
        </div>
      )}
    </div>
  );
};

export default MobileWatchLayout;