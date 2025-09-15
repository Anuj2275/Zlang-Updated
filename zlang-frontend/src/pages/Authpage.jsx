import React from 'react';
import AuthForm from '../components/AuthForm';


const AuthPage = ({ onAuthSuccess, setNotification }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <div className="text-center mb-12">
                <h1 className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight">
                    Define Your <span className="text-lime-400">World.</span>
                </h1>
                <p className="max-w-xl mx-auto mt-4 text-gray-400">
                    The definitive, community-driven dictionary for modern slang and internet culture.
                </p>
            </div>

            <AuthForm onAuthSuccess={onAuthSuccess} setNotification={setNotification} />
        </div>
    );
};

export default AuthPage;