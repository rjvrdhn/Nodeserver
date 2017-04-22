/**
 * Created by Raj on 3/2/2017.
 */

var http = require('http');
var fs = require('fs');
var ping = require('ping');
var express = require('express'),
    path = require('path'),
    app = express();

var devicejson = require('./server/devices.json');

//var testlog = require('./server/logfile.txt');

var bodyParser = require('body-parser');

app.use(express.static(path.normalize(__dirname + '/')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing       application/x-www-form-urlencoded


var engines = require('consolidate');

app.set('public', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.redirect('index.html');
});

app.get('/DevicesConfigured', function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(devicejson));
    res.end();
});

app.post('/addDevice', function (req, res) {

    var iError = 0;
    var strError = "";

    console.log("Add device:" + req.body.ipAddress);

    ping.promise.probe(req.body.ipAddress, {
        timeout: 10,
        extra: ["-i 2"],
    }).then(function (pRes) {
        console.log(pRes);
    });

    devicejson.push(req.body);
    json = JSON.stringify(devicejson); //convert it back to json
    fs.writeFile('./server/devices.json', json, 'utf8', function (err) {
        if (err) throw err;
    }); // write it back 
    res.send({ "deviceAdded": 1 }); 
});

app.post('/deleteDevice', function (req, res) {
    var index = -1;
    var comArr = eval(devicejson);
    for (var i = 0; i < comArr.length; i++) {
        if (comArr[i].ipAddress === req.body.ipAddress) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        console.log("Something gone wrong");
    } else {
        devicejson.splice(index, 1);
        json = JSON.stringify(devicejson); //convert it back to json
        fs.writeFile('./server/devices.json', json, 'utf8', function (err) {
            if (err) throw err;
        }); // write it back 
    }  

    res.send("success"); 
});

app.post('/measure', function (req, res) {
    
    console.log("Measure post request:" + JSON.stringify(req.body));

    fs.writeFile('./server/mesuredata.txt', JSON.stringify(req.body), 'utf8', function (err) {
        if (err) throw err;        
    });
    
    res.send("success");
});



http.createServer(app).listen(8888);
console.log("Server started running..");
