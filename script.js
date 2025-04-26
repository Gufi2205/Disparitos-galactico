var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');
var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var enemigos;
var balas;
var tiempoBala = 0;
var musicaFondo;

var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'img/fondo.jpg');
        juego.load.spritesheet('personaje_principal', 'img/estatico.PNG', 36, 57);
        juego.load.spritesheet('personaje_corriendo', 'img/carrera.PNG', 47, 42); // Corregido a 94/2 = 47 por frame
        juego.load.spritesheet('enemigo', 'img/enemi.png', 2400, 3200);
        juego.load.image('laser', 'img/rasengan.png');
        juego.load.audio('musicaFondo', 'audio/fondo.mp3');
    },
    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 370, 900, 'fondo');
        
        // Configuración de controles - Mover esto antes de la configuración del personaje
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.D);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.A);
        
        // Configuración del personaje estático
        personaje = juego.add.sprite(90, 650, 'personaje_principal');
        personaje.scale.setTo(1.3, 1.3);
        personaje.anchor.setTo(0.5, 0.5); // Añadido para centrar mejor el personaje
        
        // Configuración de las animaciones
        personaje.animations.add('estatico', [0, 1], 4, true);
        
        // Configuración de la animación de carrera
        var spriteCarrera = juego.add.sprite(0, 0, 'personaje_corriendo');
        spriteCarrera.animations.add('correr_derecha', [0, 1, 2, 3, 4], 12, true);
        spriteCarrera.animations.add('correr_izquierda', [0, 1, 2, 3, 4], 12, true);
        spriteCarrera.kill();
        
        personaje.animations.play('estatico');
        
        // Configuración de la animación de carrera
        var texturaOriginal = personaje.key;
        personaje.loadTexture('personaje_corriendo');
        personaje.animations.add('correr_derecha', [0, 1], 8, true); // Cambiado a 2 frames
        personaje.animations.add('correr_izquierda', [0, 1], 8, true); // Cambiado a 2 frames
        
        // Volver a la textura original y mantener la animación estática
        personaje.loadTexture(texturaOriginal);
        personaje.animations.play('estatico');
        
        // Configuración de sonido de fondo
        musicaFondo = juego.add.audio('musicaFondo', 1, true);
        musicaFondo.play();

        // Configuración del sistema de disparos
        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('scale.x', 0.02); // Reducir rasengan al 2%
        balas.setAll('scale.y', 0.02); // Reducir rasengan al 2%
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        // Configuración de enemigos
        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        // Crear matriz de enemigos 3x3
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var enemigo = enemigos.create(x * 60, y * 60, 'enemigo');
                enemigo.anchor.setTo(0.5);
                enemigo.scale.setTo(0.021, 0.016); // Ajustado para reducir de 2400x3200 a aproximadamente 50x50
            }
        }

        // Posicionar el grupo de enemigos en la parte superior
        enemigos.x = 100;
        enemigos.y = 200;

        var animacion = juego.add.tween(enemigos).to(
            { x: 150 },
            1000, Phaser.Easing.Linear.None, true, 0, 1000, true
        );
    },
    update: function () {
        fondoJuego.tilePosition.x -= 1;

        // Verificar que las teclas estén definidas antes de usarlas
        if (teclaDerecha && teclaDerecha.isDown) {
            personaje.x += 3;
            if (personaje.key !== 'personaje_corriendo') {
                personaje.loadTexture('personaje_corriendo');
                personaje.scale.setTo(1.3, 1.3);
                personaje.animations.play('correr_derecha', 12, true);
            }
            personaje.scale.x = Math.abs(personaje.scale.x);
        } else if (teclaIzquierda && teclaIzquierda.isDown) {
            personaje.x -= 3;
            if (personaje.key !== 'personaje_corriendo') {
                personaje.loadTexture('personaje_corriendo');
                personaje.scale.setTo(1.3, 1.3);
                personaje.animations.play('correr_izquierda', 12, true);
            }
            personaje.scale.x = -Math.abs(personaje.scale.x);
        } else {
            if (personaje.key !== 'personaje_principal') {
                personaje.loadTexture('personaje_principal');
                personaje.scale.setTo(1.3, 1.3);
                personaje.animations.play('estatico', 4, true);
            }
        }

        // Disparo con click izquierdo del mouse
        if (juego.input.activePointer.leftButton.isDown) {
            if (juego.time.now > tiempoBala) {
                var bala = balas.getFirstExists(false);
                if (bala) {
                    bala.reset(personaje.x + (personaje.width * 0.3) / 2, personaje.y);
                    bala.body.velocity.y = -300;
                    tiempoBala = juego.time.now + 100;
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