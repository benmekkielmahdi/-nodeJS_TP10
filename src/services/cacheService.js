// Service de cache simple pour les requêtes HTTP
class CacheService {
    constructor(ttl = 60000) { // Durée de vie par défaut: 1 minute
        this.cache = new Map();
        this.ttl = ttl;
    }

    // Récupérer une valeur du cache
    get(key) {
        const item = this.cache.get(key);

        // Vérifier si l'élément existe et n'est pas expiré
        if (item && item.expiry > Date.now()) {
            return item.value;
        }

        // Supprimer l'élément expiré
        if (item) {
            this.cache.delete(key);
        }

        return null;
    }

    // Stocker une valeur dans le cache
    set(key, value, customTtl) {
        const expiry = Date.now() + (customTtl || this.ttl);
        this.cache.set(key, { value, expiry });
    }

    // Supprimer une valeur du cache
    delete(key) {
        this.cache.delete(key);
    }

    // Vider tout le cache
    clear() {
        this.cache.clear();
    }

    // Nettoyer les entrées expirées
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (item.expiry <= now) {
                this.cache.delete(key);
            }
        }
    }
}

// Création d'une instance unique
const cacheService = new CacheService();

// Nettoyage périodique (toutes les 5 minutes)
setInterval(() => {
    cacheService.cleanup();
}, 300000);

export default cacheService;
