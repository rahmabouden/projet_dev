
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('name-setup-overlay');
    const nameSetupForm = document.getElementById('name-setup-form');
    const chatWrapper = document.querySelector('.chat-wrapper');
    const leftUserName = document.getElementById('left-user-name');
    const rightUserName = document.getElementById('right-user-name');
    
    const messagesContainer = document.getElementById('chat-messages');
    const notification = document.getElementById('notification');
    const messageFormperA = document.getElementById('message-form-perA');
    const messageInputperA = document.getElementById('message-input-perA');
    const messageFormperB = document.getElementById('message-form-perB');
    const messageInputperB = document.getElementById('message-input-perB');
    const cameraModal = document.getElementById('camera-modal');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    const cameraInput = document.getElementById('camera-input');
    const galleryInput= document.getElementById('gallery-input');
    
   

    // new chat every time i refresh
    let messages = [];
    localStorage.removeItem('chatMessages'); 

    let userNames = JSON.parse(localStorage.getItem('chatUserNames'));

    // pour la saisie des noms 
    overlay.style.display = 'flex';
    chatWrapper.style.display = 'none';
    localStorage.removeItem('chatUserNames'); // forcer la resaisie des noms

    // la saisie des noms
    nameSetupForm.addEventListener('submit', (e) => {/* this function captures the names of the two users to start the conv */ 
        e.preventDefault();/* when we click submit*/ 
        const nameLeft = document.getElementById('name-left').value.trim(); /*takes te first name  */
        const nameRight = document.getElementById('name-right').value.trim();/*takes the second  name  */
        
        if (nameLeft && nameRight) {
            userNames = {
                left: nameLeft,
                right: nameRight
            };
            localStorage.setItem('chatUserNames', JSON.stringify(userNames));/*stores the name inthe local storage  */
            startChat(userNames);/*this function does the transition from the setuo screen to the main chat interface  */
        }

    });

    function startChat(names) {
        overlay.style.display = 'none'; //hides the setap overlay
        chatWrapper.style.display = 'flex'; //shows the main inetrface 
        leftUserName.textContent = names.left; //puts the names in their places 
        rightUserName.textContent = names.right;
        renderMessages();//calls the render messages 
    }

   

    function showNotification() {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);//notification in the corner for two seconds 
    }

    //left chat event 
    // this function handles the sending of new text messages from user A
    messageFormperA.addEventListener('submit', (e) => { //when we click pn the "envoyer" button 
        e.preventDefault();
        const text = messageInputperA.value.trim(); //it takes the text written 
        if (text) {
            messages.push({ sender: 'left', text }); //  makes an obeject aand adds it  in an array
            localStorage.setItem('chatMessages', JSON.stringify(messages));//saves the array in local storage
            renderMessages();//calls the render func
            showNotification();//show notif
            messageInputperA.value = '';//reintialiser la saisie area 
        }
    });

    // right chat event 
// this function handles the sending of new text messages from user A (same as the last one but for the otherrr user )
    messageFormperB.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInputperB.value.trim();
        if (text) {
            messages.push({ sender: 'right', text });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
            messageInputperB.value = '';
        }

    
    });
   
    
    
   
    
initEmojiPickers();
// Permettre d'envoyer avec la touche Entrée
messageInputperA.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        messageFormperA.dispatchEvent(new Event('submit'));
    }
});

messageInputperB.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        messageFormperB.dispatchEvent(new Event('submit'));
    }
});

