game.module(
    'plugins.worker'
)
.body(function() {
    
game.Worker = game.Class.extend({
    worker: null,

    init: function(file) {
        if(!window.Worker) throw('Web Worker not supported');

        this.worker = new Worker(file);
    },

    onMessage: function(callback) {
        this.worker.onmessage = callback;
        return this;
    },

    send: function(data) {
        this.worker.postMessage(data);
    },

    stop: function() {
        this.worker.terminate();
    }
});

});