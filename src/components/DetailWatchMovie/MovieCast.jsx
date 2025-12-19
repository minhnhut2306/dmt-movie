import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const MovieCast = ({ peoples, isMobile = false, peoplesLoading = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  if (peoplesLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
            <p className="text-gray-400 text-sm">Đang tải diễn viên...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!peoples || peoples.length === 0) return null;

  const displayPeoples = expanded ? peoples : peoples.slice(0, isMobile ? 6 : 12);

  const handleImageError = (personId) => {
    setImageErrors(prev => ({ ...prev, [personId]: true }));
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Diễn viên ({peoples.length})</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {displayPeoples.map((person) => {
          const hasError = imageErrors[person.id];
          
          return (
            <div
              key={person.id}
              className="group bg-gradient-to-b from-gray-700 to-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {person.profile_urls && !hasError ? (
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                  <img
                    src={person.profile_urls.w185}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={() => handleImageError(person.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              ) : (
                <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs px-2">{person.name.charAt(0)}</p>
                  </div>
                </div>
              )}
              
              <div className="p-2 md:p-3">
                <h4 className="text-white font-semibold text-xs md:text-sm line-clamp-1 mb-1">
                  {person.name}
                </h4>
                <p className="text-gray-400 text-xs line-clamp-2 mb-1">
                  {person.character}
                </p>
                {person.known_for && (
                  <p className="text-gray-500 text-xs">
                    {person.known_for}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {peoples.length > (isMobile ? 6 : 12) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full py-2 md:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2 text-white font-medium text-sm md:text-base"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
              Xem thêm {peoples.length - (isMobile ? 6 : 12)} diễn viên
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default MovieCast;