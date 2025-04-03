import random
from PIL import Image, ImageDraw

# Liste des symboles pour Dobble Junior sur le tri des déchets
symboles = [
    "poubelle_jaune", "poubelle_verte", "poubelle_bleue",  
    "bouteille", "carton", "pomme",
    "journal", "canette", "yaourt", 
    "verre", "piles", "papier",
    "boite_conserve", "banane", "orange",
    "bouteille_lait", "boite_oeufs", "carotte",
    "boite_pizza", "pot_confiture", "salade",
    "bouteille_eau", "sac_papier", "pomme_terre"
]

def creer_carte_image(symboles_carte, taille_carte=500):
    """Crée une image de carte Dobble avec les symboles donnés"""
    # Créer une image circulaire blanche
    image = Image.new('RGB', (taille_carte, taille_carte), 'white')
    draw = ImageDraw.Draw(image)
    
    # Dessiner le cercle de la carte
    draw.ellipse([10, 10, taille_carte-10, taille_carte-10], outline='black', width=2)
    
    # Calculer les positions pour 6 symboles
    angles = [i * (360/6) for i in range(6)]
    rayon = taille_carte/4
    centre = taille_carte/2
    
    # Placer chaque symbole
    for i, symbole in enumerate(symboles_carte):
        angle = angles[i]
        x = centre + rayon * math.cos(math.radians(angle))
        y = centre + rayon * math.sin(math.radians(angle))
        
        try:
            # Charger l'image du symbole
            symbole_img = Image.open(f"images/{symbole}.png")
            # Redimensionner l'image du symbole
            taille_symbole = taille_carte//6
            symbole_img = symbole_img.resize((taille_symbole, taille_symbole))
            # Coller l'image du symbole
            image.paste(symbole_img, (int(x-taille_symbole/2), int(y-taille_symbole/2)), symbole_img)
        except FileNotFoundError:
            # Si l'image n'existe pas, écrire le nom du symbole
            draw.text((x, y), symbole, fill='black')
    
    return image

def creer_cartes_dobble(nb_symboles_par_carte=6):
    cartes = []
    symboles_disponibles = symboles.copy()
    random.shuffle(symboles_disponibles)
    
    # Création de 30 cartes
    for i in range(30):
        if i == 0:
            carte = random.sample(symboles_disponibles, nb_symboles_par_carte)
        else:
            carte = []
            symbole_commun = random.choice(cartes[i-1])
            carte.append(symbole_commun)
            symboles_restants = [s for s in symboles_disponibles if s not in carte]
            carte.extend(random.sample(symboles_restants, nb_symboles_par_carte - 1))
            
        cartes.append(carte)
        random.shuffle(carte)
    
    return cartes

def generer_cartes_images():
    """Génère toutes les cartes et les sauvegarde comme images"""
    cartes = creer_cartes_dobble()
    
    # Créer le dossier de sortie s'il n'existe pas
    if not os.path.exists('cartes_dobble'):
        os.makedirs('cartes_dobble')
    
    # Générer une image pour chaque carte
    for i, carte in enumerate(cartes):
        image = creer_carte_image(carte)
        image.save(f'cartes_dobble/carte_{i+1}.png')
        print(f'Carte {i+1} générée')

if __name__ == "__main__":
    import math
    import os
    generer_cartes_images()
