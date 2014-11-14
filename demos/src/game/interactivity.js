game.module(
    'game.interactivity'
)
.require(
    'engine.core'
)
.body(function() {

game.addAsset('panda2.png');

game.createClass('Panda', {
    init: function(x, y) {
        this.sprite = new game.Sprite('panda2.png');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(x, y);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.mousedown = this.sprite.touchstart = this.mousedown.bind(this);
        this.sprite.mouseup = this.sprite.mouseupoutside = this.sprite.touchend = this.mouseup.bind(this);

        this.offset = new game.Point();
    },

    mousedown: function(event) {
        game.scene.current = this;
        this.offset.x = this.sprite.position.x - event.global.x;
        this.offset.y = this.sprite.position.y - event.global.y;
        
        this.sprite.scale.set(1.2, 1.2);

        // Place sprite to top of stage
        this.sprite.remove();
        this.sprite.addTo(game.scene.stage);
    },

    mouseup: function() {
        game.scene.current = null;
        this.sprite.scale.set(1.0, 1.0);
    }
});

game.createScene('Main', {
    backgroundColor: 0xffffff,
    current: null,

    init: function() {
        for (var i = 0; i < 10; i++) {
            var panda = new game.Panda(Math.random() * game.system.width, Math.random() * game.system.height);
            this.stage.addChild(panda.sprite);
        }
    },

    mousemove: function(event) {
        if (this.current) {
            this.current.sprite.position.x = event.global.x + this.current.offset.x;
            this.current.sprite.position.y = event.global.y + this.current.offset.y;
        }
    }
});

});
