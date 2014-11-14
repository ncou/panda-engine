game.module(
    'plugins.tiled'
)
.body(function() {
    
game.createClass('TileMap', {
    layers: {},
    tiles: [],
    tileWidth: 0,
    tileHeight: 0,

    init: function(url) {
        this.json = game.getJSON(url);
        if (!this.json) throw 'Tilemap JSON not found';

        this.tileWidth = this.json.tilewidth;
        this.tileHeight = this.json.tileheight;

        this.container = new game.Container();

        this._initTiles();
        this._initLayers();

        if (game.TileMap.cacheAsBitmap) this.container.cacheAsBitmap = true;
    },

    _initTiles: function() {
        for (var i = 0; i < this.json.tilesets.length; i++) {
            var tileset = this.json.tilesets[i];
            
            var path = game.config.mediaFolder ? game.config.mediaFolder + '/' + tileset.image : tileset.image;

            var tilesInRow = Math.floor(tileset.imagewidth / tileset.tilewidth);
            var tilesInCol = Math.floor(tileset.imageheight / tileset.tileheight);
            var tileCount = tilesInRow * tilesInCol;

            for (var index = 0; index < tileCount; index++) {
                var currentRow = Math.floor(index / tilesInRow);
                var currentCol = Math.floor(index % tilesInRow);

                var x = tileset.tilewidth * Math.floor(index % tilesInRow);
                x += tileset.margin;
                x += tileset.spacing * currentCol;

                var y = tileset.tileheight * Math.floor(index / tilesInRow);
                y += tileset.margin;
                y += tileset.spacing * currentRow;

                var texture = new game.Texture(game.TextureCache[path], new game.PIXI.Rectangle(x, y, tileset.tilewidth, tileset.tileheight));
                
                this.tiles[index] = texture;
            }
        }
    },

    _initLayers: function() {
        for (var i = 0; i < this.json.layers.length; i++) {
            var layer = this.json.layers[i];
            var container = new game.Container();

            for (var o = 0; o < layer.data.length; o++) {
                if (layer.data[o] === 0) continue;

                var tile = this.getTile(layer.data[o]);
                var x = this.tileWidth * (o % layer.width);
                var y = this.tileHeight * Math.floor(o / layer.height);
                tile.position.x = x;
                tile.position.y = y;
                tile.addTo(container);
            }

            container.position.set(layer.x, layer.y);
            container.alpha = layer.opacity;
            container.visible = layer.visible;
            if (game.TileMap.cacheLayersAsBitmap) container.cacheAsBitmap = true;
            container.addTo(this.container);

            this.layers[layer.name] = container;
        }
    },

    getTile: function(index) {
        return new game.Sprite(this.tiles[index - 1]);
    },

    addTo: function(container) {
        this.container.addTo(container);
    },

    remove: function() {
        if (this.container.parent) this.container.parent.removeChild(this.container);
    }
});

game.TileMap.cacheLayersAsBitmap = false;
game.TileMap.cacheAsBitmap = false;

});
