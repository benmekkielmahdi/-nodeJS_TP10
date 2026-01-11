import React, { useState } from 'react';

function FetchUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Gestion de la sélection de fichier
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            // Création d'une URL pour la prévisualisation (pour les images)
            if (selectedFile.type.startsWith('image/')) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => setPreview(e.target.result);
                fileReader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        }
    };

    // Simulation d'upload avec XMLHttpRequest pour suivre la progression
    const uploadWithProgress = () => {
        if (!file) {
            setUploadStatus('Veuillez sélectionner un fichier');
            return;
        }

        setUploadStatus('uploading');
        setUploadProgress(0);

        // Création d'un objet FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        // Utilisation de XMLHttpRequest pour suivre la progression
        const xhr = new XMLHttpRequest();

        // Événement de progression
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded * 100) / event.total);
                setUploadProgress(progress);
            }
        });

        // Événement de fin
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                setUploadStatus('success');
                setTimeout(() => {
                    setUploadStatus(null);
                    setUploadProgress(0);
                    setFile(null);
                    setPreview(null);
                }, 3000);
            } else {
                setUploadStatus(`Erreur: ${xhr.status} ${xhr.statusText}`);
            }
        });

        // Événement d'erreur
        xhr.addEventListener('error', () => {
            setUploadStatus('Erreur de connexion');
        });

        // Événement d'annulation
        xhr.addEventListener('abort', () => {
            setUploadStatus('Upload annulé');
        });

        // Configuration et envoi de la requête
        xhr.open('POST', 'https://httpbin.org/post');
        xhr.send(formData);
    };

    // Upload avec Fetch (sans suivi de progression)
    const uploadWithFetch = async () => {
        if (!file) {
            setUploadStatus('Veuillez sélectionner un fichier');
            return;
        }

        setUploadStatus('uploading');
        setUploadProgress(0);

        // Création d'un objet FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        try {
            // Envoi de la requête avec Fetch
            const response = await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            // Simulation de progression
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 100));
                setUploadProgress(i);
            }

            setUploadStatus('success');
            setTimeout(() => {
                setUploadStatus(null);
                setUploadProgress(0);
                setFile(null);
                setPreview(null);
            }, 3000);
        } catch (error) {
            setUploadStatus(`Erreur: ${error.message}`);
        }
    };

    return (
        <div className="fetch-upload">
            <h2>Téléversement de fichiers (Fetch)</h2>

            <div className="upload-form">
                <div className="file-input">
                    <label htmlFor="file">Sélectionner un fichier:</label>
                    <input type="file" id="file" onChange={handleFileChange} />
                </div>

                {file && (
                    <div className="file-info">
                        <p>Fichier sélectionné: {file.name}</p>
                        <p>Type: {file.type}</p>
                        <p>Taille: {(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                )}

                {preview && (
                    <div className="preview">
                        <h4>Aperçu:</h4>
                        <img src={preview} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </div>
                )}

                <div className="upload-buttons">
                    <button onClick={uploadWithFetch} disabled={uploadStatus === 'uploading'}>
                        Téléverser avec Fetch
                    </button>
                    <button onClick={uploadWithProgress} disabled={uploadStatus === 'uploading'}>
                        Téléverser avec suivi de progression
                    </button>
                </div>

                {uploadStatus === 'uploading' && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <div className="progress-text">{uploadProgress}%</div>
                    </div>
                )}

                {uploadStatus === 'success' && (
                    <div className="success-message">
                        Fichier téléversé avec succès!
                    </div>
                )}

                {uploadStatus && uploadStatus !== 'uploading' && uploadStatus !== 'success' && (
                    <div className="error-message">
                        {uploadStatus}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FetchUpload;
