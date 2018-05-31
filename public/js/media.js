/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

let errorElement = document.getElementById('error');
let video = document.querySelector('video');
let canvas = document.getElementById('canvas');
let photo = document.getElementById('photo');

var width = 320; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
	audio: false,
	video: true
};

function handleSuccess(stream) {
	var videoTracks = stream.getVideoTracks();
	console.log('Got stream with constraints:', constraints);
	console.log('Using video device: ' + videoTracks[0].label);
	stream.oninactive = function() {
		console.log('Stream inactive');
	};
	window.stream = stream; // make variable available to browser console
	video.srcObject = stream;
}

function handleError(error) {
	if (error.name === 'ConstraintNotSatisfiedError') {
		errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
			constraints.video.width.exact + ' px is not supported by your device.');
	} else if (error.name === 'PermissionDeniedError') {
		errorMsg('Permissions have not been granted to use your camera and ' +
			'microphone, you need to allow the page access to your devices in ' +
			'order for the demo to work.');
	}
	errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
	errorElement.innerHTML += '<p>' + msg + '</p>';
	if (typeof error !== 'undefined') {
		console.error(error);
	}
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);

function clearphoto() {
	var context = canvas.getContext('2d');
	context.fillStyle = "#AAA";
	context.fillRect(0, 0, canvas.width, canvas.height);

	var data = canvas.toDataURL('image/png');
	photo.setAttribute('src', data);
}

function get_frame() {
	var context = canvas.getContext('2d');
	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);

		return canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
	} else {
		clearphoto();
	}
}

function send() {
	console.log('Sending.');

	let http = new XMLHttpRequest();
	http.overrideMimeType('application/json');
	http.addEventListener("load", res_listen);
	http.open('POST', `/login`, true);
	http.setRequestHeader('Content-Type', 'application/json');
	http.send(get_frame());

}

function res_listen() {
	console.log(this);
}