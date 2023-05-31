// Récupération des boutons
const addTextButton = document.getElementById('add-text');
const addImageButton = document.getElementById('add-image');
const saveButton = document.getElementById('save');

// Récupération du conteneur
const container = document.getElementById('container');

// Fonction pour ajouter un texte
function addText() {
    const text = document.createElement('div');
    text.innerHTML = 'Mon texte';
    text.style.position = 'absolute';
    text.style.top = '100px';
    text.style.left = '100px';
    container.appendChild(text);
}

// Fonction pour ajouter une image
function addImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            const image = document.createElement('img');
            image.src = reader.result;
            image.style.position = 'absolute';
            image.style.top = '200px';
            image.style.left = '200px';
            image.setAttribute('alt', 'description de l image');
            container.appendChild(image);
        };
    };
    input.click();
}


// Fonction pour enregistrer
// Fonction pour enregistrer
function save() {
    // Récupération du code HTML, CSS, et images du conteneur
    const html = container.innerHTML;
    const styles = document.querySelectorAll('#container [style]');
    let css = '';
    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        css += '#' + style.parentNode.id + ' [style="' + style.getAttribute('style') + '"] { ' + style.getAttribute('style') + ' }\n';
        style.removeAttribute('style');
    }
    const images = container.getElementsByTagName('img');

    // Envoi des fichiers au serveur via AJAX
    const formData = new FormData();
    formData.append('html', html);
    formData.append('css', css);
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const dataUrl = image.src;
        const matches = dataUrl.match(/^data:(.*);base64,(.*)$/);
        const mimeType = matches[1];
        const base64Data = matches[2];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let j = 0; j < byteCharacters.length; j++) {
            byteArrays.push(byteCharacters.charCodeAt(j));
        }
        const blob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });
        formData.append('image' + i, blob, image.getAttribute('alt'));
    }
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'save.php', true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('Enregistrement réussi');
        }
    };
    xhttp.send(formData);
}


// Ajout des écouteurs d'événements aux boutons
addTextButton.addEventListener('click', addText);
addImageButton.addEventListener('click', addImage);
saveButton.addEventListener('click', save);
