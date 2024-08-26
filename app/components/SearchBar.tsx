"use client";
import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../store/slices/weatherSlice';
import { RootState, AppDispatch } from '../store/store';

interface Suggestion {
  type: 'city' | 'area';
  value: string;
  city?: string;
}

const SearchBar: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const localities = useSelector((state: RootState) => state.weather.localities);

  useEffect(() => {
    if (value.trim()) {
      const inputValueLower = value.trim().toLowerCase();
      const filteredSuggestions: Suggestion[] = Object.entries(localities).flatMap(([city, areas]) => {
        const citySuggestions: Suggestion[] = [];

        if (city.toLowerCase().includes(inputValueLower)) {
          citySuggestions.push({ type: 'city', value: city as 'city' });
          // Add all areas of the city if the city matches the search
          const areaSuggestions: Suggestion[] = Object.keys(areas).map(area => ({
            type: 'area' as const, // Explicitly set the type to 'area'
            value: area,
            city,
          }));
          return [...citySuggestions, ...areaSuggestions];
        }

        // If the city doesn't match, still add area suggestions based on the search
        const areaSuggestions = Object.keys(areas).filter(area =>
          area.toLowerCase().includes(inputValueLower)
        ).map(area => ({
          type: 'area' as const, // Explicitly set the type to 'area'
          value: area,
          city,
        }));

        return areaSuggestions;
      });

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, localities]);



  const handleSearch = () => {
    const selectedSuggestion = suggestions.find(s => s.value.toLowerCase() === value.toLowerCase());
    if (selectedSuggestion) {
      const city = selectedSuggestion.type === 'city' ? selectedSuggestion.value : selectedSuggestion.city!;
      const area = selectedSuggestion.type === 'area' ? selectedSuggestion.value : Object.keys(localities[city])[0];
      
      // Find the city in a case-insensitive manner
      const cityKey = Object.keys(localities).find(key => key.toLowerCase() === city.toLowerCase());
      
      if (cityKey && localities[cityKey][area]) {
        const localityId = localities[cityKey][area].localityId;
        dispatch(fetchWeather(localityId));
      } else {
        console.error('City or area not found');
      }
    } else {
      console.error('Invalid selection');
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setValue(suggestion.value);
    setShowSuggestions(false);
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className='relative w-full max-w-3xl mx-auto px-4 py-3'>
      <div className='flex items-center bg-white rounded-full shadow-md overflow-hidden'>
        <input
          type='text'
          placeholder='Search for a city or area...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-grow px-4 py-2 outline-none text-gray-700'
        />
        <button
          type="button"
          className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleSearch}
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className='absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className='p-3 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out'
            >
              {suggestion.type === 'area' ? `${suggestion.value}, ${suggestion.city}` : suggestion.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default SearchBar;

