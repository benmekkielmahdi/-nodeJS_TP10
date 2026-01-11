import axios from 'axios';

// Création d'une instance Axios avec une configuration par défaut
const api = axios.create({
    baseURL: 'http://localhost:3001',  // URL de base pour toutes les requêtes
    timeout: 10000,                    // Timeout de 10 secondes
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur de requêtes
api.interceptors.request.use(
    (config) => {
        // Vous pouvez modifier la configuration avant l'envoi
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de la requête (utile pour le débogage)
        console.log(`[Axios Request] ${config.method.toUpperCase()} ${config.url}`);

        return config;
    },
    (error) => {
        // Gestion des erreurs de requête
        console.error('[Axios Request Error]', error);
        return Promise.reject(error);
    }
);

// Intercepteur de réponses
api.interceptors.response.use(
    (response) => {
        // Traitement des réponses réussies
        console.log(`[Axios Response] Status: ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        // Traitement des erreurs de réponse
        if (error.response) {
            // La requête a été faite et le serveur a répondu avec un code d'erreur
            console.error(`[Axios Error] Status: ${error.response.status}`, error.response.data);

            // Gestion spécifique selon le code d'erreur
            switch (error.response.status) {
                case 401:
                    console.log('Utilisateur non authentifié');
                    break;
                case 403:
                    console.log('Accès interdit');
                    break;
                case 404:
                    console.log('Ressource non trouvée');
                    break;
                default:
                    break;
            }
        } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error('[Axios Error] No response received', error.request);
        } else {
            // Une erreur sest produite lors de la configuration de la requête
            console.error('[Axios Error] Request configuration', error.message);
        }

        // Propagation de l'erreur pour traitement ultérieur
        return Promise.reject(error);
    }
);

export default api;
