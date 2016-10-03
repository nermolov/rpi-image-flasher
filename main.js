/*Created by nermolov for the #STEMLC*/

//import express/http and socket.io
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
//import libs for image flashing
var drivelist = require('drivelist');
var imageWrite = require('etcher-image-write');
var fs = require('fs');

//specify information for images
var avimages = {
    "raspbian": {
        "title": "Raspbian",
        "description": "The default and defacto operating system for Raspberry Pi.",
        "image": "test.jpg",
        "file": "raspbian.img"
    },
    "raspbian-lite": {
        "title": "Raspbian Lite",
        "description": "The cut down and slimmer version of Raspbian, no graphical interface, no unnecessary software.",
        "image": "test.jpg",
        "file": "raspbian-lite.img"
    },
    "noobs": {
        "title": "N.O.O.B.S.",
        "description": "The OS for beginners.",
        "image": "test.jpg",
        "file": "noobs.img"
    }
};

//set device
var sdcard = '/dev/sdb';

//open server port
server.listen(8080);
console.log('Listening on port 8080!');

//serve all static files in /assets
app.use(express.static('assets'));

//serve up main page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//establish socket communication
io.on('connection', function (socket) {
    //transmit image info
    socket.emit('imginfo', avimages);
    //listen for image flashing requests
    socket.on('startflash', function (data) {
        console.log(data);
        var imgfile = data;
        //MAIN FLASHING CODE START
        //list drives
        drivelist.list(function(error, disks) {
            if (error) throw error;
            //set glob/loc vars
            var sdisks = 0;
            var tdisk;
            //iterate through each found disk
            Array.prototype.forEach.call(disks, function(key){
                if(key.device == '/dev/sda') {
                    //if sd card was found write its info to a var
                    sdisks++;
                    tdisk = key;
                }
            });
            //if no sd card throw no sd
            if(sdisks !== 1) {
                console.log('no sd');
                socket.emit('msg', {type: 'error', msg: 'No SD Card detected'});
                return;
            }
            console.log(tdisk);
            //WRITE
            //open disk with read write settings
            var emitter = imageWrite.write({
                fd: fs.openSync(tdisk.device, 'rs+'),
                device: tdisk.device,
                size: tdisk.size
            }, {//open file with read permissions
                stream: fs.createReadStream('images/' + imgfile),
                size: fs.statSync('images/' + imgfile).size
            }, {
                check: false //disable file verification (slow in pi)
            });
             
            emitter.on('progress', function(state) {
                //console.log(state);
                socket.emit('progress', {percentage: state.percentage, eta: state.eta});
            });
             
            emitter.on('error', function(error) {
                console.error(error);
                socket.emit('msg', {type: 'error', msg: 'Write error, was the SD card disconnected?'});
            });
             
            emitter.on('done', function(results) {
                console.log('Success!');
                socket.emit('msg', {type: 'success', msg: 'done'});
            });
            //END
        });
    });
});