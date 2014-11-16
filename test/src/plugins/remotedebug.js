game.module(
    'plugins.remotedebug'
)
.body(function() {
    
game.RemoteDebug = game.Class.extend({
    connection: null,
    messages: [],

    init: function() {
        if(game.RemoteDebug.enabled && game.RemoteDebug.address && window.WebSocket) {
            this.connection = new WebSocket(game.RemoteDebug.address);
            this.connection.onopen = this.open.bind(this);

            console.log = this.log.bind(this);
        }
    },

    open: function() {
        this.send();
    },

    log: function() {
        this.messages.push(Array.prototype.slice.call(arguments));
        this.send();
    },

    send: function() {
        if(this.connection.readyState !== this.connection.OPEN) return;
        if(this.messages.length === 0) return;

        var msg = this.messages.shift();
        this.connection.send(msg);
        this.send();
    }
});

game.RemoteDebug.enabled = false;
game.RemoteDebug.address = '';

game.plugins.remotedebug = game.RemoteDebug;

});