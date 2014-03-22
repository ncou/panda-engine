var github = require('github-basic');
var fs = require('fs');

github.json('GET', '/users/:user/gists', {user: 'ekelokorpi'}, function (err, res) {
    if(err) throw('Error getting gists');
    
    var gists = res.body;
    var data = '';
    var gistFile;
    for (var i = 0; i < gists.length; i++) {
        if(!gists[i].description) continue;

        data += '<p><a href="/snippets/' + gists[i].id + '.html" class="box">' + gists[i].description + '</a></p>\n';

        gistFile = '---\nlayout: default\ntitle: Code snippet\nheader: ' + gists[i].description + '\n---\n<script src="' + gists[i].html_url + '.js"></script>';

        fs.writeFile('snippets/' + gists[i].id + '.html', gistFile, function (err) {
            if(err) throw('Error writing gist file');
            console.log('Gist html created.');
        });
    }
    fs.writeFile('_includes/snippets.html', data, function (err) {
        if(err) throw('Error writing snippets file');
        console.log('Gists updated.');
    });
});