var fs = require('fs');
var path = require('path');
var http = require('http');
var _ = require('underscore');
var Promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    callback(err, data ? data.toString().split('\n') : null);
  });
};

exports.readListOfUrlsAsync = Promise.promisify(exports.readListOfUrls);


exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(err, array) {
    callback(array.includes(url));
  });
};

exports.isUrlInListAsync = function(url) {
  return exports.readListOfUrlsAsync().then(function(list) {
    return list.includes(url);
  });
};


exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url, function(err) {
    if (!err) {
      callback(err);
    }
  });
};

exports.addUrlToListAsync = Promise.promisify(exports.addUrlToList);


exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, fs.constants.F_OK, function(err) {
    if (err) {
      err['message'] = url;                                                               
    }
    callback(err, !err); 
  });
};

exports.isUrlArchivedAsync = Promise.promisify(exports.isUrlArchived);

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    http.get('http://' + url, function(response) {      
      var path = exports.paths.archivedSites + '/' + url;
      var newFile = fs.createWriteStream(path);
      response.pipe(newFile);
    });
  });  
};

// Callback Solution
// exports.readListOfUrls = function(callback) {
//   fs.readFile(exports.paths.list, function(err, data) {
//     if (!err) {
//       callback(data.toString().split('\n'));
//     }
//   });
// };

// exports.isUrlInList = function(url, callback) {
//   exports.readListOfUrls(function(array) {
//     callback(array.includes(url));
//   });
// };

// exports.addUrlToList = function(url, callback) {
//   fs.appendFile(exports.paths.list, url, function(err) {
//     if (!err) {
//       callback(err);
//     }
//   });
// };

// exports.isUrlArchived = function(url, callback) {
//   fs.access(exports.paths.archivedSites + '/' + url, fs.constants.F_OK, function(err) {
//     callback(!err); 
//   });
// };

// exports.downloadUrls = function(urls) {
//   urls.forEach(function(url) {
//     http.get('http://' + url, function(response) {      
//       var path = exports.paths.archivedSites + '/' + url;
//       var newFile = fs.createWriteStream(path);
//       response.pipe(newFile);
//     });
//   });  
// };





