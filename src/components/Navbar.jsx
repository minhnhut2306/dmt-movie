import React, { useState } from "react";
import { Menu, X, Search, ChevronDown, Loader2 } from "lucide-react";
import SearchInput from "./Search/SearchInput";
import { useGenres, useCountries, useYears, transformGenres, transformCountries, transformYears } from "../hooks/useCategoryHooks";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Fetch TẤT CẢ từ API - KHÔNG CỐ ĐỊNH
  const { data: genresData, isLoading: genresLoading } = useGenres();
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const { data: yearsData, isLoading: yearsLoading } = useYears();

  // Transform data từ API
  const displayGenres = genresLoading ? [] : transformGenres(genresData);
  const displayCountries = countriesLoading ? [] : transformCountries(countriesData);
  const displayYears = yearsLoading ? [] : transformYears(yearsData);

  // Danh sách phim - hardcode tạm (vì API không có endpoint này)
  // Nếu có API cho phần này thì cũng fetch như trên
  const movieCategories = [
    { href: "/category/danh-sach/phim-bo", label: "Phim Bộ" },
    { href: "/category/danh-sach/phim-le", label: "Phim Lẻ" },
    { href: "/category/danh-sach/tv-shows", label: "TV Shows" },
    { href: "/category/danh-sach/hoat-hinh", label: "Hoạt Hình" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (dropdown) => setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  return (
    <nav className="bg-gradient-to-r from-[#0d1117] via-[#161b22] to-[#0b0f1c] text-white shadow-lg sticky top-0 z-50">
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-full px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-20">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-orange-500 cursor-pointer hover:text-orange-400 transition-colors">
                  DMT<span className="text-sky-300">Movie</span>
                </h1>
              </a>
            </div>
            <div className="hidden lg:flex items-center">
              <SearchInput placeholder="Tìm kiếm phim..." className="w-64 xl:w-72" variant="navbar" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-2 xl:space-x-4">
              {movieCategories.map(link => (
                <a key={link.href} href={link.href} className="px-2 py-2 text-sm xl:text-base font-medium hover:text-blue-400 transition-colors whitespace-nowrap">
                  {link.label}
                </a>
              ))}

              {/* Thể Loại - TỪ API */}
              <div className="relative group">
                <button className="flex items-center px-2 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                  Thể Loại {genresLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                  {!genresLoading && <ChevronDown size={14} className="ml-1" />}
                </button>
                {!genresLoading && displayGenres.length > 0 && (
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-80 xl:w-96 right-0">
                    <div className="p-4 grid grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-hide">
                      {displayGenres.map(genre => (
                        <a key={genre.slug} href={genre.fullPath} className="px-4 py-3 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors whitespace-nowrap text-center border border-gray-700">
                          {genre.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quốc Gia - TỪ API */}
              <div className="relative group">
                <button className="flex items-center px-2 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                  Quốc Gia {countriesLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                  {!countriesLoading && <ChevronDown size={14} className="ml-1" />}
                </button>
                {!countriesLoading && displayCountries.length > 0 && (
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-80 xl:w-96 right-0">
                    <div className="p-4 grid grid-cols-2 xl:grid-cols-3 gap-3 max-h-80 overflow-y-auto scrollbar-hide">
                      {displayCountries.map(country => (
                        <a key={country.slug} href={country.fullPath} className="px-4 py-3 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors whitespace-nowrap text-center border border-gray-700">
                          {country.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Năm - TỪ API */}
              <div className="relative group">
                <button className="flex items-center px-2 py-2 text-sm xl:text-base font-medium hover:text-violet-400 transition-colors whitespace-nowrap">
                  Năm {yearsLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin" />}
                  {!yearsLoading && <ChevronDown size={14} className="ml-1" />}
                </button>
                {!yearsLoading && displayYears.length > 0 && (
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#1a252f] rounded-lg shadow-xl mt-2 z-20 w-64 xl:w-80 max-h-80 overflow-y-auto scrollbar-hide right-0">
                    <div className="p-4 grid grid-cols-3 xl:grid-cols-4 gap-2">
                      {displayYears.map(year => (
                        <a key={year.slug} href={year.fullPath} className="px-2 py-2 bg-[#0d1117] hover:bg-gray-600 rounded-lg cursor-pointer text-sm xl:text-base transition-colors text-center whitespace-nowrap border border-gray-700">
                          {year.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center lg:hidden space-x-2">
            <button onClick={toggleMobileSearch} className="p-1.5 hover:bg-gray-700 rounded-md transition-colors">
              <Search size={18} className="text-gray-300" />
            </button>
            <button onClick={toggleMenu} className="p-1.5 rounded-md hover:bg-gray-700 transition-colors">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${showMobileSearch ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <SearchInput placeholder="Tìm kiếm phim..." className="w-full" variant="navbar" />
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-50' : 'opacity-0'}`} onClick={toggleMenu}></div>
          <div className={`absolute left-0 top-0 h-full w-80 bg-gradient-to-b from-[#0d1117] to-[#161b22] shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-600">
              <h2 className="text-lg font-bold text-orange-500">DMT<span className="text-sky-300">Movie</span></h2>
              <button onClick={toggleMenu} className="p-1 hover:bg-gray-700 rounded-md transition-colors">
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-600">
              <SearchInput placeholder="Tìm kiếm phim..." className="w-full" variant="navbar" />
            </div>

            <div className="p-4 overflow-y-auto h-full pb-20">
              <div className="space-y-2">
                {movieCategories.map(link => (
                  <a key={link.href} href={link.href} className="block px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                    {link.label}
                  </a>
                ))}

                {/* Mobile Thể Loại */}
                <div>
                  <button onClick={() => toggleDropdown('genres')} className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                    <span>Thể Loại {genresLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}</span>
                    {!genresLoading && <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'genres' ? 'rotate-180' : ''}`} />}
                  </button>
                  {!genresLoading && (
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'genres' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-[#0d1117] rounded-md">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayGenres.map(genre => (
                              <a key={genre.slug} href={genre.fullPath} className="block px-2 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-center">
                                {genre.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Quốc Gia */}
                <div>
                  <button onClick={() => toggleDropdown('countries')} className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                    <span>Quốc Gia {countriesLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}</span>
                    {!countriesLoading && <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'countries' ? 'rotate-180' : ''}`} />}
                  </button>
                  {!countriesLoading && (
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'countries' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-[#0d1117] rounded-md">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayCountries.map(country => (
                              <a key={country.slug} href={country.fullPath} className="block px-2 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition-colors text-center">
                                {country.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Năm */}
                <div>
                  <button onClick={() => toggleDropdown('years')} className="flex items-center justify-between w-full px-3 py-3 text-base font-medium hover:bg-[#1c2228] rounded-md transition-colors text-white">
                    <span>Năm Phát Hành {yearsLoading && <Loader2 className="w-3 h-3 ml-1 animate-spin inline" />}</span>
                    {!yearsLoading && <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'years' ? 'rotate-180' : ''}`} />}
                  </button>
                  {!yearsLoading && (
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'years' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-3 gap-2">
                          {displayYears.map(year => (
                            <a key={year.slug} href={year.fullPath} className="block px-2 py-2 text-sm text-gray-300 hover:bg-[#1c2228] hover:text-white rounded-md transition-colors text-center">
                              {year.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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