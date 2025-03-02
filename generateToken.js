import jwt from "jsonwebtoken"; // Utiliser `import` au lieu de `require`

// Les données (payload) du token
const payload = {
  id: 7,
  email: "amelie.dupont@example.com",
};

// Clé secrète utilisée pour signer le token
const secret = "votre-cle-secrete"; // Remplacez par votre clé réelle

// Génération du token avec une expiration de 1 heure
const token = jwt.sign(payload, secret, { expiresIn: "1h" });

console.log("Token généré :", token);
