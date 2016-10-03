//connect to socket
var socket = io(window.location.href);
//register global variable
var imgdata = {};

//receive image info
socket.on('imginfo', function (data) {
    imgdata = data;
    console.log(data);
    dispimgs();
});

//time pretty print function
function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

//percentage truncate function
Number.prototype.toFixedDown = function(digits) {
  var n = this - Math.pow(10, -digits)/2;
  n += n / Math.pow(2, 53); // added 1360765523: 17.56.toFixedDown(2) === "17.56"
  return n.toFixed(digits);
}

//display write progress
socket.on('progress', function(data) {
    //set progress bar
    document.getElementById('progbar').setAttribute('style', 'width: ' + data.percentage + '%');
    document.getElementById('progtext').innerHTML = data.percentage.toFixedDown(2);
    //set eta
    document.getElementById('eta').innerHTML = fmtMSS(data.eta);
});

//display messages
socket.on('msg', function(data) {
    if (data.type == 'error') {
        swal("Write Stopped", data.msg, "error");
    }
    if (data.type == 'success') {
        swal("Write Finished", "Write succesfully completed, you can now remove your SD Card", "success");
    }
    dispimgs();
});

//display imgdata
function dispimgs() {
    //check if var is empty
    if (imgdata == {}) {
        console.error('imgdata is empty');
        return;
    }
    //initate empty variable
    var mbuild = '';
    //iterate through each key in data
    for (var key in imgdata) {
        // skip loop if the property is from prototype
        if (!imgdata.hasOwnProperty(key)) continue;
        //create html for each image
        mbuild += '<div class="col s12 m4 l4"><div class="card"><div class="card-content"><span class="card-title">' + imgdata[key].title + '</span><p>' + imgdata[key].description + '</p></div><div class="card-action"><a href="#" onclick="imgsel(\'' + key + '\');" id="butin" class="indigo-text">Use it</a></div></div></div>';
    }
    //set html of mrow from mbuild
    document.getElementById('mrow').innerHTML = mbuild;
}

//show selected image dialog
function imgsel(imgid) {
    document.getElementById('mrow').innerHTML = '<div class="col s12 m12 l12"><div class="card"><div class="card-content"><span class="card-title" id="ctitle">Please insert your SD or microSD card into the reader</span><p id="ctext">Image Selected: <i>' + imgdata[imgid].title + '</i><br />NOTE: You cannot image two cards simultaneously, attempting to do so will corrupt the image.</p></div><div id="caction" class="card-action"><a href="#" onclick="fwrite(\'' + imgdata[imgid].file + '\');" id="butin" class="indigo-text">Flash it!</a></div></div></div>';
}

//function that calls on image flash
function fwrite(imgid) {
    //write confirm box
    swal({
        //confirm settings
		title: "Are you sure?",
		text: "All data will be erased from the SD Card!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: 'Write Image',
		cancelButtonText: "Cancel",
		closeOnConfirm: true,
		closeOnCancel: false
	},
	function(isConfirm){
        //check if user confirmed write
        if (isConfirm){
            console.log(imgid);
            //send message to server to start flashing
            socket.emit('startflash', imgid);
            //display progress bar
            document.getElementById('ctitle').innerHTML = 'Writing...';
            document.getElementById('ctext').innerHTML = '<span id="progtext">0</span>% | ETA: <span id="eta"></span><br /><div class="progress"><div class="determinate" id="progbar" style="width: 0%"></div></div>';
            document.getElementById('caction').innerHTML = '';
        } else {
            //if not confirmed cancel process, call dispimgs();
            swal({title: "Cancelled",text: "Write cancelled.",timer: 2000,showConfirmButton: false, type: "error"});
            //display main screen
            dispimgs();
        }
	});
}