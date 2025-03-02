// authMiddleware.js (fichier pour la validation du JWT côté serveur)

import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Récupère le token du header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès non autorisé ! Token manquant ou mal formaté.' });
    }

    // Extrait le token
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Accès non autorisé ! Token manquant.' });
    }

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Utilisateur décodé :', decoded);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);


        // Ajoute l'ID de l'utilisateur (user_id) à la requête pour l'utiliser dans les routes suivantes
        req.user = decoded;  // Décodé contient l'ID utilisateur et d'autres informations du token
        next();  // Passe à la prochaine fonction middleware ou route
    } catch (error) {
        console.error('Erreur lors de la validation du token :', error.message);
        res.status(403).json({ error: 'Token invalide' });
    }
    
};
