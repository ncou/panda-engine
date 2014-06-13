var github = require('github-basic');
var fs = require('fs');
var categories = ['Config', 'Core', 'Debug', 'Loader', 'Particle', 'Sprite', 'System', 'Tween', 'Other'];

var categoryData = {};
for (var i = 0; i < categories.length; i++) {
    categoryData[categories[i]] = [];
}

var perpage = 30;
var pages = 0;
var currentPage = 1;
var totalGistData = '';

var writeFile = function(filename, data) {
    fs.writeFile(filename, data, function (err) {
        if(err) console.log('Error writing ' + filename);
    });
};

var getGists = function() {
    github.json('GET', '/users/:user/gists?page='+currentPage+'&per_page='+perpage, {user: 'ekelokorpi'}, function (err, res) {
        if(err) return console.log('Error');
        
        var gists = res.body;
        var gistFile;
        var category;
        var description;
        var last;
        var temp;
        var i;
        for (i = 0; i < gists.length; i++) {
            if(!gists[i].description) continue;

            temp = gists[i].description.split(' ');

            category = temp[0];
            last = category.substr(category.length - 1); // get last character
            category = category.substr(0, category.length - 1); // remove last character

            if(last === ':') {
                if(categories.indexOf(category) === -1) category = 'Other';
                temp.shift();
                description = temp.join(' ');
            } else {
                category = 'Other';
                description = gists[i].description;
            }

            categoryData[category].push([gists[i].id, description]);

            gistFile = '---\nlayout: default\ntitle: Code snippet\nheader: ' + (category + ' - ' + description) + '\n---\n<script src="' + gists[i].html_url + '.js"></script>';

            writeFile('snippets/' + gists[i].id + '.html', gistFile);
        }

        currentPage++;
        if(currentPage > pages) {
            for(var name in categoryData) {
                if(categoryData[name].length === 0) continue;

                totalGistData += '<h6>' + name + '</h6>\n<div class="box float"><ul>';
                for (i = 0; i < categoryData[name].length; i++) {
                    totalGistData += '<li><a href="/snippets/' + categoryData[name][i][0] + '.html">' + categoryData[name][i][1] + '</a></li>\n';
                }
                totalGistData += '</ul><div class="clear"></div></div>\n';
            }
            
            writeFile('_includes/snippets.html', totalGistData);
        } else getGists();
    });
};

console.log('Getting gists...');
github.json('GET', '/users/:user', {user: 'ekelokorpi'}, function(err, res) {
    if(err) return console.log('Error');

    var gistCount = res.body.public_gists;
    console.log(gistCount + ' gists found.');
    pages = Math.ceil(gistCount / perpage);

    console.log('Writing gists...');
    getGists();
});