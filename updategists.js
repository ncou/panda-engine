var github = require('github-basic');
var fs = require('fs');

console.log('Getting gists...');

github.json('GET', '/users/:user/gists', {user: 'ekelokorpi'}, function (err, res) {
    if(err) return console.log('Error getting gists');
    
    var gists = res.body;
    var data = '';
    var gistFile;
    for (var i = 0; i < gists.length; i++) {
        if(!gists[i].description) continue;

        data += '<a href="/snippets/' + gists[i].id + '.html" class="box">' + gists[i].description + '</a>\n';

        gistFile = '---\nlayout: default\ntitle: Code snippet\nheader: ' + gists[i].description + '\n---\n<script src="' + gists[i].html_url + '.js"></script>';

        writeFile('snippets/' + gists[i].id + '.html', gistFile);
    }

    writeFile('_includes/snippets.html', data);
});

var writeFile = function(filename, data) {
    console.log('Writing ' + filename);

    fs.writeFile(filename, data, function (err) {
        if(err) console.log('Error writing ' + filename);
    });
};