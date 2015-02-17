game.module(
    'game.main'
)
.body(function() {

game.addAsset('panda.png');

var sprites = [];
var fps = [];
var startTime;
var last;
var frames = 0;
var gravity = 0.75;
var ready = false;
var maxX = 800;
var minX = 0;
var maxY = 600;
var minY = 0;

game.createScene('Main', {
    backgroundColor: 0xffffff,

    init: function() {
        game.system.stage.removeChild(this.stage);
        this.container = new game.PIXI.SpriteBatch();
        this.texture = game.Texture.fromImage('panda.png');
        game.system.stage.addChild(this.container);

        this.addSprite(20000);

        startTime = Date.now();
        last = startTime + 2000; // Skip first 2 seconds
    },

    addSprite: function(count) {
        for (var i = 0; i < count; i++) {
            var sprite = new game.Sprite(this.texture);
            sprite.speedX = Math.random() * 10;
            sprite.speedY = Math.random() * 10 - 5;
            sprite.anchor.set(0.5, 1);
            sprite.position.set(sprite.width / 2, sprite.height);
            sprite.addTo(this.container);
            sprites.push(sprite);
        }
    },

    update: function() {
        if (ready) return;

        var now = Date.now();

        if (now >= last) frames++;
        if (now >= last + 500) {
            fps.push(Math.round((frames * 1000) / (now - last)));
            last = now;
            frames = 0;
        }
        if (now >= startTime + 1000 * 60) {
            var total = 0;
            for (var i = 0; i < fps.length; i++) {
                total += fps[i];
            }
            var average = total / fps.length;
            var precision = Math.pow(10, 1);
            average = Math.round(average * precision) / precision;

            ready = true;

            if (navigator.isCocoonJS) {
                console.log('FPS: ' + average);
            }
            else {
                var div = document.createElement('div');
                div.innerHTML = 'FPS: ' + average;
                div.style.color = '#ff0000';
                document.body.appendChild(div);
                document.body.removeChild(game.system.canvas);
            }

            game.system.stopRunLoop();
            return;
        }

        var sprite;
        for (var i = 0; i < sprites.length; i++) {
            sprite = sprites[i];
            
            sprite.position.x += sprite.speedX;
            sprite.position.y += sprite.speedY;
            sprite.speedY += gravity;
            if (sprite.position.x > maxX) {
                sprite.speedX *= -1;
                sprite.position.x = maxX;
            }
            else if (sprite.position.x < minX) {
                sprite.speedX *= -1;
                sprite.position.x = minX;
            }
            if (sprite.position.y > maxY) {
                sprite.speedY *= -0.85;
                sprite.position.y = maxY;
                sprite.spin = (Math.random()-0.5) * 0.2
                if (Math.random() > 0.5) {
                    sprite.speedY -= Math.random() * 6;
                }
            } 
            else if (sprite.position.y < minY) {
                sprite.speedY = 0;
                sprite.position.y = minY;
            }
        }

        this._super();
    }
});

});
