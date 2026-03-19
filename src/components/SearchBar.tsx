import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

interface SearchBarProps {
  variant?: 'default' | 'hero';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mock search suggestions
  const mockSuggestions = [
    'آيفون 14 برو مكس',
    'سيارة BMW',
    'لابتوب ماك بوك',
    'شقة للبيع الرياض',
    'PlayStation 5',
    'ساعة رولكس',
    'غرفة نوم مودرن',
    'دراجة هوائية',
    'كاميرا كانون',
    'جهاز تمارين'
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.includes(query)
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', finalQuery.trim());
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      navigate(`/listings?${params.toString()}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const isHero = variant === 'hero';
  const containerClass = isHero
    ? 'max-w-4xl mx-auto'
    : 'max-w-2xl';

  return (
    <div className={`relative ${containerClass} ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Selector */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`
              ${isHero 
                ? 'h-14 px-4 text-lg bg-white/95 backdrop-blur-md border-white/30'
                : 'h-12 px-3 text-base bg-white border-gray-200'
              }
              w-full sm:w-48 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-gray-700 font-medium transition-all duration-200
            `}
          >
            <option value="">جميع الأقسام</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => query.length > 0 && setShowSuggestions(true)}
              placeholder="ابحث عن أي شيء..."
              className={`
                ${isHero 
                  ? 'h-14 pr-14 pl-4 text-lg bg-white/95 backdrop-blur-md border-white/30 placeholder:text-gray-500'
                  : 'h-12 pr-12 pl-4 text-base bg-white border-gray-200 placeholder:text-gray-400'
                }
                w-full rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-gray-700 transition-all duration-200
              `}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center"
                >
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className={`
            ${isHero 
              ? 'h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              : 'h-12 px-6 text-base bg-blue-600 hover:bg-blue-700'
            }
            text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl
            flex items-center justify-center min-w-fit
          `}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          ابحث
        </button>
      </div>

      {/* Quick Search Tags */}
      {isHero && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="text-white/80 text-sm mr-4">البحث الشائع:</span>
          {['سيارات', 'عقارات', 'جوالات', 'إلكترونيات', 'أثاث'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;