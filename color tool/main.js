class ContrastColorGenerator {
  constructor() {
    this.generateButton = document.getElementById('generate-button');
    this.colorResults = document.getElementById('color-results');

    this.generateButton.addEventListener('click', () => {
      this.generateColors();
    });

    this.colors = [];
    this.lockedColors = [];

    this.generateColors();
  }

  generateColors() {
    const lockedColorsCount = this.lockedColors.length;
    const unlockedColorsCount = 5 - lockedColorsCount;

    const lockedColors = this.lockedColors.slice(0, lockedColorsCount);
    const unlockedColors = this.generateAdditionalColors(unlockedColorsCount);

    this.colors = lockedColors.concat(unlockedColors);

    this.colorResults.innerHTML = '';
    this.colors.forEach((color) => {
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'color-input';
      colorInput.value = color;

      const lockCheckbox = document.createElement('input');
      lockCheckbox.type = 'checkbox';
      lockCheckbox.className = 'lock-checkbox';
      lockCheckbox.checked = this.lockedColors.includes(color);
      lockCheckbox.addEventListener('change', () => {
        this.toggleLock(color, lockCheckbox.checked);
      });

      const rgbaText = document.createElement('span');
      rgbaText.textContent = this.getColorAsRGBA(color);

      const hexText = document.createElement('span');
      hexText.textContent = color;

      const colorContainer = document.createElement('div');
      colorContainer.appendChild(colorInput);
      colorContainer.appendChild(lockCheckbox);
      colorContainer.appendChild(rgbaText);
      colorContainer.appendChild(hexText);

      if (this.lockedColors.includes(color)) {
        colorContainer.classList.add('locked');
      }

      this.colorResults.appendChild(colorContainer);
    });
  }

  generateAdditionalColors(count) {
    const colors = [];

    for (let i = 0; i < count; i++) {
      let color;
      do {
        color = this.getRandomColor();
      } while (colors.includes(color) || this.lockedColors.includes(color));

      colors.push(color);
    }

    return colors;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  toggleLock(color, locked) {
    const index = this.lockedColors.indexOf(color);

    if (locked && index === -1) {
      this.lockedColors.push(color);
    } else if (!locked && index !== -1) {
      this.lockedColors.splice(index, 1);
    }
  }

  getColorAsRGBA(color) {
    const rgb = this.hexToRgb(color);
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
  }
}

const generator = new ContrastColorGenerator();
