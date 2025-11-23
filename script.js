document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('chat-messages');
    const notification = document.getElementById('notification');
    const messageFormAlice = document.getElementById('message-form-alice');
    const messageInputAlice = document.getElementById('message-input-alice');
    const messageFormBob = document.getElementById('message-form-bob');
    const messageInputBob = document.getElementById('message-input-bob');

    // Charger les messages depuis localStorage
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    renderMessages();

    // Fonction pour afficher les messages
    function renderMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', msg.sender);
            msgDiv.textContent = msg.text;
            messagesContainer.appendChild(msgDiv);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
    }

    // Fonction pour afficher la notification
    function showNotification() {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    // Événement pour Alice
    messageFormAlice.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInputAlice.value.trim();
        if (text) {
            messages.push({ sender: 'alice', text });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
            messageInputAlice.value = '';
        }
    });

    // Événement pour Bob
    messageFormBob.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInputBob.value.trim();
        if (text) {
            messages.push({ sender: 'bob', text });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
            messageInputBob.value = '';
        }
    });
});