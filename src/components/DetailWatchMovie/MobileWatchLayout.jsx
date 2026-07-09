import React from 'react';
import { ArrowLeft, Star, Calendar, Eye, Globe, Film } from 'lucide-react';
import { lazy, Suspense } from 'react';

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

  return (
    <div className="min-h-screen bg-black">
      <div className="px-3 py-3 border-b border-subtle">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setActiveLayout('detail')}
            className="text-ink-secondary hover:text-brand-hover transition-colors duration-200 p-2 rounded-full hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate tracking-tight">{movieData.name}</h1>
            <p className="text-sm text-ink-secondary truncate">{movieData.origin_name}</p>
          </div>
        </div>
        <p className="text-xs text-ink-muted px-2">
          Đang xem: {currentEpisodeName} - {movieData.episodes?.[currentServer]?.server_name}
        </p>
      </div>

      <Suspense fallback={<div className="aspect-video bg-base-elevated flex items-center justify-center"><div className="relative h-10 w-10"><div className="absolute inset-0 rounded-full border-2 border-white/10"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin"></div></div></div>}>
        <VideoPlayer
          currentVideoUrl={currentVideoUrl}
          currentEmbedUrl={currentEmbedUrl}
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          slug={movieData.slug}
          episodeIndex={currentEpisode}
          serverIndex={currentServer}
        />
      </Suspense>

      {!isFullscreen && currentVideoUrl && (
        <div className="px-3 py-3 bg-base-elevated/60 backdrop-blur-sm border-b border-subtle">
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-secondary">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Đang phát: {currentEpisodeName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-brand-hover" />
              <span>{movieData.episodes?.[currentServer]?.server_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>{movieData.quality}</span>
            </div>
          </div>
        </div>
      )}

      {!isFullscreen && (
        <div className="px-3 py-4">
          <Suspense fallback={<div className="h-20 bg-base-elevated/60 rounded-2xl animate-skeleton-pulse mb-4" />}>
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
            <div className="bg-base-elevated/80 backdrop-blur-sm p-3 rounded-2xl shadow-cinema border border-subtle">
              <h3 className="text-sm font-bold text-ink-primary mb-2">Thông Tin</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold-light" fill="currentColor" />
                  <span className="text-ink-muted">Đánh giá:</span>
                  <span className="text-ink-primary font-medium">{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-hover" />
                  <span className="text-ink-muted">Năm:</span>
                  <span className="text-ink-primary font-medium">{movieData.year}</span>
                </div>
              </div>
            </div>

            <div className="bg-base-elevated/80 backdrop-blur-sm p-3 rounded-2xl shadow-cinema border border-subtle">
              <h3 className="text-sm font-bold text-ink-primary mb-2">Chi Tiết</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-purple-400" />
                  <span className="text-ink-muted">Chất lượng:</span>
                  <span className="text-ink-primary font-medium">{movieData.quality}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-emerald-400" />
                  <span className="text-ink-muted">Số tập:</span>
                  <span className="text-ink-primary font-medium">{movieData.episode_current}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
            <h3 className="text-sm font-bold text-ink-primary mb-2">Nội Dung Phim</h3>
            <p className="text-ink-secondary leading-relaxed text-xs">{movieData.content}</p>
          </div>

          <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
            <h3 className="text-sm font-bold text-ink-primary mb-2">Thể Loại</h3>
            <div className="flex flex-wrap gap-1">
              {movieData.category?.map((cat, index) => (
                <span
                  key={index}
                  className="bg-white/10 border border-subtle text-ink-primary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
            <h3 className="text-sm font-bold text-ink-primary mb-3">Diễn Viên</h3>
            <div className="grid grid-cols-2 gap-2">
              {movieData.actor?.length > 0 ? movieData.actor.slice(0, 6).map((actor, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-subtle text-ink-secondary px-2 py-2 rounded-lg text-xs text-center"
                >
                  {actor}
                </div>
              )) : <span className="text-ink-muted text-xs">Không có diễn viên nào.</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileWatchLayout;