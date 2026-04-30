import { useState } from "react";
import { Menu, X, Search, ChevronDown, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FilterModal from "./FilterModal";
import { 
  useDynamicGenres, 
  useDynamicCountries, 
  ALL_YEARS 
} from "../utils/CategoryConfigDynamic";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleApplyFilter = (filters) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.year) params.append('year', filters.year);
    if (filters.lang) params.append('lang', filters.lang);
    params.append('sort_field', filters.sortField);
    params.append('sort_type', filters.sortType);
    
    window.location.href = `/filter?${params.toString()}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSearchDropdown(false);
      setSearchInput('');
    }
  };

  const { genres: displayGenres } = useDynamicGenres();
  const { countries: displayCountries } = useDynamicCountries();
  const displayYears = ALL_YEARS;

  return (
    <>
      <style>{`
        body {
          padding-top: 56px;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <nav className="bg-black text-white shadow-lg fixed top-0 left-0 right-0 z-[9999]">
        {/* Hàng 1: Logo + Menu chính + Actions */}
        <div className="border-b border-gray-800">
          <div className="max-w-full px-2">
            <div className="flex items-center justify-between h-14">
              
              {/* Logo */}
              <a href="/" className="flex items-center">
                <h1 className="text-2xl font-bold">
                  <span className="text-orange-500">DMT</span>
                  <span className="text-blue-400">Movie</span>
                </h1>
              </a>

              {/* Desktop Menu chính */}
              <div className="hidden lg:flex items-center space-x-8">
                <a href="/category/danh-sach/phim-bo" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Bộ
                </a>
                <a href="/category/danh-sach/phim-le" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Lẻ
                </a>
                <a href="/category/danh-sach/phim-chieu-rap" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Chiếu Rạp
                </a>
                <a href="/category/danh-sach/hoat-hinh" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Hoạt Hình
                </a>
                <a href="/category/danh-sach/phim-vietsub" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Vietsub
                </a>
                <a href="/category/danh-sach/phim-thuyet-minh" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Thuyết Minh
                </a>
                <a href="/category/danh-sach/phim-long-tieng" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Lồng Tiếng
                </a>

                {/* Thể loại Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'genres-desktop' ? null : 'genres-desktop')}
                    className="flex items-center text-sm font-medium hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Thể Loại
                    <ChevronDown size={14} className="ml-1" />
                  </button>
                  {activeDropdown === 'genres-desktop' && (
                    <>
                      <div 
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div 
                        className="fixed bg-gray-900 rounded-lg shadow-2xl w-96 border border-gray-800 z-[99999] right-4"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                          {displayGenres.map(genre => (
                            <a
                              key={genre.slug}
                              href={genre.fullPath}
                              className="px-3 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {genre.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Quốc gia Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'countries-desktop' ? null : 'countries-desktop')}
                    className="flex items-center text-sm font-medium hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Quốc Gia
                    <ChevronDown size={14} className="ml-1" />
                  </button>
                  {activeDropdown === 'countries-desktop' && (
                    <>
                      <div 
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div 
                        className="fixed bg-gray-900 rounded-lg shadow-2xl w-96 border border-gray-800 z-[99999] right-4"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                          {displayCountries.map(country => (
                            <a
                              key={country.slug}
                              href={country.fullPath}
                              className="px-3 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {country.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Năm Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'years-desktop' ? null : 'years-desktop')}
                    className="flex items-center text-sm font-medium hover:text-orange-500 transition-colors whitespace-nowrap"
                  >
                    Năm
                    <ChevronDown size={14} className="ml-1" />
                  </button>
                  {activeDropdown === 'years-desktop' && (
                    <>
                      <div 
                        className="fixed inset-0 z-[99998]"
                        onClick={() => setActiveDropdown(null)}
                      />
                      <div 
                        className="fixed bg-gray-900 rounded-lg shadow-2xl w-80 max-h-96 overflow-y-auto scrollbar-hide border border-gray-800 z-[99999] right-4"
                        style={{ top: '64px' }}
                      >
                        <div className="p-4 grid grid-cols-4 gap-2">
                          {displayYears.map(year => (
                            <a
                              key={year.slug}
                              href={year.fullPath}
                              className="px-2 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {year.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-4">
                <NotificationBell />
                
                {/* Search Icon - Desktop */}
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="p-2 hover:text-orange-500 transition-colors"
                    title="Tìm kiếm"
                  >
                    <Search size={20} />
                  </button>
                  
                  {showSearchDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowSearchDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-2xl z-50 border border-gray-800 p-4 top-full">
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              placeholder="Nhập tên phim..."
                              className="w-full bg-black text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 focus:border-orange-500 outline-none transition-all"
                              autoFocus
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition-all"
                          >
                            Tìm kiếm
                          </button>
                        </form>
                      </div>
                    </>
                  )}
                </div>

                {/* Filter Icon - Desktop */}
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="hidden lg:block p-2 hover:text-orange-500 transition-colors"
                  title="Bộ lọc"
                >
                  <Filter size={20} />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="lg:hidden p-2 hover:text-orange-500 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-70' : 'opacity-0'}`}
            onClick={toggleMenu}
          />

          <div className={`absolute left-0 top-0 h-full w-80 bg-black shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-gray-800`}>

            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">
                <span className="text-orange-500">DMT</span>
                <span className="text-blue-400">Movie</span>
              </h2>
              <button onClick={toggleMenu} className="p-2 hover:text-orange-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-800">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm phim..."
                    className="w-full bg-gray-900 text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-800 focus:border-orange-500 outline-none"
                  />
                </div>
              </form>
            </div>

            <div className="p-4 overflow-y-auto h-full pb-32">
              <div className="space-y-2">
                {/* Grid 2 cột cho mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <a href="/category/danh-sach/phim-bo" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Bộ
                  </a>
                  <a href="/category/danh-sach/phim-le" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Lẻ
                  </a>
                  <a href="/category/danh-sach/phim-chieu-rap" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Chiếu Rạp
                  </a>
                  <a href="/category/danh-sach/hoat-hinh" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Hoạt Hình
                  </a>
                  <a href="/category/danh-sach/phim-vietsub" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Vietsub
                  </a>
                  <a href="/category/danh-sach/phim-thuyet-minh" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Thuyết Minh
                  </a>
                  <a href="/category/danh-sach/phim-long-tieng" className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Lồng Tiếng
                  </a>
                </div>

                <button
                  onClick={() => setShowFilterModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all mt-4"
                >
                  <Filter className="w-4 h-4" />
                  Bộ lọc nâng cao
                </button>

                <div className="mt-4 space-y-2">
                  <div>
                    <button
                      onClick={() => toggleDropdown('genres')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium hover:bg-gray-900 hover:text-orange-500 rounded-lg transition-all"
                    >
                      <span>Thể Loại</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'genres' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'genres' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-gray-900 rounded-lg">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayGenres.map(genre => (
                              <a
                                key={genre.slug}
                                href={genre.fullPath}
                                className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                              >
                                {genre.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDropdown('countries')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium hover:bg-gray-900 hover:text-orange-500 rounded-lg transition-all"
                    >
                      <span>Quốc Gia</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'countries' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'countries' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 p-2 bg-gray-900 rounded-lg">
                        <div className="max-h-48 overflow-y-auto scrollbar-hide">
                          <div className="grid grid-cols-2 gap-2">
                            {displayCountries.map(country => (
                              <a
                                key={country.slug}
                                href={country.fullPath}
                                className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                              >
                                {country.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleDropdown('years')}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-medium hover:bg-gray-900 hover:text-orange-500 rounded-lg transition-all"
                    >
                      <span>Năm Phát Hành</span>
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeDropdown === 'years' ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === 'years' ? 'max-h-64' : 'max-h-0'}`}>
                      <div className="mt-2 max-h-48 overflow-y-auto scrollbar-hide">
                        <div className="grid grid-cols-3 gap-2">
                          {displayYears.map(year => (
                            <a
                              key={year.slug}
                              href={year.fullPath}
                              className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                            >
                              {year.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <FilterModal 
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilter={handleApplyFilter}
      />
    </>
  );
};

export default Navbar;
