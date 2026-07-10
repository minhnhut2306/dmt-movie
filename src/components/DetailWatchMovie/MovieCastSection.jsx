import React from 'react';
import { User } from 'lucide-react';
import { useMovieCredits } from '../../hooks/useMovies';

const DEPARTMENT_LABEL = {
  Acting: 'Diễn Viên',
  Directing: 'Đạo Diễn',
  Writing: 'Biên Kịch',
};

const PersonCard = ({ person }) => (
  <div className="flex-shrink-0 w-24 sm:w-auto flex flex-col items-center text-center gap-2">
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-1 ring-white/10 bg-ink-800 shadow-glass">
      {person.profileUrl ? (
        <img
          src={person.profileUrl}
          alt={person.name}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-iris-500/25 to-iris-700/25">
          <User className="w-8 h-8 text-white/35" strokeWidth={1.5} />
        </div>
      )}
    </div>
    <div className="min-w-0 w-full">
      <p className="text-white text-xs sm:text-sm font-medium truncate" title={person.name}>{person.name}</p>
      {person.character && (
        <p className="text-white/40 text-[11px] truncate" title={person.character}>{person.character}</p>
      )}
      {person.department && (
        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-iris-500/20 text-iris-200 border border-iris-400/20 whitespace-nowrap">
          {DEPARTMENT_LABEL[person.department] || person.department}
        </span>
      )}
    </div>
  </div>
);

const PersonRow = ({ people }) => (
  <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 overflow-x-auto sm:overflow-visible pb-1 scrollbar-hide">
    {people.map((person) => (
      <PersonCard key={person.id} person={person} />
    ))}
  </div>
);

/**
 * Hiển thị Diễn Viên (Acting) và Đoàn Làm Phim (Directing/Writing) từ TMDB.
 * Nếu chưa lấy được dữ liệu TMDB (endpoint chưa sẵn sàng hoặc phim không có tmdb id),
 * tự động fallback về danh sách tên diễn viên gốc (fallbackActors) để không mất tính năng hiện có.
 */
const MovieCastSection = ({ slug, fallbackActors = [] }) => {
  const { data: people, isLoading } = useMovieCredits(slug);

  const cast = people?.filter((p) => p.department === 'Acting') || [];
  const crew = people?.filter((p) => p.department === 'Directing' || p.department === 'Writing') || [];
  const hasTmdbData = cast.length > 0 || crew.length > 0;

  if (isLoading) return null;

  if (!hasTmdbData) {
    if (!fallbackActors || fallbackActors.length === 0) return null;
    return (
      <div className="glass p-4 sm:p-6 rounded-xl2 shadow-glass mb-4 sm:mb-8">
        <h3 className="text-base sm:text-lg font-display font-bold mb-3 sm:mb-4 text-white">Diễn Viên</h3>
        <div className="flex flex-wrap gap-2">
          {fallbackActors.map((actor, index) => (
            <span
              key={index}
              className="bg-white/[0.04] border border-white/10 text-white/70 px-3 py-2 rounded-lg text-sm"
            >
              {actor}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {cast.length > 0 && (
        <div className="glass p-4 sm:p-6 rounded-xl2 shadow-glass mb-4 sm:mb-8">
          <h3 className="text-base sm:text-lg font-display font-bold mb-3 sm:mb-4 text-white">Diễn Viên</h3>
          <PersonRow people={cast} />
        </div>
      )}
      {crew.length > 0 && (
        <div className="glass p-4 sm:p-6 rounded-xl2 shadow-glass mb-4 sm:mb-8">
          <h3 className="text-base sm:text-lg font-display font-bold mb-3 sm:mb-4 text-white">Đoàn Làm Phim</h3>
          <PersonRow people={crew} />
        </div>
      )}
    </>
  );
};

export default MovieCastSection;
