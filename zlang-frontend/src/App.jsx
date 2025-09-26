import { useState, useEffect, useCallback } from 'react';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Notification from './components/Notification';

const GEMINI_API_KEY = 'AIzaSyD20hZhA4KcNoxJ1SWWU2uCwF9t80gnf_E';
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

function App() {
    const [token, setToken] = useState(localStorage.getItem('zlang-token'));
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const clearNotification = useCallback(() => setNotification({ message: '', type: '' }), []);

    useEffect(() => {
        const storedToken = localStorage.getItem('zlang-token');
        if (storedToken) {
            const decodedUser = parseJwt(storedToken);
            if (decodedUser) {
                setUser(decodedUser);
                setToken(storedToken);
            } else {
                // Handle invalid token
                localStorage.removeItem('zlang-token');
                setToken(null);
                setUser(null);
            }
        }
    }, [token]);

    const handleAuthSuccess = (newToken) => {
        localStorage.setItem('zlang-token', newToken);
        setToken(newToken);
        const decoded = parseJwt(newToken);
        setNotification({ message: `Welcome, ${decoded.name}!`, type: 'success' });
    };

    const handleLogout = () => {
        localStorage.removeItem('zlang-token');
        setToken(null);
        setUser(null);
        setNotification({ message: 'You have been logged out.', type: 'success' });
    };

    return (
        <div className="font-sans bg-gray-900 min-h-screen text-gray-200">
            <Notification message={notification.message} type={notification.type} onClear={clearNotification} />

            {token && user ? (
                <DashboardPage user={user} onLogout={handleLogout} apiKey={GEMINI_API_KEY} setNotification={setNotification} />
            ) : (
                <HomePage onAuthSuccess={handleAuthSuccess} apiKey={GEMINI_API_KEY} setNotification={setNotification} />
            )}
        </div>
    );
}

export default App;