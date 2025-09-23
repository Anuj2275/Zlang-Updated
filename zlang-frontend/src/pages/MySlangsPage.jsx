import React, { useState, useEffect, useCallback } from 'react';
import { LoadingSpinner } from '../components/icons';
import SlangCard from '../components/SlangCard';
import Modal from '../components/Modal';
import SlangForm from '../components/SlangForm';

const API_BASE_URL = 'http://localhost:8081/api';

const MySlangsPage = ({ user, setNotification }) => {
    const [mySlangs, setMySlangs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('edit');
    const [selectedSlang, setSelectedSlang] = useState(null);
    const token = localStorage.getItem('zlang-token');

    const fetchMySlangs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/slangs/my-slangs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Could not fetch your slangs.');
            const data = await response.json();
            setMySlangs(data);
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [token, setNotification]);

    useEffect(() => {
        fetchMySlangs();
    }, [fetchMySlangs]);

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
        setMySlangs(prev => prev.map(s => s.id === updatedSlang.id ? updatedSlang : s));
        setNotification({ message: 'Slang updated successfully!', type: 'success' });
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
            setMySlangs(prev => prev.filter(s => s.id !== selectedSlang.id));
            setNotification({ message: 'Slang deleted successfully!', type: 'success' });
        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        }
        closeModal();
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:px-8">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'edit' ? 'Edit Slang' : 'Confirm Deletion'}>
                {modalMode === 'edit' ? (
                    <SlangForm token={token} onFormSubmit={handleFormSubmit} initialData={selectedSlang} onCancel={closeModal} setNotification={setNotification} />
                ) : (
                    <div>
                        <p className="text-gray-300">Are you sure you want to delete <span className="font-bold text-white">"{selectedSlang?.term}"</span>?</p>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={closeModal} className="px-5 py-2 text-sm font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500">Delete</button>
                        </div>
                    </div>
                )}
            </Modal>

            <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-8">My Slang Contributions</h1>

            {isLoading ? (
                <LoadingSpinner className="text-lime-400 mx-auto mt-8" />
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {mySlangs.length > 0 ? (
                        mySlangs.map(slang =>
                            <SlangCard
                                key={slang.id}
                                slang={slang}
                                currentUserId={user.userId}
                                onEdit={() => openModal('edit', slang)}
                                onDelete={() => openModal('delete', slang)}
                            />)
                    ) : (
                        <p className="text-gray-500 md:col-span-2">You haven't added any slangs yet. Go to the dashboard to contribute!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MySlangsPage;