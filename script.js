// Inicialización del juego con Phaser
// Parámetros: ancho (370), alto (900), renderizador (CANVAS), ID del contenedor HTML ('bloque_juego')
var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');

// Variables globales del juego
var fondoJuego;      // Referencia al fondo del juego
var personaje;       // Objeto del jugador principal
var tecladoDerecha;  // Tecla para mover derecha
var tecladoIzquierda;// Tecla para mover izquierda
var enemigos;        // Grupo de enemigos
var balas;           // Grupo de balas/disparos
var tiempoBala = 0;  // Control de tiempo entre disparos
var botonDisparo;    // Tecla para disparar

// Objeto que contiene los estados del juego (en este caso solo el principal)
var estadoPrincipal = {
    // Función preload: Carga todos los recursos del juego
    preload: function () {
        // Carga de imágenes y spritesheets:
        juego.load.image('fondo', 'img/img1.png');  // Fondo del juego
        juego.load.spritesheet('personaje_principal', 'img/spritesheet1.png', 256, 256);  // Spritesheet del jugador
        juego.load.spritesheet('enemigo', 'img/enemigo1.png', 50, 50);  // Spritesheet de enemigos
        juego.load.image('laser', 'img/laser.png');  // Imagen de los disparos
    },

    // Función create: Se ejecuta una vez al iniciar el estado, configura los objetos del juego
    create: function () {
        // Configuración del fondo (TileSprite permite efecto de movimiento)
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');

        // Creación del personaje principal
        personaje = juego.add.sprite(90, 650, 'personaje_principal');
        // Definición de la animación de movimiento (frames 0-4, 10fps, en bucle)
        personaje.animations.add('movimiento', [0, 1, 2, 3, 4], 10, true);

        // Configuración del sistema de disparos:
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);  // Tecla espacio para disparar
        balas = juego.add.group();  // Grupo para gestionar todas las balas
        balas.enableBody = true;    // Habilita físicas para las balas
        balas.physicsBodyType = Phaser.Physics.ARCADE;  // Tipo de físicas (sistema simple)
        balas.createMultiple(20, 'laser');  // Crea 20 balas (pool de objetos para reutilizar)
        // Propiedades comunes a todas las balas:
        balas.setAll('anchor.x', 0.5);  // Punto de anclaje horizontal (centro)
        balas.setAll('anchor.y', 0.5);  // Punto de anclaje vertical (centro)
        balas.setAll('outOfBoundsKill', true);  // Eliminar balas cuando salgan de pantalla
        balas.setAll('checkWorldBounds', true);  // Verificar límites del mundo

        // Configuración de enemigos:
        enemigos = juego.add.group();  // Grupo para todos los enemigos
        enemigos.enableBody = true;    // Habilita físicas
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        // Creación de enemigos en formación 3x3
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemigo = enemigos.create(x * 50, y * 50, 'enemigo');
                enemigo.anchor.setTo(0.5);  // Centra el punto de anclaje
            }
        }

        // Posición inicial del grupo de enemigos
        enemigos.x = 100;
        enemigos.y = 390;

        // Animación de movimiento lateral de los enemigos (tween)
        var animacion = juego.add.tween(enemigos).to(
            { x: 200 },  // Mover a x=200
            1000,        // Duración: 1 segundo
            Phaser.Easing.Linear.None,  // Tipo de interpolación
            true,       // Iniciar automáticamente
            0,          // Retraso inicial
            1000,       // Tiempo entre repeticiones
            true        // Repetir indefinidamente (yoyo)
        );

        // Configuración de controles de teclado
        tecladoDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);  // Flecha derecha
        tecladoIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT); // Flecha izquierda
    },

    // Función update: Se ejecuta en cada frame del juego (60 veces por segundo)
    update: function () {
        // Efecto de movimiento del fondo (desplazamiento horizontal)
        fondoJuego.tilePosition.x -= 1;

        // Control del personaje:
        if (tecladoDerecha.isDown) {
            personaje.x++;  // Mover derecha
            personaje.animations.play('movimiento');  // Reproducir animación
        } else if (tecladoIzquierda.isDown) {
            personaje.x--;  // Mover izquierda
            personaje.animations.play('movimiento');
        }

        // Sistema de disparo:
        if (botonDisparo.isDown) {
            // Control de tiempo entre disparos (para evitar disparos demasiado rápidos)
            if (juego.time.now > tiempoBala) {
                var bala = balas.getFirstExists(false);  // Obtiene primera bala inactiva
                if (bala) {
                    // Posiciona la bala en el personaje (centrada horizontalmente)
                    bala.reset(personaje.x + personaje.width / 2, personaje.y);
                    bala.body.velocity.y = -300;  // Velocidad hacia arriba
                    tiempoBala = juego.time.now + 100;  // Establece próximo tiempo de disparo (100ms después)
                }
            }
        }

        // Detección de colisiones entre balas y enemigos
        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

// Función que maneja las colisiones entre balas y enemigos
function colision(bala, enemigo) {
    bala.kill();    // Elimina la bala
    enemigo.kill(); // Elimina el enemigo
}

// Registro del estado principal e inicio del juego
juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');