import React, { useState } from 'react';
import { LoadingSpinner } from './icons';
import { SwapIcon } from './AiIcons';

const callGeminiAPI = async (prompt, apiKey) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Translation request failed.");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};

const Translator = ({ apiKey }) => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isSlangToEnglish, setIsSlangToEnglish] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim() || !apiKey || apiKey === 'YOUR_GOOGLE_AI_API_KEY_HERE') {
            setOutputText('Please enter text to translate and ensure your API key is set in App.jsx.');
            return;
        }
        setIsLoading(true);
        setOutputText('');

        const fromLang = isSlangToEnglish ? "modern internet slang" : "proper formal English";
        const toLang = isSlangToEnglish ? "proper formal English" : "modern internet slang";

        const prompt = `Translate the following text from ${fromLang} to ${toLang}. Provide only the translated text, without any additional commentary or labels:\n\n"${inputText}"`;

        try {
            const translation = await callGeminiAPI(prompt, apiKey);
            setOutputText(translation.trim());
        } catch (error) {
            setOutputText("Sorry, an error occurred during translation.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto my-16">
            <h2 className="font-display text-3xl font-bold text-white mb-6 text-center">Slang Translator</h2>
            <div className="grid md:grid-cols-2 gap-4 items-center relative">
                <textarea
                    placeholder={isSlangToEnglish ? "Enter slang..." : "Enter formal English..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows="4"
                    className="w-full p-4 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition resize-none" />

                <div className="flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 my-2 md:my-0">
                    <button onClick={() => setIsSlangToEnglish(!isSlangToEnglish)} className="p-3 bg-gray-700 rounded-full text-lime-400 hover:bg-gray-600 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-lime-400">
                        <SwapIcon />
                    </button>
                </div>

                <div className="w-full p-4 h-full min-h-[112px] bg-gray-900 text-gray-300 border-2 border-gray-700 rounded-lg flex items-center justify-center">
                    {isLoading ? <LoadingSpinner className="text-lime-400" /> : outputText || (isSlangToEnglish ? "Translation to English appears here..." : "Translation to slang appears here...")}
                </div>
            </div>
            <button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="mt-6 w-full max-w-xs mx-auto flex justify-center py-3 px-4 rounded-lg font-bold text-gray-900 bg-lime-400 hover:bg-lime-300 disabled:bg-lime-400/50 transition-colors">
                {isLoading ? <LoadingSpinner className="text-gray-900" /> : 'Translate'}
            </button>
        </div>
    );
};

export default Translator;