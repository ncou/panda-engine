game.module(
    'game.animation'
)
.require(
    'engine.core'
)
.body(function() {

game.addAsset('papapino_spritesheet.png');
game.addAsset('papapino_spine.json');
game.addAsset('papapino_spritesheet.json');

game.createClass('Player', {
    init: function(x, y) {
        this.anim = new game.Spine('papapino_spine.json');
        this.anim.mix('walk', 'stand', 10);
        this.anim.mix('stand', 'walk', 5);
        this.anim.mix('stand', 'jump', 10);
        this.anim.mix('walk', 'jump', 10);
        this.anim.mix('jump', 'fall', 40);
        this.anim.mix('walk', 'fall', 20);
        this.anim.mix('fall', 'walk', 10);
        this.anim.mix('jump', 'walk', 10);
        this.anim.mix('fall', 'stand', 10);
        this.anim.mix('stand', 'duck', 10);
        this.anim.mix('duck', 'stand', 10);
        this.anim.position.set(x, y);

        this.changeAnim('walk', true);

        game.scene.stage.addChild(this.anim);
    },

    changeAnim: function(anim, loop) {
        this.anim.play(anim, !!loop);
    },

    jump: function() {
        if (this.anim.state.current.name !== 'walk') return;
        
        this.changeAnim('jump');

        var speed = 500;
        var up = game.scene.addTween(this.anim.position, {
            y: '-300'
        }, speed, {
            easing: 'Quadratic.Out',
            onComplete: this.changeAnim.bind(this, 'fall')
        });
        var down = game.scene.addTween(this.anim.position, {
            y: game.system.height - 100
        }, speed, {
            easing: 'Quadratic.In',
            onComplete: this.changeAnim.bind(this, 'walk', true)
        });
        up.chain(down);
        up.start();
    }
});

game.createScene('Main', {
    backgroundColor: 0xffffff,

    init: function() {
        this.player = new game.Player(game.system.width / 2, game.system.height - 100);
    },

    mousedown: function() {
        this.player.jump();
    }
});

});
