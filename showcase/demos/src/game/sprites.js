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
        var sprite, text;

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

        text = new game.BitmapText('Position', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = 250;
        this.stage.addChild(text);

        text = new game.BitmapText('Scale', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = 450;
        this.stage.addChild(text);

        text = new game.BitmapText('Rotation', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = 650;
        this.stage.addChild(text);

        text = new game.BitmapText('Alpha', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = 850;
        this.stage.addChild(text);

        this.super();
    }
})

game.start();

});