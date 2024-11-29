const canvas = document.querySelector('canvas')  // Sélectionne l'élément canvas dans le DOM
const c = canvas.getContext('2d')  // Récupère le contexte 2D pour dessiner sur le canvas

canvas.width = 1024  // Définit la largeur du canvas
canvas.height = 576  // Définit la hauteur du canvas

c.fillRect(0, 0, canvas.width, canvas.height)  // Remplie le fond du canvas avec une couleur noire

const gravity = 0.4  // Gravité pour les personnages (utilisé pour la gestion de la gravité)

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'  // Charge l'image de fond
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',  // Charge l'image du shop
  scale: 2.75,  // Échelle de l'image (grossissement)
  framesMax: 6  // Nombre d'images dans l'animation du shop
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',  // Image de départ du joueur
  framesMax: 8,  // Nombre d'images dans l'animation du joueur
  scale: 2.5,  // Taille du joueur
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    // Définition des différentes animations du joueur
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',  // Couleur de l'ennemi
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',  // Image de départ de l'ennemi
  framesMax: 4,  // Nombre d'images de l'animation de l'ennemi
  scale: 2.5,  // Taille de l'ennemi
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    // Définition des animations de l'ennemi
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)  // Affiche l'objet 'player' dans la console

const keys = {
  q: { pressed: false },  // Touche "q" pour déplacer le joueur à gauche
  d: { pressed: false },  // Touche "d" pour déplacer le joueur à droite
  ArrowRight: { pressed: false },  // Touche flèche droite pour déplacer l'ennemi à droite
  ArrowLeft: { pressed: false }  // Touche flèche gauche pour déplacer l'ennemi à gauche
}

decreaseTimer()  // Fonction qui diminue un timer (probablement pour un compte à rebours du match)

function animate() {
  window.requestAnimationFrame(animate)  // Appelle la fonction 'animate' en boucle pour animer le jeu
  c.fillStyle = 'black'  // Définit la couleur de remplissage (fond noir)
  c.fillRect(0, 0, canvas.width, canvas.height)  // Remplie le fond avec cette couleur
  background.update()  // Met à jour l'arrière-plan
  shop.update()  // Met à jour le shop
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'  // Définit une couleur semi-transparente pour l'effet de superposition
  c.fillRect(0, 0, canvas.width, canvas.height)  // Applique l'effet de superposition
  player.update()  // Met à jour l'animation du joueur
  enemy.update()  // Met à jour l'animation de l'ennemi

  player.velocity.x = 0  // Réinitialise la vitesse horizontale du joueur
  enemy.velocity.x = 0  // Réinitialise la vitesse horizontale de l'ennemi

  // Mouvement du joueur
  if (keys.q.pressed && player.lastKey === 'q') {  // Si la touche 'q' est enfoncée, le joueur se déplace à gauche
    player.velocity.x = -5
    player.switchSprite('run')  // Change l'animation du joueur pour la course
  } else if (keys.d.pressed && player.lastKey === 'd') {  // Si la touche 'd' est enfoncée, le joueur se déplace à droite
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')  // Si aucune touche n'est pressée, on revient à l'animation d'idle
  }

  // Gestion du saut du joueur
  if (player.velocity.y < 0) {  // Si la vitesse verticale est négative, le joueur est en train de sauter
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {  // Si la vitesse verticale est positive, le joueur est en train de tomber
    player.switchSprite('fall')
  }

  // Mouvement de l'ennemi
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // Gestion du saut de l'ennemi
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // Détection de collision et gestion des attaques
  if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.framesCurrent === 4) {
    enemy.takeHit()  // L'ennemi prend un coup
    player.isAttacking = false  // Le joueur n'est plus en train d'attaquer

    gsap.to('#enemyHealth', { width: enemy.health + '%' })  // Met à jour la barre de santé de l'ennemi
  }

  // Si l'attaque du joueur rate
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // Le joueur prend un coup
  if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
    player.takeHit()  // Le joueur prend un coup
    enemy.isAttacking = false
    gsap.to('#playerHealth', { width: player.health + '%' })  // Met à jour la barre de santé du joueur
  }

  // Si l'attaque de l'ennemi rate
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false  // L'ennemi n'est plus en train d'attaquer
  }

  // Fin du jeu si un des personnages n'a plus de vie
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })  // Détermine le gagnant une fois qu'un joueur perd toute sa vie
  }
}

// Appelle la fonction animate pour commencer l'animation du jeu
animate()

// Événements de pression de touche pour les actions du joueur et de l'ennemi
window.addEventListener('keydown', (event) => {
  if (!player.dead) {  // Si le joueur est en vie, il peut effectuer des actions
    switch (event.key) {
      case 'd':  // Si la touche 'd' est pressée, le joueur va à droite
        keys.d.pressed = true
        player.lastKey = 'd'  // Met à jour la dernière touche pressée du joueur
        break
      case 'q':  // Si la touche 'q' est pressée, le joueur va à gauche
        keys.q.pressed = true
        player.lastKey = 'q'  // Met à jour la dernière touche pressée du joueur
        break
      case 'z':  // Si la touche 'z' est pressée, le joueur saute
        player.velocity.y = -12
        break
      case 'e':  // Si la touche 'e' est pressée, le joueur attaque
        player.attack()
        break
    }
  }

  if (!enemy.dead) {  // Si l'ennemi est en vie, il peut effectuer des actions
    switch (event.key) {
      case 'ArrowRight':  // Si la touche flèche droite est pressée, l'ennemi va à droite
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'  // Met à jour la dernière touche pressée de l'ennemi
        break
      case 'ArrowLeft':  // Si la touche flèche gauche est pressée, l'ennemi va à gauche
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'  // Met à jour la dernière touche pressée de l'ennemi
        break
      case 'ArrowUp':  // Si la touche flèche haut est pressée, l'ennemi saute
        enemy.velocity.y = -12
        break
      case 'ArrowDown':  // Si la touche flèche bas est pressée, l'ennemi attaque
        enemy.attack()
        break
    }
  }
})

// Événements de relâchement des touches pour arrêter les actions du joueur et de l'ennemi
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':  // Si la touche 'd' est relâchée, arrête le mouvement vers la droite du joueur
      keys.d.pressed = false
      break
    case 'q':  // Si la touche 'q' est relâchée, arrête le mouvement vers la gauche du joueur
      keys.q.pressed = false
      break
  }

  // Même principe pour les touches de l'ennemi
  switch (event.key) {
    case 'ArrowRight':  // Si la touche flèche droite est relâchée, arrête le mouvement vers la droite de l'ennemi
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':  // Si la touche flèche gauche est relâchée, arrête le mouvement vers la gauche de l'ennemi
      keys.ArrowLeft.pressed = false
      break
  }
})
