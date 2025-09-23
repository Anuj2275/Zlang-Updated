import React from 'react';

// <<< FIX: ADD THESE TWO ICONS BACK
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg> );
const DeleteIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SlangCard = ({ slang, currentUserId, onEdit, onDelete, onSave, isSaved }) => {
    const isOwner = slang.authorId === currentUserId;

    return (
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-lime-400/50 hover:-translate-y-1 transition-all duration-300 ease-in-out group relative">
            <div className="flex justify-between items-start">
                <h3 className="font-display text-2xl font-bold text-lime-400 tracking-tight group-hover:text-lime-300 transition-colors pr-16">{slang.term}</h3>
                {onSave && (
                     <button onClick={onSave} className={`p-2 rounded-full transition-colors ${isSaved ? 'text-lime-400 bg-lime-900/50' : 'text-gray-400 bg-gray-700/50 hover:bg-gray-700 hover:text-white'}`}>
                        <SaveIcon />
                    </button>
                )}
            </div>
            <p className="text-gray-300 mt-2">{slang.meaning}</p>
            {slang.example && <p className="text-gray-500 italic text-sm mt-4">"{slang.example}"</p>}

            {isOwner && (
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-full transition-colors"><EditIcon /></button>
                    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-full transition-colors"><DeleteIcon /></button>
                </div>
            )}
        </div>
    );
};

export default SlangCard;