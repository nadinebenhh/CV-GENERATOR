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

// Lors de la soumission du formulaire (avec affichage du CV généré directement)
document.getElementById("cvForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this); // Récupère automatiquement les données du formulaire
  const templateSelect = document.getElementById("templateSelect");
  const templateId = templateSelect.value; // Récupère l'ID du modèle sélectionné

  console.log("Modèle sélectionné ID:", templateId); // Vérifie l'ID sélectionné
  try {
      const response = await fetch(`http://localhost:3000/api/cvs/generate`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              templateId,
              data: Object.fromEntries(formData), // Convertir FormData en objet JSON
          }),
      });

      if (!response.ok) {
          throw new Error("Erreur lors de la génération du CV");
      }

      
      // Si le backend retourne un fichier HTML en réponse
      const cvFile = await response.text();

      // Récupérer le nom du fichier généré (ex: "cv1.html")
      const cvFileName = cvFile.trim();

      // Afficher la section du CV généré
      document.getElementById("cvContainer").style.display = "block";

      // Insérer le contenu du CV dans la section "cvContent"
      const cvContentContainer = document.getElementById("cvContent");

      // Chargez le fichier HTML généré à partir du serveur
      const cvResponse = await fetch(`http://localhost:3000/generated/${cvFileName}`);
      const cvHtml = await cvResponse.text();

      // Insérer le contenu du CV dans la page
      cvContentContainer.innerHTML = cvHtml;

      alert("CV généré avec succès !");
  } catch (error) {
      console.error("Erreur :", error.message);
      alert("Une erreur est survenue lors de la génération du CV.");
  }
});