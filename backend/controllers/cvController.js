// controllers/cvController.js
import db from '../database.js'; // Connexion MySQL

// Créer un nouveau CV
const createCV = async (req, res) => {
  const {
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
  } = req.body;
  const userId = req.user.id; // ID de l'utilisateur connecté

  try {
    const [result] = await db.query(
      `INSERT INTO cvs (
          user_id, title, phone_number, location, city_or_zip, linkedin, experiences, education, skills, certifications, interests, professional_project
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        phone_number,
        location,
        city_or_zip,
        linkedin,
        JSON.stringify(experiences),
        JSON.stringify(education),
        JSON.stringify(skills),
        JSON.stringify(certifications),
        JSON.stringify(interests),
        JSON.stringify(professional_project),
      ]
    );

    res.status(201).json({ message: 'CV créé avec succès', cvId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du CV', details: error.message });
  }
};

// Récupérer un CV spécifique
const getCV = async (req, res) => {
  const cvId = req.params.id;

  try {
    const [cv] = await db.query(`SELECT * FROM cvs WHERE id = ?`, [cvId]);

    if (!cv.length) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    res.status(200).json(cv[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du CV', details: error.message });
  }
};

// Mettre à jour un CV existant
const updateCV = async (req, res) => {
  const cvId = req.params.id;
  const {
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
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE cvs
       SET title = ?, phone_number = ?, location = ?, city_or_zip = ?, linkedin = ?, experiences = ?, education = ?, skills = ?, certifications = ?, interests = ?, professional_project = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        phone_number,
        location,
        city_or_zip,
        linkedin,
        JSON.stringify(experiences),
        JSON.stringify(education),
        JSON.stringify(skills),
        JSON.stringify(certifications),
        JSON.stringify(interests),
        JSON.stringify(professional_project),
        cvId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    res.status(200).json({ message: 'CV mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du CV', details: error.message });
  }
};

// Supprimer un CV existant
const deleteCV = async (req, res) => {
  const cvId = req.params.id;

  try {
    const [result] = await db.query(`DELETE FROM cvs WHERE id = ?`, [cvId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'CV non trouvé' });
    }

    res.status(200).json({ message: 'CV supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du CV', details: error.message });
  }
};

export default { createCV, getCV, updateCV, deleteCV };
