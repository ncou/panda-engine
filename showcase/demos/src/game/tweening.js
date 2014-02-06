game.module(
    'game.tweening'
)
.require(
    'engine.core',
    'game.main',
    'game.assets'
)
.body(function(){

game.icon = 'media/icons/settings.png';
game.addAsset(game.icon);

var easings = [];
var currentEasing = 0;
for(var i in game.Tween.Easing) {
    if(i !== 'Linear') easings.push(i);
}

SceneTitle = game.Scene.extend({
    init: function() {
        var text;
        var sprite;

        sprite = new game.Sprite(game.system.width / 2 - 200, game.system.height / 2 - 200, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.stage.addChild(sprite);
        this.addTween(sprite.position, {y: game.system.height / 2 + 200}, 2, {easing: game.Tween.Easing[easings[currentEasing]]['In'], loop: game.Tween.Loop.Reverse}).start();
        text = new game.BitmapText('In', {font: 'HelveticaNeue'});
        text.position.x = game.system.width / 2 - 200 - text.width / 2;
        text.position.y = game.system.height / 2 + 300;
        this.stage.addChild(text);

        sprite = new game.Sprite(game.system.width / 2, game.system.height / 2 - 200, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.stage.addChild(sprite);
        this.addTween(sprite.position, {y: game.system.height / 2 + 200}, 2, {easing: game.Tween.Easing[easings[currentEasing]]['Out'], loop: game.Tween.Loop.Reverse}).start();        
        text = new game.BitmapText('Out', {font: 'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = game.system.height / 2 + 300;
        this.stage.addChild(text);

        sprite = new game.Sprite(game.system.width / 2 + 200, game.system.height / 2 - 200, 'media/panda2.png', {anchor: {x:0.5, y:0.5}});
        this.stage.addChild(sprite);
        this.addTween(sprite.position, {y: game.system.height / 2 + 200}, 2, {easing: game.Tween.Easing[easings[currentEasing]]['InOut'], loop: game.Tween.Loop.Reverse}).start();
        text = new game.BitmapText('InOut', {font: 'HelveticaNeue'});
        text.position.x = game.system.width / 2 + 200 - text.width / 2;
        text.position.y = game.system.height / 2 + 300;
        this.stage.addChild(text);

        var word = game.ua.mobile ? 'Touch' : 'Click';
        text = new game.BitmapText(word + ' to change', {font:'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = game.system.height - 50;
        this.stage.addChild(text);

        text = new game.BitmapText(easings[currentEasing], {font: 'HelveticaNeue'});
        text.position.x = game.system.width / 2 - text.width / 2;
        text.position.y = 150;
        this.stage.addChild(text);

        this.super();
    },

    click: function() {
        currentEasing++;
        if(!easings[currentEasing]) currentEasing = 0;
        game.system.setScene(SceneTitle);
    }
})

game.start();

});