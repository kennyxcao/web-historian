var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var querystring = require('querystring');
var helpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('Request Method: ' + req.method + ' Request URL:' + req.url);
  
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        if (err) {
          res.writeHead(404, helpers.headers);
          res.end();
        } else {
          res.writeHead(200, helpers.headers);
          res.end(data);
        }
      });
    } else {
      var filePath = archive.paths.archivedSites + req.url;
      //console.log(filePath);
      fs.readFile(filePath, function(err, data) {
        if (err) {
          res.writeHead(404, helpers.headers);
          res.end();
        } else {
          res.writeHead(200, helpers.headers);
          res.end(data);
        }      
      });
    }
  }

  if (req.method === 'POST') {
    var data = '';
    req.on('data', function (chunk) {
      data += chunk;
    });
    req.on('end', function () {
      var url = querystring.parse(data).url;
      
      archive.isUrlInList(url, function(exist) {
        if (!exist) {
          archive.addUrlToList(url + '\n', function(err) {
            if (!err) {
              res.writeHead(302, helpers.headers);
              res.end();
            } else {
              res.writeHead(500, helpers.headers);
              res.end();
            }
          });
        }
      });
    });
  }

  //res.end(archive.paths.list);
};
