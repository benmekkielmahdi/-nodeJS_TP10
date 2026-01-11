import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [controller, setController] = useState(null);

    // Fonction pour annuler la requête
    const cancel = useCallback(() => {
        if (controller) {
            controller.abort();
        }
    }, [controller]);

    // Fonction pour exécuter la requête
    const execute = useCallback(async (overrideOptions = {}) => {
        // Annuler toute requête en cours
        if (controller) {
            controller.abort();
        }

        // Créer un nouveau contrôleur d'annulation
        const newController = new AbortController();
        setController(newController);

        // Préparer les options avec le signal d'annulation
        const fetchOptions = {
            ...options,
            ...overrideOptions,
            signal: newController.signal
        };

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
            return result;
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(error.message);
                throw error;
            }
        } finally {
            setLoading(false);
        }
    }, [url, options, controller]);

    // Exécuter la requête au montage si autoLoad est true
    useEffect(() => {
        if (options.autoLoad) {
            execute();
        }

        // Nettoyer en annulant la requête lors du démontage
        return () => {
            if (controller) controller.abort();
        };
    }, [execute, options.autoLoad]);

    return { data, loading, error, execute, cancel };
}

export default useFetch;
