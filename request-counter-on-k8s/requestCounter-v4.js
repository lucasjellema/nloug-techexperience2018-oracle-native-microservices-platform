//respond to HTTP requests with response: count of number of requests
// invoke from browser or using curl:  curl http://127.0.0.1:PORT
var os = require("os");
var hostname = os.hostname();

var http = require('http'),
    url = require('url'),
    qs = require('querystring');
var requestCounter = 0;
var version = "v2";

var PORT = process.env.APP_PORT || 3000;
var PORT = process.env.APP_PORT || 3000;
var REDIS_HOST = process.env.REDIS_HOST || 'redis-master';
var REDIS_PORT = process.env.REDIS_PORT || 6379;
var dead = false;
var redisKeyRequestCounter = "requestCounter";


var server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url, true),
        urlParams = urlParts.query,
        urlPathname = urlParts.pathname,
        body = '',
        reqInfo = {};

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        reqInfo.urlPathname = urlPathname; //sample value: /api/employee
        reqInfo.urlParams = urlParams; //sample value: {"id": "12345","name": "Kay"}
        reqInfo.body = qs.parse(body); //sample value: {"firstname": "Clarkson","lastname": "Nick"}
        reqInfo.urlParts = urlParts;

        console.log(reqInfo);
        if ("/ready" == urlPathname) {
            ready(req, res)
        } else {
            if ("/health" == urlPathname) {
                health(req, res)
            } else if ("/kill" == urlPathname) {
                kill(req, res)
            } else {
                root(req, res)
            }
        };

    });
})
server.listen(PORT, function () {
    console.log('Server running, version ' + version + ', Express is listening... at ' + PORT + " for Request Counter calls");
});

console.log('server running on port ' + PORT);


function ready(req, res) {
    if (!dead) {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end('{"message":"Alive and kicking"}');
    } else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end('{"message":"Dead as a dodo!"}');
    }
}


function health(req, res) {
    if (!dead) {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end('{"message":"Alive and kicking"}');
    } else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end('{"message":"Dead as a dodo!"}');
    }
}



function kill(req, res) {
    if (!dead) {
        dead = true
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end('{"message":"Killed the request counter at host "+hostname}');
    } else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end('{"message":"Was already dead: request counter at host "+hostname}');
    }
}

function root(req, res) {
    if (!dead) {
        increment(redisKeyRequestCounter, function (err, newValue) {
            if (err) {
                res.writeHead(500, { 'Content-type': 'application/json' });
                var rc = {
                    'Request Count': 'ERROR: ' + err,
                    'Response from Version Request Count': version,
                    'Response from Host': hostname
                }
                res.end(JSON.stringify(rc));
            } else {
                res.writeHead(200, { 'Content-type': 'application/json' });
                var rc = {
                    'Request Count': newValue,
                    'Response from Version Request Count': version,
                    'Response from Host': hostname
                }
                res.end(JSON.stringify(rc));
            }
        })

    } else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end('{"message":"Dead as a dodo!"}');
    }
}

