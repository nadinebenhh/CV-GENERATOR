// Sélection des éléments du DOM
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// État de la conversation
let conversationState = {
  askingForCV: true, // Le chatbot commence par demander si l'utilisateur veut télécharger son CV
};

// Fonction pour créer un élément de message
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Fonction pour générer la réponse du bot
const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  // Récupérer la réponse de l'utilisateur
  const userResponse = messageInput.value.trim().toLowerCase();

  // Réinitialiser le champ de saisie après chaque réponse
  messageInput.value = "";

  if (conversationState.askingForCV) {
    if (userResponse === "oui" || userResponse === "non") {
      if (userResponse === "oui") {
        messageElement.innerText = "Très bien, veuillez télécharger votre CV en format PDF.";
      } else {
        messageElement.innerText = "D'accord, pas de problème. Comment puis-je vous aider autrement ?";
      }
      conversationState.askingForCV = false; // Passer à l'étape suivante
    } else {
      // Réponse invalide : demander à nouveau une réponse valide
      messageElement.innerText = "Je n'ai pas compris votre réponse. Veuillez répondre par 'oui' ou 'non'.";
    }
  }

  // Masquer l'indicateur de "pensée" et faire défiler vers le bas
  incomingMessageDiv.classList.remove("thinking");
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};

// Gestion de l'envoi du message utilisateur
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  const userMessage = messageInput.value.trim();
  if (!userMessage) return; // Ne rien faire si le champ est vide

  // Créer et afficher le message de l'utilisateur
  const outgoingMessageDiv = createMessageElement(
    `<div class="message-text">${userMessage}</div>`,
    "user-message"
  );
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

  // Réinitialiser le champ de saisie
  messageInput.value = "";

  // Simuler la réponse du bot avec un indicateur de "pensée"
  setTimeout(() => {
    const incomingMessageDiv = createMessageElement(
      `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/>
      </svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Événements
sendMessage.addEventListener("click", handleOutgoingMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    handleOutgoingMessage(e);
  }
});
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});
closeChatbot.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
})