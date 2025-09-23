import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Translator from '../components/Translator';
import SearchBar from '../components/SearchBar';
import AiSlangCard from '../components/AiSlangCard';
import SlangCard from '../components/SlangCard';
import Modal from '../components/Modal';
import SlangForm from '../components/SlangForm';
import MySlangsPage from './MySlangsPage';
import SavedSlangsPage from './SavedSlangsPage';

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

const DashboardPage = ({ user, onLogout, apiKey, setNotification }) => {
    const [slangs, setSlangs] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // <<< FIX: ADD THIS LINE
    const [aiSlang, setAiSlang] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedSlang, setSelectedSlang] = useState(null);
    const [savedSlangIds, setSavedSlangIds] = useState(new Set(user.savedSlangIds || []));
    const [currentPage, setCurrentPage] = useState('dashboard');
    const token = localStorage.getItem('zlang-token');

    const fetchCommunitySlangs = useCallback(async (query) => {
        setSearchLoading(true);
        setAiSlang(null);
        const communityPromise = fetch(`${API_BASE_URL}/slangs/search?query=${encodeURIComponent(query)}`).then(res => res.ok ? res.json() : []).catch(() => []);
        const aiPromise = query.trim() ? fetchSlangFromGemini(query, apiKey) : Promise.resolve(null);
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

    // <<< FIX: ADD THIS ENTIRE useEffect HOOK
    useEffect(() => {
        if (currentPage === 'dashboard') {
            const timer = setTimeout(() => {
                fetchCommunitySlangs(searchTerm || '');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, currentPage, fetchCommunitySlangs]);


    const openModal = (mode, slang = null) => {
        setModalMode(mode);
        setSelectedSlang(slang);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSlang(null);
    };

    const handleFormSubmit = (updatedSlang) => {
        if (modalMode === 'add') {
            setSlangs(prev => [updatedSlang, ...prev]);
            setNotification({ message: 'Slang added successfully!', type: 'success' });
        } else {
            setSlangs(prev => prev.map(s => s.id === updatedSlang.id ? updatedSlang : s));
            setNotification({ message: 'Slang updated successfully!', type: 'success' });
        }
        closeModal();
    };

    const handleDeleteConfirm = async () => {
        if (!selectedSlang) return;
        try {
            const response = await fetch(`${API_BASE_URL}/slangs/${selectedSlang.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to delete slang.');
            setSlangs(prev => prev.filter(s => s.id !== selectedSlang.id));
            setNotification({ message: 'Slang deleted successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
        closeModal();
    };

    const handleSaveToggle = async (slangId) => {
        const isCurrentlySaved = savedSlangIds.has(slangId);
        const method = isCurrentlySaved ? 'DELETE' : 'POST';
        const endpoint = `${API_BASE_URL}/slangs/${slangId}/save`;
        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Could not update saved status.');
            const newSavedIds = new Set(savedSlangIds);
            if (isCurrentlySaved) {
                newSavedIds.delete(slangId);
                setNotification({ message: 'Slang unsaved!', type: 'success' });
            } else {
                newSavedIds.add(slangId);
                setNotification({ message: 'Slang saved!', type: 'success' });
            }
            setSavedSlangIds(newSavedIds);
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'mySlangs':
                return <MySlangsPage user={user} setNotification={setNotification} />;
            case 'savedSlangs':
                return <SavedSlangsPage user={user} setNotification={setNotification} />;
            default:
                return (
                    <>
                        <div className="text-center mt-8 mb-12">
                            <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white leading-tight">Share Your Lingo</h1>
                            <p className="max-w-xl mx-auto mt-3 text-gray-400">Contribute to the culture. Add a new slang term the world needs to know.</p>
                            <button onClick={() => openModal('add')} className="mt-6 inline-block px-8 py-3 font-bold text-gray-900 bg-lime-400 rounded-lg hover:bg-lime-300 transition-colors shadow-lg shadow-lime-500/10">Add New Slang</button>
                        </div>
                        <Translator apiKey={apiKey} />
                        <div className="mt-16 w-full max-w-4xl mx-auto">
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchTermChange={setSearchTerm}
                                searchLoading={searchLoading}
                            />
                            <div className="grid gap-6 md:grid-cols-2">
                                {aiSlang && <AiSlangCard slang={aiSlang} />}
                                {slangs.map(slang =>
                                    <SlangCard
                                        key={slang.id}
                                        slang={slang}
                                        currentUserId={user.userId}
                                        onEdit={() => openModal('edit', slang)}
                                        onDelete={() => openModal('delete', slang)}
                                        onSave={() => handleSaveToggle(slang.id)}
                                        isSaved={savedSlangIds.has(slang.id)}
                                    />
                                )}
                                {!searchLoading && !aiSlang && slangs.length === 0 && (
                                     <div className="text-center text-gray-500 md:col-span-2 mt-8 py-10 bg-gray-800/50 rounded-2xl">
                                        <p>{searchTerm ? 'No results found.' : 'No community slangs yet. Add one!'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div>
            <Header user={user} onLogout={onLogout} setCurrentPage={setCurrentPage} />
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'add' ? 'Add New Slang' : modalMode === 'edit' ? 'Edit Slang' : 'Confirm Deletion'}>
                {modalMode === 'add' || modalMode === 'edit' ? (
                    <SlangForm token={token} onFormSubmit={handleFormSubmit} initialData={selectedSlang} onCancel={closeModal} setNotification={setNotification} />
                ) : (
                    <div>
                        <p className="text-gray-300">Are you sure you want to delete the term <span className="font-bold text-white">"{selectedSlang?.term}"</span>? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors">Yes, Delete</button>
                        </div>
                    </div>
                )}
            </Modal>
            <main className="container mx-auto p-4 sm:p-6 lg:px-8">
                {renderPage()}
            </main>
        </div>
    );
};

export default DashboardPage;