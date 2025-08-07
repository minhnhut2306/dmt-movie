import React, { useState } from "react";
import { Moon, Menu, X, Search, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  return (
    <nav className="bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0b0f1c] text-white shadow-lg sticky top-0 z-50">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="max-w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Main navbar content */}
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-20">
          {/* Logo - Smaller on mobile */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-orange-500 cursor-pointer hover:text-orange-400 transition-colors">
              DMT<span className="text-sky-300">Movie</span>
            </h1>
          </div>

          {/* Desktop Search - Hidden on mobile */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="bg-[#1f2a3a] text-white rounded-full pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#2d3a4a] transition-all text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-6">
            <div className="flex items-center space-x-1 xl:space-x-4">
              <a href="#" className="px-3 py-2 text-sm xl:text-base font-medium hover:text-blue-400 transition-colors whitespace-nowrap">
                Phim Bộ
              </a>
              <a href="#" className="px-3 py-2 text-sm xl:text-base font-medium hover:text-blue-400 transition-colors whitespace-nowrap">
                Phim Lẻ
              </a>
              <a href="#" className="px-3 py-2 text-sm xl:text-base font-medium hover:text-blue-400 transition-colors whitespace-nowrap">
                TV Shows
              </a>
              <a href="#" className="px-3 py-2 text-sm xl:text-base font-medium hover:text-blue-400 transition-colors whitespace-nowrap">
                Hoạt Hình
              </a>

              {/* Desktop Dropdowns */}
              <div className="flex items-center space-x-1 xl:space-x-4">
                {/* Thể Loại Dropdown */}
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                    Thể Loại
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-80 xl:w-96 right-0">
                    <div className="p-4 grid grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-hide">
                      {['Hành Động', 'Viễn Tưởng', 'Bí Ẩn', 'Tâm Lý', 'Âm Nhạc', 'Hài Hước', 'Khoa Học', 'Kinh Dị'].map(genre => (
                        <div key={genre} className="px-4 py-3 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors whitespace-nowrap text-center border border-gray-700">
                          {genre}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quốc Gia Dropdown */}
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                    Quốc Gia
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-80 xl:w-96 right-0">
                    <div className="p-4 grid grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-hide">
                      {['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan', 'Mỹ', 'Âu Mỹ'].map(country => (
                        <div key={country} className="px-4 py-3 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors whitespace-nowrap text-center border border-gray-700">
                          {country}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Năm Dropdown */}
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                    Năm
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-80 xl:w-96 max-h-80 overflow-y-auto scrollbar-hide right-0">
                    <div className="p-4 grid grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({length: 27}, (_, i) => 2026 - i).map(year => (
                        <div key={year} className="px-4 py-3 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors text-center whitespace-nowrap border border-gray-700">
                          {year}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark mode toggle */}
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <Moon size={20} />
            </button>
          </div>

          {/* Mobile Controls - Compact design */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Mobile Search Icon */}
            <button onClick={toggleMobileSearch} className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
              <Search size={18} className="text-gray-300" />
            </button>
            
            {/* Mobile menu button - smaller */}
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Toggleable */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${showMobileSearch ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm phim..."
              className="bg-[#1f2a3a] text-white rounded-full pl-10 pr-4 py-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#2d3a4a] transition-all"
            />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
          {/* Background overlay */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`}
            onClick={toggleMenu}
          ></div>
          
          {/* Sidebar */}
          <div className={`absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0d1117] to-[#161b22] shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h2 className="text-lg font-bold text-orange-500">
                DMT<span className="text-sky-300">Movie</span>
              </h2>
              <button onClick={toggleMenu} className="p-1 hover:bg-gray-700 rounded-md transition-colors">
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm phim..."
                  className="bg-[#1f2a3a] text-white rounded-lg pl-9 pr-3 py-2.5 w-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-[#2d3a4a] transition-all text-sm"
                />
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="p-4 overflow-y-auto h-full pb-20">
              <div className="space-y-2">
                {/* Basic Menu Items */}
                <a href="#" className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                  Duyệt Tìm
                </a>
                <a href="#" className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                  Phim Bộ
                </a>
                <a href="#" className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                  Phim Lẻ
                </a>
                <a href="#" className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                  TV Shows
                </a>
                <a href="#" className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                  Hoạt Hình
                </a>

                {/* Dropdown Sections */}
                <div className="mt-4 space-y-2">
                  {/* Thể Loại */}
                  <div>
                    <button 
                      onClick={() => toggleDropdown('genres')}
                      className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white"
                    >
                      <span>Thể Loại</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'genres' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'genres' ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-[#0d1117] rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          {['Hành Động', 'Viễn Tưởng', 'Bí Ẩn', 'Tâm Lý', 'Âm Nhạc', 'Hài Hước', 'Khoa Học', 'Kinh Dị'].map(genre => (
                            <a key={genre} href="#" className="block px-2 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-center">
                              {genre}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quốc Gia */}
                  <div>
                    <button 
                      onClick={() => toggleDropdown('countries')}
                      className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white"
                    >
                      <span>Quốc Gia</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'countries' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'countries' ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-[#0d1117] rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          {['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan', 'Mỹ', 'Âu Mỹ'].map(country => (
                            <a key={country} href="#" className="block px-2 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-center">
                              {country}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Năm */}
                  <div>
                    <button 
                      onClick={() => toggleDropdown('years')}
                      className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white"
                    >
                      <span>Năm</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'years' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'years' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-3 gap-2">
                          {Array.from({length: 27}, (_, i) => 2026 - i).map(year => (
                            <a key={year} href="#" className="block px-2 py-2 text-sm text-gray-300 hover:bg-[#1c2228] hover:text-white rounded-md transition-colors text-center">
                              {year}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom section */}
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <button className="flex items-center w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                    <Moon size={18} className="mr-3" />
                    Chế độ tối
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;