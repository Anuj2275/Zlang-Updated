import React from 'react';
import { AiSparkleIcon } from './AiIcons';

const AiSlangCard = ({ slang }) => {
    if (!slang) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-lime-500/30 hover:border-lime-500/60 hover:-translate-y-1.5 transition-all duration-300 ease-in-out group relative md:col-span-2">
            <div className="flex justify-between items-start">
                <h3 className="font-display text-2xl font-bold text-lime-400 tracking-tight group-hover:text-lime-300 transition-colors">{slang.term}</h3>
                <span className="flex items-center space-x-2 text-xs font-bold text-lime-300 bg-lime-900/50 px-2 py-1 rounded-full">
                    <AiSparkleIcon />
                    <span>AI Definition</span>
                </span>
            </div>
            <p className="text-gray-300 mt-2">{slang.meaning}</p>
            <p className="text-gray-500 italic text-sm mt-4">"{slang.example}"</p>
        </div>
    );
};

export default AiSlangCard;