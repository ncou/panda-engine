game.module(
    'game.main'
)
.body(function() {

game.addAsset('plane.png');
game.addAsset('shadow.png');
game.addAsset('smoke.png');

game.createClass('Player', {
    acceleration: 700,
    maxSpeed: 400,
    currentSpeed: 0,
    targetSpeed: 0,

    init: function(x, y) {
        this.sprite = new game.Sprite('plane.png');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.addTo(game.scene.stage);

        var shadow = new game.Sprite('shadow.png');
        shadow.anchor.set(0.5, 0.5);
        shadow.scale.set(0.6, 0.6);
        shadow.alpha = 0.05;
        shadow.position.y = 200;
        this.sprite.addChild(shadow);

        this.emitter = new game.Emitter();
        this.emitter.textures.push('smoke.png');
        // this.emitter.container = game.scene.stage;
        this.emitter.position.x = this.sprite.position.x;
        this.emitter.position.y = this.sprite.position.y + this.sprite.height / 2 - 10;
        this.emitter.startScale = 1;
        this.emitter.endScale = 2;
        this.emitter.startAlpha = 0;
        this.emitter.endAlpha = 1;
        this.emitter.rate = 100;
        this.emitter.rotate = 2;
        this.emitter.rotateVar = 1;
        this.emitter.angle = Math.PI / 2;
        this.emitter.angleVar = Math.PI / 4;
        this.emitter.speed = 400;
        this.emitter.spriteSettings.blendMode = game.blendModes.ADD;

        // game.scene.addEmitter(this.emitter);

        game.scene.addTween(this.sprite.position, {
            y: this.sprite.position.y - 30
        }, 1000, {
            repeat: Infinity,
            yoyo: true,
            easing: 'Quadratic.InOut'
        }).start();
    },

    update: function() {
        if (game.keyboard.down('LEFT')) this.targetSpeed = -this.maxSpeed;
        else if (game.keyboard.down('RIGHT')) this.targetSpeed = this.maxSpeed;
        else this.targetSpeed = 0;

        if (this.currentSpeed < this.targetSpeed) this.currentSpeed += this.acceleration * game.system.delta;
        if (this.currentSpeed > this.targetSpeed) this.currentSpeed -= this.acceleration * game.system.delta;

        this.sprite.rotation = -(this.sprite.position.x - game.system.width / 2) / 800;

        this.sprite.position.x += this.currentSpeed * game.system.delta;

        var limit = 500;
        if (this.sprite.position.x > game.system.width / 2 + limit) {
            this.sprite.position.x = game.system.width / 2 + limit;
            this.currentSpeed = 0;
        }
        if (this.sprite.position.x < game.system.width / 2 - limit) {
            this.sprite.position.x = game.system.width / 2 - limit;
            this.currentSpeed = 0;
        }

        this.emitter.position.x = this.sprite.position.x;
        this.emitter.position.y = this.sprite.position.y + this.sprite.height / 2 - 10;
    }
});

game.createScene('Main', {
    backgroundColor: 0xffffff,

    init: function() {
        this.video = new game.Video('clouds.m4v');
        this.video.onLoaded(this.ready.bind(this));

        this.loadText = new game.Text('Loading video...');
        this.loadText.position.set(
            game.system.width / 2 - this.loadText.width / 2,
            game.system.height / 2 - this.loadText.height / 2
        );
        this.stage.addChild(this.loadText);
    },

    ready: function() {
        this.stage.removeChild(this.loadText);

        this.video.loop = true;
        this.video.play();
        this.video.sprite.addTo(this.stage);

        this.player = new game.Player(game.system.width / 2, game.system.height - 200);
        this.addObject(this.player);
    }
});

});
