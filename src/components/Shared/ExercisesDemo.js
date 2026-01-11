import React from 'react';
import useFetch from '../../hooks/useFetch';
import axios from 'axios';
import cacheService from '../../services/cacheService';

// Fonction qui récupère des données avec mise en cache
async function fetchWithCache(url, options = {}) {
    const { ttl, skipCache, ...axiosOptions } = options;

    const cacheKey = `${url}-${JSON.stringify(axiosOptions)}`;

    if (!skipCache) {
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
            console.log(`Données récupérées du cache pour: ${url}`);
            return { data: cachedData, fromCache: true };
        }
    }

    try {
        const response = await axios(url, axiosOptions);
        cacheService.set(cacheKey, response.data, ttl);
        return { data: response.data, fromCache: false };
    } catch (error) {
        console.error(`Erreur lors de la récupération des données pour: ${url}`, error);
        throw error;
    }
}

function ExercisesDemo() {
    const { data, loading, error, execute } = useFetch('http://localhost:3001/users', {
        autoLoad: true
    });

    const [cacheData, setCacheData] = React.useState(null);
    const [cacheInfo, setCacheInfo] = React.useState('');

    const testCache = async () => {
        setCacheInfo('Récupération...');
        try {
            const result = await fetchWithCache('http://localhost:3001/posts');
            setCacheData(result.data);
            setCacheInfo(result.fromCache ? 'Récupéré du cache ✅' : 'Récupéré du serveur 🌐');
        } catch (err) {
            setCacheInfo(`Erreur: ${err.message}`);
        }
    };

    return (
        <div className="exercises-demo">
            <section>
                <h2>Exercice 2: Hook Personnalisé (useFetch)</h2>
                <button onClick={() => execute()}>Rafraîchir les utilisateurs</button>
                {loading && <p>Chargement...</p>}
                {error && <p className="error">{error}</p>}
                {data && (
                    <ul>
                        {data.map(user => (
                            <li key={user.id}>{user.name} ({user.email})</li>
                        ))}
                    </ul>
                )}
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2>Exercice 3: Système de Cache</h2>
                <button onClick={testCache}>Tester le cache (Posts)</button>
                <p><em>{cacheInfo}</em></p>
                {cacheData && (
                    <ul>
                        {cacheData.slice(0, 2).map(post => (
                            <li key={post.id}><strong>{post.title}</strong></li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default ExercisesDemo;
