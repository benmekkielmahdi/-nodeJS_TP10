import React, { useState, useEffect } from 'react';

function FetchBasic() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
    const [addStatus, setAddStatus] = useState('');

    useEffect(() => {
        // Fonction asynchrone pour récupérer les utilisateurs
        async function fetchUsers() {
            try {
                // Envoi de la requête GET
                const response = await fetch('http://localhost:3001/users');

                // Vérification du statut de la réponse
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                // Parsing du corps de la réponse en JSON
                const data = await response.json();

                // Mise à jour de l'état avec les données
                setUsers(data);
                setError(null);
            } catch (error) {
                setError(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []); // Tableau de dépendances vide = exécution unique au montage

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAddStatus('pending');

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',                  // Méthode HTTP
                headers: {                       // En-têtes HTTP
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)    // Corps de la requête (converti en JSON)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
            }

            const addedUser = await response.json();
            setUsers(prevUsers => [...prevUsers, addedUser]);
            setNewUser({ name: '', email: '', role: 'user' });
            setAddStatus('success');

            // Réinitialiser le statut après 3 secondes
            setTimeout(() => setAddStatus(''), 3000);
        } catch (error) {
            setAddStatus('error');
            setError(`Erreur lors de l'ajout de l'utilisateur: ${error.message}`);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="error">{error}</div>;

    const addUserForm = (
        <div className="add-user-form">
            <h3>Ajouter un utilisateur</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nom:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Rôle:</label>
                    <select
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>
                <button type="submit" disabled={addStatus === 'pending'}>
                    {addStatus === 'pending' ? 'Ajout en cours...' : 'Ajouter'}
                </button>
                {addStatus === 'success' && <p className="success-message">Utilisateur ajouté avec succès!</p>}
            </form>
        </div>
    );

    return (
        <div className="fetch-basic">
            <h2>Liste des utilisateurs (Fetch basique)</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email}) - {user.role}
                    </li>
                ))}
            </ul>
            {addUserForm}
        </div>
    );
}

export default FetchBasic;
