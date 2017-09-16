// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
// * * * * * /Users/student/.nvm/versions/node/v6.9.5/bin/node /Users/student/code/hrsf82-web-historian/workers/htmlfetcher.js
var archive = require('../helpers/archive-helpers');
var cron = require('node-cron');

cron.schedule('* * * * *', function() {
  archive.readListOfUrls(function(urls) {
    var fetchURLs = [];
    
    for (let i = 0; i < urls.length; i++) {
      var downloadURL = function(exist) {
        if (!exist) {
          fetchURLs.push(urls[i]);
        }
        if (i === urls.length - 1) {
          archive.downloadUrls(fetchURLs);
        }
      };        
      archive.isUrlArchived(urls[i], downloadURL, i);
    }
  });
});