game.module(
    'game.main'
)
.body(function() {

game.addAsset('panda.png');

game.createScene('Main', {
    backgroundColor: 0xffffff,
    startPandaCount: 2,
    gravity: 0.75,
    pandas: [],
    minX: 0,
    minY: 0,

    init: function() {
        this.maxX = game.system.width;
        this.maxY = game.system.height;

        this.addAmount = game.system.renderer.gl ? 50 : 5;
            
        if (this.addAmount === 5) {
            game.system.renderer.context.mozImageSmoothingEnabled = false;
            game.system.renderer.context.webkitImageSmoothingEnabled = false;
        }

        for (var i = 0; i < this.startPandaCount; i++) this.addPanda();
    },

    addPanda: function() {
        var panda = new game.Sprite('panda.png');
        panda.speedX = Math.random() * 10;
        panda.speedY = Math.random() * 10 - 5;
        
        panda.anchor.set(0.5, 1);
        panda.position.set(panda.width / 2, panda.height);
        this.pandas.push(panda);
        this.stage.addChild(panda);
    },

    mousedown: function() {
        this.isAdding = true;
    },

    mouseup: function() {
        this.isAdding = false;
    },

    update: function() {
        var i;
        var panda;

        if (this.isAdding) {
            for (i = 0; i < this.addAmount; i++) this.addPanda();
        }

        for (i = 0; i < this.pandas.length; i++) {
            panda = this.pandas[i];
            
            panda.position.x += panda.speedX * game.system.delta * 60;
            panda.position.y += panda.speedY * game.system.delta * 60;
            panda.speedY += this.gravity * game.system.delta * 60;

            if (panda.position.x + panda.width / 2 > this.maxX) {
                panda.speedX *= -1;
                panda.position.x = this.maxX - panda.width / 2;
            }
            else if (panda.position.x - panda.width / 2 < this.minX) {
                panda.speedX *= -1;
                panda.position.x = this.minX + panda.width / 2;
            }
            if (panda.position.y > this.maxY) {
                panda.speedY *= -0.85;
                panda.position.y = this.maxY;
                if (Math.random() > 0.5) panda.speedY -= Math.random() * 6;
            }
            else if (panda.position.y - panda.height < this.minY) {
                panda.speedY = 0;
                panda.position.y = this.minY + panda.height;
            }
        }

        this._super();
    }
});

game.Debug.enabled = true;

});
