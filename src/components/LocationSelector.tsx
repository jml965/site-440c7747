import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, MapPin, Navigation, AlertCircle } from 'lucide-react';
import { CITIES } from '../utils/constants';

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  error,
  placeholder = 'اختر المدينة',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [popularCities, setPopularCities] = useState<typeof CITIES>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected city
  useEffect(() => {
    const city = CITIES.find(c => c.id === value);
    setSelectedCity(city?.name || '');
  }, [value]);

  // Set popular cities (most commonly used)
  useEffect(() => {
    const popular = CITIES
      .filter(city => city.popular)
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, 8);
    setPopularCities(popular);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter cities based on search term
  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.searchKeywords?.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Group cities by region
  const citiesByRegion = filteredCities.reduce((groups, city) => {
    const region = city.region || 'أخرى';
    if (!groups[region]) {
      groups[region] = [];
    }
    groups[region].push(city);
    return groups;
  }, {} as Record<string, typeof CITIES>);

  const handleCitySelect = (cityId: string) => {
    onChange(cityId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode these coordinates
          // For now, we'll just show Riyadh as default
          const riyadh = CITIES.find(city => city.id === 'riyadh');
          if (riyadh) {
            handleCitySelect(riyadh.id);
          }
        },
        (error) => {
          console.error('Error detecting location:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-right border rounded-xl flex items-center justify-between
          transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error 
            ? 'border-red-300 bg-red-50' 
            : isOpen 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {selectedCity}
                </div>
                {CITIES.find(c => c.id === value)?.region && (
                  <div className="text-xs text-gray-500">
                    {CITIES.find(c => c.id === value)?.region}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <MapPin className={`w-5 h-5 ${error ? 'text-red-500' : 'text-gray-400'}`} />
              <span className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
                {placeholder}
              </span>
            </>
          )}
        </div>
        
        <ChevronDown className={`
          w-5 h-5 transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
          ${error ? 'text-red-500' : 'text-gray-400'}
        `} />
      </button>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-white">
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="ابحث عن مدينة..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Location Detection */}
            <button
              onClick={detectLocation}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <Navigation className="w-4 h-4" />
              تحديد موقعي الحالي
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {!searchTerm && popularCities.length > 0 && (
              /* Popular Cities */
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">المدن الشائعة</h4>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.id)}
                      className={`
                        p-2 rounded-lg text-right flex items-center gap-2
                        transition-all duration-150
                        ${value === city.id 
                          ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cities List */}
            {filteredCities.length > 0 ? (
              <div className="p-2">
                {searchTerm ? (
                  /* Search Results */
                  filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city.id)}
                      className={`
                        w-full p-3 rounded-lg text-right flex items-center gap-3
                        transition-all duration-150
                        ${value === city.id 
                          ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div className="flex-1 text-right">
                        <div className="font-medium text-sm">{city.name}</div>
                        {city.region && (
                          <div className="text-xs text-gray-500">{city.region}</div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  /* All Cities by Region */
                  Object.entries(citiesByRegion).map(([region, cities]) => (
                    <div key={region} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 px-3 py-2 bg-gray-50 rounded-lg mb-2">
                        {region}
                      </h4>
                      <div className="space-y-1">
                        {cities.map((city) => (
                          <button
                            key={city.id}
                            onClick={() => handleCitySelect(city.id)}
                            className={`
                              w-full p-2 rounded-lg text-right flex items-center gap-3
                              transition-all duration-150
                              ${value === city.id 
                                ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                : 'hover:bg-gray-50 text-gray-700'
                              }
                            `}
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{city.name}</span>
                            {city.population && (
                              <span className="text-xs text-gray-400 mr-auto">
                                {(city.population / 1000000).toFixed(1)}م نسمة
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* No Results */
              <div className="p-8 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">لا توجد مدن مطابقة</p>
                <p className="text-sm">
                  جرب البحث بكلمة أخرى أو تصفح جميع المدن
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  مسح البحث
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filteredCities.length} مدينة متاحة • 
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                اقترح إضافة مدينة
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;