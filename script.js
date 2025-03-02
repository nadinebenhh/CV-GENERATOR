d<script>
// Afficher ou masquer le champ de photo en fonction du modèle choisi
document.getElementById("modelChoice").addEventListener("change", function() {
    const photoUpload = document.getElementById("photoUpload");
    if (this.value === "modele1") {
        photoUpload.style.display = "block";  // Afficher le champ photo pour le modèle 1
    } else {
        photoUpload.style.display = "none";  // Masquer le champ photo pour le modèle 2
    }
});

// Gestion de la soumission du formulaire
document.getElementById("cvForm").addEventListener("submit", async function(event) {
    event.preventDefault();  // Empêcher le rechargement de la page lors de la soumission du formulaire

    // Récupération des données du formulaire
    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append("phone_number", document.getElementById("phone_number").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("city_or_zip", document.getElementById("city_or_zip").value);
    formData.append("linkedin", document.getElementById("linkedin").value);
    formData.append("experiences", document.getElementById("experiences").value);
    formData.append("education", document.getElementById("education").value);
    formData.append("skills", document.getElementById("skills").value);
    formData.append("certifications", document.getElementById("certifications").value);
    formData.append("interests", document.getElementById("interests").value);
    formData.append("professional_project", document.getElementById("professional_project").value);

    // Validation du numéro de téléphone
    if (!/^\d{8}$/.test(formData.get("phone_number"))) {
        alert("Numéro de téléphone invalide. Veuillez entrer un numéro à 8 chiffres.");
        return;
    }

    // Vérification du modèle sélectionné et ajout de la photo si nécessaire
    const model = document.getElementById("modelChoice").value;  // Remplacer "cv_model" par "modelChoice"
    if (model === "modele1") {  // Si le modèle nécessite une photo
        const photoInput = document.getElementById("photo");
        if (photoInput.files.length > 0) {
            formData.append("photo", photoInput.files[0]); // Ajouter la photo à formData
        } else {
            alert("Veuillez télécharger une photo pour ce modèle.");
            return;
        }
    }

    try {
        const response = await fetch("https://api.example.com/generate-cv", {
            method: "POST",
            body: formData  // Utilisation de FormData pour envoyer les données
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur : ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        alert("CV généré avec succès !");
    } catch (error) {
        alert(`Une erreur s'est produite : ${error.message}`);
    }
});

