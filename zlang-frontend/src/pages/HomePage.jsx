import React, { useState, useEffect, useCallback } from 'react';
import Translator from '../components/Translator';
import SearchBar from '../components/SearchBar';
import AiSlangCard from '../components/AiSlangCard';
import SlangCard from '../components/SlangCard';
import AuthPage from './AuthPage'; // We will reuse the AuthPage for the form

const API_BASE_URL = 'http://localhost:8081/api';

const fetchSlangFromGemini = async (term, apiKey) => {
    if (!apiKey || apiKey.includes('YOUR_GOOGLE_AI_API_KEY')) {
        console.warn("Gemini API key is not set. Skipping AI search.");
        return null;
    }
    const prompt = `You are a slang dictionary. Define the slang term "${term}". Provide a concise meaning and a creative, realistic example sentence. Format your response as a JSON object with three keys: "term", "meaning", and "example". Provide only the JSON object.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) return null;
        const data = await response.json();
        const jsonText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Failed to fetch or parse Gemini response:", error);
        return null;
    }
};


const HomePage = ({ onAuthSuccess, apiKey, setNotification }) => {
    const [slangs, setSlangs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [aiSlang, setAiSlang] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const fetchCommunitySlangs = useCallback(async (query) => {
        if (!query.trim()) {
            setSlangs([]);
            setAiSlang(null);
            return;
        }
        setSearchLoading(true);
        setAiSlang(null);

        const communityPromise = fetch(`${API_BASE_URL}/slangs/search?query=${encodeURIComponent(query)}`).then(res => res.ok ? res.json() : []).catch(() => []);
        const aiPromise = fetchSlangFromGemini(query, apiKey);

        try {
            const [communityResults, aiResult] = await Promise.all([communityPromise, aiPromise]);
            setSlangs(communityResults);
            setAiSlang(aiResult);
        } catch (error) {
            setNotification({ message: 'An error occurred while searching.', type: 'error' });
        } finally {
            setSearchLoading(false);
        }
    }, [apiKey, setNotification]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCommunitySlangs(searchTerm);
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [searchTerm, fetchCommunitySlangs]);

    if (showLogin) {
        return <AuthPage onAuthSuccess={onAuthSuccess} setNotification={setNotification} />;
    }

    return (
        <>
            <header className="bg-gray-900/70 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-20">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="font-display text-3xl font-extrabold text-white tracking-wider">
                        Z-Lang <span className="text-lime-400">.</span>
                    </div>
                    <button
                        onClick={() => setShowLogin(true)}
                        className="px-4 py-2 text-sm font-semibold text-gray-900 bg-lime-400 rounded-lg hover:bg-lime-300 transition-colors"
                    >
                        Login / Register
                    </button>
                </nav>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:px-8">
                <div className="text-center my-8">
                    <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        Define Your <span className="text-lime-400">World.</span>
                    </h1>
                    <p className="max-w-xl mx-auto mt-4 text-gray-400">
                        The definitive, AI-powered and community-driven dictionary for modern slang.
                    </p>
                </div>
                <Translator apiKey={apiKey} />
                <div className="mt-16 w-full max-w-4xl mx-auto">
                    <h2 className="font-display text-3xl font-bold text-white mb-6 text-center">Community Dictionary</h2>
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        searchLoading={searchLoading}
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                        {aiSlang && <AiSlangCard slang={aiSlang} />}
                        {slangs.map(slang => <SlangCard key={slang.id} slang={slang} />)}
                        {!searchLoading && !aiSlang && slangs.length === 0 && searchTerm && (
                            <div className="text-center text-gray-500 md:col-span-2 mt-8 py-10 bg-gray-800/50 rounded-2xl">
                                <p>No community definitions found for "{searchTerm}". Login to be the first to add one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default HomePage;