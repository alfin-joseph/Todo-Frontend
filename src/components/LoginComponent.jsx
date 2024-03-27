// LoginComponent.js
import React, { useState } from 'react';
import { login } from '../authService';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await login(username, password);
            localStorage.setItem('token', data.access);

            // Redirect to dashboard or any other route
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /><br>
            </br>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br>
            </br>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};
export default LoginComponent