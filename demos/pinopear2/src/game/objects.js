game.module(
    'game.objects'
)
.body(function() {

// Tomato
// Lemon
// Lime
// Sombrero

var collisionGroup = {
    PLAYER: Math.pow(2,0),
    STATIC: Math.pow(2,1),
    DYNAMIC: Math.pow(2,2),
    KINEMATIC: Math.pow(2,3)
};

PlayerData = game.Class.extend({
    panda: null,
    score: 0,
    position: {x:0, y:0},

    init: function(settings) {
        game.merge(this, settings);
    }
});

AimLine = game.Class.extend({
    ballCount: 5,
    balls: [],
    maxDist: 300,

    init: function(x, y, x2, y2) {
        var ball;
        for (var i = 0; i < this.ballCount; i++) {
            ball = new game.Sprite('aimball');
            ball.anchor.set(0.5, 0.5);
            game.scene.stage.addChild(ball);
            this.balls.push(ball);
        }

        this.set(x, y, x2, y2);
    },

    set: function(x, y, x2, y2) {
        var dist = game.Math.distance(x, y, x2, y2);
        if(dist > this.maxDist) dist = this.maxDist;
        var space = dist / this.ballCount;
        var angle = Math.atan2(-(y2 - y), (x2 - x));
        angle += Math.PI / 2;

        var bx, by;
        for (var i = 0; i < this.ballCount; i++) {
            bx = x + Math.sin(angle) * (i+1) * space;
            by = y + Math.cos(angle) * (i+1) * space;
            this.balls[i].position.x = bx;
            this.balls[i].position.y = by;
        }
    },

    remove: function() {
        for (var i = 0; i < this.ballCount; i++) {
            game.scene.stage.removeChild(this.balls[i]);
        }
    }
});

Panda = game.Class.extend({
    init: function(playerNum, mx, my, x, y, parent) {
        this.playerNum = playerNum;
        this.parent = parent;
        // game.audio.playSound('blob');

        this.sprite = new game.Sprite('player' + playerNum);
        this.sprite.position.set(x, y);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.scale.set(0,0);

        var angle = Math.atan2(-(this.sprite.position.y - my), -(this.sprite.position.x - mx));
        this.sprite.rotation = angle;

        var tween = new game.Tween(this.sprite.scale);
        tween.to({x:1, y:1}, 200);
        tween.easing(game.Tween.Easing.Back.Out);
        tween.start();
        
        game.scene.container.addChild(this.sprite);

        this.aimLine = new AimLine(x, y, mx, my);
    },

    jump: function(x, y) {
        var dist = game.Math.distance(x, y, this.sprite.position.x, this.sprite.position.y);
        if(dist > this.aimLine.maxDist) dist = this.aimLine.maxDist;

        var force = Math.min(10, dist / 50);

        this.aimLine.remove();

        var smoke = new Smoke(this.sprite.position.x, this.sprite.position.y);

        game.audio.playSound('p' + this.playerNum + 'speak1');
        game.audio.playSound('springboard');
        var angle = Math.atan2(-(this.sprite.position.y - y), -(this.sprite.position.x - x));

        var shape = new game.Circle(32 / 2 / game.scene.world.ratio);
        shape.collisionGroup = collisionGroup.PLAYER;
        shape.collisionMask = collisionGroup.PLAYER | collisionGroup.STATIC | collisionGroup.DYNAMIC | collisionGroup.KINEMATIC;

        this.body = new game.Body({
            mass: 1.0,
            position: [
                this.sprite.position.x / game.scene.world.ratio,
                this.sprite.position.y / game.scene.world.ratio
            ],
            angularVelocity: this.playerNum === 1 ? 1 : -1,
            angle: angle
        });
        this.body.parent = this;
        this.body.player = true;
        this.body.addShape(shape);
        
        this.body.velocity[0] = Math.cos(angle) * force;
        this.body.velocity[1] = Math.sin(angle) * force;

        game.scene.world.addBody(this.body);

        game.scene.addObject(this);
        // game.scene.addTimer(20000, this.remove.bind(this));
        return true;
    },

    shoot: function(x, y) {
        if(this.parent.power === 0) return;
        this.parent.power--;
        // this.parent.powerText.setText(this.parent.power.toString());
        // if(this.parent.powerText.alignRight) {
            // this.parent.powerText.updateTransform();
            // this.parent.powerText.position.x = this.parent.powerText.position._x - this.parent.powerText.textWidth;
        // }

        game.audio.playSound('p' + this.playerNum + 'speak1');
        var shootPower = 400;
        var smoke = new Smoke(this.sprite.position.x, this.sprite.position.y);
        var angle = this.body.angle;
        this.body.force[0] = Math.cos(angle) * shootPower;
        this.body.force[1] = Math.sin(angle) * shootPower;
        this.body.angularVelocity = 0;
    },

    rotate: function(x, y) {
        var angle = Math.atan2(-(this.sprite.position.y - y), -(this.sprite.position.x - x));
        this.sprite.rotation = angle;
    },

    remove: function() {
        if(this.removed) return;
        this.removed = true;
        
        game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);
        game.scene.removeObject(this);
        this.parent.panda = null;

        game.scene.gameOver();
    },

    update: function() {
        var maxVel = 4.0;
        if(this.body.velocity[0] > maxVel) this.body.velocity[0] = maxVel;
        if(this.body.velocity[0] < -maxVel) this.body.velocity[0] = -maxVel;

        if(this.body.velocity[1] > maxVel) this.body.velocity[1] = maxVel;
        if(this.body.velocity[1] < -maxVel) this.body.velocity[1] = -maxVel;

        if(this.body.angularVelocity > 3) this.body.angularVelocity = 3;
        if(this.body.angularVelocity < -3) this.body.angularVelocity = -3;

        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;

        if(this.sprite.position.y > game.system.height) this.remove();
    }
});

Smoke = game.Class.extend({
    init: function(x, y) {
        this.sprite = new game.Sprite('smoke');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(x, y);
        this.sprite.scale.set(0.5, 0.5);

        var tween = new game.Tween(this.sprite.scale);
        tween.to({x:1, y:1}, 500);
        tween.onComplete(this.remove.bind(this));
        tween.start();

        tween = new game.Tween(this.sprite);
        tween.to({alpha: 0}, 500);
        tween.start();

        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        game.scene.container.removeChild(this.sprite);
    }
});

ScoreText = game.Class.extend({
    init: function(x, y, score) {
        this.text = new game.BitmapText(score.toString(), {font: 'Grobold3'});
        // this.text.scale.set(0.5, 0.5);
        this.text.position.x = x - this.text.textWidth / 2;
        this.text.position.y = y - this.text.textHeight / 2;
        game.scene.container.addChild(this.text);

        var tween = new game.Tween(this.text.position);
        tween.to({y: '-100'}, 2000);
        tween.onComplete(this.remove.bind(this));
        tween.start();

        tween = new game.Tween(this.text);
        tween.to({alpha: 0}, 2000);
        tween.start();
    },

    remove: function() {
        game.scene.container.removeChild(this.text);
    }
});

Sparkle = game.Class.extend({
    init: function(x, y) {
        this.sprite = new game.Animation(
            'sparkle-1',
            'sparkle-2',
            'sparkle-3',
            'sparkle-4'
        );

        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.set(x, y);
        this.sprite.onComplete = this.remove.bind(this);
        this.sprite.loop = false;
        this.sprite.animationSpeed = 0.2;
        this.sprite.play();

        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        game.scene.container.removeChild(this.sprite);
    }
});

GameObject = game.Class.extend({
    force: 200,
    score: 0,
    scoreAdd: 0,
    health: 0,
    endGame: false,
    sound: '',
    texture: '',
    shape: 'Circle',
    sensor: false,
    sprite: null,
    body: null,
    velocity: null,
    mass: 0,
    type: 'STATIC',

    init: function(x, y, angle) {
        var texture = this.health > 0 ? this.texture + this.health : this.texture;
        this.sprite = new game.Sprite(texture);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = angle || 0;

        if(this.shape === 'Circle') {
            var radius = Math.min(this.sprite.width, this.sprite.height);
            var shape = new game[this.shape](radius / 2 / game.scene.world.ratio);
        }
        if(this.shape === 'Rectangle') {
            var shape = new game[this.shape](this.sprite.width / game.scene.world.ratio, this.sprite.height / game.scene.world.ratio);
        }

        shape.sensor = this.sensor;

        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ],
            angle: angle || 0,
            mass: this.mass
        });

        if(this.velocity) {
            this.body.velocity[0] = this.velocity.x;
            this.body.velocity[1] = this.velocity.y;
        }

        this.body.motionState = game.Body[this.type];
        shape.collisionGroup = collisionGroup[this.type];

        if(shape.collisionGroup === collisionGroup.STATIC) shape.collisionMask = collisionGroup.PLAYER | collisionGroup.DYNAMIC;
        else if(shape.collisionGroup === collisionGroup.DYNAMIC) shape.collisionMask = collisionGroup.PLAYER | collisionGroup.STATIC | collisionGroup.DYNAMIC;
        else if(shape.collisionGroup === collisionGroup.KINEMATIC) shape.collisionMask = collisionGroup.PLAYER;
        
        if(this.mass > 0 || this.velocity) game.scene.addObject(this);

        this.body.parent = this;
        this.body.addShape(shape);

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    hit: function(player) {
        if(this.sound) game.audio.playSound(this.sound);

        this.health--;
        if(this.sensor) this.health = 0;

        if(this.health !== 0) {
            if(this.health > 0) this.sprite.setTexture(this.texture + this.health);

            this.sprite.scale.set(0.8, 0.8);
            var tween = new game.Tween(this.sprite.scale);
            tween.to({x:1, y:1}, 200);
            tween.easing(game.Tween.Easing.Back.Out);
            tween.start();

            this.score += this.scoreAdd;
            return false;
        } else {
            this.remove();
            return true;
        }
    },

    remove: function() {
        if(this.body.world && !this.sensor) game.scene.world.removeBody(this.body);
        if(this.sprite.parent) this.sprite.parent.removeChild(this.sprite);
        game.scene.removeObject(this);

        if(this.endGame) game.scene.gameOver(player);
    },

    update: function() {
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        this.sprite.rotation = this.body.angle;

        if(this.sprite.position.y + this.sprite.height / 2 < 0) this.remove();
        if(this.sprite.position.y - this.sprite.height / 2 > game.system.height) this.remove();
    }
});

Emitter = game.Class.extend({
    position: {x:0, y:0},
    width: 0,
    height: 0,
    object: '',
    emitOnInit: true,
    time: 1000,

    init: function(object, x, y, width, height, time) {
        this.object = object;
        this.position.x = x || this.position.x;
        this.position.y = y || this.position.y;
        this.width = width || this.width;
        this.height = height || this.height;
        this.time = time || this.time;

        game.scene.addTimer(this.time, this.emit.bind(this), true);
        
        if(this.emitOnInit) this.emit();
    },

    emit: function() {
        var obj = new window[this.object](
            this.position.x + Math.random() * this.width - this.width / 2,
            this.position.y + Math.random() * this.height - this.height / 2
        );
    }
});

Star = GameObject.extend({
    texture: 'star',
    sound: 'pickup',
    velocity: {x: 0, y: -0.5},
    sensor: true,
    type: 'KINEMATIC'
});

Brick = GameObject.extend({
    texture: 'brick',
    shape: 'Rectangle'
});

Ball = GameObject.extend({
    texture: 'ball',
    score: 70,
    mass: 1,
    type: 'DYNAMIC'
});

Heart = GameObject.extend({
    force: 300,
    score: 100,
    scoreAdd: 100,
    health: 3,
    texture: 'heart'
});

Apple = GameObject.extend({
    force: 250,
    score: 100,
    scoreAdd: 50,
    health: 2,
    texture: 'apple'
});

Bush = GameObject.extend({
    texture: 'bush'
});

Block = GameObject.extend({
    force: 100,
    score: 10,
    scoreAdd: 10,
    texture: 'block',
    health: 2,
    shape: 'Rectangle'
});

});