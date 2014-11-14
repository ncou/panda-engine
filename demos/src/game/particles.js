game.module(
    'game.particles'
)
.require(
    'engine.core'
)
.body(function() {

game.addAsset('particle.png');

game.createScene('Main', {
    init: function() {
        this.container = new game.Container().addTo(this.stage);

        this.emitter = new game.Emitter();
        this.emitter.position.x = game.system.width / 2;
        this.emitter.position.y = game.system.height / 2;
        this.emitter.container = this.container;
        this.emitter.textures.push('particle.png');
        this.addEmitter(this.emitter);
    }
});

});
