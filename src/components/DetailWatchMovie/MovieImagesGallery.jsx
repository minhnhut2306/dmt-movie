import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';

const MovieImagesGallery = ({ images, movieName, imagesLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [currentType, setCurrentType] = useState('backdrop'); // 'backdrop' hoặc 'poster'
  const [imageErrors, setImageErrors] = useState({});

  if (imagesLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl mb-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-400" />
            <p className="text-gray-400 text-sm">Đang tải hình ảnh...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) return null;

  const backdrops = images.filter(img => img.type === 'backdrop');
  const posters = images.filter(img => img.type === 'poster');

  const handleImageClick = (image, index, type) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setCurrentType(type);
    setShowGallery(true);
  };

  const handleNext = () => {
    const currentList = currentType === 'backdrop' ? backdrops : posters;
    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(currentList[nextIndex]);
  };

  const handlePrev = () => {
    const currentList = currentType === 'backdrop' ? backdrops : posters;
    const prevIndex = currentIndex === 0 ? currentList.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(currentList[prevIndex]);
  };

  const handleClose = () => {
    setShowGallery(false);
    setSelectedImage(null);
  };

  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 md:p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">Hình ảnh từ phim</h3>
      </div>

      {/* Backdrop Images */}
      {backdrops.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm text-gray-400 mb-3">Hình nền ({backdrops.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {backdrops.slice(0, 8).map((img, index) => {
              const imageId = `backdrop-${index}`;
              const imageUrl = img.urls?.w780 || img.urls?.w300 || img.urls?.original;
              
              return (
                <button
                  key={imageId}
                  onClick={() => handleImageClick(img, index, 'backdrop')}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer bg-gray-800"
                  disabled={imageErrors[imageId]}
                >
                  {!imageErrors[imageId] ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={`${movieName} backdrop ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={() => handleImageError(imageId)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Poster Images */}
      {posters.length > 0 && (
        <div>
          <h4 className="text-sm text-gray-400 mb-3">Poster ({posters.length})</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {posters.slice(0, 12).map((img, index) => {
              const imageId = `poster-${index}`;
              const imageUrl = img.urls?.w342 || img.urls?.w185 || img.urls?.w500;
              
              return (
                <button
                  key={imageId}
                  onClick={() => handleImageClick(img, index, 'poster')}
                  className="relative aspect-[2/3] rounded-lg overflow-hidden group cursor-pointer bg-gray-800"
                  disabled={imageErrors[imageId]}
                >
                  {!imageErrors[imageId] ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={`${movieName} poster ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={() => handleImageError(imageId)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Gallery Modal */}
      {showGallery && selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-7xl max-h-[90vh] w-full flex flex-col items-center">
            <img
              src={selectedImage.urls?.original || selectedImage.urls?.w1280 || selectedImage.urls?.w780}
              alt={`${movieName} ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                // Fallback nếu original lỗi
                if (selectedImage.urls?.w1280 && e.target.src !== selectedImage.urls.w1280) {
                  e.target.src = selectedImage.urls.w1280;
                } else if (selectedImage.urls?.w780 && e.target.src !== selectedImage.urls.w780) {
                  e.target.src = selectedImage.urls.w780;
                }
              }}
            />
            <div className="text-center mt-4">
              <p className="text-white text-sm">
                {currentIndex + 1} / {currentType === 'backdrop' ? backdrops.length : posters.length}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {currentType === 'backdrop' ? 'Hình nền' : 'Poster'} - {selectedImage.width} x {selectedImage.height}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieImagesGallery;