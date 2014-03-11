game.module(
    'plugins.math'
)
.body(function() {
    
game.Math = {
    _seed: Date.now(),
    
    /**
        Distance between two points.
        @method Math.distance
        @param {Number} x
        @param {Number} y
        @param {Number} x2
        @param {Number} y2
        @return {Number}
    **/
    distance: function(x, y, x2, y2) {
        x = x2 - x;
        y = y2 - y;
        return Math.sqrt(x * x + y * y);
    },

    /**
        Generate random number between `min` and `max`.
        @method Math.random
        @param {Number} min
        @param {Number} max
        @param {Boolean} [seeded]
        @param {Boolean} [integer]
        @return {Number}
    **/
    random: function(min, max, seeded, integer) {
        var rnd = seeded ? core.Math._seededRandom() : Math.random();
        return integer ? Math.floor(rnd * (max - min + 1) + min) : rnd * (max - min) + min;
    },

    /**
        Generate random integer between `min` and `max`.
        @method Math.randomInt
        @param {Number} min
        @param {Number} max
        @param {Boolean} [seeded]
        @return {Number}
    **/
    randomInt: function(min, max, seeded) {
        return core.Math.random(min, max, seeded, true);
    },

    /**
        Seed the random number generator.
        @method Math.randomSeed
        @param {Number} seed
        @return {Number}
    **/
    randomSeed: function(seed) {
        if(seed !== undefined) core.Math._seed = seed;
        return core.Math._seed;
    },
    
    _seededRandom: function() {
        core.Math._seed = (core.Math._seed * 9301 + 49297) % 233280;
        return core.Math._seed / 233280;
    }
};

});