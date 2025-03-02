import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";  // Assurez-vous que ce chemin est correct
import cvRoutes from "./routes/cvRoutes.js";  // Ajout de la route CV
import path from 'path';  // Importation de 'path' pour la gestion des fichiers

// Chargement des variables d'environnement
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Log pour vérifier la valeur de JWT_SECRET

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour autoriser les requêtes CORS
app.use(cors());
app.use(cors({
    exposedHeaders: ["Authorization"]
}));

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Route de test pour vérifier que l'API fonctionne
app.get("/", (req, res) => {
    res.send("🚀 API CV Builder fonctionne !");
});

// Vérifier que la clé JWT_SECRET est définie dans .env
if (!process.env.JWT_SECRET) {
    console.error("Erreur : JWT_SECRET n'est pas défini dans le fichier .env");
    process.exit(1); // Arrête le serveur si la clé JWT_SECRET est manquante
}

// Route d'authentification
app.use("/auth", authRoutes);
console.log("✅ Serveur démarre et écoute sur http://localhost:3000");

// Route pour les CVs
app.use("/api/cvs", cvRoutes);

// Route pour tester le serveur
app.post("/test", (req, res) => {
    res.send("Route POST /test fonctionne !");
});

// Configuration des fichiers statiques dans le répertoire 'uploads'
app.use('/uploads', express.static('uploads', {
  setHeaders: function (res, path) {
    // Définir le type MIME pour les images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
      res.set('Content-Type', 'frontend/image/jpeg');  // Définir le type MIME pour les fichiers image
    }
  }
}));

// Middleware pour gérer les erreurs liées aux fichiers statiques
app.use((err, req, res, next) => {
  if (err) {
    console.error("Erreur d'accès au fichier:", err.message);
    res.status(500).send('Erreur interne du serveur');
  } else {
    next();
  }
});
// Ajouter cette route dans server.js pour envoyer le CV généré
app.get('/generated/:cvFile', (req, res) => {
  const filePath = path.join(__dirname, 'generated', req.params.cvFile);
  res.sendFile(filePath, (err) => {
      if (err) {
          console.log("Erreur lors de l'envoi du fichier : ", err);
          res.status(500).send("Erreur interne du serveur");
      }
  });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    app.get('/', (req, res) => {
        res.send('Server is running');
    });
});
