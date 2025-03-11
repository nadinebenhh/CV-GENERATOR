import path from 'path';
import fs from 'fs';  // Import du module fs
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer un nouveau CV
async function createCV(req, res) {
  const { title, phone_number, location, city_or_zip, linkedin, experiences, education, skills, certifications, interests, professional_project } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      `INSERT INTO cvs (user_id, title, phone_number, location, city_or_zip, linkedin, experiences, education, skills, certifications, interests, professional_project)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, phone_number, location, city_or_zip, linkedin, JSON.stringify(experiences), JSON.stringify(education), JSON.stringify(skills), JSON.stringify(certifications), JSON.stringify(interests), JSON.stringify(professional_project)]
    );

    res.status(201).json({ message: 'CV créé avec succès', cvId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du CV', details: error.message });
  }
}

// Récupérer un CV spécifique
async function getCV(req, res) {
  const cvId = req.params.id;

  try {
    const [cv] = await db.query(`SELECT * FROM cvs WHERE id = ?`, [cvId]);
    if (!cv.length) return res.status(404).json({ error: 'CV non trouvé' });
    res.status(200).json(cv[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du CV', details: error.message });
  }
}

// Mettre à jour un CV
async function updateCV(req, res) {
  const cvId = req.params.id;
  const { title, phone_number, location, city_or_zip, linkedin, experiences, education, skills, certifications, interests, professional_project } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE cvs SET title = ?, phone_number = ?, location = ?, city_or_zip = ?, linkedin = ?, experiences = ?, education = ?, skills = ?, certifications = ?, interests = ?, professional_project = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, phone_number, location, city_or_zip, linkedin, JSON.stringify(experiences), JSON.stringify(education), JSON.stringify(skills), JSON.stringify(certifications), JSON.stringify(interests), JSON.stringify(professional_project), cvId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'CV non trouvé' });
    res.status(200).json({ message: 'CV mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CV', details: error.message });
  }
}

// Supprimer un CV
async function deleteCV(req, res) {
  const cvId = req.params.id;

  try {
    const [result] = await db.query(`DELETE FROM cvs WHERE id = ?`, [cvId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'CV non trouvé' });
    res.status(200).json({ message: 'CV supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du CV', details: error.message });
  }
}

// Générer le PDF
async function generatePDF(req, res) {
  const fileName = req.params.fileName;

  // Définir le chemin du fichier HTML dans le dossier 'generated'
  const htmlPath = path.join(__dirname, "../../backend/generated", fileName + ".html");

  // Vérifier si le fichier HTML existe
  if (!fs.existsSync(htmlPath)) {
    return res.status(404).json({ error: `Le fichier HTML ${fileName}.html n'existe pas` });
  }

  try {
    // Créer le dossier 'pdf' si il n'existe pas
    const pdfDir = path.join(__dirname, "../../backend/pdf");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);  // Créer le dossier pdf si il n'existe pas
    }

    // Définir le chemin du fichier PDF où il sera enregistré
    const pdfPath = path.join(pdfDir, `${fileName}.pdf`);

    // Lancer Puppeteer pour générer le PDF
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' }); // Charger le fichier HTML

    // Générer le PDF à partir de la page HTML
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Enregistrer le fichier PDF dans le dossier 'pdf'
    fs.writeFileSync(pdfPath, pdfBuffer);

    // Renvoie l'URL du fichier PDF généré pour que le frontend puisse l'afficher
    res.status(200).json({
      message: 'PDF généré avec succès',
      pdfUrl: `/pdf/${fileName}.pdf` // Renvoie l'URL du fichier PDF généré
    });

  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la génération du PDF', details: error.message });
  }
}

export default { createCV, getCV, updateCV, deleteCV, generatePDF };
