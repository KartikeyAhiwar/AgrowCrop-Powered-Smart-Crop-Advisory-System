import React, { useState } from 'react';
import axios from 'axios';
import './auth.css';
import { useAuth } from '../../context/AuthProvider';
import { SignIn } from '@clerk/clerk-react';

const API_BASE_URL = '/api/auth';

export default function Login() {
    const { login, mode } = useAuth();
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [devMode, setDevMode] = useState(false);
    const [devOtp, setDevOtp] = useState('');

    // If using Clerk, render Clerk's SignIn component
    if (mode === 'clerk') {
        return (
            <div className="auth-container">
                <div className="auth-header">
                    <h1>AgrowCrop</h1>
                    <p>Expert farming tools for every farmer</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <SignIn />
                </div>
            </div>
        );
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Ensure phone has +91 prefix
            const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
            const response = await axios.post(`${API_BASE_URL}/send-otp`, { phone: formattedPhone });
            if (response.data) {
                setOtpSent(true);
            }
        } catch (err) {
            // Auto-enable dev mode - fetch OTP from dev endpoint (same as PowerShell script)
            // ONLY in local development
            if (import.meta.env.MODE === 'development') {
                // Generate safe random fallback OTP for dev
                const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                console.log(`%c🔑 DEV MODE OTP: ${randomOtp}`, 'color: green; font-size: 20px; font-weight: bold');
                console.log('%cThis is a generated OTP because backend is unreachable.', 'color: orange; font-size: 14px');
                alert(`DEV MODE: Check console (F12) for OTP: ${randomOtp}`);
                setDevOtp(randomOtp);
                setDevMode(true);
                setOtpSent(true);
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Dev mode verification
            if (devMode) {
                if (otp === devOtp) {
                    const mockToken = 'dev_token_' + Date.now();
                    const user = { phone, role: 'ROLE_FARMER' };
                    login(mockToken, user);
                    return;
                } else {
                    setError('Invalid OTP. Please try again.');
                    setLoading(false);
                    return;
                }
            }

            const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
            const response = await axios.post(`${API_BASE_URL}/verify-otp`, { phone: formattedPhone, otp });
            const { token, role } = response.data;

            login(token, { phone, role });

        } catch (err) {
            setError(err.response?.data || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>AgrowCrop</h1>
                <p>Expert farming tools for every farmer</p>
            </div>

            {!otpSent ? (
                <form className="auth-form" onSubmit={handleSendOtp}>
                    <div className="input-group">
                        <label htmlFor="phone">Mobile Number</label>
                        <input
                            id="phone"
                            type="tel"
                            className="auth-input"
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            pattern="[0-9]{10}"
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            ) : (
                <form className="auth-form" onSubmit={handleVerifyOtp}>
                    <div className="input-group">
                        <label htmlFor="otp">Verify OTP</label>
                        <input
                            id="otp"
                            type="text"
                            className="auth-input"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Verifying...' : 'Login'}
                    </button>
                    <button
                        type="button"
                        className="resend-link"
                        onClick={handleSendOtp}
                        disabled={loading}
                    >
                        Didn't receive code? Resend
                    </button>
                </form>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}
