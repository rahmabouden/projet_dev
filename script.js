document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('name-setup-overlay');
    const nameSetupForm = document.getElementById('name-setup-form');
    const chatWrapper = document.querySelector('.chat-wrapper');
    const leftUserName = document.getElementById('left-user-name');
    const rightUserName = document.getElementById('right-user-name');
    
    const messagesContainer = document.getElementById('chat-messages');
    const notification = document.getElementById('notification');
    const messageFormAlice = document.getElementById('message-form-alice');
    const messageInputAlice = document.getElementById('message-input-alice');
    const messageFormBob = document.getElementById('message-form-bob');
    const messageInputBob = document.getElementById('message-input-bob');

    // VIDER les messages à chaque actualisation
    let messages = [];
    localStorage.removeItem('chatMessages'); // Supprimer aussi du localStorage

    let userNames = JSON.parse(localStorage.getItem('chatUserNames'));

    // ⭐⭐ MODIFICATION ICI ⭐⭐
    // Afficher TOUJOURS l'overlay au début
    overlay.style.display = 'flex';
    chatWrapper.style.display = 'none';
    localStorage.removeItem('chatUserNames'); // Optionnel : forcer la resaisie des noms

    // Configuration des noms
    nameSetupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameLeft = document.getElementById('name-left').value.trim();
        const nameRight = document.getElementById('name-right').value.trim();
        
        if (nameLeft && nameRight) {
            userNames = {
                left: nameLeft,
                right: nameRight
            };
            localStorage.setItem('chatUserNames', JSON.stringify(userNames));
            startChat(userNames);
        }
    });

    function startChat(names) {
        overlay.style.display = 'none';
        chatWrapper.style.display = 'flex';
        leftUserName.textContent = names.left;
        rightUserName.textContent = names.right;
        renderMessages();
    }

    function renderMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', msg.sender === 'left' ? 'alice' : 'bob');
            
            const senderName = msg.sender === 'left' ? userNames.left : userNames.right;
            const nameSpan = document.createElement('span');
            nameSpan.className = 'sender-name';
            nameSpan.textContent = senderName + ': ';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'message-text';
            textSpan.textContent = msg.text;
            
            msgDiv.appendChild(nameSpan);
            msgDiv.appendChild(textSpan);
            messagesContainer.appendChild(msgDiv);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showNotification() {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    // Événement pour Alice (gauche)
    messageFormAlice.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInputAlice.value.trim();
        if (text) {
            messages.push({ sender: 'left', text });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
            messageInputAlice.value = '';
        }
    });

    // Événement pour Bob (droite)
    messageFormBob.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInputBob.value.trim();
        if (text) {
            messages.push({ sender: 'right', text });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
            messageInputBob.value = '';
        }
    });
});