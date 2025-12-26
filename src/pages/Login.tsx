import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, Zap, Sparkles, AlertCircle } from 'lucide-react';

interface LoginProps {
    onLogin: (user: { name: string, role: string, accessToken?: string }) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Demo users that exist in the seeded database
    const demoUsers = [
        { name: 'Alex Morgan', email: 'admin@omniverse.demo', role: 'Admin', password: 'password123' },
        { name: 'Sarah Chen', email: 'manager@omniverse.demo', role: 'Manager', password: 'password123' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Login failed');
            }

            // Store tokens in localStorage
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            onLogin({
                name: data.data.user.name,
                role: data.data.user.role,
                accessToken: data.data.accessToken
            });
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async (user: { name: string, email: string, role: string, password: string }) => {
        setIsLoading(true);
        setError(null);
        setEmail(user.email);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email, password: user.password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Login failed');
            }

            // Store tokens in localStorage
            localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);

            onLogin({
                name: data.data.user.name,
                role: data.data.user.role,
                accessToken: data.data.accessToken
            });
        } catch (err) {
            console.error('Demo login error:', err);
            // Fallback to mock login if API fails
            console.log('API unavailable, using mock login');
            setTimeout(() => {
                onLogin({ name: user.name, role: user.role });
                setIsLoading(false);
            }, 800);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-primary)'
        }}>
            {/* Background Narrative: Pulse of Innovation */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--omnicom-blue) 0%, transparent 70%)',
                    zIndex: 0,
                    filter: 'blur(80px)'
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--omnicom-coral) 0%, transparent 70%)',
                    zIndex: 0,
                    filter: 'blur(80px)'
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="glass-dark"
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    padding: '48px',
                    borderRadius: '32px',
                    zIndex: 10,
                    boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                    position: 'relative'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <motion.div
                        initial={{ rotate: -20, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 100 }}
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'black'
                        }}
                    >
                        <Zap size={32} fill="black" />
                    </motion.div>
                    <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'white', letterSpacing: '-0.5px' }}>
                        Omnicom <span className="serif" style={{ color: 'var(--omnicom-coral)' }}>Omniverse</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>The Intelligence Layer for Global Workflow.</p>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                marginBottom: '20px',
                                color: '#ef4444',
                                fontSize: '0.9rem'
                            }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Work Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="email"
                                placeholder="admin@omniverse.demo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    color: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--omnicom-blue)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Password</label>
                            <a href="#" style={{ fontSize: '0.8rem', color: 'var(--omnicom-blue)', fontWeight: 600, textDecoration: 'none' }}>Recovery</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input
                                type="password"
                                placeholder="password123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    color: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--omnicom-blue)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                        style={{
                            padding: '16px',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            marginTop: '8px',
                        }}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}
                            />
                        ) : (
                            <>Sign Into Workspace <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Demo Access</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {demoUsers.map((user) => (
                            <motion.button
                                key={user.email}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDemoLogin(user)}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    color: 'white',
                                    textAlign: 'left',
                                    opacity: isLoading ? 0.6 : 1
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--omnicom-blue), #3a6cd9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800 }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{user.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{user.role} • {user.email}</p>
                                    </div>
                                </div>
                                <Sparkles size={14} color="rgba(255,255,255,0.1)" />
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    <Shield size={14} />
                    <span>Secured with enterprise SSO</span>
                </div>
            </motion.div>

            {/* Bottom Brand Bar */}
            <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', opacity: 0.2 }}>
                <span style={{ color: 'white', fontSize: '0.75rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Omnicom Group</span>
            </div>
        </div>
    );
};

export default Login;
