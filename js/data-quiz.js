/* Questions du quiz foot.
 * Les règles citées sont celles du football à 11 (Lois du Jeu de l'IFAB).
 * Les questions sur les joueurs et les clubs portent sur des faits passés
 * (finales, records datés) pour ne pas devenir fausses avec le temps.
 * a = index de la bonne réponse dans "o". */
const QUIZ = {
  debutant: {
    label: 'Débutant',
    questions: [
      { cat: 'Règles', q: 'Combien de joueurs chaque équipe a-t-elle sur le terrain au football à 11 ?', o: ['9', '10', '11', '12'], a: 2, e: '11 joueurs par équipe, dont le gardien.' },
      { cat: 'Règles', q: 'Combien de temps dure un match chez les adultes (sans prolongation) ?', o: ['60 minutes', '80 minutes', '90 minutes', '120 minutes'], a: 2, e: 'Deux mi-temps de 45 minutes, plus le temps additionnel.' },
      { cat: 'Règles', q: 'Quelle couleur de carton signifie une expulsion ?', o: ['Jaune', 'Rouge', 'Vert', 'Blanc'], a: 1, e: 'Le carton rouge = expulsion. Le jaune est un avertissement.' },
      { cat: 'Règles', q: 'Que se passe-t-il quand un joueur reçoit deux cartons jaunes dans le même match ?', o: ['Rien', 'Il sort 10 minutes', 'Il est expulsé', 'Son équipe a un penalty contre elle'], a: 2, e: 'Deux jaunes = un rouge : le joueur est expulsé.' },
      { cat: 'Règles', q: 'Quel joueur peut toucher le ballon avec les mains dans sa surface de réparation ?', o: ['Le capitaine', 'Le gardien', 'Le défenseur central', 'Personne'], a: 1, e: 'Seul le gardien, et seulement dans sa propre surface.' },
      { cat: 'Règles', q: 'Comment fait-on une remise en jeu (une touche) ?', o: ['Au pied', 'Avec une seule main', 'Avec les deux mains, le ballon passant au-dessus de la tête', 'De la tête'], a: 2, e: 'Les deux mains, ballon lancé depuis derrière et au-dessus de la tête, les pieds au sol.' },
      { cat: 'Règles', q: 'Le ballon sort derrière la ligne de but, touché en dernier par un défenseur. L\'arbitre siffle…', o: ['Une sortie de but', 'Un corner', 'Un penalty', 'Une touche'], a: 1, e: 'Si le dernier à toucher le ballon est un défenseur, c\'est un corner pour l\'attaque.' },
      { cat: 'Règles', q: 'Peut-on marquer un but directement sur une rentrée de touche ?', o: ['Oui', 'Non'], a: 1, e: 'Non. Si le ballon entre directement dans le but adverse, c\'est une sortie de but.' },
      { cat: 'Grands joueurs', q: 'Dans quel club Kylian Mbappé a-t-il commencé le football ?', o: ['AS Bondy', 'Paris Saint-Germain', 'AS Monaco', 'Clairefontaine'], a: 0, e: 'Il a débuté à l\'AS Bondy, en Seine-Saint-Denis, comme toi !' },
      { cat: 'Grands joueurs', q: 'De quel pays est Lionel Messi ?', o: ['Espagne', 'Brésil', 'Argentine', 'Uruguay'], a: 2, e: 'Messi est argentin. Il a gagné la Coupe du monde 2022 avec l\'Argentine.' },
      { cat: 'Grands joueurs', q: 'De quel pays est Cristiano Ronaldo ?', o: ['Brésil', 'Portugal', 'Espagne', 'Italie'], a: 1, e: 'Cristiano Ronaldo est portugais, né à Madère.' },
      { cat: 'Clubs', q: 'Comment s\'appelle le stade du Paris Saint-Germain ?', o: ['Stade de France', 'Parc des Princes', 'Vélodrome', 'Groupama Stadium'], a: 1, e: 'Le PSG joue au Parc des Princes, dans le 16e arrondissement de Paris.' },
      { cat: 'Clubs', q: 'Comment s\'appelle le stade de l\'Olympique de Marseille ?', o: ['Le Vélodrome', 'Geoffroy-Guichard', 'Le Parc des Princes', 'Bollaert'], a: 0, e: 'L\'OM joue au stade Vélodrome.' },
      { cat: 'Équipe de France', q: 'Quel pays a gagné la Coupe du monde 2018 ?', o: ['Croatie', 'Brésil', 'France', 'Allemagne'], a: 2, e: 'La France, en battant la Croatie 4-2 en finale, en Russie.' },
      { cat: 'Équipe de France', q: 'Quel pays organisait la Coupe du monde 1998 ?', o: ['Italie', 'France', 'États-Unis', 'Allemagne'], a: 1, e: 'La France, qui l\'a aussi gagnée.' },
      { cat: 'Équipe de France', q: 'Quel est le surnom de l\'équipe de France ?', o: ['Les Rouges', 'Les Bleus', 'Les Coqs d\'or', 'La Seleção'], a: 1, e: 'Les Bleus, à cause de la couleur du maillot.' }
    ]
  },
  confirme: {
    label: 'Confirmé',
    questions: [
      { cat: 'Règles', q: 'À quelle distance du but se trouve le point de penalty ?', o: ['9 m', '11 m', '16,5 m', '20 m'], a: 1, e: '11 mètres du milieu de la ligne de but.' },
      { cat: 'Règles', q: 'Sur un coup franc, à quelle distance minimum doit se placer le mur ?', o: ['5 m', '7 m', '9,15 m', '11 m'], a: 2, e: '9,15 m, soit 10 yards.' },
      { cat: 'Règles', q: 'Peut-on être hors-jeu directement sur une rentrée de touche ?', o: ['Oui', 'Non'], a: 1, e: 'Non : pas de hors-jeu sur une touche, une sortie de but ou un corner.' },
      { cat: 'Règles', q: 'Peut-on être hors-jeu dans sa propre moitié de terrain ?', o: ['Oui', 'Non'], a: 1, e: 'Non, on ne peut être hors-jeu que dans la moitié adverse.' },
      { cat: 'Règles', q: 'Quand l\'arbitre lève le bras au-dessus de la tête sur un coup franc, cela veut dire…', o: ['Coup franc direct', 'Coup franc indirect', 'Penalty', 'Fin du match'], a: 1, e: 'Bras levé = coup franc indirect : le ballon doit toucher un autre joueur avant d\'entrer dans le but.' },
      { cat: 'Règles', q: 'Un défenseur fait une passe volontaire du pied à son gardien, qui la prend à la main. Que siffle l\'arbitre ?', o: ['Rien', 'Penalty', 'Coup franc indirect', 'Carton rouge'], a: 2, e: 'C\'est la règle de la passe en retrait : coup franc indirect pour l\'adversaire.' },
      { cat: 'Règles', q: 'Quelle taille de ballon utilise-t-on chez les adultes ?', o: ['Taille 3', 'Taille 4', 'Taille 5', 'Taille 6'], a: 2, e: 'Taille 5. Les plus jeunes jouent souvent avec un ballon taille 4 ou 3.' },
      { cat: 'Grands joueurs', q: 'Qui a marqué deux buts de la tête en finale de la Coupe du monde 1998 ?', o: ['Thierry Henry', 'Zinédine Zidane', 'Emmanuel Petit', 'Lilian Thuram'], a: 1, e: 'Zidane, deux têtes sur corner. Emmanuel Petit a marqué le 3e but.' },
      { cat: 'Grands joueurs', q: 'Combien de Coupes du monde Pelé a-t-il gagnées avec le Brésil ?', o: ['1', '2', '3', '4'], a: 2, e: 'Trois : 1958, 1962 et 1970. C\'est le seul joueur à l\'avoir fait.' },
      { cat: 'Grands joueurs', q: 'Qui a remporté le Ballon d\'Or 2025 ?', o: ['Kylian Mbappé', 'Ousmane Dembélé', 'Lamine Yamal', 'Erling Haaland'], a: 1, e: 'Ousmane Dembélé, après sa saison avec le PSG.' },
      { cat: 'Grands joueurs', q: 'Combien de buts Kylian Mbappé a-t-il marqués en finale de la Coupe du monde 2022 ?', o: ['1', '2', '3', '4'], a: 2, e: 'Un triplé contre l\'Argentine (3-3), mais la France a perdu aux tirs au but.' },
      { cat: 'Clubs', q: 'Quel a été le premier club français à gagner la Ligue des champions ?', o: ['PSG', 'Olympique de Marseille', 'AS Monaco', 'Olympique lyonnais'], a: 1, e: 'L\'OM en 1993, 1-0 contre l\'AC Milan (but de Basile Boli).' },
      { cat: 'Clubs', q: 'Dans quelle ville joue la Juventus ?', o: ['Milan', 'Rome', 'Turin', 'Naples'], a: 2, e: 'La Juventus est le club de Turin.' },
      { cat: 'Clubs', q: 'Quel club joue au stade Santiago-Bernabéu ?', o: ['FC Barcelone', 'Real Madrid', 'Atlético de Madrid', 'FC Séville'], a: 1, e: 'Le Real Madrid.' },
      { cat: 'Clubs', q: 'Quel club anglais joue à Anfield ?', o: ['Manchester United', 'Chelsea', 'Liverpool', 'Arsenal'], a: 2, e: 'Liverpool FC.' },
      { cat: 'Équipe de France', q: 'Où se trouve le centre national de formation de la Fédération française de football ?', o: ['Clairefontaine', 'Marcoussis', 'Saint-Étienne', 'Vichy'], a: 0, e: 'À Clairefontaine-en-Yvelines.' },
      { cat: 'Équipe de France', q: 'Contre qui la France a-t-elle gagné la finale de la Coupe du monde 1998 ?', o: ['Italie', 'Brésil', 'Croatie', 'Allemagne'], a: 1, e: '3-0 contre le Brésil, au Stade de France.' }
    ]
  },
  expert: {
    label: 'Expert',
    questions: [
      { cat: 'Règles', q: 'Quelles sont les dimensions d\'un but (largeur × hauteur) ?', o: ['7,32 m × 2,44 m', '7 m × 2,5 m', '6 m × 2 m', '8 m × 2,44 m'], a: 0, e: '7,32 m × 2,44 m, soit 8 yards × 8 pieds.' },
      { cat: 'Règles', q: 'Quelle est la profondeur de la surface de réparation ?', o: ['11 m', '13,5 m', '16,5 m', '20 m'], a: 2, e: '16,5 m depuis la ligne de but.' },
      { cat: 'Règles', q: 'Quel est le rayon du rond central ?', o: ['5,5 m', '9,15 m', '11 m', '16,5 m'], a: 1, e: '9,15 m, la même distance que le mur sur coup franc.' },
      { cat: 'Règles', q: 'Peut-on marquer directement sur le coup d\'envoi ?', o: ['Oui', 'Non'], a: 0, e: 'Oui, un but peut être marqué directement contre l\'adversaire sur le coup d\'envoi.' },
      { cat: 'Règles', q: 'Peut-on marquer directement contre l\'adversaire sur une sortie de but (6 mètres) ?', o: ['Oui', 'Non'], a: 0, e: 'Oui, la Loi 16 l\'autorise, même si c\'est très rare.' },
      { cat: 'Règles', q: 'Un coup franc indirect entre directement dans le but adverse sans toucher personne. L\'arbitre accorde…', o: ['Le but', 'Une sortie de but', 'Un corner', 'Un penalty'], a: 1, e: 'Pas de but : c\'est une sortie de but pour l\'adversaire.' },
      { cat: 'Grands joueurs', q: 'Quel Français détient le record de buts en une seule Coupe du monde (13 buts) ?', o: ['Just Fontaine', 'Michel Platini', 'Thierry Henry', 'Kylian Mbappé'], a: 0, e: 'Just Fontaine, 13 buts en 1958, en Suède.' },
      { cat: 'Grands joueurs', q: 'Combien de buts Michel Platini a-t-il marqués à l\'Euro 1984 ?', o: ['5', '7', '9', '11'], a: 2, e: '9 buts en 5 matchs, et la France a gagné l\'Euro.' },
      { cat: 'Grands joueurs', q: 'En quelle année Lionel Messi a-t-il gagné son 8e Ballon d\'Or ?', o: ['2019', '2021', '2022', '2023'], a: 3, e: 'En 2023, après la Coupe du monde 2022.' },
      { cat: 'Grands joueurs', q: 'Combien de Ballons d\'Or Cristiano Ronaldo a-t-il gagnés ?', o: ['3', '4', '5', '7'], a: 2, e: 'Cinq : 2008, 2013, 2014, 2016 et 2017.' },
      { cat: 'Grands joueurs', q: 'Quel joueur détient le record de sélections en équipe de France (145) ?', o: ['Lilian Thuram', 'Hugo Lloris', 'Antoine Griezmann', 'Thierry Henry'], a: 1, e: 'Le gardien Hugo Lloris, avec 145 sélections.' },
      { cat: 'Grands joueurs', q: 'En finale de la Coupe du monde 2006, Zidane a été expulsé contre…', o: ['Le Brésil', 'Le Portugal', 'L\'Italie', 'L\'Allemagne'], a: 2, e: 'Contre l\'Italie, qui a gagné aux tirs au but.' },
      { cat: 'Clubs', q: 'En quelle année le PSG a-t-il gagné sa première Ligue des champions ?', o: ['2020', '2023', '2024', '2025'], a: 3, e: 'En 2025, 5-0 en finale contre l\'Inter Milan, à Munich.' },
      { cat: 'Clubs', q: 'Quelle équipe a gagné la toute première Coupe du monde, en 1930 ?', o: ['Brésil', 'Argentine', 'Uruguay', 'Italie'], a: 2, e: 'L\'Uruguay, qui organisait aussi le tournoi.' },
      { cat: 'Clubs', q: 'Quels pays organisent ensemble la Coupe du monde 2026 ?', o: ['Espagne, Portugal, Maroc', 'États-Unis, Canada, Mexique', 'Qatar, Arabie saoudite', 'Brésil, Argentine'], a: 1, e: 'États-Unis, Canada et Mexique, avec 48 équipes pour la première fois.' },
      { cat: 'Équipe de France', q: 'Quel a été le score de la finale de la Coupe du monde 2018 ?', o: ['France 2-0 Croatie', 'France 4-2 Croatie', 'France 1-0 Belgique', 'France 3-1 Croatie'], a: 1, e: '4-2, à Moscou.' }
    ]
  }
};
