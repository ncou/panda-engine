var github = require('github-basic');
var fs = require('fs');
var categories = [];

var perpage = 30;
var pages = 0;
var currentPage = 1;
var totalGistData = '';
var categoryData = {};

var writeFile = function(filename, data) {
    fs.writeFile(filename, data, function (err) {
        if(err) console.log('Error writing ' + filename);
    });
};

var ksort = function(obj) {
    if (!obj || typeof obj !== 'object') return false;

    var keys = [], result = {}, i;
    for (i in obj) {
        keys.push(i);
    }
    
    keys.sort();

    // Put 'Basic usage' to first
    var basicUsageIndex = keys.indexOf('Basic usage');
    if (basicUsageIndex !== -1) {
        var basicUsage = keys[basicUsageIndex];
        keys.splice(basicUsageIndex, 1);
        keys.unshift(basicUsage);
    }

    for (i = 0; i < keys.length; i++) {
        result[keys[i]] = obj[keys[i]];
    }

    return result;
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

            if (last === ':') {
                // New category found
                if (categories.indexOf(category) === -1) {
                    categories.push(category);
                    categoryData[category] = {};
                }
                temp.shift();
                description = temp.join(' ');
            } else {
                // No valid gist
                continue;
            }

            categoryData[category][description] = gists[i].id;

            gistFile = '---\nlayout: default\ntitle: CHEATSHEET\nheader: ' + (category + ' - ' + description) + '\n---\n<script src="' + gists[i].html_url + '.js"></script>';

            writeFile('snippets/' + gists[i].id + '.html', gistFile);
        }

        currentPage++;
        if (currentPage > pages) {
            // Last page
            categories.sort();
            console.log(categories.length + ' categories found.');
            for (var c = 0; c < categories.length; c++) {
                var name = categories[c];
                
                categoryData[name] = ksort(categoryData[name]);

                totalGistData += '<h6>' + name + '</h6>\n<div class="box float"><ul>';
                for (var key in categoryData[name]) {
                    totalGistData += '<li><a href="/snippets/' + categoryData[name][key] + '.html">' + key + '</a></li>\n';
                }
                totalGistData += '</ul><div class="clear"></div></div>\n';
            }
            
            writeFile('_includes/snippets.html', totalGistData);
        } else getGists();
    });
};

console.log('Getting gists...');
github.json('GET', '/users/:user', { user: 'ekelokorpi' }, function(err, res) {
    if (err) return console.log('Error: ' + err);

    var gistCount = res.body.public_gists;
    console.log(gistCount + ' gists found.');
    pages = Math.ceil(gistCount / perpage);

    console.log('Writing gists...');
    getGists();
});
