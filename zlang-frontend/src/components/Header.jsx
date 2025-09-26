import React from 'react';

const Header = ({ user, onLogout, setCurrentPage }) => {
    return (
        <header className="bg-gray-900/70 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-20">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div
                    onClick={() => setCurrentPage('dashboard')}
                    className="font-display text-3xl font-extrabold text-white tracking-wider cursor-pointer"
                >
                    Z-Lang <span className="text-lime-400">.</span>
                </div>
                <div className="flex items-center space-x-4 md:space-x-6">
                    <button onClick={() => setCurrentPage('mySlangs')} className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">My Slangs</button>
                    <button onClick={() => setCurrentPage('savedSlangs')} className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">Saved Slangs</button>
                    <button onClick={() => setCurrentPage('leaderboard')} className="hidden sm:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">Leaderboard</button>
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="text-sm text-gray-400">
                            Welcome, <span className="font-bold text-white">{user.name}</span>
                        </span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm font-semibold text-lime-400 bg-lime-400/10 rounded-lg hover:bg-lime-400/20 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;