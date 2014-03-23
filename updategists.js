var github = require('github-basic');
var fs = require('fs');
var categories = ['Sprite', 'Config', 'Core', 'Debug', 'Other'];

var categoryData = {};
for (var i = 0; i < categories.length; i++) {
    categoryData[categories[i]] = [];
}

console.log('Getting gists...');

github.json('GET', '/users/:user/gists', {user: 'ekelokorpi'}, function (err, res) {
    if(err) return console.log('Error getting gists');
    
    var gists = res.body;
    var data = '';
    var gistFile;
    var category;
    var description;
    var last;
    var temp;
    for (var i = 0; i < gists.length; i++) {
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

    for(var name in categoryData) {
        if(categoryData[name].length == 0) continue;
        
        data += '<h6>' + name + '</h6>';
        for (var i = 0; i < categoryData[name].length; i++) {
            data += '<a href="/snippets/' + categoryData[name][i][0] + '.html" class="box">' + categoryData[name][i][1] + '</a>\n';
        }
    }

    writeFile('_includes/snippets.html', data);
});

var writeFile = function(filename, data) {
    console.log('Writing ' + filename);

    fs.writeFile(filename, data, function (err) {
        if(err) console.log('Error writing ' + filename);
    });
};