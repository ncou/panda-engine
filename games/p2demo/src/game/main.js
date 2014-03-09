game.module(
    'game.main'
)
.require(
    'engine.core',
    'plugins.p2'
)
.body(function() {

game.addAsset('media/panda.png', 'panda');

Panda = game.Class.extend({
    init: function(x, y) {
        // Add body and shape
        var shape = new game.Circle(63 / 2 / game.scene.world.ratio);
        this.body = new game.Body({
            mass: 1,
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ],
            angularVelocity: 1
        });
        this.body.addShape(shape);

        // Add sprite
        this.sprite = new game.Sprite('panda');
        this.sprite.anchor.set(0.5, 0.5);

        var force = 500;
        var angle = Math.random() * Math.PI * 2;
        this.body.applyForce([
            Math.sin(angle) * force,
            Math.cos(angle) * force
        ], this.body.position);

        this.update();
        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
        game.scene.addTimer(5000, this.remove.bind(this));
    },

    remove: function() {
        game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);
        game.scene.removeObject(this);
    },

    update: function() {
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;
    }
});

SceneGame = game.Scene.extend({
    backgroundColor: 0x808080,

    init: function() {
        // Init world
        this.world = new game.World();
        this.world.ratio = 100;

        // Add container
        this.container = new game.Container();
        this.container.position.x = 0;
        this.container.position.y = game.system.height;
        this.container.scale.y = -1; // Flip container
        this.stage.addChild(this.container);

        // Add plane
        var planeShape = new game.Plane();
        var planeBody = new game.Body({
            position: [0, 0]
        });
        planeBody.addShape(planeShape);
        this.world.addBody(planeBody);

        // Add walls
        var wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        var wallBody = new game.Body({
            position: [-1, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        var wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        var wallBody = new game.Body({
            position: [game.system.width / this.world.ratio + 1, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        this.addTimer(200, function() {
            var panda = new Panda(game.system.width / 2, game.system.height / 2);
            game.scene.addObject(panda);
            game.scene.countText.setText(game.scene.objects.length.toString());
        }, true);

        this.countText = new game.Text('0');
        this.stage.addChild(this.countText);
    },

    mousedown: function(event) {
        var panda = new Panda(event.global.x, game.system.height - event.global.y);
        this.addObject(panda);
    }
});

game.System.width = window.innerWidth * game.device.pixelRatio;
game.System.height = window.innerHeight * game.device.pixelRatio;

game.start();

});