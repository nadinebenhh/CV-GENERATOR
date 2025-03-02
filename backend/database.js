import mysql from 'mysql2';

// Création de la connexion à la base de données MySQL avec un pool de connexions
const db = mysql.createPool({
    host: 'localhost',           // Hôte de la base de données
    user: 'root',                // Nom d'utilisateur de la base de données
    password: 'Valentino/20',    // Mot de passe pour se connecter à MySQL
    database: "cv_builder",      // Nom de la base de données à utiliser
    waitForConnections: true,    // Attente de connexions si toutes sont occupées
});

// Vérification de la connexion à la base de données
db.getConnection((err, connection) => {
    if (err) {
        // Affiche l'erreur de connexion en cas de problème
        console.error('❌ Erreur de connexion à MySQL:', err);
        return;
    } 
    
    // Si la connexion réussit, on libère la connexion et affiche un message de succès
    console.log('✅ Connecté à la base de données MySQL');
    connection.release();  // Libère la connexion pour être réutilisée par d'autres requêtes
});

// Exporte l'objet db pour être utilisé dans d'autres fichiers (comme dans vos controllers)
export default db.promise();

