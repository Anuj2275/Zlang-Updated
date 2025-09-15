import React from 'react';
import { LoadingSpinner } from './icons';

const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const SearchBar = ({ searchTerm, onSearchTermChange, searchLoading }) => {
    return (
        <div className="relative mb-8">
            <input
                type="text"
                placeholder="Search for any slang..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full pl-14 pr-4 py-4 text-lg bg-gray-800 text-white border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                {searchLoading ? <LoadingSpinner className="text-gray-500" /> : <SearchIcon className="h-6 w-6 text-gray-500" />}
            </div>
        </div>
    );
};

export default SearchBar;