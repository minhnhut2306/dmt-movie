import React from 'react';
import {
  Play,
  Mail,
  Phone,
  Facebook,
  Youtube,
  Film,
  Tv,
  Clock,
  MessageCircle
} from 'lucide-react';
import { CATEGORY_TYPES } from '../utils/CategoryConfig';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/nhut2306', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: MessageCircle, href: 'https://zalo.me/0345093534', label: 'Zalo' }
  ];

  const popularMovieCategories = Object.entries(CATEGORY_TYPES["danh-sach"].categories).slice(0, 6);
  const popularGenres = Object.entries(CATEGORY_TYPES["the-loai"].categories).slice(0, 6);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="space-y-4 md:pr-6 md:border-r md:border-gray-600">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="text-orange-500">DMT</span>
                <span className="text-blue-500">Movie</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Khám phá thế giới điện ảnh với hàng ngàn bộ phim chất lượng cao.
              Từ phim bộ đình đám đến những tác phẩm kinh điển, chúng tôi mang đến
              trải nghiệm giải trí tuyệt vời nhất.
            </p>
            <div className="md:hidden border-b border-gray-600 pb-4"></div>
          </div>

          {/* Mobile version */}
          <div className="md:hidden space-y-4">
            <div className="grid grid-cols-2 gap-8">
              {/* Movie Categories */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-red-400">
                  <span className="text-sm">Danh Mục Phim</span>
                </h3>
                <ul className="space-y-3">
                  {popularMovieCategories.map(([slug, category]) => (
                    <li key={slug}>
                      <a
                        href={`/category/danh-sach/${slug}`}
                        className="text-xs leading-relaxed hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Genres */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-red-400">
                  <span className="text-sm">Thể Loại</span>
                </h3>
                <ul className="space-y-3">
                  {popularGenres.map(([slug, genre]) => (
                    <li key={slug}>
                      <a
                        href={`/category/the-loai/${slug}`}
                        className="text-xs leading-relaxed hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {genre.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-b border-gray-600 pb-4"></div>
          </div>

          {/* Desktop Movie Categories */}
          <div className="hidden md:block space-y-4 md:px-6 md:border-r md:border-gray-600">
            <h3 className="text-lg font-semibold text-red-400 flex items-center space-x-2">
              <Tv className="w-5 h-5" />
              <span>Danh Mục Phim</span>
            </h3>
            <ul className="space-y-2">
              {popularMovieCategories.map(([slug, category]) => (
                <li key={slug}>
                  <a
                    href={`/category/danh-sach/${slug}`}
                    className="text-sm hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Genres */}
          <div className="hidden md:block space-y-4 md:px-6 md:border-r md:border-gray-600">
            <h3 className="text-lg font-semibold text-red-400 flex items-center space-x-2">
              <Film className="w-5 h-5" />
              <span>Thể Loại</span>
            </h3>
            <ul className="space-y-2">
              {popularGenres.map(([slug, genre]) => (
                <li key={slug}>
                  <a
                    href={`/category/the-loai/${slug}`}
                    className="text-sm hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {genre.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:pl-6">
            <h3 className="text-lg font-semibold text-white">Thông Tin Liên Hệ</h3>

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
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-center md:text-left">
              <div className="text-gray-400">
                Được tạo bởi <span className="text-red-400 font-semibold">nhut-dev</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-all duration-300 hover:scale-110"
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-safe-bottom md:h-0"></div>
    </footer>
  );
};

export default Footer;