game.module(
    'game.interactivity'
)
.require(
    'engine.core',
    'game.main',
    'game.assets'
)
.body(function(){

game.icon = 'icons/cursor.png';
game.addAsset(game.icon);

Panda = game.Sprite.extend({
    interactive: true,
    anchor: { x: 0.5, y: 0.5 },
    offset: { x: 0, y: 0 },

    init: function(x, y) {
        this._super('panda2.png', x, y);
    },

    mousedown: function(e) {
        this.offset.x = this.position.x - e.global.x;
        this.offset.y = this.position.y - e.global.y;
        game.scene.current = this;
        this.scale.x = this.scale.y = 1.2;
    },

    mouseup: function() {
        game.scene.current = null;
        this.scale.x = this.scale.y = 1.0;
    },

    mouseupoutside: function() {
        this.mouseup();
    }
});

SceneGame = game.Scene.extend({
    current: null,

    init: function() {
        this._super();

        var panda;

        panda = new Panda(game.system.width / 2, game.system.height / 2 - 100);
        this.stage.addChild(panda);

        panda = new Panda(game.system.width / 2, game.system.height / 2);
        this.stage.addChild(panda);

        panda = new Panda(game.system.width / 2, game.system.height / 2 + 100);
        this.stage.addChild(panda);

        panda = new Panda(game.system.width / 2, game.system.height / 2 + 200);
        this.stage.addChild(panda);

        var word = game.device.mobile ? 'Touch' : 'Click';
        text = new game.BitmapText(word + ' and drag sprites', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        text.position.y = game.system.height - 50;
        this.stage.addChild(text);
    },

    mousemove: function(e) {
        if (this.current) {
            this.current.position.x = e.global.x + this.current.offset.x;
            this.current.position.y = e.global.y + this.current.offset.y;
        }
    }
});

game.start();

});