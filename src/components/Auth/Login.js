import React, { useState } from 'react';
import authService from '../../services/authService';

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.login(credentials.email, credentials.password);
            setSuccess(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setSuccess(false);
        setCredentials({ email: '', password: '' });
    };

    return (
        <div className="login-form">
            <h2>Exercice 1: Authentification</h2>

            {success || authService.isAuthenticated() ? (
                <div className="success-message">
                    <p>Connexion réussie! Vous êtes authentifié.</p>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h3>Se connecter</h3>
                    {error && <div className="error-message">{error}</div>}

                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Mot de passe:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Login;
