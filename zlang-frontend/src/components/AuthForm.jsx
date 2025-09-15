import React, { useState } from 'react';
import { LoadingSpinner } from './icons';

const API_BASE_URL = 'http://localhost:8081/api';


const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const AuthForm = ({ onAuthSuccess, setNotification }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const [errors, setErrors] = useState({});
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (!validateEmail(value)) {
            setErrors(prev => ({ ...prev, username: 'Please enter a valid email format.' }));
        } else {
            setErrors(prev => ({ ...prev, username: null }));
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (value.length > 0 && value.length < 6) {
            setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters.' }));
        } else {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.username || errors.password) {
            setNotification({ message: 'Please fix the errors before submitting.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setNotification({ message: '', type: 'success' });

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin ? { username, password } : { name, username, password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
                const errorMessage = errorData.errors ? Object.values(errorData.errors).join(', ') : (errorData.message || 'Authentication failed.');
                throw new Error(errorMessage);
            }

            const data = await response.json();
            onAuthSuccess(data.token);

        } catch (error) {
            setNotification({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            {/* ... Toggles and Title are unchanged ... */}
             <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${isLogin ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400'}`}>Login</button>
                <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 focus:outline-none ${!isLogin ? 'text-lime-400 border-b-2 border-lime-400' : 'text-gray-400'}`}>Register</button>
            </div>
            <h2 className="font-display text-4xl font-bold text-center text-white mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
            <p className="text-center text-gray-400 mb-8 text-sm">{isLogin ? 'Enter your credentials.' : 'Create an account.'}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <input type="text" placeholder="Display Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition" />
                    </div>
                )}
                <div>
                    <input type="text" placeholder="Username (must be an email)" value={username} onChange={handleUsernameChange} required className={`w-full px-4 py-3 bg-gray-900 text-white border-2 rounded-lg focus:outline-none focus:ring-2 transition ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-lime-400'}`} />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                     <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={handlePasswordChange} required className={`w-full px-4 py-3 bg-gray-900 text-white border-2 rounded-lg focus:outline-none focus:ring-2 transition ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-lime-400'}`} />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 rounded-lg font-bold text-gray-900 bg-lime-400 hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lime-400 disabled:bg-lime-400/50 transition-colors pt-4">
                    {isLoading ? <LoadingSpinner className="text-gray-900" /> : (isLogin ? 'Login' : 'Create Account')}
                </button>
            </form>
        </div>
    );
};

export default AuthForm;

