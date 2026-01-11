import api from './axiosInstance';

// Stockage du token dans le localStorage
const TOKEN_KEY = 'auth_token';

// Service d'authentification
const authService = {
    // Connexion utilisateur
    login: async (email, password) => {
        try {
            // Dans un cas réel, remplacez cette URL par votre endpoint d'authentification
            // Ici on simule une connexion réussie si l'email contient '@'
            if (!email.includes('@')) {
                throw new Error('Email invalide');
            }

            // Stockage d'un token factice
            const fakeToken = 'ey-abc-123-fake-token';
            localStorage.setItem(TOKEN_KEY, fakeToken);

            return { id: 1, name: 'Utilisateur Test', email };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Échec de la connexion');
        }
    },

    // Déconnexion utilisateur
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Vérification si l'utilisateur est connecté
    isAuthenticated: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Récupération du token
    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    // Récupération du profil utilisateur
    getProfile: async () => {
        try {
            // Simulé
            return { id: 1, name: 'Utilisateur Test', role: 'admin' };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Échec de la récupération du profil');
        }
    }
};

export default authService;
