import React, { useState } from 'react';
import { LoadingSpinner } from './icons';
import { SwapIcon, AiSparkleIcon } from './AiIcons';

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const Translator = ({ apiKey }) => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isSlangToEnglish, setIsSlangToEnglish] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleTranslate = async () => {
        if (!inputText.trim() || !apiKey || apiKey.includes('YOUR_GOOGLE_AI_API_KEY')) {
            setOutputText('Please enter text to translate and ensure your API key is set.');
            return;
        }
        setIsLoading(true);
        setOutputText('');

        const fromLang = isSlangToEnglish ? "modern internet slang" : "proper formal English";
        const toLang = isSlangToEnglish ? "proper formal English" : "modern internet slang";
        const prompt = `Translate the following text from ${fromLang} to ${toLang}. Provide only the translated text, without any additional commentary or labels:\n\n"${inputText}"`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                throw new Error(`AI service responded with status: ${response.status}. Please check API key and configuration.`);
            }

            const data = await response.json();
            const translation = data.candidates[0].content.parts[0].text;
            setOutputText(translation.trim());
        } catch (error) {
            setOutputText(error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (outputText && !isLoading) {
            navigator.clipboard.writeText(outputText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const fromLanguage = isSlangToEnglish ? 'Slang' : 'Formal English';
    const toLanguage = isSlangToEnglish ? 'Formal English' : 'Slang';

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto my-16">
            <h2 className="font-display text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                <AiSparkleIcon /> AI Slang Translator
            </h2>
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* FROM BOX */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 px-1">From: {fromLanguage}</label>
                    <textarea
                        placeholder={`Enter ${fromLanguage.toLowerCase()}...`}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        rows="5"
                        className="w-full p-4 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition resize-none"
                    />
                </div>

                {/* SWAP BUTTON */}
                <div className="flex justify-center mt-8">
                    <button onClick={() => setIsSlangToEnglish(!isSlangToEnglish)} className="p-3 bg-gray-700 rounded-full text-lime-400 hover:bg-gray-600 transition-colors focus:outline-none ring-2 ring-transparent focus:ring-lime-400">
                        <SwapIcon />
                    </button>
                </div>

                {/* TO BOX - UI FIX APPLIED HERE */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 px-1">To: {toLanguage}</label>
                    <div className="relative w-full h-full min-h-[140px] bg-gray-900 border-2 border-gray-700 rounded-lg">
                        <div className="p-4 pr-14 text-gray-300">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full pt-8">
                                    <LoadingSpinner className="text-lime-400" />
                                </div>
                            ) : (
                                outputText || `Translation to ${toLanguage.toLowerCase()} appears here...`
                            )}
                        </div>
                        {outputText && !isLoading && (
                            <button onClick={handleCopy} className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-full transition-colors">
                                {copied ? <span className="text-xs px-1">Copied!</span> : <CopyIcon />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <button onClick={handleTranslate} disabled={isLoading || !inputText.trim()} className="mt-8 w-full max-w-xs mx-auto flex justify-center py-3 px-4 rounded-lg font-bold text-gray-900 bg-lime-400 hover:bg-lime-300 disabled:bg-lime-400/50 transition-colors">
                {isLoading ? <LoadingSpinner className="text-gray-900" /> : 'Translate'}
            </button>
        </div>
    );
};

export default Translator;