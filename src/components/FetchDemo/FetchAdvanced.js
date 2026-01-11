import React, { useState } from 'react';

function FetchAdvanced() {
    const [postId, setPostId] = useState('');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeoutEnabled, setTimeoutEnabled] = useState(true);
    const [timeoutDuration, setTimeoutDuration] = useState(5000);

    // Fonction pour récupérer un post avec gestion d'erreurs et timeout
    const fetchPostWithTimeout = async () => {
        if (!postId.trim()) {
            setError('Veuillez entrer un ID de post');
            return;
        }

        setLoading(true);
        setError(null);
        setPost(null);

        // Création d'un AbortController pour le timeout
        const controller = new AbortController();
        const { signal } = controller;

        // Définition du timeout si activé
        let timeoutId;
        if (timeoutEnabled) {
            timeoutId = setTimeout(() => {
                controller.abort();
            }, timeoutDuration);
        }

        try {
            // Requête avec signal d'annulation
            const response = await fetch(`http://localhost:3001/posts/${postId}`, {
                signal
            });

            // Vérification du statut de la réponse
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Le post avec l'ID ${postId} n'existe pas`);
                }
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Parsing du corps de la réponse
            const data = await response.json();
            setPost(data);
        } catch (error) {
            // Gestion spécifique pour les erreurs d'annulation
            if (error.name === 'AbortError') {
                setError(`La requête a été annulée après ${timeoutDuration / 1000} secondes`);
            } else {
                setError(`Erreur: ${error.message}`);
            }
        } finally {
            // Nettoyage du timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            setLoading(false);
        }
    };

    // Fonction pour récupérer l'auteur du post
    const fetchAuthor = async (authorId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${authorId}`);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération de l'auteur: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'auteur:', error);
            return { name: 'Auteur inconnu' };
        }
    };

    // Fonction pour récupérer les commentaires du post
    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3001/comments?postId=${postId}`);

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des commentaires: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
            return [];
        }
    };

    // Fonction pour récupérer le post avec l'auteur et les commentaires
    const fetchPostDetails = async () => {
        if (!postId.trim()) {
            setError('Veuillez entrer un ID de post');
            return;
        }

        setLoading(true);
        setError(null);
        setPost(null);

        try {
            // Récupération du post
            const postResponse = await fetch(`http://localhost:3001/posts/${postId}`);

            if (!postResponse.ok) {
                if (postResponse.status === 404) {
                    throw new Error(`Le post avec l'ID ${postId} n'existe pas`);
                }
                throw new Error(`Erreur HTTP: ${postResponse.status}`);
            }

            const postData = await postResponse.json();

            // Récupération de l'auteur et des commentaires en parallèle
            const [author, comments] = await Promise.all([
                fetchAuthor(postData.author),
                fetchComments(postData.id)
            ]);

            // Combinaison des données
            setPost({
                ...postData,
                authorDetails: author,
                comments
            });
        } catch (error) {
            setError(`Erreur: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fetch-advanced">
            <h2>Récupération de post avec gestion avancée (Fetch)</h2>

            <div className="controls">
                <div>
                    <label htmlFor="postId">ID du post:</label>
                    <input
                        type="number"
                        id="postId"
                        value={postId}
                        onChange={(e) => setPostId(e.target.value)}
                        min="1"
                    />
                </div>

                <div className="timeout-controls">
                    <label>
                        <input
                            type="checkbox"
                            checked={timeoutEnabled}
                            onChange={(e) => setTimeoutEnabled(e.target.checked)}
                        />
                        Activer le timeout
                    </label>

                    {timeoutEnabled && (
                        <div>
                            <label htmlFor="timeoutDuration">Durée (ms):</label>
                            <input
                                type="number"
                                id="timeoutDuration"
                                value={timeoutDuration}
                                onChange={(e) => setTimeoutDuration(Number(e.target.value))}
                                min="100"
                                step="100"
                            />
                        </div>
                    )}
                </div>

                <div className="buttons">
                    <button onClick={fetchPostWithTimeout} disabled={loading}>
                        Récupérer avec timeout
                    </button>
                    <button onClick={fetchPostDetails} disabled={loading}>
                        Récupérer avec détails
                    </button>
                </div>
            </div>

            {loading && <div className="loading">Chargement...</div>}
            {error && <div className="error">{error}</div>}

            {post && (
                <div className="post-details">
                    <h3>{post.title}</h3>
                    {post.authorDetails && (
                        <p className="author">Par: {post.authorDetails.name}</p>
                    )}
                    <p className="content">{post.content}</p>

                    {post.comments && post.comments.length > 0 && (
                        <div className="comments">
                            <h4>Commentaires ({post.comments.length})</h4>
                            <ul>
                                {post.comments.map(comment => (
                                    <li key={comment.id}>{comment.text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default FetchAdvanced;
