game.module(
    'game.sprites'
)
.require(
    'engine.core',
    'game.main',
    'game.assets'
)
.body(function(){

game.icon = 'media/icons/image.png';
game.addAsset(game.icon);

SceneTitle = game.Scene.extend({
    init: function() {
        var sprite;

        sprite = new game.Sprite(game.system.width / 2 - 200, 200, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.addTween(sprite.position, {x: game.system.width / 2 + 200}, 2, {loop: game.Tween.Loop.Reverse}).start();
        this.stage.addChild(sprite);

        sprite = new game.Sprite(game.system.width / 2, 400, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.addTween(sprite.scale, {x: 0, y: 0}, 2, {loop: game.Tween.Loop.Reverse}).start();
        this.stage.addChild(sprite);

        sprite = new game.Sprite(game.system.width / 2, 600, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.addTween(sprite, {rotation: Math.PI * 2}, 2, {loop: game.Tween.Loop.Reverse}).start();
        this.stage.addChild(sprite);

        sprite = new game.Sprite(game.system.width / 2, 800, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.addTween(sprite, {alpha: 0}, 2, {loop: game.Tween.Loop.Reverse}).start();
        this.stage.addChild(sprite);


        this.super();
    }
})

game.start();

});