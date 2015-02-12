game.module(
    'game.main'
)
.body(function() {

game.addAsset('panda.png');

game.createScene('Main', {
    backgroundColor: 0xffffff,
    gravity: 0.75,
    pandas: [],

    init: function() {
        this.addPanda(game.startCount);
    },

    addPanda: function(count) {
        for (var i = 0; i < count; i++) {
            var panda = new game.Sprite('panda.png');
            panda.speedX = Math.random() * 10;
            panda.speedY = Math.random() * 10 - 5;
            panda.anchor.set(0.5, 1);
            panda.position.set(panda.width / 2, panda.height);
            panda.addTo(this.stage);
            this.pandas.push(panda);
        }
    },

    click: function() {
        this.addPanda(1000);
    },

    update: function() {
        var panda;
        for (var i = 0; i < this.pandas.length; i++) {
            panda = this.pandas[i];
            
            panda.position.x += panda.speedX * game.system.delta * 60;
            panda.position.y += panda.speedY * game.system.delta * 60;
            panda.speedY += this.gravity * game.system.delta * 60;

            if (panda.position.x + panda.width / 2 > game.system.width) {
                panda.speedX *= -1;
                panda.position.x = game.system.width - panda.width / 2;
            }
            else if (panda.position.x - panda.width / 2 < 0) {
                panda.speedX *= -1;
                panda.position.x = panda.width / 2;
            }
            if (panda.position.y > game.system.height) {
                panda.speedY *= -0.85;
                panda.position.y = game.system.height;
                if (Math.random() > 0.5) panda.speedY -= Math.random() * 6;
            }
            else if (panda.position.y - panda.height < 0) {
                panda.speedY = 0;
                panda.position.y = panda.height;
            }
        }

        this._super();
    }
});

var url = document.location.href;
game.System.webGL = !!url.toLowerCase().match(/\webgl/);
game.startCount = parseInt(url.substr(url.indexOf('count=') + 6)) || 1000;

});
