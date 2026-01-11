import React, { useState, useEffect } from 'react';
import api from '../../services/axiosInstance';

function AxiosBasic() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState({ title: '', content: '', author: 1 });

    // Récupération des posts au chargement du composant
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                setPosts(response.data);
            } catch (error) {
                setError(`Erreur lors de la récupération des posts: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/posts', newPost);
            setPosts(prevPosts => [...prevPosts, response.data]);
            setNewPost({ title: '', content: '', author: 1 });
        } catch (error) {
            setError(`Erreur lors de la création du post: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post?')) {
            return;
        }

        setLoading(true);

        try {
            await api.delete(`/posts/${id}`);
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        } catch (error) {
            setError(`Erreur lors de la suppression du post: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && posts.length === 0) return <div>Chargement...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="axios-basic">
            <h2>Gestion des posts (Axios basique)</h2>

            <div className="add-post-form">
                <h3>Ajouter un nouveau post</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Titre:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newPost.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Contenu:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newPost.content}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="author">Auteur ID:</label>
                        <input
                            type="number"
                            id="author"
                            name="author"
                            value={newPost.author}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Ajout en cours...' : 'Ajouter'}
                    </button>
                </form>
            </div>

            <div className="posts-list">
                <h3>Liste des posts</h3>
                {posts.length === 0 ? (
                    <p>Aucun post disponible.</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li key={post.id} className="post-item">
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <div className="post-actions">
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(post.id)}
                                        disabled={loading}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default AxiosBasic;
