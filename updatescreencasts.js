var Youtube = require('youtube-api');
var fs = require('fs');

var playlistItems = [];
var fileData = '';

Youtube.authenticate({
    type: 'key',
    key: 'AIzaSyBLHO4xOmxMb9XdyUTgr7Zam7nFqWIkiCs'
});

var writeFiles = function() {
    var data = playlistItems.shift();
    if(!data) {
        // All done!

        fs.writeFile('_includes/screencasts.html', fileData, function (err) {
            if(err) console.log('Error writing file');
            // else console.log('Screencasts updated.');
        });

        return;
    }

    var filename = data.fileId + '.html';

    // var header = data.snippet.title.split(' - ')[1];
    var header = data.snippet.title.replace('Panda.js screencast ', '');
    var content = '---\nlayout: default\ntitle: Screencast\nheader: '+ header +'\n---\n';

    content += '<iframe width="920" height="690" src="//www.youtube.com/embed/'+data.snippet.resourceId.videoId+'" frameborder="0" allowfullscreen></iframe>';

    fs.writeFile('screencasts/' + filename, content, function (err) {
        if(err) console.log('Error writing file');
        else writeFiles();
    });
};

var getItems = function(pageToken) {
    var params = {
        playlistId: 'PLknoUyBGDcVR-_tMrbdqJVSmnekwx0o_1',
        part: 'snippet'
    };
    if(pageToken) params.pageToken = pageToken;

    Youtube.playlistItems.list(params, function(err, data) {
        if(err) return console.log(err);

        // console.log(data);
        
        for (var i = 0; i < data.items.length; i++) {
            playlistItems.push(data.items[i]);
        }

        // Next page found
        if(data.nextPageToken) {
            getItems(data.nextPageToken);
        } else {
            // All found
            // fileData = '<ul>\n';
            fileData = '';
            for (var i = 0; i < playlistItems.length; i++) {
                playlistItems[i].fileId = i + 1;

                fileData += '<p><a href="/screencasts/'+playlistItems[i].fileId+'.html">' + playlistItems[i].snippet.title.replace('Panda.js screencast ', '') + '</a></p>\n';
            }
            // fileData += '</ul>\n';

            console.log(playlistItems.length + ' screencasts found.');
            console.log('Writing screencasts...');
            writeFiles();
        }
    });
}

console.log('Getting screencasts...');
getItems();