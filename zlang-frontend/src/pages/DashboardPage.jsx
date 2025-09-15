import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Translator from '../components/Translator';
import SearchBar from '../components/SearchBar';
import AiSlangCard from '../components/AiSlangCard';

const fetchSlangFromGemini = async (term, apiKey) => {
    // THIS IS THE CORRECT CHECK. It looks for the placeholder.
    if (!apiKey || apiKey === 'YOUR_GOOGLE_AI_API_KEY_HERE') {
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

const DashboardPage = ({ user, onLogout, apiKey }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [aiSlang, setAiSlang] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim()) {
                setSearchLoading(true);
                setAiSlang(null);
                fetchSlangFromGemini(searchTerm, apiKey).then(result => {
                    setAiSlang(result);
                    setSearchLoading(false);
                });
            } else {
                setAiSlang(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, apiKey]);

    return (
        <div>
            <Header user={user} onLogout={onLogout} />
            <main className="container mx-auto p-4 sm:p-6 lg:px-8">
                <Translator apiKey={apiKey} />
                <div className="mt-16 w-full max-w-4xl mx-auto">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        searchLoading={searchLoading}
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                        {aiSlang && <AiSlangCard slang={aiSlang} />}
                        {!searchLoading && !aiSlang && searchTerm && (
                             <div className="text-center text-gray-500 md:col-span-2 mt-8 py-10 bg-gray-800/50 rounded-2xl">
                                <p>No AI definition found for "{searchTerm}". Try another word!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

