import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";
import { config } from "dotenv";

config();

const { hash: _hash, compare } = bcryptjs;
const { sign } = jwt;

export async function register(req, res) {
    const { first_name, last_name, email, password } = req.body;

    try {
        const [existingUser] = await db.query("SELECT email FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email déjà utilisé !" });
        }

        const hashedPassword = await _hash(password, 10);

        await db.query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            [first_name, last_name, email, hashedPassword]
        );

        res.status(201).json({ message: "Utilisateur inscrit avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: "Utilisateur non trouvé !" });
        }

        const user = users[0];
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Mot de passe incorrect !" });
        }

        const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
             algorithm: 'HS256',
        });
        console.log("Clé utilisée pour signer le token :", process.env.JWT_SECRET);

        res.status(200).json({ message: "Connexion réussie !", token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
}