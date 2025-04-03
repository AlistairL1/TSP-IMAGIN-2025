document.addEventListener('DOMContentLoaded', () => {
    const newTopicBtn = document.getElementById('newTopicBtn');
    const newTopicForm = document.getElementById('newTopicForm');
    const topicForm = document.getElementById('topicForm');
    const cancelTopicBtn = document.getElementById('cancelTopic');

    // Exemple de données pour le forum
    const sampleTopics = {
        'vie-locale': [
            {
                title: 'Nouveau marché hebdomadaire',
                author: 'Marie D.',
                date: '2024-03-15',
                preview: 'Proposition d\'un nouveau marché bio le dimanche matin...',
                responses: 5
            }
        ],
        'evenements': [
            {
                title: 'Festival d\'été 2024',
                author: 'Pierre M.',
                date: '2024-03-14',
                preview: 'Programme des festivités pour cet été...',
                responses: 3
            }
        ],
        'projets': [
            {
                title: 'Rénovation du parc central',
                author: 'Sophie L.',
                date: '2024-03-13',
                preview: 'Consultation citoyenne pour le projet de rénovation...',
                responses: 8
            }
        ]
    };

    // Afficher/Masquer le formulaire de nouveau sujet
    newTopicBtn.addEventListener('click', () => {
        newTopicForm.style.display = 'block';
    });

    cancelTopicBtn.addEventListener('click', () => {
        newTopicForm.style.display = 'none';
        topicForm.reset();
    });

    // Gérer la soumission d'un nouveau sujet
    topicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('topicTitle').value;
        const category = document.getElementById('topicCategory').value;
        const content = document.getElementById('topicContent').value;

        // Ajouter le nouveau sujet
        addNewTopic({
            title: title,
            author: 'Utilisateur',
            date: new Date().toISOString().split('T')[0],
            preview: content.substring(0, 100) + '...',
            responses: 0
        }, category);

        // Réinitialiser et masquer le formulaire
        topicForm.reset();
        newTopicForm.style.display = 'none';
    });

    // Fonction pour ajouter un nouveau sujet
    function addNewTopic(topic, category) {
        const topicElement = createTopicElement(topic);
        const categoryContainer = document.getElementById(`${category}-topics`);
        if (categoryContainer) {
            categoryContainer.insertBefore(topicElement, categoryContainer.firstChild);
        }
    }

    // Fonction pour créer l'élément HTML d'un sujet
    function createTopicElement(topic) {
        const topicDiv = document.createElement('div');
        topicDiv.className = 'topic-card';
        topicDiv.innerHTML = `
            <div class="topic-header">
                <span class="topic-title">${topic.title}</span>
                <span class="topic-meta">par ${topic.author} le ${topic.date}</span>
            </div>
            <p class="topic-preview">${topic.preview}</p>
            <div class="topic-meta">
                <span>${topic.responses} réponse(s)</span>
            </div>
        `;

        // Ajouter un événement de clic pour voir le sujet complet
        topicDiv.addEventListener('click', () => {
            // À implémenter : affichage du sujet complet
            console.log('Afficher le sujet:', topic.title);
        });

        return topicDiv;
    }

    // Initialiser le forum avec les sujets exemple
    Object.entries(sampleTopics).forEach(([category, topics]) => {
        topics.forEach(topic => addNewTopic(topic, category));
    });
}); 