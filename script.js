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

    // new chat every time i refresh
    let messages = [];
    localStorage.removeItem('chatMessages'); 

    let userNames = JSON.parse(localStorage.getItem('chatUserNames'));

    // pour la saisie des noms 
    overlay.style.display = 'flex';
    chatWrapper.style.display = 'none';
    localStorage.removeItem('chatUserNames'); // Optionnel : forcer la resaisie des noms

    // les noms
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

   

    function showNotification() {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    //left chat event 
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

    // right chat event 
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

initEmojiPickers();

function addReaction(messageIndex, emoji, sender) {
    if (!messages[messageIndex].reactions) {
        messages[messageIndex].reactions = {};
    }
    
    
    const hasSameReaction = messages[messageIndex].reactions[emoji] && 
                           messages[messageIndex].reactions[emoji].includes(sender);
    
    if (hasSameReaction) {
        
        delete messages[messageIndex].reactions[emoji];
       
        if (Object.keys(messages[messageIndex].reactions).length === 0) {
            delete messages[messageIndex].reactions;
        }
    } else {
       
        Object.keys(messages[messageIndex].reactions).forEach(e => {
            const index = messages[messageIndex].reactions[e].indexOf(sender);
            if (index > -1) {
                messages[messageIndex].reactions[e].splice(index, 1);
                if (messages[messageIndex].reactions[e].length === 0) {
                    delete messages[messageIndex].reactions[e];
                }
            }
        });
        
       
        messages[messageIndex].reactions[emoji] = [sender];
    }
    
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    renderMessages();
}


function renderMessages() {
    messagesContainer.innerHTML = '';
    messages.forEach((msg, index) => {

        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message-wrapper ${msg.sender === 'left' ? 'alice' : 'bob'}`;

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.sender === 'left' ? 'alice' : 'bob');
        
        // si je veux afficher le nom du sender dans la conversation :
        //const senderName = msg.sender === 'left' ? userNames.left : userNames.right;
       // const nameSpan = document.createElement('span');
        //nameSpan.className = 'sender-name';
        //nameSpan.textContent = senderName + ': ';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = msg.text;
        
        //msgDiv.appendChild(nameSpan);
        msgDiv.appendChild(textSpan);
        
        
    if (msg.reactions && Object.keys(msg.reactions).length > 0) {
        const reactionsDisplay = document.createElement('div');
        reactionsDisplay.className = 'reactions-display';
    
   
       Object.keys(msg.reactions).forEach(emoji => {
            const reactionBadge = document.createElement('div');
            reactionBadge.className = 'reaction-badge';
            reactionBadge.textContent = emoji;
            reactionsDisplay.appendChild(reactionBadge);
        });
        msgDiv.appendChild(reactionsDisplay);
    }
        /*const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        messageContainer.appendChild(msgDiv);*/

        const reactionPicker = document.createElement('div');
        reactionPicker.className = 'message-reactions';
        
        const emojis = ['😊', '😂', '❤️', '👍', '😢', '🎉'];
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'reaction-emoji';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                const currentUser = msg.sender === 'left' ? 'left' : 'right';
                addReaction(index, emoji, currentUser);
            });
            reactionPicker.appendChild(emojiBtn);
        });
        
        messageWrapper.appendChild(msgDiv);
        messageWrapper.appendChild(reactionPicker);
        messagesContainer.appendChild(messageWrapper)
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
});



function initEmojiPickers() {
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    const emojiPickers = document.querySelectorAll('.emoji-picker');
    

    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', 
                   '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
                   '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', 
                   '🤪', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', 
                   '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', 
                   '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', 
                   '😳', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', 
                   '🤔', '🤭', '🤫', '😶', '😐', '😑', '😬', '🙄', 
                   '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', 
                   '😪', '😵', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];
    

    emojiPickers.forEach(picker => {
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'emoji-option';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {
                const inputId = picker.getAttribute('data-input');
                const input = document.getElementById(inputId);
                input.value += emoji;
                input.focus();
                
            });
            picker.appendChild(emojiBtn);
        });
    });
    
  
    emojiButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const inputId = button.getAttribute('data-input');
            const picker = document.querySelector(`.emoji-picker[data-input="${inputId}"]`);
           
            emojiPickers.forEach(p => {
                if (p !== picker) p.classList.remove('active');
            });
            
            
            picker.classList.toggle('active');
        });
    });
    
   
    document.addEventListener('click', () => {
        emojiPickers.forEach(picker => {
            picker.classList.remove('active');
        });
    });
}


