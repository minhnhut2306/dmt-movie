import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Globe, Users, Film, Eye, Play, Youtube } from 'lucide-react';
import { useMovieImage } from '../../hooks/useMovieImage';
import { buildBgFallbackChain } from '../../utils/imageHelper';
import TrailerModal from './TrailerModal';
import MovieCastSection from './MovieCastSection';

const MobileDetailLayout = ({
  movieData,
  navigate,
  setActiveLayout
}) => {
  const [showTrailer, setShowTrailer] = useState(false);

  // Backdrop dùng CSS background-image nên phải fallback bằng chuỗi url() đa nguồn
  const backdropChain = buildBgFallbackChain(movieData.thumb_url, { width: 900, quality: 88 });
  const { currentSrc: posterSrc, handleLoad: posterHandleLoad, handleError: posterHandleError, setImgRef: posterSetImgRef } = useMovieImage(movieData.poster_url, movieData.name, { width: 500, quality: 90 });

  return (
    <div className="min-h-screen">
      <div className="px-3 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-iris-300 mb-4 transition-colors duration-200 cursor-pointer min-h-[44px] -ml-2 px-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <div className="relative mb-5">
          <div
            className="h-64 sm:h-80 bg-cover bg-center rounded-xl2 relative overflow-hidden shadow-glass-lg"
            style={{ backgroundImage: backdropChain }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1.5 text-white leading-tight">{movieData.name}</h1>
              <p className="text-sm text-white/55 mb-3">{movieData.origin_name}</p>
              <div className="flex items-center gap-3 text-xs text-white/70 flex-wrap">
                <div className="flex items-center gap-1 text-ember-400 font-semibold">
                  <Star className="w-3.5 h-3.5" fill="currentColor" />
                  <span>{movieData.vote_average}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{movieData.vote_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{movieData.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3.5 mb-5">
          <div className="w-24 sm:w-32 flex-shrink-0">
            <img
              ref={posterSetImgRef}
              src={posterSrc}
              alt={movieData.name}
              className="w-full rounded-card shadow-glass ring-1 ring-white/5"
              referrerPolicy="no-referrer"
              onLoad={posterHandleLoad}
              onError={posterHandleError}
            />
          </div>
          <div className="flex-1 space-y-2.5 min-w-0">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-iris-300 flex-shrink-0" />
                <span className="text-white/45">Thời lượng:</span>
                <span className="text-white font-medium truncate">{movieData.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-iris-300 flex-shrink-0" />
                <span className="text-white/45">Số tập:</span>
                <span className="text-white font-medium truncate">{movieData.episode_current}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-iris-300 flex-shrink-0" />
                <span className="text-white/45">Chất lượng:</span>
                <span className="text-white font-medium truncate">{movieData.quality}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-ember-400 flex-shrink-0" />
                <span className="text-white/45">Ngôn ngữ:</span>
                <span className="text-white font-medium truncate">{movieData.lang}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveLayout('watch')}
              className="w-full min-h-[46px] btn-signature text-white font-bold py-3 px-4 rounded-xl2 transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4.5 h-4.5" fill="currentColor" />
              Xem Phim
            </button>

            {movieData.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="w-full min-h-[44px] glass text-white font-semibold py-2.5 px-4 rounded-xl2 transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Youtube className="w-4 h-4 text-ember-400" />
                Xem Trailer
              </button>
            )}
          </div>
        </div>

        <div className="glass p-4 rounded-xl2 shadow-glass mb-4">
          <h2 className="text-base font-display font-bold mb-2.5 text-white">Nội Dung Phim</h2>
          <p className="text-white/55 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: movieData.content }} />
        </div>

        <div className="glass p-4 rounded-xl2 shadow-glass mb-4">
          <h3 className="text-base font-display font-bold mb-2.5 text-white">Thể Loại</h3>
          <div className="flex flex-wrap gap-2">
            {movieData.category?.map((cat, index) => (
              <span
                key={index}
                className="bg-iris-500/20 text-iris-200 border border-iris-400/20 px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        <MovieCastSection slug={movieData.slug} fallbackActors={movieData.actor} />
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