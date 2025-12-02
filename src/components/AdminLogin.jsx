import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const colors = {
        primary: '#ff9900',
        primaryDark: '#cc7a00',
        bgDark: '#1f2233',
        bgLighter: '#282c3f',
        textWhite: '#ffffff',
        textMuted: '#aaaaaa',
    };

    const styles = {
        wrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: colors.bgDark,
            backgroundImage: `radial-gradient(circle at center, ${colors.bgLighter} 1px, ${colors.bgDark} 80%)`,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        card: {
            width: '100%',
            maxWidth: '400px',
            backgroundColor: colors.bgLighter,
            borderRadius: '12px',
            color: colors.textWhite,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        },
        brandWhite: { color: colors.textWhite, fontWeight: 700 },
        brandOrange: { color: colors.primary, fontWeight: 700 },
        loginTitle: {
            color: colors.primary,
            fontWeight: 500,
            borderBottom: `2px solid ${colors.primary}33`,
            paddingBottom: '10px',
            marginTop: '5px',
        },
        input: {
            backgroundColor: colors.bgDark,
            border: `1px solid ${colors.bgDark}`,
            color: colors.textWhite,
            padding: '10px 15px',
            borderRadius: '6px',
        },
        button: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: colors.bgDark,
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: '10px',
            transition: 'background-color 0.3s, transform 0.2s',
        },
        forgotLink: {
            color: colors.primary,
            textDecoration: 'none',
            fontSize: '0.9rem',
        },
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid Credentials. Please check username and password.');
        }
    };

    return (
        <div style={styles.wrapper}>
            <div className="p-4 shadow-lg" style={styles.card}>
                <h1 className="text-center mb-4 fs-1">
                    <span style={styles.brandWhite}>E-commerce</span>
                    <span style={styles.brandOrange}>.in</span>
                </h1>

                <h4 className="text-center mb-4" style={styles.loginTitle}>Admin Sign In</h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-muted">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label text-muted">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    {error && <div className="alert alert-danger p-2 mb-3 text-center">{error}</div>}

                    <button
                        type="submit"
                        className="btn w-100"
                        style={styles.button}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                            e.currentTarget.style.borderColor = colors.primaryDark;
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 153, 0, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primary;
                            e.currentTarget.style.borderColor = colors.primary;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-3 text-center">
                    <a href="#" style={styles.forgotLink}>Forgot Password?</a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
