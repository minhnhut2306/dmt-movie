import { useState, useEffect } from "react";
import { Menu, X, Search, ChevronDown, Filter, History, Play, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import FilterModal from "./FilterModal";
import {
  useDynamicGenres,
  useDynamicCountries,
  ALL_YEARS
} from "../utils/CategoryConfigDynamic";
import NotificationBell from "./NotificationBell";
import { getAllWatchHistory, removeFromWatchHistory } from "../utils/watchHistory";
import { getSafeImageUrl } from "../utils/imageHelper";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const openHistory = () => {
    setHistoryItems(getAllWatchHistory().slice(0, 12));
    setShowHistory(true);
  };

  const handleRemoveHistory = (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchHistory(slug);
    setHistoryItems(prev => prev.filter(h => h.slug !== slug));
  };

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
    
    navigate(`/filter?${params.toString()}`);
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
              <Link to="/" className="flex items-center">
                <h1 className="text-2xl font-bold">
                  <span className="text-orange-500">DMT</span>
                  <span className="text-blue-400">Movie</span>
                </h1>
              </Link>

              {/* Desktop Menu chính */}
              <div className="hidden lg:flex items-center space-x-8">
                <Link to="/category/danh-sach/phim-bo" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Bộ
                </Link>
                <Link to="/category/danh-sach/phim-le" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Lẻ
                </Link>
                <Link to="/category/danh-sach/phim-chieu-rap" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Phim Chiếu Rạp
                </Link>
                <Link to="/category/danh-sach/hoat-hinh" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Hoạt Hình
                </Link>
                <Link to="/category/danh-sach/phim-vietsub" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Vietsub
                </Link>
                <Link to="/category/danh-sach/phim-thuyet-minh" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Thuyết Minh
                </Link>
                <Link to="/category/danh-sach/phim-long-tieng" className="text-sm font-medium hover:text-orange-500 transition-colors">
                  Lồng Tiếng
                </Link>

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
                            <Link
                              key={genre.slug}
                              to={genre.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className="px-3 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {genre.name}
                            </Link>
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
                            <Link
                              key={country.slug}
                              to={country.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className="px-3 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {country.name}
                            </Link>
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
                            <Link
                              key={year.slug}
                              to={year.fullPath}
                              onClick={() => setActiveDropdown(null)}
                              className="px-2 py-2 bg-black hover:bg-orange-500 rounded-lg text-sm transition-all text-center border border-gray-800"
                            >
                              {year.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <NotificationBell />

                {/* History Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => showHistory ? setShowHistory(false) : openHistory()}
                    className="p-2 hover:text-orange-500 transition-colors"
                    title="Lịch sử xem"
                  >
                    <History size={20} />
                  </button>

                  {showHistory && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                      <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-800 overflow-hidden top-full">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                          <span className="text-sm font-semibold text-white">Xem gần đây</span>
                          <Link
                            to="/history"
                            onClick={() => setShowHistory(false)}
                            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                          >
                            Xem tất cả →
                          </Link>
                        </div>

                        {historyItems.length === 0 ? (
                          <div className="py-10 text-center text-gray-500 text-sm">
                            Chưa có lịch sử xem
                          </div>
                        ) : (
                          <div className="max-h-96 overflow-y-auto scrollbar-hide">
                            {historyItems.map(item => (
                              <div
                                key={item.slug}
                                className="group flex items-center gap-3 px-3 py-2.5 hover:bg-gray-800 cursor-pointer transition-colors"
                                onClick={() => { navigate(`/movie/${item.slug}`); setShowHistory(false); }}
                              >
                                <div className="relative flex-shrink-0 w-10 h-14 rounded overflow-hidden bg-gray-800">
                                  <img
                                    src={getSafeImageUrl(item.poster, item.title)}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                                  {item.lastEpisodeName && (
                                    <p className="text-orange-400 text-xs truncate">{item.lastEpisodeName}</p>
                                  )}
                                  <p className="text-gray-500 text-xs mt-0.5">
                                    {item.timestamp ? (() => {
                                      const diff = Date.now() - item.timestamp;
                                      const m = Math.floor(diff / 60000);
                                      if (m < 1) return 'Vừa xem';
                                      if (m < 60) return `${m} phút trước`;
                                      const h = Math.floor(m / 60);
                                      if (h < 24) return `${h} giờ trước`;
                                      return `${Math.floor(h / 24)} ngày trước`;
                                    })() : ''}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => handleRemoveHistory(e, item.slug)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-600/30 hover:text-red-400 text-gray-600 rounded transition-all flex-shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Search Icon - Mobile */}
                <div className="lg:hidden relative">
                  <button
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="p-2 hover:text-orange-500 transition-colors"
                  >
                    <Search size={20} />
                  </button>

                  {showSearchDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowSearchDropdown(false)}
                      />
                      <div
                        className="absolute right-0 mt-2 w-72 bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-800 p-3"
                      >
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                            <input
                              type="text"
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                              placeholder="Nhập tên phim..."
                              className="w-full bg-black text-white pl-9 pr-16 py-2 rounded-lg border border-gray-700 focus:border-orange-500 outline-none text-sm"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md text-xs font-medium transition-all"
                            >
                              Tìm
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </div>
                
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

            {/* Mobile Search đã có trên navbar rồi, bỏ ở đây */}

            <div className="p-4 overflow-y-auto h-full pb-32">
              <div className="space-y-2">
                {/* Grid 2 cột cho mobile */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/category/danh-sach/phim-bo" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Bộ
                  </Link>
                  <Link to="/category/danh-sach/phim-le" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Lẻ
                  </Link>
                  <Link to="/category/danh-sach/phim-chieu-rap" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Phim Chiếu Rạp
                  </Link>
                  <Link to="/category/danh-sach/hoat-hinh" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Hoạt Hình
                  </Link>
                  <Link to="/category/danh-sach/phim-vietsub" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Vietsub
                  </Link>
                  <Link to="/category/danh-sach/phim-thuyet-minh" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Thuyết Minh
                  </Link>
                  <Link to="/category/danh-sach/phim-long-tieng" onClick={toggleMenu} className="block px-3 py-2.5 text-sm font-medium bg-gray-900 hover:bg-gray-800 hover:text-orange-500 rounded-lg transition-all text-center border border-gray-800">
                    Lồng Tiếng
                  </Link>
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
                              <Link
                                key={genre.slug}
                                to={genre.fullPath}
                                onClick={toggleMenu}
                                className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                              >
                                {genre.name}
                              </Link>
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
                              <Link
                                key={country.slug}
                                to={country.fullPath}
                                onClick={toggleMenu}
                                className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                              >
                                {country.name}
                              </Link>
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
                            <Link
                              key={year.slug}
                              to={year.fullPath}
                              onClick={toggleMenu}
                              className="block px-2 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white rounded-lg transition-all text-center"
                            >
                              {year.name}
                            </Link>
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
