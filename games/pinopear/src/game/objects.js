game.module(
    'game.objects'
)
.body(function() {

AimLine = game.Class.extend({
    ballCount: 5,
    balls: [],

    init: function(x, y, x2, y2) {
        var ball;
        for (var i = 0; i < this.ballCount; i++) {
            ball = new game.Sprite('aimball');
            ball.anchor.set(0.5, 0.5);
            game.scene.stage.addChild(ball);
            this.balls.push(ball);
        }

        this.reset(x, y, x2, y2);
    },

    reset: function(x, y, x2, y2) {
        var dist = game.Math.distance(x, y, x2, y2);
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
        game.audio.playSound('blob');

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
        this.aimLine.remove();
        var smoke = new Smoke(this.sprite.position.x, this.sprite.position.y);

        game.audio.playSound('p' + this.playerNum + 'speak1');
        game.audio.playSound('springboard');
        var angle = Math.atan2(-(this.sprite.position.y - y), -(this.sprite.position.x - x));

        var shape = new game.Circle(32 / 2 / game.scene.world.ratio);

        this.body = new game.Body({
            mass: 1.0,
            position: [
                this.sprite.position.x / game.scene.world.ratio,
                this.sprite.position.y / game.scene.world.ratio
            ],
            angularVelocity: 1,
            angle: angle
        });
        this.body.parent = this;
        this.body.player = true;
        this.body.addShape(shape);

        
        var force = Math.min(10, game.Math.distance(x, y, this.sprite.position.x, this.sprite.position.y) / 50);
        
        this.body.velocity[0] = Math.cos(angle) * force;
        this.body.velocity[1] = Math.sin(angle) * force;

        game.scene.world.addBody(this.body);

        // game.scene.addTimer(20000, this.remove.bind(this));
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
    },

    update: function() {
        var maxVel = 4.0;
        if(this.body.velocity[0] > maxVel) this.body.velocity[0] = maxVel;
        if(this.body.velocity[0] < -maxVel) this.body.velocity[0] = -maxVel;

        if(this.body.velocity[1] > maxVel) this.body.velocity[1] = maxVel;
        if(this.body.velocity[1] < -maxVel) this.body.velocity[1] = -maxVel;

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

Heart = game.Class.extend({
    force: 300,
    score: 500,
    health: 3,

    init: function(x, y) {
        var shape = new game.Circle(40 / 2 / game.scene.world.ratio);
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        this.sprite = new game.Sprite('heart' + this.health);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        this.health--;

        game.audio.playSound('heartbeat');

        if(this.health > 0) {
            this.sprite.setTexture('heart' + this.health);

            this.sprite.scale.set(0.8, 0.8);
            var tween = new game.Tween(this.sprite.scale);
            tween.to({x:1, y:1}, 200);
            tween.easing(game.Tween.Easing.Back.Out);
            tween.start();

            this.score += 200;
            return false;
        }

        if(this.body.world) game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);

        game.scene.gameOver();
        return true;
    }
});

Apple = game.Class.extend({
    force: 250,
    score: 100,
    health: 2,

    init: function(x, y) {
        game.scene.appleCount++;

        var shape = new game.Circle(22 / 2 / game.scene.world.ratio);
        // shape.collisionGroup = 2;
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        this.sprite = new game.Sprite('apple'+this.health);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;
        // this.sprite.rotation = Math.PI;

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        this.health--;

        if(this.health > 0) {
            this.sprite.setTexture('apple'+this.health);

            this.sprite.scale.set(0.8, 0.8);
            var tween = new game.Tween(this.sprite.scale);
            tween.to({x:1, y:1}, 200);
            tween.easing(game.Tween.Easing.Back.Out);
            tween.start();

            this.score = 200;
            return false;
        }
        game.audio.playSound('pickup');
        if(this.body.world) game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);

        return true;
    }
});

Star = game.Class.extend({
    score: 50,

    init: function(x, y) {
        var shape = new game.Circle(32 / 2 / game.scene.world.ratio);
        shape.sensor = true;
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        this.sprite = new game.Sprite('star');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = this.body.position[0] * game.scene.world.ratio;
        this.sprite.position.y = this.body.position[1] * game.scene.world.ratio;

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        game.audio.playSound('pickup');
        game.scene.container.removeChild(this.sprite);
        return true;
    }
});

Bush = game.Class.extend({
    force: 200,

    init: function(x, y) {
        this.sprite = new game.Sprite('bush');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = x;
        this.sprite.position.y = y;

        var shape = new game.Circle(66 / 2 / game.scene.world.ratio);
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ]
        });
        this.body.parent = this;
        this.body.addShape(shape);

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        // game.audio.playSound('springboard', null, null, null, game.Math.random(1.0,1.2));

        if(this.hitted) return;
        this.hitted = true;

        this.sprite.scale.set(0.9, 0.9);
        var tween = new game.Tween(this.sprite.scale);
        tween.to({x:1, y:1}, 400);
        tween.easing(game.Tween.Easing.Back.Out);
        tween.onComplete(this.reset.bind(this));
        tween.start();
    },

    reset: function() {
        this.hitted = false;
    }
});

Block = game.Class.extend({
    score: 10,
    force: 100,

    init: function(x, y, angle) {
        angle = angle || 0;

        this.sprite = new game.Sprite('block2');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.rotation = angle;

        var shape = new game.Rectangle(this.sprite.width / game.scene.world.ratio, this.sprite.height / game.scene.world.ratio);
        // shape.collisionGroup = 2;
        this.body = new game.Body({
            position: [
                x / game.scene.world.ratio,
                y / game.scene.world.ratio
            ],
            angle: angle
        });
        this.body.parent = this;
        this.body.addShape(shape);

        game.scene.world.addBody(this.body);
        game.scene.container.addChild(this.sprite);
    },

    remove: function() {
        // game.audio.playSound('hit');

        if(this.hitted) return this._remove();
        this.hitted = true;
        this.sprite.setTexture('block1');
        this.score = 20;
    },

    _remove: function() {
        if(this.body.world) game.scene.world.removeBody(this.body);
        game.scene.container.removeChild(this.sprite);
    }
});

Sparkle = game.Class.extend({
    init: function(x, y) {
        this.sprite = new game.Animation(
            'media/sparkle-1.png',
            'media/sparkle-2.png',
            'media/sparkle-3.png',
            'media/sparkle-4.png'
        );

        this.sprite.anchor.set(0.5, 0.5);
        // this.sprite.scale.set(0.5, 0.5);
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

});