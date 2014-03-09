game.module(
    'game.main'
)
.require(
    'engine.core',
    'plugins.p2'
)
.body(function() {

game.addAsset('media/bg.png', 'bg');
game.addAsset('media/panda.png', 'panda');
game.addAsset('media/acorn.png', 'acorn');
game.addAsset('media/apple.png', 'apple');
game.addAsset('media/star.png', 'star');

// game.addAudio('media/audio/music.m4a', 'music');
game.addAudio('media/audio/blob.m4a', 'blob');
// game.addAudio('media/audio/falloff.m4a', 'falloff');
game.addAudio('media/audio/hit.m4a', 'hit');
game.addAudio('media/audio/springboard.m4a', 'springboard');

Panda = game.Class.extend({
    init: function(x, y) {
        game.audio.playSound('blob');
        // Add body and shape
        var shape = new game.Circle(63 / 2 / game.scene.world.ratio);
        shape.collisionMask = 2;
        this.body = new game.Body({
            mass: 1,
            position: [
                game.system.width / 2 / game.scene.world.ratio,
                game.system.height / game.scene.world.ratio
            ],
            angularVelocity: 1
        });
        this.body.player = true;
        this.body.addShape(shape);

        // Add sprite
        this.sprite = new game.Sprite('panda');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.y = -1;
        
        var angle = Math.atan2(-(0 - y), (game.system.width / 2 - x)) - Math.PI;
        var force = Math.min(10, game.Math.distance(x, y, game.system.width / 2, 0) / 60);
        
        this.body.velocity[0] = Math.cos(angle) * force;
        this.body.velocity[1] = Math.sin(angle) * force;
        
        this.update();
        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        // game.audio.playSound('falloff', false, 0.1);
        game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);
        game.scene.removeObject(this);
    },

    update: function() {
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;

        if(this.sprite.position.y < 0) this.remove();
    }
});

Acorn = game.Class.extend({
    force: 200,

    init: function(x, y) {
        var shape = new game.Circle(26 / 2 / game.scene.world.ratio);
        shape.collisionGroup = 2;
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                (game.system.height - y) / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        this.sprite = new game.Sprite('acorn');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.y = -1;
                
        this.update();
        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
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

Star = game.Class.extend({
    init: function(x, y) {
        var shape = new game.Circle(34 / 2 / game.scene.world.ratio);
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                (game.system.height - y) / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        this.sprite = new game.Sprite('star');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.y = -1;
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
                
        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);
    }
});

SceneGame = game.Scene.extend({
    backgroundColor: 0x808080,

    init: function() {
        this.stage.addChild(new game.Sprite('bg'));
        // game.audio.playMusic('music');

        // Init world
        this.world = new game.World();
        this.world.ratio = 100;

        this.world.on('impact', function(data) {
            var player = data.bodyA.player ? data.bodyA : data.bodyB.player ? data.bodyB : false;
            if(player) {
                var target = data.bodyA.player ? data.bodyB : data.bodyA;

                if(target.parent) {
                    var angle = Math.atan2((player.position[1] - target.position[1]), (player.position[0] - target.position[0]));
                    
                    player.force[0] = Math.cos(angle) * target.parent.force;
                    player.force[1] = Math.sin(angle) * target.parent.force;

                    target.parent.remove();

                    if(navigator.isCocoonJS) game.audio.stopSound('springboard');
                    game.audio.playSound('springboard');
                } else {
                    game.audio.playSound('hit');
                }
            }
        });

        this.world.on('postStep', function() {
            
        });

        // Add container
        this.container = new game.Container();
        this.container.position.x = 0;
        this.container.position.y = game.system.height;
        this.container.scale.y = -1; // Flip container
        this.stage.addChild(this.container);

        // Add walls
        var wallShape = new game.Rectangle(128 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = 2;
        var wallBody = new game.Body({
            position: [128 / 2 / this.world.ratio, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        wallShape = new game.Rectangle(128 / this.world.ratio, game.system.height * 2 / this.world.ratio);
        wallShape.collisionGroup = 2;
        wallBody = new game.Body({
            position: [(game.system.width - 128 / 2) / this.world.ratio, game.system.height / 2 / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        this.spawnAcorns(8, 300);
        this.spawnAcorns(6, 400);
        this.spawnAcorns(8, 500);
        this.spawnAcorns(4, 600);

        var star = new Star(300, 200);
    },

    spawnAcorns: function(count, y) {
        var padding = 230;
        for (var i = 0; i < count; i++) {
            var x = padding + (((game.system.width - padding * 2) / (count - 1)) * (i));
            var acorn = new Acorn(x, y);
        }
    },

    click: function(event) {
        var panda = new Panda(event.global.x, event.global.y);
        this.addObject(panda);
    }
});

game.System.width = 1024;
game.System.height = 768;

game.start();

});