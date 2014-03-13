game.module(
    'plugins.clay'
)
.body(function() {

game.Clay = game.Class.extend({
    ready: false,

    init: function() {
        game.clay = this;

        window.Clay = window.Clay || {};
        Clay.gameKey = game.config.clayKey;
        Clay.options = {
            debug: !!game.config.clayDebug,
            hideUI: !!game.config.clayHideUI,
            fail: function() {
                console.log('Error connecting to Clay.io');
            }
        };
        Clay.readyFunctions = [this.connected.bind(this)];

        ( function() {
            var clay = document.createElement('script'); clay.async = true;
            clay.src = ( 'https:' === document.location.protocol ? 'https://' : 'http://' ) + 'clay.io/api/api.js';
            var tag = document.getElementsByTagName('script')[0]; tag.parentNode.insertBefore(clay, tag);
        } )();
    },

    connected: function() {
        this.ready = true;
    }
});

game.plugins.clay = game.Clay;

});