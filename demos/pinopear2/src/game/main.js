game.module(
    'game.main'
)
.require(
    'engine.core',
    'game.assets',
    'game.objects',
    'game.levels.level1',
    'plugins.p2'
)
.body(function() {

SceneGame = game.Scene.extend({
    score: 0,
    players: [],

    init: function() {
        this.level = game.copy(Level1);
        
        this.initWorld();
        this.initLevel();
        this.initHUD();
        this.initPlayers();
        this.initMusic();
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
                    if(target.parent.hit()) {
                        var sparkle = new Sparkle(target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio);
                    }
                    if(target.parent.score) game.scene.addScore(player.parent.parent, target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio, target.parent.score);
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
            if(data.bodyA.player && data.bodyB.player) return game.audio.playSound('hit');
            
            var player = data.bodyA.player ? data.bodyA : data.bodyB.player ? data.bodyB : false;

            if(player) {
                var target = data.bodyA.player ? data.bodyB : data.bodyA;

                game.audio.playSound('p'+player.parent.playerNum+'speak'+(Math.round(game.Math.random(2,5))));
                var smoke = new Smoke(player.parent.sprite.position.x, player.parent.sprite.position.y);

                if(target.parent) {
                    // Player hits object
                    if(target.parent.force) {
                        var angle = Math.atan2((player.position[1] - target.position[1]), (player.position[0] - target.position[0]));
                        
                        player.force[0] = Math.cos(angle) * target.parent.force;
                        player.force[1] = Math.sin(angle) * target.parent.force;                        
                    }

                    if(target.parent.score) game.scene.addScore(player.parent.parent, target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio, target.parent.score);

                    if(target.parent.hit()) {
                        var sparkle = new Sparkle(target.position[0] * game.scene.world.ratio, target.position[1] * game.scene.world.ratio);
                    }
                    
                } else {
                    // Player hits wall
                }
            }
        });

        var wallShape, wallBody;
        // Left wall
        wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [-1, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        // Right wall
        wallShape = new game.Rectangle(2, game.system.height * 2 / this.world.ratio);
        wallBody = new game.Body({
            position: [game.system.width / this.world.ratio + 1, game.system.height / this.world.ratio]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);

        // Top wall
        wallShape = new game.Rectangle(game.system.width / this.world.ratio, 2);
        wallBody = new game.Body({
            position: [game.system.width / 2 / this.world.ratio, 40 / this.world.ratio - 1]
        });
        wallBody.addShape(wallShape);
        this.world.addBody(wallBody);
    },

    initLevel: function() {
        this.container = new game.Container();
        var bg = new game.TilingSprite('bg', game.system.width, game.system.height);
        // bg.speed.x = -10;
        this.addObject(bg);
        this.container.addChild(bg);
        this.stage.addChild(this.container);

        var i, obj;
        for (i = 0; i < this.level.objects.length; i++) {
            obj = new window[this.level.objects[i][0]](this.level.objects[i][1], this.level.objects[i][2], this.level.objects[i][3]);
        }

        for (i = 0; i < this.level.emitters.length; i++) {
            obj = new Emitter(this.level.emitters[i][0], this.level.emitters[i][1], this.level.emitters[i][2], this.level.emitters[i][3], this.level.emitters[i][4], this.level.emitters[i][5]);
        }
    },

    initHUD: function() {
        var topBar = new game.Graphics();
        topBar.beginFill(0);
        topBar.drawRect(0, 0, game.system.width, 40);
        topBar.alpha = 0.5;
        this.stage.addChild(topBar);

        var text = new game.BitmapText(this.level.name, {font: 'Titan'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        text.position.y = 3;
        this.stage.addChild(text);

        this.playerCountText = [];

        // Player 1
        var sprite = new game.Sprite('player1');
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.8, 0.8);
        sprite.position.set(-8 + 820 + 5, 20);
        this.stage.addChild(sprite);

        var text = new game.BitmapText(this.level.playerCount[0].toString(), {font: 'TitanWhite'});
        text.position.set(-8 + 820 + 5 + 20, 3);
        this.stage.addChild(text);
        this.playerCountText.push(text);

        // Star
        var sprite = new game.Sprite('star');
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.8, 0.8);
        sprite.position.set(-8 + 970, 20);
        this.stage.addChild(sprite);

        var text = new game.BitmapText('0', {font: 'TitanWhite'});
        text.position.set(-8 + 985, 3);
        this.stage.addChild(text);

        // Player 2
        var sprite = new game.Sprite('player2');
        sprite.anchor.set(0.5, 0.5);
        sprite.scale.set(0.8, 0.8);
        sprite.position.set(-8 + 900, 20);
        sprite.rotation = Math.PI;
        sprite.scale.x = -0.8;
        this.stage.addChild(sprite);

        var text = new game.BitmapText(this.level.playerCount[1].toString(), {font: 'TitanWhite'});
        text.position.set(-8 + 900 + 20, 3);
        this.stage.addChild(text);
        this.playerCountText.push(text);

        this.scoreText = new game.BitmapText('0 / ' + this.level.targetScore, {font: 'TitanWhite'});
        this.scoreText.position.set(50, 3);
        this.stage.addChild(this.scoreText);

        var pause = new game.Sprite('pause');
        pause.anchor.set(0.5, 0.5);
        pause.position.set(20, 20);
        this.stage.addChild(pause);
    },

    initPlayers: function() {
        var home, tween, player;
        for (var i = 0; i < this.level.players.length; i++) {
            player = new PlayerData();

            player.position.x = this.level.players[i][0];
            player.position.y = this.level.players[i][1];
            
            home = new game.Sprite('home');
            home.anchor.set(0.5, 0.5);
            home.position.x = player.position.x;
            home.position.y = player.position.y;
            this.container.addChild(home);

            tween = new game.Tween(home);
            tween.to({rotation: Math.PI * 2}, 10000);
            tween.repeat();
            tween.start();

            this.players.push(player);
        }
    },

    initMusic: function() {
        game.audio.musicVolume = 0.5;
        game.audio.playMusic(this.level.music);
    },

    levelComplete: function() {
        if(this.ended) return;
        this.ended = true;

        game.audio.playMusic('music2');

        var text = new game.BitmapText('LEVEL COMPLETE', {font: 'Grobold2'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        text.position.y = -text.textHeight;
        text.rotation = -0.1;
        this.stage.addChild(text);

        var tween = new game.Tween(text.position);
        tween.to({y: game.system.height / 2 - text.textHeight / 2}, 2000);
        tween.easing(game.Tween.Easing.Bounce.Out);
        tween.start();

        this.addTimer(20000, function() {
            game.system.setScene(SceneGame);
        });
    },

    gameOver: function(force) {
        if(this.ended) return;

        var isGameOver = true;
        for (var i = 0; i < this.level.playerCount.length; i++) {
            if(this.level.playerCount[i] > 0) isGameOver = false;
        }
        if(force) isGameOver = true;
        if(!isGameOver) return;
        
        this.ended = true;
        
        game.audio.playMusic('music2');

        var text = new game.BitmapText('GAME OVER', {font: 'Grobold2'});
        text.position.x = game.system.width / 2 - text.textWidth / 2;
        text.position.y = -text.textHeight;
        text.rotation = -0.1;
        this.stage.addChild(text);

        var tween = new game.Tween(text.position);
        tween.to({y: game.system.height / 2 - text.textHeight / 2}, 2000);
        tween.easing(game.Tween.Easing.Bounce.Out);
        tween.start();

        this.addTimer(20000, function() {
            game.system.setScene(SceneGame);
        });
    },

    addScore: function(player, x, y, amount) {
        if(this.ended) return;

        this.score += amount;
        this.scoreText.setText(this.score.toString() + ' / ' + this.level.targetScore);

        var text = new ScoreText(x, y, amount);

        if(this.score >= this.level.targetScore) this.levelComplete();
    },

    mousedown: function(event) {
        if(this.ended) return;

        var player = event.global.x < game.system.width / 2 ? 0 : 1;

        if(this.players[player].panda && this.players[player].panda.body) return this.players[player].panda.shoot(event.global.x, event.global.y);        

        if(this.level.playerCount[player] === 0) return;

        this.players[player].mousedown = true;
        if(this.players[player].panda) return;
        this.players[player].panda = new Panda(player + 1, event.global.x, event.global.y, this.players[player].position.x, this.players[player].position.y, this.players[player]);
    },

    mousemove: function(event) {        
        var player = event.global.x < game.system.width / 2 ? 0 : 1;
        
        if(!this.players[player].panda || !this.players[player].mousedown) return;

        this.players[player].panda.rotate(event.global.x, event.global.y);
        this.players[player].panda.aimLine.set(this.players[player].panda.sprite.position.x, this.players[player].panda.sprite.position.y, event.global.x, event.global.y);
    },

    mouseup: function(event) {        
        var player = event.global.x < game.system.width / 2 ? 0 : 1;
        if(!this.players[player].panda || !this.players[player].mousedown) return;

        this.players[player].mousedown = false;
        this.players[player].panda.jump(event.global.x, event.global.y);

        this.level.playerCount[player]--;
        this.playerCountText[player].setText(this.level.playerCount[player].toString());
    }
});

SceneTitle = game.Scene.extend({
    init: function() {
        this.stage.addChild(new game.Sprite('bg_title'));
        game.audio.musicVolume = 0.5;
        game.audio.playMusic('music2');
    },

    click: function() {
        game.system.setScene(SceneGame);
    }
});

game.start(SceneTitle);

});