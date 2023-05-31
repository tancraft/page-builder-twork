<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form action="main.php" method="POST">
        <div>
            <label for="name">nom du projet</label>
            <input type="text" name="name" id="name" required >
        </div>
        <div>
            <label for="type">couleur</label>
            <select id="type" type="type" name="type">
                <option value="">choisir une option</option>
                <option value="html">html</option>
                <option value="php">php</option>
            </select>
        </div>
        <div>
            <label for="color">couleur</label>
            <input id="color" type="color" name="color">
        </div>
        <button type="submit">envoyer</button>
    </form>


    <script>
        // Récupérer l'élément input de type "color"
const inputColor = document.getElementById("color");

// Ajouter un écouteur d'événement pour détecter les changements de valeur
inputColor.addEventListener("change", () => {
  // Récupérer la valeur hexadécimale de l'input color
  const hexValue = inputColor.value;

  console.log(inputColor.value)

  // Convertir la valeur hexadécimale en RGB
  const rgbValue = hexToRgb(hexValue);

  // Afficher la valeur RGB dans la console
  console.log(rgbValue);
});

// Fonction de conversion de l'hexadécimal en RGB
function hexToRgb(hex) {
  // Supprimer le symbole "#" du début de la valeur hexadécimale
  hex = hex.replace("#", "");

  // Extraire les valeurs R, G et B
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Retourner la valeur RGB sous forme d'objet
  return `rgb(${r}, ${g}, ${b})`;
}

    </script>
    
</body>
</html>