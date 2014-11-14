game.module(
    'game.tweening'
)
.require(
    'engine.core'
)
.body(function(){

game.addAsset('panda2.png');

var easings = [];
var currentEasing = 0;
for (var i in game.Tween.Easing) {
    if (i !== 'Linear') easings.push(i);
}

game.createScene('Main', {
    backgroundColor: 0xffffff,

    init: function() {
        var sprite = new game.Sprite('panda2.png');
        sprite.addTo(this.stage);

        this.addTween(sprite.position, {
            y: game.system.height - sprite.height
        }, 2000, {
            easing: easings[currentEasing] + '.InOut',
            repeat: Infinity,
            yoyo: true
        }).start();

        var text = new game.Text(easings[currentEasing]);
        text.position.set(100, 10);
        this.stage.addChild(text);
    },

    click: function() {
        currentEasing++;
        if (!easings[currentEasing]) currentEasing = 0;
        game.system.setScene('Main');
    }
});

});
