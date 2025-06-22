// frontend/src/components/LeftComponent/SearchBoxInput.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBoxInput({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value); // Pass the search query to the parent if provided
  };

  const handleSearchSubmit = () => {
    if (onSearch) onSearch(searchQuery); // Trigger search on icon click
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearch) onSearch(''); // Clear search in parent
  };

  return (
    <div className="relative group">
      <div
        className={`relative bg-[#1E293B]/60 backdrop-blur-lg rounded-xl shadow-lg border border-[#2A3447]/30 transition-all duration-300 ease-in-out
          ${isFocused ? 'scale-[1.02] border-blue-500/50 shadow-blue-500/20' : 'group-hover:border-blue-500/30 group-hover:shadow-blue-500/10'}`}
      >
        {/* Optional: Add a subtle noise texture */}
        <div className="absolute inset-0 rounded-xl bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-5"></div>

        <div className="relative flex items-center gap-2 p-2 sm:p-3">
          {/* Search Icon */}
          <button
            onClick={handleSearchSubmit}
            className="absolute inset-y-0 left-3 flex items-center justify-center text-[#1E90FF] hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            title="Search"
          >
            <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Input */}
          <input
            type="text"
            id="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search profiles..."
            className="w-full rounded-xl border-none bg-transparent p-2.5 sm:p-3 pl-10 sm:pl-12 text-white placeholder-gray-400/70 focus:outline-none focus:ring-0 transition-all duration-300 text-sm sm:text-base font-medium tracking-wide"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              title="Clear Search"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBoxInput;