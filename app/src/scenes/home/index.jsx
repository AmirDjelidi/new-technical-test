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

    const handleDelete = async (id) => {
        if (!window.confirm("Tu es sûr de vouloir supprimer ce projet ?")) return;

        try {
            const { ok } = await api.delete(`/project/${id}`);
            if (ok) {
                setProjects(projects.filter(p => p._id !== id));
            }
        } catch (e) {
            console.log("Erreur suppression", e);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Liste des Projets</h1>

            <div style={{ border: "1px solid grey", padding: "10px", marginBottom: "20px", borderRadius: "8px" }}>
                <h3>Nouveau Projet</h3>
                <form onSubmit={handleSubmit}>
                    <div>Nom: <input className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div style={{ marginTop: "5px" }}>Budget: <input className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></div>
                    <div style={{ marginTop: "5px" }}>Desc: <input className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-500 outline-none" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md" type="submit" style={{ marginTop: "10px" }}>Créer</button>
                </form>
            </div>

            {projects.map((p) => (
                <div key={p._id} style={{ border: "1px solid grey", padding: "10px", marginBottom: "10px", position: "relative", borderRadius: "8px" }}>

                    {/* close button */}
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
                        <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md" style={{ marginTop: "10px", cursor: "pointer" }}>Voir le détail</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};