// Lorsque l'utilisateur clique sur "Créer un CV"
document.getElementById("createCvBtn").addEventListener("click", function () {
    document.getElementById("modelChoiceSection").style.display = "block"; // Afficher le choix du modèle
});

// Lorsque l'utilisateur clique sur un modèle
document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
        const modelChoice = this.id; // 'modele1' ou 'modele2'
        const photoUpload = document.getElementById("photoUpload");

        // Masquer le choix des modèles et afficher le formulaire
        document.getElementById("modelChoiceSection").style.display = "none";
        document.getElementById("cvFormSection").style.display = "block";

        // Afficher ou masquer l'upload photo selon le modèle choisi
        if (modelChoice === "modele1") {
            photoUpload.style.display = "block"; // Afficher photo pour modèle 1
        } else {
            photoUpload.style.display = "none"; // Masquer photo pour modèle 2
        }
    });
});

// Lorsque le formulaire est soumis pour générer un CV PDF
document.getElementById("cvForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this); // Récupère automatiquement les données du formulaire
    const title = formData.get("title");
    const phoneNumber = formData.get("phone_number");
    const location = formData.get("location");
    const cityOrZip = formData.get("city_or_zip");
    const linkedin = formData.get("linkedin");
    const experiences = formData.get("experiences");
    const education = formData.get("education");
    const skills = formData.get("skills");
    const certifications = formData.get("certifications");
    const interests = formData.get("interests");
    const professionalProject = formData.get("professional_project");

    try {
        // Créer un nouveau document PDF avec jsPDF
        const doc = new jsPDF();

        // Ajouter le titre du CV
        doc.setFontSize(22);
        doc.text(title, 20, 30);

        // Ajouter les informations personnelles
        doc.setFontSize(12);
        doc.text(`Téléphone: ${phoneNumber}`, 20, 40);
        doc.text(`Adresse: ${location}`, 20, 50);
        doc.text(`Ville / Code Postal: ${cityOrZip}`, 20, 60);
        if (linkedin) {
            doc.text(`LinkedIn: ${linkedin}`, 20, 70);
        }

        // Ajouter les sections du CV
        doc.setFontSize(16);
        doc.text("Expériences", 20, 80);
        doc.setFontSize(12);
        doc.text(experiences, 20, 90);

        doc.setFontSize(16);
        doc.text("Éducation", 20, 120);
        doc.setFontSize(12);
        doc.text(education, 20, 130);

        doc.setFontSize(16);
        doc.text("Compétences", 20, 160);
        doc.setFontSize(12);
        doc.text(skills, 20, 170);

        if (certifications) {
            doc.setFontSize(16);
            doc.text("Certifications", 20, 200);
            doc.setFontSize(12);
            doc.text(certifications, 20, 210);
        }

        if (interests) {
            doc.setFontSize(16);
            doc.text("Centres d'intérêt", 20, 240);
            doc.setFontSize(12);
            doc.text(interests, 20, 250);
        }

        doc.setFontSize(16);
        doc.text("Projet Professionnel", 20, 280);
        doc.setFontSize(12);
        doc.text(professionalProject, 20, 290);

        // Générer le fichier PDF et l'afficher
        const pdfOutput = doc.output("blob");
        
        // Afficher le CV PDF dans la zone de CV généré
        const pdfUrl = URL.createObjectURL(pdfOutput);
        const cvContentContainer = document.getElementById("cvContent");
        const pdfEmbed = `<embed src="${pdfUrl}" width="100%" height="600px" type="application/pdf">`;
        cvContentContainer.innerHTML = pdfEmbed;

        // Afficher la section du CV généré
        document.getElementById("cvContainer").style.display = "block";

        alert("CV généré avec succès !");
    } catch (error) {
        console.error("Erreur :", error.message);
        alert("Une erreur est survenue lors de la génération du CV.");
    }
});
