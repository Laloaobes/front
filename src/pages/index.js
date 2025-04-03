import { useState, useEffect } from "react";

export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]); 
    const [expandedImage, setExpandedImage] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecciona una imagen antes de subir.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://3523110153-eduardoapi-backend.rvdental.fun/images/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al subir la imagen");
            }

            const data = await response.json();
            fetchImages();
        } catch (error) {
            setError("Error al subir la imagen.");z
            console.error(error);
        }
    };

    const fetchImages = async () => {
        try {
            const response = await fetch("https://3523110153-eduardoapi-backend.rvdental.fun/images/obtain");
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="upload-container">
            <h3>Sube una Imagen</h3>
            <div className="upload-form">
                <input type="file" onChange={handleFileChange} className="file-input" />
                {preview && <img src={preview} alt="Vista previa" className="preview-image" />}
                <button onClick={handleUpload} className="upload-button">Subir Imagen</button>
                {error && <p className="error-text">{error}</p>}
            </div>

            <h3>Imágenes Subidas</h3>
            <div className="image-gallery">
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div 
                            key={index} 
                            className="image-card" 
                            onClick={() => setExpandedImage(image)}
                        >
                            <img 
                                src={image} 
                                alt={`Imagen ${index + 1}`} 
                                className="image-thumbnail" 
                            />
                        </div>
                    ))
                ) : (
                    <p>No hay imágenes subidas.</p>
                )}
            </div>

            {expandedImage && (
                <>
                    <div className="overlay" onClick={() => setExpandedImage(null)}></div>
                    <img 
                        src={expandedImage} 
                        alt="Imagen ampliada" 
                        className="image-expanded"
                        onClick={() => setExpandedImage(null)}
                    />
                </>
            )}
        </div>
    );
}
