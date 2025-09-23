import React, { useState, useEffect } from 'react';
import SlangCard from '../components/SlangCard';

const API_BASE_URL = 'http://localhost:8081/api';

const SavedSlangsPage = ({ user, setNotification }) => {
    const [savedSlangs, setSavedSlangs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('zlang-token');

    useEffect(() => {
        const fetchSavedSlangs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/slangs/saved`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Could not fetch saved slangs.');
                const data = await response.json();
                setSavedSlangs(data);
            } catch (error) {
                setNotification({ message: error.message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavedSlangs();
    }, [token, setNotification]);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:px-8">
            <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-8">Your Saved Slangs</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {savedSlangs.length > 0 ? (
                        savedSlangs.map(slang => <SlangCard key={slang.id} slang={slang} />)
                    ) : (
                        <p className="text-gray-500 md:col-span-2">You haven't saved any slangs yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedSlangsPage;