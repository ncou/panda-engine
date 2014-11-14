game.module(
    'game.sprites'
)
.require(
    'engine.core'
)
.body(function() {

game.addAsset('panda2.png');

game.createScene('Main', {
    backgroundColor: 0xffffff,

    init: function() {
        // Create new sprite
        var sprite = new game.Sprite('panda2.png');
        // Set position
        sprite.position.set(100, 100);
        // Add to stage
        sprite.addTo(this.stage);

        var sprite = new game.Sprite('panda2.png');
        sprite.position.set(200, 200);
        // Set scale
        sprite.scale.set(2, 2);
        sprite.addTo(this.stage);

        var sprite = new game.Sprite('panda2.png');
        sprite.position.set(400, 400);
        // Rotate sprite
        sprite.rotation = 0.2;
        sprite.addTo(this.stage);

        var sprite = new game.Sprite('panda2.png');
        sprite.position.set(500, 500);
        // Change opacity
        sprite.alpha = 0.5;
        sprite.addTo(this.stage);
    }
});

});
