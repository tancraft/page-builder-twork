
//Variables globales de l app
let currentTool = 'create';
let parentDiv = document.getElementById('outputZone');
let isCreating = false;
let selectedDiv = null;
let divsToUpdate = [];

// faire une couleur random
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// class pour la gestion des outils
class Tools {
  static createDivOnClick(divId, content) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('id', divId);
    newDiv.innerHTML = content;

    newDiv.addEventListener('click', (event) => {
      event.stopPropagation();

      if (currentTool === 'select') {
        Tools.selectDiv(newDiv);
      } else if (currentTool === 'create') {
        const nestedDiv = Tools.createDivOnClick(`div${Date.now()}`, 'Nouvelle div');
        newDiv.appendChild(nestedDiv);
      }
    });

    newDiv.addEventListener('mouseover', () => {
      if (currentTool === 'create' && !isCreating) {
        parentDiv = newDiv;
        newDiv.classList.add('hover');
      }
    });

    newDiv.addEventListener('mouseout', () => {
      if (currentTool === 'create') {
        newDiv.classList.remove('hover');
      }
    });

    newDiv.style.width = '100%';
    newDiv.style.minHeight = '20px';

    newDiv.style.backgroundColor = getRandomColor();

    return newDiv;
  }

  static selectDiv(div) {
    if (selectedDiv) {
      selectedDiv.classList.remove('selected');
    }
  
    selectedDiv = div;
    selectedDiv.classList.add('selected');
  
    // update des params a droite
    Parameters.updateParameters(selectedDiv);
  
    // update des divs
    divsToUpdate = [selectedDiv];
  }
  
}

class Parameters {

  static rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g).map(Number);

    const hexValues = rgbValues.map((value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    });

    // return de la valeur hexa
    return '#' + hexValues.join('');
  }
  
  static updateParameters(div) {
    const backgroundColorInput = document.getElementById('backgroundColorInput');
    const widthInput = document.getElementById('widthInput');
    const minHeightInput = document.getElementById('minHeightInput');

    let backgroundColor = window.getComputedStyle(div).backgroundColor;
    let width = window.getComputedStyle(div).width;
    let minHeight = window.getComputedStyle(div).minHeight;

    // convertir rgb en hexa
    backgroundColor = Parameters.rgbToHex(backgroundColor);

    backgroundColorInput.value = backgroundColor;
    widthInput.value = width;
    minHeightInput.value = minHeight;

    backgroundColorInput.removeEventListener('input', Parameters.handleBackgroundColorChange);
    widthInput.removeEventListener('input', Parameters.handleWidthChange);
    minHeightInput.removeEventListener('input', Parameters.handleMinHeightChange);

    backgroundColorInput.addEventListener('input', Parameters.handleBackgroundColorChange);
    widthInput.addEventListener('input', Parameters.handleWidthChange);
    minHeightInput.addEventListener('input', Parameters.handleMinHeightChange);
  }

  static handleBackgroundColorChange(event) {
    const backgroundColor = event.target.value;
    const divToUpdate = divsToUpdate[0];
    divToUpdate.style.backgroundColor = backgroundColor;
  }

  static handleWidthChange(event) {
    const width = event.target.value;
    const divToUpdate = divsToUpdate[0];
    divToUpdate.style.width = width;
  }

  static handleMinHeightChange(event) {
    const minHeight = event.target.value;
    const divToUpdate = divsToUpdate[0];
    divToUpdate.style.minHeight = minHeight;
  }
}

// Fonction AJAX pour envoyer afin de traiter en php l ecriture des fichiers
function sendStructureToPHP(structure) {
  fetch('script.php', {
    method: 'POST',
    body: JSON.stringify({ structure: structure }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Une erreur s\'est produite:', error);
    });
}

// classe application de base se lance avec une premiere frame(id root)
class Root {
  constructor() {
    this.rootDiv = Tools.createDivOnClick('root', '');
    this.outputElement = document.getElementById('outputZone');
    this.paramContent = document.getElementById('paramContent');

    this.createButton = document.getElementById('createButton');
    this.selectButton = document.getElementById('selectButton');
    this.saveButton = document.getElementById('saveButton');

    this.createButton.addEventListener('click', this.handleCreateButtonClick.bind(this));
    this.selectButton.addEventListener('click', this.handleSelectButtonClick.bind(this));
    this.saveButton.addEventListener('click', this.handleSaveButtonClick.bind(this));

    this.outputElement.addEventListener('click', this.handleOutputClick.bind(this));
    this.outputElement.addEventListener('mouseover', this.handleOutputMouseOver.bind(this));
    this.outputElement.addEventListener('mouseout', this.handleOutputMouseOut.bind(this));

    this.outputElement.appendChild(this.rootDiv);
    Parameters.updateParameters(this.rootDiv);
  }

  handleCreateButtonClick() {
    currentTool = 'create';
    Parameters.updateParameters(selectedDiv);
  }

  handleSelectButtonClick() {
    currentTool = 'select';
  }

  handleSaveButtonClick() {
    const structureAsString = this.getStructureAsString();
    sendStructureToPHP(structureAsString);
  }

  getStructureAsString() {
    return this.rootDiv.outerHTML;
  }

  handleOutputClick(event) {
    const target = event.target;
    if (currentTool === 'create' && !isCreating && target === parentDiv) {
      isCreating = true;
      const newDiv = Tools.createDivOnClick(`div${Date.now()}`, 'Nouvelle div');
      target.appendChild(newDiv);
      isCreating = false;

      // Mupdate des styles et param du bloc selectionner dans la partie droite d el appli
      Parameters.updateParameters(newDiv);
    }
  }

  handleOutputMouseOver(event) {
    const target = event.target;
    target.style.border = '1px solid red';

    const parentDiv = target.closest('.parent-div');
    if (parentDiv && !parentDiv.classList.contains('hover') && target !== parentDiv) {
      parentDiv.classList.add('hover');
    }
  }

  handleOutputMouseOut(event) {
    const target = event.target;
    target.style.border = 'none';

    const parentDiv = target.closest('.parent-div');
    if (parentDiv && parentDiv.classList.contains('hover') && target !== parentDiv) {
      parentDiv.classList.remove('hover');
    }
  }
}

//demarrer l appli
const root = new Root();
