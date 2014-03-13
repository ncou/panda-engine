game.module(
    'plugins.yleloader'
)
.require(
    'engine.loader'
)
.body(function() {

if(game.device.mobile) {
    game.addAsset('media/yleloader/badge.png');
    game.addAsset('media/yleloader/button.png');
}

game.Loader.inject({
    backgroundColor: 0xffffff,

    initStage: function() {
        imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAV1BMVEUAAAD///8AqsEAs8gAtMgAtMgAtMgAtMgAtMgAtMgArsQApr6n5exp0986xdXa9Pcfvc+36vDq+ft92eMtwtJPy9kOuMvI7/OP3uec4upc0Nz2/f4An7lf1MBDAAAACnRSTlMA////vvH/KqVWYaEqtwAAA/NJREFUaN7t2+tymzAQBWCz2yrpLjdxB/P+z1m7Dj2hQgaHsem0Oj8zRt9oJSHBhNPp9Pb+3bw0/P52uuSHOSA/Lv01h+Tt9G4OybeTOSgB9iXAAQ5wgAMcYG8C/L/BTHoLvRZmqupbKuJXwlRGU0ri18GSR0i6XO2nwFRFSKcHwTG9EM4PgpniY2AjMvRxewBsWGmsXwuDTo6BTYCXEuDnw3yNMQ/DLCK81JwIr8JCqiSXkJI8BpPw1TBOi8wsdB8W5TTpbdu2Ni5ro/QATJXNsszm9IfL/eXPbUp3YNamzCKk6HLlrTBLEV3T0vwS7W+NNeKFRYcimuecqGyDsenNuywNjhweWLSL3PQq92EI59sVic46XEe3VD6YtYyW0unWUmdoEplaLYx4YE0xttbaFscyvQuDiEH8DpO9/dUSL8Mi0/jalIlI8qkAGfE2OFk4QIr5aLZUswzrEE2/UOFLaKzQ5TUYswvG/IBXe2Cm9qO/mEzjMM2vVRiDjKrCwWpyYSwGKEK3lgqWLbCZVsW5we+n810rvASj0i2xOyNz2gbXztgwZ1gby3DnLB5M9Fq3wFjJpTrjXi/DmPWDGsNTpsuSLTAaQV0xZXNZhmUqSTWS0hSVM3qwCrszCYXMhBdhVMl2fdfHv3NG/ddhd+2wtFgYDoyx8KVfgX1TCf0ZvHDlVdd7jGg/r6ym2LG+Ag+b4RrQ5/WYMX8FzkS2wdh8B51N81jN43DRN2Q2wkyYTJ93iGQdrqt0nsqQmC2wW1u0WpEHxnuRZqR5wK7DcwpIweKFm2LlZcw2WPhzcbUHsgxjSxt0D4xjSExoFEN8517d7YUHVJdy1N0HY1aQ7IGBpSNrjUOYF6bpHpOMM5lF+AEYd+csp7HDicQHY1ZEJasq/YoqSWOI12EEh+TWYntegp0Lirgc6vSSeijjtigSegBG6ZCU7sHC58iTRrbBeIRCMMQujBu8JxVth912MMQrjzB7YcYjGIZ4AVZcocmOUiNCSeYOMdYb7lSQ894d6KzeOrnQDqdDknwU8GzEzOQ6ttYm81VKmg99W0xmkdmyZrgbYLzPGBsM8VwmIXLWqKhKk1fpJVXeMKmKeRzGYGKIEd+rHRb6iOAHX4B7DPH+bIdZMqzi18GYvZbMa+Gxw168kv0wkwhfY3jEXvx8WCTPjdA1khY4EMzyBFiaNjoXrY0vyTxPP0+B3Tuu+0z/HLhbf+p6Fdw6J7inwMOfrhXaL63DLP2MzRKC+0zYCOXXd93ZNW1Xs/IuYh1GSInkyrFgW3syjC1PrtnV2X/o3zECHOAABzjAdxLgAAc4wH8RfNSHVod9WnbYx3RHfD5ovl36+xMLy03g8Z4G6AAAAABJRU5ErkJggg==';
        if(game.device.ie) imageData += '?' + Date.now();
        this.logo = new game.Sprite(game.system.width / 2, game.system.height / 2, game.Texture.fromImage(imageData, true), {
            anchor: {x: 0.5, y: 0.5}
        });
        game.system.stage.addChild(this.logo);

        this.text = new game.Text(this.percent+'%',{font:'14px Arial'});
        this.text.position.x = game.system.width/2 - this.text.width/2;
        this.text.position.y = game.system.height/2+92;
        game.system.stage.addChild(this.text);

        imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAJ1BMVEUAAAAAtMgAt8cAs8gAtMgAtMgAtcgAtMgAtcoAtMgAr88AtMgAtMgllZgxAAAADHRSTlMAvyBGoHVg7DCQENmYD+5KAAAA/ElEQVQ4y7yRoW4CQRCGp3fXlpCKqqYC0aT2BLYpggc40fMIXA2ChASF4AGwJAgEGJ7iBAcHBPgeigSWZe+Y4OBTk3y7szP/yqMoxQmkwy/d/vQ4sh9p9h9L99r+4tAp2inAR1XkOwb4zFsfyKqnehYBzZxuQGYnLo9h5doAUmcfrwJ1R0fwJw4vkInlGZaSY+Ceb7EvROUllwslWEiBECamfIJ+Ufvwbsoaa7miYbv3clvYlqmdW/lD75zcK1tRiGibHXeaDs3jY+qaDkzThKamfTZmholonCb24lRUKib2sq5bNjeV2m0dMr+l3+6pg8MECxhGwSgYBbQFAPZWdaANFuM8AAAAAElFTkSuQmCC';
        if(game.device.ie) imageData += '?' + Date.now();
        this.symbol = new game.Sprite(game.system.width / 2, game.system.height / 2 + 100, game.Texture.fromImage(imageData, true), {
            anchor: {x: 0.5, y: 0.5}
        });
        game.system.stage.addChild(this.symbol);
        var tween = new game.Tween(this.symbol).to({rotation: Math.PI*2}, 500).repeat();
        tween.start();
    },

    ready: function() {
        if(!game.device.mobile || !game.Loader.touchToStart) return this.setScene();

        this.text.visible = this.symbol.visible = false;

        var sprite = new game.Sprite(game.system.width/2, game.system.height/2, 'media/yleloader/badge.png', {
            anchor: {x:0.5, y:0.5},
            scale: {x:0, y:0}
        });
        game.system.stage.addChild(sprite);

        var button = new game.Sprite(sprite.width/2, sprite.height/2 + 200, 'media/yleloader/button.png', {
            anchor: {x:0.5, y:0.5},
            interactive: true,
            buttonMode: true,
            click: this.unlock.bind(this),
            rotation: -0.1
        });
        sprite.addChild(button);

        var tween;
        tween = new game.Tween(button).to({rotation: 0.1}, 1000).easing(game.Tween.Easing.Quadratic.InOut).repeat().yoyo();
        tween.start();

        tween = new game.Tween(sprite.scale).to({x:0.8, y:0.8}, 300).delay(300).easing(game.Tween.Easing.Back.Out);
        tween.start();

        tween = new game.Tween(this.logo.scale).to({x:0, y:0}, 300).easing(game.Tween.Easing.Back.In);
        tween.start();
    },

    unlock: function() {
        if(game.audio) {
            if(game.audio.context) {
                var buffer = game.audio.context.createBuffer(1, 1, 22050);
                var source = game.audio.context.createBufferSource();
                source.buffer = buffer;
                source.connect(game.audio.context.destination);
                if(source.start) source.start(0);
                else if(source.noteOn) source.noteOn(0);
            }
        }
        this.setScene();
    }
});

game.Loader.touchToStart = false;

});