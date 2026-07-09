import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play, Youtube } from 'lucide-react';
import { getSafeImageUrl, getBackdropUrl, getPosterUrl } from '../../utils/imageHelper';
import { useMovieImages } from '../../hooks/useMovies';
import TrailerModal from './TrailerModal';

const MobileDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const { data: imagesData } = useMovieImages(movieData.slug);
  const backdropUrl = getBackdropUrl(imagesData) || getSafeImageUrl(movieData.thumb_url, movieData.name);
  const posterUrl = getPosterUrl(imagesData) || getSafeImageUrl(movieData.poster_url, movieData.name);

  return (
    <div className="min-h-screen bg-black">
      <div className="px-3 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ink-secondary hover:text-brand-hover mb-4 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="relative mb-6">
          <div
            className="h-64 sm:h-80 bg-cover bg-center rounded-2xl relative overflow-hidden shadow-cinema"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-black/75"></div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white tracking-tight">{movieData.name}</h1>
              <p className="text-lg text-white/80 mb-3">{movieData.origin_name}</p>
              <div className="flex items-center gap-3 text-sm text-white/80 flex-wrap">
                <div className="flex items-center gap-1 text-gold-light">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="font-semibold">{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{movieData.vote_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="w-28 sm:w-32 flex-shrink-0">
            <img
              src={posterUrl}
              alt={movieData.name}
              className="w-full rounded-2xl shadow-cinema"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-hover" />
                <span className="text-ink-muted">Thời lượng:</span>
                <span className="text-ink-primary font-medium">{movieData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-400" />
                <span className="text-ink-muted">Số tập:</span>
                <span className="text-ink-primary font-medium">{movieData.episode_current}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-ink-muted">Chất lượng:</span>
                <span className="text-ink-primary font-medium">{movieData.quality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-light" />
                <span className="text-ink-muted">Ngôn ngữ:</span>
                <span className="text-ink-primary font-medium">{movieData.lang}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-3 px-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-cinema flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Xem Phim
            </button>

            {movieData.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full bg-white/10 hover:bg-white/15 border border-subtle text-ink-primary font-bold py-2.5 px-4 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                Xem Trailer
              </button>
            )}
          </div>
        </div>

        <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
          <h2 className="text-lg font-bold mb-3 text-ink-primary tracking-tight">Nội Dung Phim</h2>
          <p className="text-ink-secondary leading-relaxed text-sm">{movieData.content}</p>
        </div>

        <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
          <h3 className="text-lg font-bold mb-3 text-ink-primary tracking-tight">Thể Loại</h3>
          <div className="flex flex-wrap gap-2">
            {movieData.category?.map((cat, index) => (
              <span
                key={index}
                className="bg-white/10 text-ink-primary px-3 py-2 rounded-full text-xs font-medium border border-subtle"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-base-elevated/80 backdrop-blur-sm p-4 rounded-2xl shadow-cinema mb-4 border border-subtle">
          <h3 className="text-lg font-bold mb-3 text-ink-primary tracking-tight">Diễn Viên</h3>
          <div className="grid grid-cols-2 gap-2">
            {movieData.actor?.length > 0 ? movieData.actor.slice(0, 6).map((actor, index) => (
              <span
                key={index}
                className="bg-white/5 border border-subtle text-ink-secondary px-3 py-2 rounded-lg text-xs text-center"
              >
                {actor}
              </span>
            )) : <span className="text-ink-muted text-xs">Không có diễn viên nào.</span>}
          </div>
        </div>
      </div>

      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movieData.trailer_url}
        movieName={movieData.name}
      />
    </div>
  );
};

export default MobileDetailLayout;