function renderMessages() {//the MAIN function 
    messagesContainer.innerHTML = ''; //clear message container 
    messages.forEach((msg, index) => {

        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message-wrapper ${msg.sender === 'left' ? 'perA' : 'perB'}`;

        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', msg.sender === 'left' ? 'perA' : 'perB');
        
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

        if (msg.image) {
            const img = document.createElement('img');
            img.src = msg.image;
            img.className = 'message-image';
            msgDiv.appendChild(img);
        }
        if (msg.file) {
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.style.marginTop = '5px';
            fileInfo.style.padding = '8px';
            fileInfo.style.background = '#f5f5f5';
            fileInfo.style.borderRadius = '5px';
            fileInfo.style.border = '1px dashed #ccc';
            
            const downloadLink = document.createElement('a');
            downloadLink.href = msg.file.data;
            downloadLink.download = msg.file.name;
            downloadLink.textContent = `📥 Télécharger ${msg.file.name} (${formatFileSize(msg.file.size)})`;
            downloadLink.style.textDecoration = 'none';
            downloadLink.style.color = '#2196F3';
            downloadLink.style.cursor = 'pointer';
             fileInfo.appendChild(downloadLink);
            msgDiv.appendChild(fileInfo);
        }
        
        
        
    if (msg.reactions && Object.keys(msg.reactions).length > 0) { //if th emessage has a reaction 
    
        const reactionsDisplay = document.createElement('div'); //creates a container for badges 
        reactionsDisplay.className = 'reactions-display';
    
   
       Object.keys(msg.reactions).forEach(emoji => {
            const reactionBadge = document.createElement('div'); // creates a badges showing each emoji
            reactionBadge.className = 'reaction-badge';
            reactionBadge.textContent = emoji;
            reactionsDisplay.appendChild(reactionBadge);
        });
        msgDiv.appendChild(reactionsDisplay);
    }
        

        const reactionPicker = document.createElement('div');// makes a container for reaction btns 
        reactionPicker.className = 'message-reactions';
        
        const emojis = ['😊', '😂', '❤️', '👍', '😢', '🎉'];
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');//creates a btn for each emoji
            emojiBtn.className = 'reaction-emoji';
            emojiBtn.textContent = emoji;
            emojiBtn.addEventListener('click', () => {// when clicked calls addReaction
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
//les reactions sur messages
function addReaction(messageIndex, emoji, sender) {
   
    if (!messages[messageIndex].reactions) {//if the message doesn't have a reaction  it creates an empty object 
        messages[messageIndex].reactions = {};
    }
    
    
    const hasSameReaction = messages[messageIndex].reactions[emoji] && // true if you're clicking with the exact same emoji 
                           messages[messageIndex].reactions[emoji].includes(sender); 
    
    if (hasSameReaction) { // si oui 
        
        delete messages[messageIndex].reactions[emoji]; //enlever l'emoji 
       
        if (Object.keys(messages[messageIndex].reactions).length === 0) { // if there is no reaction left delete the entire reaction property from the message 
            delete messages[messageIndex].reactions;
        }
    } else { //sinon 
       //removing the previous one and adding the nes 
        Object.keys(messages[messageIndex].reactions).forEach(e => {
            const index = messages[messageIndex].reactions[e].indexOf(sender);
            if (index > -1) {
                messages[messageIndex].reactions[e].splice(index, 1);
                if (messages[messageIndex].reactions[e].length === 0) {
                    delete messages[messageIndex].reactions[e];
                }
            }
        });
        
    }
    //save and update
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    renderMessages();
}
function initEmojiPickers() {//this function enables the button of emojis 
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    const emojiPickers = document.querySelectorAll('.emoji-picker');//gets the hidden container where the emojis will show up
    

    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', // an array of emojis (as strings )
                   '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', 
                   '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', 
                   '🤪', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', 
                   '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', 
                   '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', 
                   '😳', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', 
                   '🤔', '🤭', '🤫', '😶', '😐', '😑', '😬', '🙄', 
                   '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', 
                   '😪', '😵', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];
    

    emojiPickers.forEach(picker => { // loop that goes through the two emoji containers (the hidden one ) 
        emojis.forEach(emoji => {//loop that goes through eaach emoji 
            const emojiBtn = document.createElement('button'); //new buutton for each emoji 
            emojiBtn.className = 'emoji-option';
            emojiBtn.textContent = emoji;//the text de ce bouton prend l'emoji courant 
            emojiBtn.addEventListener('click', (e) => {
                e.preventDefault(); // empêche le comportement par défaut
                e.stopPropagation(); // empêche la propagation de l'événement
    
                const inputId = picker.getAttribute('data-input'); //gets the data input from which person 
                const input = document.getElementById(inputId);
    
                // ajout de l'emoji à la position actuelle du curseur
                const cursorPosition = input.selectionStart;
                const textBefore = input.value.substring(0, cursorPosition);
                const textAfter = input.value.substring(cursorPosition);
    
                input.value = textBefore + emoji + textAfter;
    
                // replace le curseur après l'emoji ajouté
                const newCursorPosition = cursorPosition + emoji.length;
                input.setSelectionRange(newCursorPosition, newCursorPosition);
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
            //close the emoji container when we click elsewhere 
            document.addEventListener('click', () => {
                emojiPickers.forEach(picker => {
                picker.classList.remove('active');
                });
    });
    
   
    
    });
}

document.querySelectorAll('.camera-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        
        e.stopPropagation();
        const user = e.target.getAttribute('data-user');
        const form = e.target.closest('.message-form');
        currentSender = form.id === 'message-form-perA' ? 'left' : 'right';
        document.querySelectorAll('[id^="camera-modal-"]').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Montre le modal correct
        const modal = document.getElementById(`camera-modal-${user}`);
        if (modal) {
            modal.style.display = 'flex';
        }
    });
});
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('camera-option-btn')) {
        e.stopPropagation();
        const user = e.target.getAttribute('data-user');
        const action = e.target.getAttribute('data-action');
        document.getElementById(`camera-modal-${user}`).style.display = 'none';
        
        if (action === 'camera' ) {
            openCamera(user)
        } else if (action === 'gallery' ) {
            document.getElementById(`gallery-input-${user}`).click();
        }
    }
     if (e.target.classList.contains('upload-file-btn')) {
        e.stopPropagation();
        const user = e.target.getAttribute('data-user');
        document.getElementById(`camera-modal-${user}`).style.display = 'none';
        // Ajouter la logique pour uploader des fichiers si nécessaire
    }
});

document.addEventListener('click', (e) => {
    // Check if click is outside any modal content
    const isModalClick = e.target.closest('.overlay-content');
    const isCameraBtnClick = e.target.classList.contains('camera-btn');

    if (!isModalClick && !isCameraBtnClick) {
        document.querySelectorAll('[id^="camera-modal-"]').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});




//opens a camera interface with live preview using  the browsers's direct camera API
function openDirectCamera(user) {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" // use front camera
        },
        audio: false 
    })
    .then(function(stream) {//if camera access is successfully grantes the live video stream 
        showCameraPreview(stream, user);
    })
    .catch(function(error) {//if camera acces denied or fails 
        console.error("Camera error:", error);//logs the specific error to the console for debugging 
        alert("Impossible d'accéder à la caméra. Vérifiez les permissions ou utilisez la galerie.");
        document.getElementById(`camera-input-${user}`).click();//opens gallery instead 
    });
}
//creates a full-screen overlay with a live video feed from 
//the camera and the two buutons capyurer et  annuler 
function showCameraPreview(stream, user) {
    // Create camera preview overlay
    const cameraOverlay = document.createElement('div');
    cameraOverlay.className = 'overlay';
    cameraOverlay.style.zIndex = '2000';
    cameraOverlay.innerHTML = `
        <div class="overlay-content" style="max-width: 600px;">
            <h2>Prendre une photo</h2>
            <video id="camera-preview-${user}" autoplay playsinline style="width: 100%; max-width: 500px; border-radius: 10px;"></video>
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button type="button" class="camera-option-btn capture-btn" data-user="${user}" style="width: auto; padding: 10px 20px;">📷 Capturer</button>
                 <button type="button" class="camera-option-btn cancel-btn" data-user="${user}" style="width: auto; padding: 10px 20px; background: #ff5722;">❌ Annuler</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cameraOverlay);
    
    const video = document.getElementById(`camera-preview-${user}`);
    video.srcObject = stream;
    document.querySelector('.capture-btn').addEventListener('click', () => capturePhoto(video, user, stream));
    document.querySelector('.cancel-btn').addEventListener('click', () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(cameraOverlay);
    });

}
//takes a snapshot from the live video feed and adds it as message 
function capturePhoto(video, user, stream) {
    //this try block catches any potential errors during the process 
    try {
        console.log("Capture photo called for user:", user);//logs a debug message to confirm the function was called and for which user 
        //creation de canvas 
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
       
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0); //captures the photo by drawing the current video frame onto the canvas at position (0,0)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8); //  covertion vers JPEG pour réduire la taille
        console.log("Image data created, length:", imageData.length);//logs the size 
        
        // stop camera stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        //Supprimer l'overlay de manière sécurisée
        const cameraOverlay = video.closest('.overlay');
        if (cameraOverlay && cameraOverlay.parentNode) {
            cameraOverlay.remove();
        }
        
        // Add the photo to messages
        const sender = user === 'perA' ? 'left' : 'right';
        messages.push({ 
            sender: sender, 
            text: '',
            image: imageData 
        });
        console.log("Message added to array, total messages:", messages.length);
       //save and update  
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        renderMessages();
        showNotification();
        
    }
    //if anything goes wrong in the try block
     catch (error) {
        console.error("Error in capturePhoto:", error);
        // Continuer même si l'overlay ne peut pas être supprimé
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        renderMessages();
        showNotification();
    }
}
function openCamera(user) {
    // hide the modal
    document.getElementById(`camera-modal-${user}`).style.display = 'none';
    //getUserMedia method to request camera 
    //Method to request camera/microphone access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {//checks if the browser supports the modern gerUserMedia API for direct camera acces 
        openDirectCamera(user); //if yess we call opendirectcamera(user) to start the costum camera interface with live preview 
    } else {
        // Fallback for older browsers or mobile
        const cameraInput = document.getElementById(`camera-input-${user}`);
        cameraInput.click();
    }
    

 



}
//photos 
function handleImageSelection(e, user) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();// reads the chosen image 
        reader.onload = function(event) {
            // déterminer l'expéditeur
            const sender = user === 'perA' ? 'left' : 'right';
            
            // Ajouter le message image
            messages.push({ 
                sender: sender, 
                text: '',
                image: event.target.result 
            });
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
        };
        reader.readAsDataURL(file);//converts it to a data url
    }

    // Réinitialiser les inputs
    e.target.value = '';
}
// fonction pour gérer la sélection de fichiers
function handleFileSelection(e, user) {
    const file = e.target.files[0];//get the selected file 
    if (file) {
        const reader = new FileReader(); //can read the content of files 
        reader.onload = function(event) {
            const sender = user === 'perA' ? 'left' : 'right';//which user is sending the file 
            
            // Déterminer le type de fichier
            let fileType = 'file';
            let fileIcon = '📎';
            
            if (file.type.startsWith('image/')) {
                fileType = 'image';
                fileIcon = '🖼️';
            } else if (file.type.startsWith('video/')) {
                fileType = 'video';
                fileIcon = '🎬';
            } else if (file.type.startsWith('audio/')) {
                fileType = 'audio';
                fileIcon = '🎵';
            } else if (file.type.includes('pdf')) {
                fileIcon = '📄';
            } else if (file.type.includes('zip') || file.type.includes('rar')) {
                fileIcon = '📦';
            }
            
            // Ajouter le message fichier
            messages.push({ 
                sender: sender, 
                text: `${fileIcon} Fichier: ${file.name}`,
                file: {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: event.target.result
                }
            });
            //save and update 
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            renderMessages();
            showNotification();
        };
        reader.readAsDataURL(file);
    }

    // Réinitialiser l'input
    e.target.value = '';
}

// Fonction pour ouvrir le sélecteur de fichiers
function openFileSelector(user) {
    document.getElementById(`file-input-${user}`).click();
}



// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Écouteurs pour les boutons de téléchargement de fichiers
document.querySelectorAll('.upload-file-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const user = e.target.getAttribute('data-user');
        document.getElementById(`camera-modal-${user}`).style.display = 'none';
        openFileSelector(user);
    });
});

// Ajoutez les écouteurs pour les inputs camera et gallery
document.getElementById('camera-input-perA').addEventListener('change', (e) => handleImageSelection(e, 'perA'));
document.getElementById('gallery-input-perA').addEventListener('change', (e) => handleImageSelection(e, 'perA'));
document.getElementById('camera-input-perB').addEventListener('change', (e) => handleImageSelection(e, 'perB'));
document.getElementById('gallery-input-perB').addEventListener('change', (e) => handleImageSelection(e, 'perB'));



// Écouteurs pour les inputs de fichiers
document.getElementById('file-input-perA').addEventListener('change', (e) => handleFileSelection(e, 'perA'));
document.getElementById('file-input-perB').addEventListener('change', (e) => handleFileSelection(e, 'perB'));
});






