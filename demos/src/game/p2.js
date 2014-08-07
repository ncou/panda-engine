game.module(
    'game.sprites'
)
.require(
    'game.main',
    'game.assets',
    'plugins.p2'
)
.body(function(){

game.icon = 'icons/die.png';
game.addAsset(game.icon);

game.addAsset('p2/bg.png');
game.addAsset('p2/rectangle.png');
game.addAsset('p2/circle.png');

PhysicsObject = game.Class.extend({
    size: 70,

    init: function(x, y) {
        // Add body and shape
        var shape = Math.random() > 0.5 ?
            new game.Circle(this.size / 2 / game.scene.world.ratio) :
            new game.Rectangle(this.size / game.scene.world.ratio, this.size / game.scene.world.ratio);

        this.body = new game.Body({
            mass: 1,
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ],
            angularVelocity: 1
        });
        this.body.addShape(shape);

        // Apply velocity
        var force = 5;
        var angle = Math.random() * Math.PI * 2;
        this.body.velocity[0] = Math.sin(angle) * force;
        this.body.velocity[1] = Math.cos(angle) * force;

        this.sprite = new game.Sprite(shape.radius ? 'p2/circle.png' : 'p2/rectangle.png');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(x, y);

        game.scene.addObject(this);
        game.scene.stage.addChild(this.sprite);
        game.scene.world.addBody(this.body);
        game.scene.addTimer(5000, this.remove.bind(this));
    },

    remove: function() {
        game.scene.removeObject(this);
        game.scene.stage.removeChild(this.sprite);
        game.scene.world.removeBody(this.body);
    },

    update: function() {
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;
    }
});

SceneGame = game.Scene.extend({
    init: function() {
        var bg = new game.Sprite('p2/bg.png', game.system.width / 2, game.system.height / 2, {
            anchor: { x: 0.5, y: 0.5 }
        }).addTo(this.stage);

        // Init world
        this.world = new game.World({gravity: [0, 9]});
        this.world.ratio = 100;

        // Add walls
        var wallShape, wallBody;

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [0, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(50 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 50 / this.world.ratio);
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        this.addTimer(200, function() {
            var object = new PhysicsObject(game.system.width / 2, game.system.height / 2);
            game.scene.addObject(object);
        }, true);

        this._super();
    }
});

game.start();

});