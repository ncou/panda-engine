game.module(
    'game.tilemap'
)
.require(
    'engine.core',
    'plugins.tiled'
)
.body(function() {

game.addAsset('desert.json');
game.addAsset('tmw_desert_spacing.png');

game.createScene('Main', {
    init: function() {
        this.tilemap = new game.TileMap('desert.json');
        this.tilemap.addTo(this.stage);
    },

    mousemove: function(event) {
        this.tilemap.container.position.x = Math.round(-event.global.x / 2);
        this.tilemap.container.position.y = Math.round(-event.global.y / 2);
    }
});

});
