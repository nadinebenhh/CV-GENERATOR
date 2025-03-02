import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import cvController from '../controllers/cvController.js';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import multer from 'multer';

const router = express.Router();

// Configuration de multer pour gérer l'upload des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où stocker les photos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer pour éviter les conflits
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers images sont autorisés !'));
    }
  }
});

// --------------------------
// Routes de gestion des CV
// --------------------------

router.post('/cv/create', authenticateToken, upload.single('photo'), cvController.createCV);
router.get('/cv/:id', authenticateToken, cvController.getCV);
router.put('/cv/:id', authenticateToken, cvController.updateCV);
router.delete('/cv/:id', authenticateToken, cvController.deleteCV);

// --------------------------
// Routes pour la gestion des modèles
// --------------------------

// Route pour lister tous les modèles disponibles
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      { id: 1, name: 'Modèle Professionnel', file: 'modele1.html', type: 'html' },
      { id: 2, name: 'Modèle Moderne', file: 'modele2.html', type: 'html' },
    ];
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des modèles", details: error.message });
  }
});

// Route pour récupérer un modèle par ID
router.get('/templates/:id', async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du modèle dans l'URL
  const filePath = path.join(process.cwd(), 'frontend', `modele${id}.html`); // Le fichier est dans le dossier 'frontend'

  console.log("Chemin du fichier modèle :", filePath); // Log pour déboguer

  try {
    // Lire le fichier HTML de manière asynchrone
    const data = await fs.promises.readFile(filePath, 'utf8');
    res.send(data);  // Envoyer le contenu du fichier au client
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier :", err.message);
    return res.status(404).json({ error: 'Modèle non trouvé' }); // Si le fichier n'est pas trouvé
  }
});

// Route pour générer le CV en fonction du modèle choisi
router.post('/cv/generate', authenticateToken, async (req, res) => {
  const { templateId, data } = req.body;
  const filePath = path.join(process.cwd(), `modele${templateId}.html`);

  console.log("Chemin du fichier modèle :", filePath); // Log pour debug

  fs.readFile(filePath, 'utf8', (err, templateSource) => {
    if (err) {
      console.error("Erreur lors de la lecture du fichier :", err.message);
      return res.status(404).json({ error: 'Modèle non trouvé' });
    }

    try {
      // Compiler le template avec Handlebars
      const template = Handlebars.compile(templateSource);
      const filledTemplate = template(data);

      // Vérification et création du dossier "generated" si nécessaire
      const generatedDir = path.join(process.cwd(), 'generated');
      if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
      }

      // Sauvegarder le CV généré
      const outputFilePath = path.join(generatedDir, `cv_${Date.now()}.html`);
      fs.writeFileSync(outputFilePath, filledTemplate, 'utf8');

      res.status(200).json({ message: 'CV généré avec succès !', filePath: outputFilePath });
    } catch (error) {
      console.error("Erreur lors de la génération du CV :", error.message);
      res.status(500).json({ error: 'Erreur lors de la génération du CV', details: error.message });
    }
  });
});

// Route pour traiter la soumission du formulaire de génération du CV
router.post('/cv/generate-with-photo', authenticateToken, upload.single('photo'), async (req, res) => {
  const { title, phone_number, location, city_or_zip, linkedin, experiences, education, skills, certifications, interests, professional_project, cv_model } = req.body;

  let photoPath = null;
  if (req.file && cv_model === '1') { // Si le modèle nécessite une photo
    photoPath = `/uploads/${req.file.filename}`; // Inclure le chemin de la photo
  }

  const cvData = {
    title,
    phone_number,
    location,
    city_or_zip,
    linkedin,
    experiences,
    education,
    skills,
    certifications,
    interests,
    professional_project,
    photo: photoPath // Ajout de la photo dans les données
  };

  res.json({
    message: 'CV généré avec succès !',
    data: cvData
  });
});

export default router;
