import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api.js";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getProjects();
    }, []);

    const getProjects = async () => {
        try {
            const { data } = await api.get("/project");
            setProjects(Array.isArray(data) ? data : []);
        } catch (e) {
            console.log("Erreur chargement", e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !budget) return alert("Nom et budget obligatoires");
        try {
            const { ok } = await api.post("/project", { name, budget, description });
            if (ok) {
                getProjects();
                setName("");
                setBudget("");
                setDescription("");
            }
        } catch (e) {
            console.log("Erreur création", e);
        }
    };

    // --- NOUVELLE FONCTION SUPPRESSION ---
    const handleDelete = async (id) => {
        if (!window.confirm("Tu es sûr de vouloir supprimer ce projet ?")) return;

        try {
            const { ok } = await api.delete(`/project/${id}`);
            if (ok) {
                // Astuce : on filtre la liste locale pour que ça disparaisse tout de suite
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (e) {
            console.log("Erreur suppression", e);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Liste des Projets</h1>

            <div style={{ border: "1px solid black", padding: "10px", marginBottom: "20px" }}>
                <h3>Nouveau Projet</h3>
                <form onSubmit={handleSubmit}>
                    <div>Nom: <input value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div style={{ marginTop: "5px" }}>Budget: <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
                    <div style={{ marginTop: "5px" }}>Desc: <input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                    <button type="submit" style={{ marginTop: "10px" }}>Créer</button>
                </form>
            </div>

            {projects.map((p) => (
                <div key={p._id} style={{ borderBottom: "1px solid grey", padding: "10px", marginBottom: "10px", position: "relative" }}>

                    {/* --- BOUTON CROIX --- */}
                    <button
                        onClick={() => handleDelete(p._id)}
                        style={{ position: "absolute", top: "10px", right: "10px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                    >
                        X
                    </button>

                    <div style={{ fontWeight: "bold" }}>{p.name}</div>
                    <div>Budget: {p.budget} €</div>
                    <div>{p.description}</div>

                    <Link to={`/project/${p._id}`} style={{ textDecoration: "none" }}>
                        <button style={{ marginTop: "10px", cursor: "pointer" }}>Voir le détail</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};