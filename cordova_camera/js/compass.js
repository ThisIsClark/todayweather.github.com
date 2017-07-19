function onSuccess(heading) {
    var element = document.getElementById('heading');
    element.innerHTML = 'Heading: ' + heading.magneticHeading;
};

function onError(compassError) {
    alert('Compass error: ' + compassError.code);
};

var options = {
    frequency: 3000
}; // Update every 3 seconds

function onPhoneDataSuccess(imageData) {
	alert("Pic got");
}

function onFail(message) {
	alert("error : " + message);
}

//navigator.compass.getCurrentHeading(onSuccess, onError);                
//document.addEventListener("deviceready", onDeviceReady, false);
document.getElementById("LaunchCamera").addEventListener("click", launchCamera);
function launchCamera() {
	//var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
	navigator.camera.getPicture(onPhoneDataSuccess, onFail, {
		quality: 50,  
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA
    });
}