game.module(
    'game.main'
)
.require(
    'engine.core',
    'game.assets',
    'game.objects',
    'plugins.p2'
)
.body(function() {

SceneGame = game.Scene.extend({
    playerCount: 2,
    players: [],
    appleCount: 0,

    init: function() {
        this.initWorld();
        this.initScene();
        this.initPlayers();

        // game.audio.musicMuted = true;
        game.audio.musicVolume = 0.5;
        game.audio.playMusic('music');
    },

    gameOver: function() {
        this.ended = true;

        var winner = this.players[0].score > this.players[1].score ? 1 : 2;

        game.audio.playSound('p'+winner+'speak1');
        var text = new game.BitmapText('Player ' + (winner) + ' wins!', {font: 'Grobold2'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        text.position.y = -text.textHeight;
        text.rotation = -0.1;
        this.stage.addChild(text);

        var tween = new game.Tween(text.position);
        tween.to({y: game.system.height / 2 - text.textHeight / 2}, 2000);
        tween.easing(game.Tween.Easing.Bounce.Out);
        tween.start();

        game.audio.playMusic('music2');

        this.addTimer(20000, function() {
            game.system.setScene(SceneGame);
        });
    },

    initPlayers: function() {
        var player;
        for (var i = 0; i < this.playerCount; i++) {
            player = {
                num: (i+1),
                panda: null,
                count: 5,
                countSprites: [],
                score: 0,
                position: {} // Spawn position
            };
            this.players.push(player);
        }

        this.players[0].scoreText = new game.BitmapText('0', {font: 'Grobold'});
        this.players[0].scoreText.position.x = 10;
        this.players[0].scoreText.position.y = 10;
        this.stage.addChild(this.players[0].scoreText);

        this.players[1].scoreText = new game.BitmapText('0', {font: 'Grobold'});
        this.players[1].scoreText.position.x = game.system.width - 14 - this.players[1].scoreText.textWidth;
        this.players[1].scoreText.position.y = 10;
        this.players[1].scoreText.position._x = game.system.width - 14;
        this.players[1].scoreText.alignRight = true;
        this.stage.addChild(this.players[1].scoreText);

        this.players[0].position.x = 35;
        this.players[0].position.y = 210;

        this.players[1].position.x = 1024 - 30;
        this.players[1].position.y = 200;
    },

    initScene: function() {
        this.container = new game.Container();

        this.container.addChild(new game.Sprite('bg'));

        this.spawnRow(Apple, 3, 50, 400);

        this.spawnRow(Apple, 2, 270, 490);
        this.spawnRow(Apple, 2, 300, 470);
        this.spawnRow(Apple, 2, 330, 450);
        this.spawnRow(Apple, 2, 360, 470);
        this.spawnRow(Apple, 2, 390, 490);

        var block;

        block = new Block(30-10, 300, 60 * (Math.PI / 180));
        block = new Block(60-10, 340, 45 * (Math.PI / 180));
        block = new Block(100-10, 370, 30 * (Math.PI / 180));
        block = new Block(150-10, 390, 15 * (Math.PI / 180));

        block = new Block(game.system.width - 30+10, 300, -60 * (Math.PI / 180));
        block = new Block(game.system.width - 60+10, 340, -45 * (Math.PI / 180));
        block = new Block(game.system.width - 100+10, 370, -30 * (Math.PI / 180));
        block = new Block(game.system.width - 150+10, 390, -15 * (Math.PI / 180));

        block = new Block(30-10+330, 300+270, 60 * (Math.PI / 180));
        block = new Block(60-10+330, 340+270, 45 * (Math.PI / 180));
        block = new Block(100-10+330, 370+270, 30 * (Math.PI / 180));
        block = new Block(150-10+330, 390+270, 15 * (Math.PI / 180));

        block = new Block(game.system.width - 30+10-330, 300+270, -60 * (Math.PI / 180));
        block = new Block(game.system.width - 60+10-330, 340+270, -45 * (Math.PI / 180));
        block = new Block(game.system.width - 100+10-330, 370+270, -30 * (Math.PI / 180));
        block = new Block(game.system.width - 150+10-330, 390+270, -15 * (Math.PI / 180));

        block = new Block(game.system.width / 2 - 50, 220, -90 * (Math.PI / 180));
        block = new Block(game.system.width / 2 + 50, 220, -90 * (Math.PI / 180));

        block = new Block(game.system.width / 2 - 50, 220 - 50, -90 * (Math.PI / 180));
        block = new Block(game.system.width / 2 + 50, 220 - 50, -90 * (Math.PI / 180));

        block = new Block(game.system.width / 2 - 350, 650, 45 * (Math.PI / 180));
        block = new Block(game.system.width / 2 - 280, 650, -45 * (Math.PI / 180));

        block = new Block(game.system.width / 2 + 350, 650, -45 * (Math.PI / 180));
        block = new Block(game.system.width / 2 + 280, 650, 45 * (Math.PI / 180));

        // block = new Block(game.system.width / 2 - 50, 220 - 100, -90 * (Math.PI / 180));
        // block = new Block(game.system.width / 2 + 50, 220 - 100, -90 * (Math.PI / 180));

        var apple;
        apple = new Apple(game.system.width / 2, 670);
        apple = new Apple(game.system.width / 2, 700);
        apple = new Apple(game.system.width / 2, 730);

        apple = new Apple(game.system.width / 2 - 314, 660);
        apple = new Apple(game.system.width / 2 + 314, 660);

        apple = new Apple(game.system.width / 2 - 450, 572);
        apple = new Apple(game.system.width / 2 + 450, 572);

        this.spawnRow(Apple, 12, 480);

        // this.spawnRow(Block, 8, 500, 200);
        this.spawnRow(Block, 11, 750, 70);

        var bush;
        bush = new Bush(game.system.width / 2 - 200, 200);
        bush = new Bush(game.system.width / 2 + 200, 200);

        bush = new Bush(game.system.width / 2 - 130, 330);
        bush = new Bush(game.system.width / 2 + 130, 330);

        bush = new Bush(game.system.width / 2 - 130, 700);
        bush = new Bush(game.system.width / 2 + 130, 700);

        bush = new Bush(game.system.width / 2 - 230, 600);
        bush = new Bush(game.system.width / 2 + 230, 600);

        bush = new Bush(game.system.width / 2 - 400, 600);
        bush = new Bush(game.system.width / 2 + 400, 600);

        bush = new Bush(game.system.width / 2 - 500, 550);
        bush = new Bush(game.system.width / 2 + 500, 550);

        var star;
        star = new Star(348, 267);
        star = new Star(677, 264);
        star = new Star(459, 107);
        star = new Star(564, 109);
        star = new Star(172, 600);
        star = new Star(219, 600);
        star = new Star(802, 603);
        star = new Star(856, 603);
        star = new Star(373, 556);
        star = new Star(395, 590);
        star = new Star(427, 613);
        star = new Star(475, 626);
        star = new Star(545, 633);
        star = new Star(593, 613);
        star = new Star(621, 586);
        star = new Star(644, 556);

        star = new Star(123, 141);
        star = new Star(190, 111);
        star = new Star(254, 78);
        star = new Star(317, 55);

        star = new Star(game.system.width - 123, 141);
        star = new Star(game.system.width - 190, 111);
        star = new Star(game.system.width - 254, 78);
        star = new Star(game.system.width - 317, 55);

        var heart = new Heart(game.system.width / 2, game.system.height / 2 - 50);

        this.stage.addChild(this.container);
    },

    initWorld: function() {
        this.world = new game.World({
            gravity: [0, 5]
        });
        this.world.ratio = 100;

        this.world.removeBodies = [];

        this.world.on('beginContact', function(data) {
            if(data.bodyA.player && data.bodyB.player) return;

            var player = data.bodyA.player ? data.bodyA : data.bodyB.player ? data.bodyB : false;

            if(player) {
                var target = data.bodyA.player ? data.bodyB : data.bodyA;

                if(target.shapes[0].sensor) {
                    if(target.parent.remove()) {
                        var sparkle = new Sparkle(target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio);
                    }
                    if(target.parent.score) game.scene.addScore(player.parent.parent, player.parent.sprite.position.x, player.parent.sprite.position.y, target.parent.score);
                    data.target.removeBodies.push(target);
                }
            }
        });

        this.world.on('postStep', function(data) {
            for (var i = data.target.removeBodies.length - 1; i >= 0; i--) {
                data.target.removeBody(data.target.removeBodies[i]);
                data.target.removeBodies.splice(i, 1);
            }
        });

        this.world.on('impact', function(data) {
            if(data.bodyA.player && data.bodyB.player) {
                // Player vs. Player collision
                game.audio.playSound('hit');
                return;
            }
            var player = data.bodyA.player ? data.bodyA : data.bodyB.player ? data.bodyB : false;

            if(player) {
                var target = data.bodyA.player ? data.bodyB : data.bodyA;

                if(!game.scene.ended) game.audio.playSound('p'+player.parent.playerNum+'speak'+(Math.round(game.Math.random(2,5))));
                if(target.parent) {
                    if(target.parent.force) {
                        var angle = Math.atan2((player.position[1] - target.position[1]), (player.position[0] - target.position[0]));
                        
                        player.force[0] = Math.cos(angle) * target.parent.force;
                        player.force[1] = Math.sin(angle) * target.parent.force;                        
                    }

                    if(target.parent.score) game.scene.addScore(player.parent.parent, player.parent.sprite.position.x, player.parent.sprite.position.y, target.parent.score);

                    if(target.parent.remove()) {
                        var sparkle = new Sparkle(target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio);
                    }
                } else {
                    // Hitting wall
                    // game.scene.addScore(50);
                    // game.audio.playSound('hit');
                }

                var smoke = new Smoke(player.parent.sprite.position.x, player.parent.sprite.position.y);
            }
        });

        // Left wall
        var wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        // wallShape.collisionGroup = 2;
        var wallBody = new game.Body({
            position: [-1, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        // Right wall
        wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        // wallShape.collisionGroup = 2;
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio + 1, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        // Ceiling
        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 2);
        // wallShape.collisionGroup = 2;
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, -1]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);
    },

    addScore: function(player, x, y, amount) {
        if(this.ended) return;

        player.score += amount;
        player.scoreText.setText(player.score.toString());

        // if(player.score >= 4000) this.gameOver(player.num);

        if(player.scoreText.alignRight) {
            player.scoreText.updateTransform();
            player.scoreText.position.x = player.scoreText.position._x - player.scoreText.textWidth;
        }

        var text = new ScoreText(x, y, amount);
    },

    spawnRow: function(type, count, y, padding) {
        padding = padding || 50;
        for (var i = 0; i < count; i++) {
            var x = padding + (((game.system.width - padding * 2) / (count - 1)) * (i));
            var acorn = new (type)(x, y);
        }
    },

    mousedown: function(event) {
        // return console.log(event.global.x + ', ' + event.global.y);
        if(this.ended) return;
        var player = event.global.x < game.system.width / 2 ? 0 : 1;
        if(this.players[player].panda) return;

        this.players[player].mousedown = true;
        this.players[player].panda = new Panda(player + 1, event.global.x, event.global.y, this.players[player].position.x, this.players[player].position.y, this.players[player]);
    },

    mousemove: function(event) {
        // if(this.ended) return;
        var player = event.global.x < game.system.width / 2 ? 0 : 1;
        if(!this.players[player].panda || !this.players[player].mousedown) return;

        this.players[player].panda.rotate(event.global.x, event.global.y);
        this.players[player].panda.aimLine.reset(this.players[player].panda.sprite.position.x, this.players[player].panda.sprite.position.y, event.global.x, event.global.y);
    },

    mouseup: function(event) {
        // if(this.ended) return;
        var player = event.global.x < game.system.width / 2 ? 0 : 1;
        if(!this.players[player].panda || !this.players[player].mousedown) return;

        this.players[player].mousedown = false;
        this.players[player].panda.jump(event.global.x, event.global.y);

        this.addObject(this.players[player].panda);
    }
});

SceneTitle = game.Scene.extend({
    init: function() {
        
    },

    mouseup: function(event) {
        
    }
});

game.start();

});