var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');
var fondoJuego;
var personaje;
var tecladoDerecha;
var tecladoIzquierda;
var enemigos;

var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'img/img1.png');
        juego.load.spritesheet('personaje_principal', 'img/spritesheet1.png', 256, 256);
        juego.load.spritesheet('enemigo', 'img/enemigo1.png', 50, 50);
    },
    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');
        personaje = juego.add.sprite(90, 650, 'personaje_principal');
        personaje.animations.add('movimiento', [0, 1, 2, 3, 4], 10, true);

        // Inicializa el grupo de enemigos correctamente
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        // Crea los enemigos en posiciones correctas
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemigo = enemigos.create(x * 50, y * 50, 'enemigo');
                enemigo.anchor.setTo(0.5);
            }
        }

        // Posición global de los enemigos
        enemigos.x = 100;
        enemigos.y = 390;

        // Anima el movimiento de los enemigos
        var animacion = juego.add.tween(enemigos).to(
            { x: 200 },
            1000, Phaser.Easing.Linear.None, true, 0, 1000, true
        );

        // Configuración del teclado
        tecladoDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        tecladoIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    },
    update: function () {
        if (tecladoDerecha.isDown) {
            personaje.x++;
            personaje.animations.play('movimiento');
        } else if (tecladoIzquierda.isDown) {
            personaje.x--;
            personaje.animations.play('movimiento');
        }
    }
};

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');