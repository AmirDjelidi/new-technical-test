import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        getProject();
        getExpenses();
    }, []);

    const getProject = async () => {
        const { data } = await api.get(`/project/${id}`);
        setProject(data);
    };

    const getExpenses = async () => {
        const { data } = await api.get(`/expense?projectId=${id}`);
        setExpenses(data || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount) return alert("Remplis tout !");
        try {
            const { ok } = await api.post("/expense", { description, amount: Number(amount), projectId: id });
            if (ok) {
                getExpenses();
                setDescription("");
                setAmount("");
            }
        } catch (e) {
            console.log("Erreur ajout", e);
        }
    };

    // --- NOUVELLE FONCTION SUPPRESSION ---
    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Supprimer cette dépense ?")) return;

        try {
            const { ok } = await api.delete(`/expense/${expenseId}`);
            if (ok) {
                setExpenses(expenses.filter(e => e._id !== expenseId));
            }
        } catch (e) {
            console.log("Erreur suppression", e);
        }
    }

    // Calcul du total (se mettra à jour tout seul quand on supprime une dépense)
    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    if (!project) return <div>Chargement...</div>;
    const isOverBudget = totalSpent > project.budget;

    return (
        <div style={{ padding: "20px" }}>
            <Link to="/" style={{ display: "block", marginBottom: "20px" }}>← Retour aux projets</Link>

            <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
                <h1 style={{ margin: 0 }}>{project.name}</h1>
                <p>{project.description}</p>
                <div style={{ marginTop: "20px", fontSize: "18px" }}>
                    Budget: <b>{project.budget} €</b><br />
                    Dépensé: <b style={{ color: "blue"}}>{totalSpent} €</b><br />
                    Reste: <b style={{ color: isOverBudget ? "red" : "green" }}>{project.budget - totalSpent} €</b>
                </div>
                {isOverBudget && <div style={{ backgroundColor: "#ffcccc", color: "red", padding: "10px", marginTop: "10px" }}>⚠️ BUDGET DÉPASSÉ !</div>}
            </div>

            <div style={{ border: "1px solid black", padding: "15px", marginBottom: "20px", background: "#f9f9f9" }}>
                <h3>Ajouter une dépense</h3>
                <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
                    <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="number" placeholder="Montant" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <button type="submit">Ajouter +</button>
                </form>
            </div>

            <h3>Détail des dépenses ({expenses.length})</h3>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id} style={{ marginBottom: "5px", borderBottom: "1px solid #eee", padding: "5px", display: "flex", justifyContent: "space-between" }}>
                        <span>{expense.description}</span>
                        <span>
                <span style={{ fontWeight: "bold", marginRight: "15px" }}>{expense.amount} €</span>
                            {/* --- BOUTON CROIX --- */}
                            <button
                                onClick={() => handleDeleteExpense(expense._id)}
                                style={{ background: "red", color: "white", border: "none", cursor: "pointer", padding: "2px 8px", borderRadius: "50%" }}
                            >
                    X
                </button>
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}