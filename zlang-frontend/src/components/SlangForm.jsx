import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './icons';

const SlangForm = ({ token, onFormSubmit, initialData = null, onCancel, setNotification }) => {
    const [term, setTerm] = useState('');
    const [meaning, setMeaning] = useState('');
    const [example, setExample] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = initialData !== null;
    const API_BASE_URL = 'http://localhost:8081/api';

    useEffect(() => {
        if (isEditing) {
            setTerm(initialData.term);
            setMeaning(initialData.meaning);
            setExample(initialData.example || '');
        } else {
            setTerm('');
            setMeaning('');
            setExample('');
        }
    }, [initialData, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const slangData = { term, meaning, example };
        const endpoint = isEditing ? `${API_BASE_URL}/slangs/${initialData.id}` : `${API_BASE_URL}/slangs`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(slangData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'create'} slang.`);
            onFormSubmit(result);
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Term" value={term} onChange={(e) => setTerm(e.target.value)} required className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition" />
            <textarea placeholder="Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} required rows="3" className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition" />
            <input type="text" placeholder="Example Sentence" value={example} onChange={(e) => setExample(e.target.value)} className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition" />
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 flex items-center justify-center font-semibold text-gray-900 bg-lime-400 rounded-lg hover:bg-lime-300 disabled:bg-lime-400/50 transition-colors">
                    {isLoading ? <LoadingSpinner className="text-gray-900" /> : (isEditing ? 'Save Changes' : 'Add Slang')}
                </button>
            </div>
        </form>
    );
};

export default SlangForm;