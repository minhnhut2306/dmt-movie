import React, { useState } from 'react';
import { X, Filter, ChevronDown } from 'lucide-react';
import { useDynamicGenres, useDynamicCountries, ALL_YEARS } from '../utils/CategoryConfigDynamic';

const FilterModal = ({ isOpen, onClose, onApplyFilter }) => {
  const { genres } = useDynamicGenres();
  const { countries } = useDynamicCountries();
  
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    country: '',
    year: '',
    lang: '',
    sortField: 'modified.time',
    sortType: 'desc'
  });

  // Accordion state for mobile
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const types = [
    { value: 'phim-bo', label: 'Phim Bộ' },
    { value: 'phim-le', label: 'Phim Lẻ' },
    { value: 'tv-shows', label: 'TV Shows' },
    { value: 'hoat-hinh', label: 'Hoạt Hình' },
  ];

  const langs = [
    { value: 'vietsub', label: 'Vietsub' },
    { value: 'thuyet-minh', label: 'Thuyết Minh' },
    { value: 'long-tieng', label: 'Lồng Tiếng' },
  ];

  const sortFields = [
    { value: 'modified.time', label: 'Mới cập nhật' },
    { value: 'year', label: 'Năm phát hành' },
    { value: '_id', label: 'Mặc định' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      type: '',
      category: '',
      country: '',
      year: '',
      lang: '',
      sortField: 'modified.time',
      sortType: 'desc'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-black w-full max-w-lg sm:max-w-4xl rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden border border-orange-500/30">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Bộ lọc</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(85vh-120px)] scrollbar-hide">
          <div className="space-y-3">
            {/* Loại phim - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-orange-400 mb-2">Loại phim</label>
              <div className="grid grid-cols-2 gap-2">
                {types.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleFilterChange('type', filters.type === type.value ? '' : type.value)}
                    className={`px-2 py-2 rounded text-xs font-medium transition-all ${
                      filters.type === type.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-900 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ngôn ngữ - Always visible */}
            <div>
              <label className="block text-xs font-semibold text-blue-400 mb-2">Ngôn ngữ</label>
              <div className="grid grid-cols-3 gap-2">
                {langs.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => handleFilterChange('lang', filters.lang === lang.value ? '' : lang.value)}
                    className={`px-2 py-2 rounded text-xs font-medium transition-all ${
                      filters.lang === lang.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-900 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thể loại - Collapsible on mobile */}
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('category')}
                className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-400">Thể loại</span>
                  {filters.category && (
                    <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      {genres.find(g => g.slug === filters.category)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'category' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'category' && (
                <div className="p-3 bg-gray-900/30">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {genres.map(genre => (
                      <button
                        key={genre.slug}
                        onClick={() => {
                          handleFilterChange('category', filters.category === genre.slug ? '' : genre.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                          filters.category === genre.slug
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quốc gia - Collapsible on mobile */}
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('country')}
                className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-400">Quốc gia</span>
                  {filters.country && (
                    <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">
                      {countries.find(c => c.slug === filters.country)?.name}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'country' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'country' && (
                <div className="p-3 bg-gray-900/30">
                  <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {countries.map(country => (
                      <button
                        key={country.slug}
                        onClick={() => {
                          handleFilterChange('country', filters.country === country.slug ? '' : country.slug);
                          toggleSection(null);
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                          filters.country === country.slug
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Năm - Collapsible on mobile */}
            <div className="border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('year')}
                className="w-full flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-400">Năm phát hành</span>
                  {filters.year && (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {filters.year}
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${expandedSection === 'year' ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedSection === 'year' && (
                <div className="p-3 bg-gray-900/30">
                  <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                    {ALL_YEARS.map(year => (
                      <button
                        key={year.slug}
                        onClick={() => {
                          handleFilterChange('year', filters.year === year.slug ? '' : year.slug);
                          toggleSection(null);
                        }}
                        className={`px-1.5 py-1.5 rounded text-[10px] font-medium transition-all ${
                          filters.year === year.slug
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                      >
                        {year.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sắp xếp - Compact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-2">Sắp xếp</label>
                <select
                  value={filters.sortField}
                  onChange={(e) => handleFilterChange('sortField', e.target.value)}
                  className="w-full px-2 py-2 text-xs bg-gray-900 text-white rounded border border-gray-800 focus:border-orange-500 outline-none"
                >
                  {sortFields.map(field => (
                    <option key={field.value} value={field.value}>{field.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-yellow-400 mb-2">Thứ tự</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleFilterChange('sortType', 'desc')}
                    className={`px-2 py-2 rounded text-xs font-medium transition-all ${
                      filters.sortType === 'desc'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-900 text-gray-300 border border-gray-800'
                    }`}
                  >
                    Giảm
                  </button>
                  <button
                    onClick={() => handleFilterChange('sortType', 'asc')}
                    className={`px-2 py-2 rounded text-xs font-medium transition-all ${
                      filters.sortType === 'asc'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-900 text-gray-300 border border-gray-800'
                    }`}
                  >
                    Tăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="grid grid-cols-2 gap-2 p-3 sm:p-4 border-t border-gray-800 bg-black">
          <button
            onClick={handleReset}
            className="px-3 py-2.5 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all border border-gray-700"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium shadow-lg transition-all"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
