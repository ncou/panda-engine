game.module(
    'game.main'
)
.body(function() {

game.createScene('Main', {
    init: function() {
        this.video = new game.Video('media/trailer.mp4');
        this.video.onLoaded(function() {
            this.position.x = game.system.width / 2 - this.width / 2;
            this.position.y = game.system.height / 2 - this.height / 2;
        });
        this.stage.addChild(this.video);
        if (!game.device.mobile) this.video.play();
    },

    click: function() {
        if (game.device.mobile) this.video.play();
    }
});

});
