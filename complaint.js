document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.getElementById('complaintForm');
    
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(complaintForm);
        
        try {
            // Simulation d'envoi à un serveur
            // À remplacer par votre véritable endpoint d'API
            await simulateSubmission(formData);
            
            // Afficher un message de succès
            showMessage('Votre plainte a été enregistrée avec succès. Nous vous contacterons dans les plus brefs délais.', 'success');
            
            // Réinitialiser le formulaire
            complaintForm.reset();
            
        } catch (error) {
            showMessage('Une erreur est survenue lors de l\'envoi de votre plainte. Veuillez réessayer.', 'error');
        }
    });
});

function showMessage(message, type) {
    // Supprimer les anciens messages
    const oldMessages = document.querySelectorAll('.confirmation-message, .error-message');
    oldMessages.forEach(msg => msg.remove());
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'confirmation-message' : 'error-message';
    messageDiv.textContent = message;
    
    // Insérer le message avant le formulaire
    const form = document.getElementById('complaintForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Afficher le message
    messageDiv.style.display = 'block';
    
    // Faire défiler jusqu'au message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

async function simulateSubmission(formData) {
    // Simulation d'une requête API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
} 