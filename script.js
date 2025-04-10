var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');
var fondoJuego;
var personaje;
var teclaDerecha;  // Cambiado de tecladoDerecha
var teclaIzquierda; // Cambiado de tecladoIzquierda
var enemigos;
var balas;
var tiempoBala = 0;

var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'img/img1.png');
        juego.load.spritesheet('personaje_principal', 'img/spritesheet1.png', 256, 256);
        juego.load.spritesheet('enemigo', 'img/enemigo1.png', 50, 50);
        juego.load.image('laser', 'img/laser.png');
    },
    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');
        personaje = juego.add.sprite(90, 650, 'personaje_principal');
        personaje.animations.add('movimiento', [0, 1, 2, 3, 4], 10, true);

        // Configuración de controles modificados:
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.D); // Tecla D para derecha
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.A); // Tecla A para izquierda

        // Configuración del sistema de disparos con mouse
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // Configuración de enemigos (sin cambios)
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemigo = enemigos.create(x * 50, y * 50, 'enemigo');
                enemigo.anchor.setTo(0.5);
            }
        }

        enemigos.x = 100;
        enemigos.y = 390;

        var animacion = juego.add.tween(enemigos).to(
            { x: 200 },
            1000, Phaser.Easing.Linear.None, true, 0, 1000, true
        );
    },
    update: function () {
        fondoJuego.tilePosition.x -= 1;

        // Movimiento con teclas A y D
        if (teclaDerecha.isDown) {
            personaje.x++;
            personaje.animations.play('movimiento');
        } else if (teclaIzquierda.isDown) {
            personaje.x--;
            personaje.animations.play('movimiento');
        }

        // Disparo con click izquierdo del mouse
        if (juego.input.activePointer.leftButton.isDown) {
            if (juego.time.now > tiempoBala) {
                var bala = balas.getFirstExists(false);
                if (bala) {
                    bala.reset(personaje.x + personaje.width / 2, personaje.y);
                    bala.body.velocity.y = -300;
                    tiempoBala = juego.time.now + 100; // Control de cadencia de disparo
                }
            }
        }

        juego.physics.arcade.overlap(balas, enemigos, colision, null, this);
    }
};

function colision(bala, enemigo) {
    bala.kill();
    enemigo.kill();
}

juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');