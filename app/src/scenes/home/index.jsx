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

        const { data } = await api.get("/project");

        setProjects(data || []);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !budget) return alert("Nom et budget obligatoires");
        try {
            const { ok } = await api.post("/project", { name, budget, description });
            if (ok) {
                getProjects(); // On recharge la liste
                setName("");
                setBudget("");
                setDescription("");
            }
        } catch (e) {
            console.log("Erreur création", e);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Liste des Projets</h1>

            {/* FORMULAIRE */}
            <div style={{ border: "1px solid black", padding: "10px", marginBottom: "20px" }}>
                <h3>Nouveau Projet</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        Nom: <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div style={{ marginTop: "5px" }}>
                        Budget: <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                    </div>
                    <div style={{ marginTop: "5px" }}>
                        Desc: <input value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <button type="submit" style={{ marginTop: "10px" }}>Créer</button>
                </form>
            </div>

            {/* LISTE */}
            {projects.map((p) => (
                <div key={p._id} style={{ borderBottom: "1px solid grey", padding: "10px", marginBottom: "10px" }}>
                    <div style={{ fontWeight: "bold" }}>{p.name}</div>
                    <div>Budget: {p.budget} €</div>
                    <div>{p.description}</div>

                    <Link to={`/project/${p._id}`}>
                        <button>Voir le détail</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};