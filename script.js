
var juego = new Phaser.Game(370, 900, Phaser.CANVAS, 'bloque_juego');


var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'img/img1.png');
    },

    create: function () {
        juego.add.tileSprite(0, 0, 370, 900, 'fondo');
    },

    update: function () {

    }


};


juego.state.add('principal', estadoPrincipal);
juego.state.start('principal');