"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios
            .get("https://3523110153-eduardoapi-backend.rvdental.fun/images/obtain")
            .then((response) => {
                setImages(response.data.result.images);
            })
            .catch(() => {
                setError("Error al obtener las imágenes.");
            });
    }, []);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || !selectedFile.type.startsWith("image/") || selectedFile.size > 5 * 1024 * 1024) {
            setError("Selecciona un archivo de imagen válido (máx. 5MB).");
            return;
        }
        setError("");
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Selecciona un archivo para subir.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                "https://3523110153-eduardoapi-backend.rvdental.fun/images/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setImages((prevImages) => [...prevImages, response.data.result]);
            setError("");
        } catch {
            setError("Error al subir la imagen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="mb-4 text-center">Galería de Imágenes</h1>

            <div className="mb-3">
                <input type="file" onChange={handleFileChange} className="form-control" />
                <button className="btn btn-primary btn-lg mt-2" onClick={handleUpload} disabled={loading}>
                    {loading ? <div className="spinner-border text-light" role="status"></div> : "Subir Imagen"}
                </button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px" }}>
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.variants[0]}
                        alt="Imagen subida"
                        style={{
                            width: "250px",
                            height: "250px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                        onClick={() => setSelectedImage(img.variants[1])}
                    />
                ))}
            </div>

            {selectedImage && (
                <div
                    className="modal"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        alt="Imagen ampliada"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            objectFit: "contain",
                            borderRadius: "8px",
                        }}
                    />
                </div>
            )}
        </div>
    );
}