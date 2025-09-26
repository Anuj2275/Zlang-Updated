import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/icons';

const API_BASE_URL = 'http://localhost:8081/api';

const LeaderboardPage = ({ setNotification }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/slangs/leaderboard`);
                if (!response.ok) {
                    throw new Error('Could not fetch leaderboard data.');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (error) {
                setNotification({ message: error.message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [setNotification]);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:px-8">
            <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-8 text-center">Top Contributors</h1>
            {isLoading ? (
                <div className="flex justify-center mt-12">
                    <LoadingSpinner className="text-lime-400 h-8 w-8" />
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl shadow-lg">
                    <ul className="divide-y divide-gray-700">
                        {leaderboardData.length > 0 ? (
                            leaderboardData.map((user, index) => (
                                <li key={user.authorName} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className={`text-xl font-bold ${index < 3 ? 'text-lime-400' : 'text-gray-400'} w-10`}>#{index + 1}</span>
                                        <span className="text-lg text-white ml-4">{user.authorName}</span>
                                    </div>
                                    <span className="text-lg font-bold text-white">{user.slangCount} slangs</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center p-8">The leaderboard is empty. Be the first to contribute!</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;