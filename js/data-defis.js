/* Défis d'entraînement à la maison.
 * Un défi est choisi chaque jour de façon déterministe à partir de la date,
 * donc tout le monde voit le même défi le même jour, et il change à minuit.
 * Conseil sécurité : à faire dehors ou dans un espace dégagé, loin des fenêtres. */
const DEFIS = [
  { id: 'jong-droit', cat: 'Jongles', titre: 'Jongles pied droit', desc: 'Fais le plus de jongles possible uniquement du pied droit. 3 essais, garde ton meilleur score.', objectif: 'Battre ton score de la semaine dernière' },
  { id: 'jong-gauche', cat: 'Jongles', titre: 'Jongles pied gauche', desc: 'Même exercice, mais uniquement avec le pied gauche (ou ton pied le plus faible).', objectif: 'Atteindre 10 jongles d\'affilée' },
  { id: 'jong-alt', cat: 'Jongles', titre: 'Jongles alternés', desc: 'Alterne pied droit / pied gauche à chaque touche.', objectif: '20 touches alternées sans faire tomber le ballon' },
  { id: 'jong-cuisse', cat: 'Jongles', titre: 'Pied – cuisse – pied', desc: 'Enchaîne : pied, cuisse, pied, cuisse… en changeant de côté.', objectif: '3 enchaînements complets' },
  { id: 'jong-tete', cat: 'Jongles', titre: 'Jongles de la tête', desc: 'Lance le ballon avec les mains et fais des petites touches de tête, front bien tendu.', objectif: '5 têtes d\'affilée' },
  { id: 'jong-tour', cat: 'Jongles', titre: 'Le tour du monde', desc: 'Pied droit, cuisse droite, épaule/tête, cuisse gauche, pied gauche.', objectif: 'Réussir 1 tour complet' },
  { id: 'cond-slalom', cat: 'Conduite de balle', titre: 'Slalom bouteilles', desc: 'Place 6 bouteilles (ou plots) espacées d\'1 mètre. Slalom aller-retour, ballon collé au pied.', objectif: '5 allers-retours sans toucher une bouteille' },
  { id: 'cond-exterieur', cat: 'Conduite de balle', titre: 'Slalom extérieur du pied', desc: 'Même slalom, mais uniquement avec l\'extérieur du pied.', objectif: '3 allers-retours propres' },
  { id: 'cond-semelle', cat: 'Conduite de balle', titre: 'Semelle – recul', desc: 'Fais reculer le ballon avec la semelle, en alternant les pieds, sur 5 mètres.', objectif: '5 trajets sans perdre le ballon' },
  { id: 'cond-chrono', cat: 'Conduite de balle', titre: 'Contre la montre', desc: 'Chronomètre un slalom aller-retour (avec l\'aide d\'un parent si besoin).', objectif: 'Améliorer ton temps à chaque essai' },
  { id: 'cond-feintes', cat: 'Conduite de balle', titre: 'Feinte de corps', desc: 'Devant chaque bouteille, fais une feinte de corps avant de la contourner.', objectif: '10 feintes réussies' },
  { id: 'cond-roulette', cat: 'Conduite de balle', titre: 'Pied faible seulement', desc: 'Conduis le ballon en cercle uniquement avec ton pied faible.', objectif: '3 minutes sans t\'arrêter' },
  { id: 'tir-cible', cat: 'Tirs', titre: 'Tir dans la cible', desc: 'Dessine (craie) ou délimite une cible contre un mur. 10 tirs du plat du pied à 5 mètres.', objectif: '7 tirs sur 10 dans la cible' },
  { id: 'tir-faible', cat: 'Tirs', titre: 'Tirs pied faible', desc: '10 tirs du plat du pied avec ton pied faible, contre un mur.', objectif: '6 sur 10 dans la cible' },
  { id: 'tir-coins', cat: 'Tirs', titre: 'Les deux coins', desc: 'Marque deux cibles (gauche et droite). Vise-les à tour de rôle.', objectif: '4 réussites de chaque côté' },
  { id: 'tir-volee', cat: 'Tirs', titre: 'Reprise de volée', desc: 'Lance-toi le ballon et reprends-le du plat du pied avant qu\'il touche le sol, vers le mur.', objectif: '5 reprises cadrées' },
  { id: 'pass-mur', cat: 'Passes', titre: '50 passes contre le mur', desc: 'Passes du plat du pied contre un mur, contrôle puis passe. 25 pied droit, 25 pied gauche.', objectif: '50 passes sans erreur de contrôle' },
  { id: 'pass-1touche', cat: 'Passes', titre: 'En une touche', desc: 'Passes contre le mur sans contrôle (une seule touche), en alternant les pieds.', objectif: '20 d\'affilée' },
  { id: 'ctrl-oriente', cat: 'Contrôle', titre: 'Contrôle orienté', desc: 'Passe contre le mur, puis contrôle le ballon vers la droite ou la gauche pour l\'emmener.', objectif: '10 contrôles orientés de chaque côté' },
  { id: 'ctrl-aerien', cat: 'Contrôle', titre: 'Amorti du ballon aérien', desc: 'Lance le ballon en l\'air et amortis-le du pied (ou de la cuisse) pour qu\'il reste près de toi.', objectif: '10 amortis réussis' },
  { id: 'phys-gainage', cat: 'Physique', titre: 'Gainage du footballeur', desc: 'Planche sur les avant-bras, dos bien droit. 3 séries avec 30 secondes de repos.', objectif: '3 × 30 secondes' },
  { id: 'phys-appuis', cat: 'Physique', titre: 'Appuis rapides', desc: 'Pose le ballon au sol et touche-le avec la semelle en alternant les pieds le plus vite possible.', objectif: '3 × 30 secondes' }
];
