var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var querystring = require('querystring');
var helpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(res, statusCode, path) {
  res.writeHead(statusCode, helpers.headers);
  var fileStream = fs.createReadStream(path);
  fileStream.pipe(res); 
};

exports.handleRequest = function (req, res) {
  console.log('Request Method: ' + req.method + ' Request URL:' + req.url);
  
  if (req.method === 'GET') {
    var filePath = req.url === '/' ? archive.paths.siteAssets + '/index.html' : archive.paths.archivedSites + req.url;
    fs.readFile(filePath, function(err, data) {
      res.writeHead(err ? 404 : 200, helpers.headers);
      res.end(data);
    });
  }
  // Working promise solution
  if (req.method === 'POST') {
    var data = '';
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      var url = querystring.parse(data).url;
      
      archive.isUrlArchivedAsync(url)
      .then(function() {
        sendResponse(res, 302, archive.paths.archivedSites + '/' + url);  
      })
      .catch(function(err) {
        sendResponse(res, 500, archive.paths.siteAssets + '/loading.html');
        return archive.isUrlInListAsync(url);
      })
      .then(function(exist) {
        if (!exist) {
          archive.addUrlToListAsync(url + '\n');
        }
      });
    });
  }
};

// Working callback solution
// exports.handleRequest = function (req, res) {
//   console.log('Request Method: ' + req.method + ' Request URL:' + req.url);
  
//   if (req.method === 'GET') {
//     var filePath = req.url === '/' ? archive.paths.siteAssets + '/index.html' : archive.paths.archivedSites + req.url;

//     fs.readFile(filePath, function(err, data) {
//       res.writeHead(err ? 404 : 200, helpers.headers);
//       res.end(data);
//     });
//   }

//   if (req.method === 'POST') {
//     var data = '';
//     req.on('data', function (chunk) {
//       data += chunk;
//     });
//     req.on('end', function () {
//       var url = querystring.parse(data).url;
      
//       archive.isUrlInList(url, function(exist) {
//         if (!exist) {
//           archive.addUrlToList(url + '\n', function(err) {
//             res.writeHead(err ? 500 : 302, helpers.headers);
//             var fileStream = fs.createReadStream(archive.paths.siteAssets + '/loading.html');
//             fileStream.pipe(res); 
//           });
//         } else {
//           archive.isUrlArchived(url, function(exist) {
//             res.writeHead(exist ? 302 : 500, helpers.headers);            
//             var redirect = exist ? archive.paths.archivedSites + '/' + url : archive.paths.siteAssets + '/loading.html';
//             var fileStream = fs.createReadStream(redirect);
//             fileStream.pipe(res);
//           });
//         }
//       });
//     });
//   }
// };