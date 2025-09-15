import React, { useEffect } from 'react';

const Notification = ({ message, type, onClear }) => {

    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClear, 3500);
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    if (!message) {
        return null;
    }

        const styles = {
        success: 'bg-lime-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`fixed z-50 bottom-5 right-5 p-4 rounded-lg shadow-2xl text-white text-sm font-bold transition-all duration-300 transform ${message ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${styles[type]}`}>
            {message}
        </div>
    );
};

export default Notification;