import React from 'react';
import { Mail, Phone, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useGenres, useCountries, transformGenres, transformCountries } from '../hooks/useCategoryHooks';

const Footer = () => {
  // LẤY TẤT CẢ TỪ API - KHÔNG CỐ ĐỊNH
  const { data: genresData } = useGenres();
  const { data: countriesData } = useCountries();

  // Transform và lấy 6 items đầu tiên
  const popularGenres = transformGenres(genresData).slice(0, 6);
  const popularCountries = transformCountries(countriesData).slice(0, 6);

  // Danh mục phim - hardcode tạm vì API không có endpoint
  const movieCategories = [
    { slug: 'phim-moi-cap-nhat', name: 'Phim Mới', fullPath: '/category/danh-sach/phim-moi-cap-nhat' },
    { slug: 'phim-bo', name: 'Phim Bộ', fullPath: '/category/danh-sach/phim-bo' },
    { slug: 'phim-le', name: 'Phim Lẻ', fullPath: '/category/danh-sach/phim-le' },
    { slug: 'tv-shows', name: 'TV Shows', fullPath: '/category/danh-sach/tv-shows' },
    { slug: 'hoat-hinh', name: 'Hoạt Hình', fullPath: '/category/danh-sach/hoat-hinh' },
    { slug: 'phim-thuyet-minh', name: 'Thuyết Minh', fullPath: '/category/danh-sach/phim-thuyet-minh' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/nhut2306', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: MessageCircle, href: 'https://zalo.me/0345093534', label: 'Zalo' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Thông tin */}
          <div className="space-y-4 md:pr-6 md:border-r md:border-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="text-orange-500">DMT</span>
                <span className="text-blue-500">Movie</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Khám phá thế giới điện ảnh với hàng ngàn bộ phim chất lượng cao.
              Từ phim bộ đình đám đến những tác phẩm kinh điển.
            </p>
            <div className="md:hidden border-b border-gray-600 pb-4"></div>
          </div>

          {/* Mobile version */}
          <div className="md:hidden space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-red-400">
                  <span className="text-sm">Danh Mục</span>
                </h3>
                <ul className="space-y-3">
                  {movieCategories.map(cat => (
                    <li key={cat.slug}>
                      <a href={cat.fullPath} className="text-xs leading-relaxed hover:text-orange-400 transition-colors duration-200">
                        {cat.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-red-400">
                  <span className="text-sm">Thể Loại</span>
                </h3>
                <ul className="space-y-3">
                  {popularGenres.length > 0 ? (
                    popularGenres.map(genre => (
                      <li key={genre.slug}>
                        <a href={genre.fullPath} className="text-xs leading-relaxed hover:text-orange-400 transition-colors duration-200">
                          {genre.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500">Đang tải...</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="border-b border-gray-600 pb-4"></div>
          </div>

          {/* Desktop - Danh mục */}
          <div className="hidden md:block space-y-4 md:px-6 md:border-r md:border-gray-600">
            <h3 className="text-lg font-semibold text-red-400">Danh Mục Phim</h3>
            <ul className="space-y-2">
              {movieCategories.map(cat => (
                <li key={cat.slug}>
                  <a href={cat.fullPath} className="text-sm hover:text-orange-400 transition-colors duration-200">
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop - Thể loại & Quốc gia TỪ API */}
          <div className="hidden md:block space-y-4 md:px-6 md:border-r md:border-gray-600">
            <h3 className="text-lg font-semibold text-red-400">Thể Loại & Quốc Gia</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Thể Loại Phổ Biến</p>
                <ul className="space-y-2">
                  {popularGenres.length > 0 ? (
                    popularGenres.map(genre => (
                      <li key={genre.slug}>
                        <a href={genre.fullPath} className="text-sm hover:text-orange-400 transition-colors duration-200">
                          {genre.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">Đang tải...</li>
                  )}
                </ul>
              </div>

              {popularCountries.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Quốc Gia</p>
                  <ul className="space-y-2">
                    {popularCountries.slice(0, 3).map(country => (
                      <li key={country.slug}>
                        <a href={country.fullPath} className="text-sm hover:text-orange-400 transition-colors duration-200">
                          {country.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 md:pl-6">
            <h3 className="text-lg font-semibold text-white">Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <Mail className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="break-words">nhutnm2306@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>+84 345 093 534</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MessageCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <a href="https://zalo.me/0345093534" className="hover:text-orange-400 transition-colors duration-200">
                  Zalo: +84 345 093 534
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 text-center md:text-left">
              Được tạo bởi <span className="text-red-400 font-semibold">nhut-dev</span>
              <p className="mt-1">Web này làm chơi cho vui</p>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a key={index} href={social.href} aria-label={social.label} className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-all duration-300 hover:scale-110">
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;