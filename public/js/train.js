let error = document.getElementById('error');
let video = document.querySelector('video');
let snap = document.getElementById('snapshot');
let counter = document.getElementById('count');
let directions = document.getElementById('directions');
let buttons = document.getElementById('buttons');

snap.addEventListener('click', add_frame);

let data = new FormData();
let count = 7;

function getUserMedia() {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(mediaStream => {
			document.querySelector('video').srcObject = mediaStream;
			const track = mediaStream.getVideoTracks()[0];
			window.stream = track;
			if (window.stream.enabled) {
				snap.classList.remove("onclick");
				snap.addEventListener('click', add_frame);
			};
		})
		.catch(error => console.log(error));
}

function success(responseURL) {
	document.getElementById('status').innerHTML = 'Training complete.';
	snap.remove();
	error.innerHTML = 'All done.';
	error.style.opacity = '1';
	error.style.color = '#6EC867';
	snap.classList.remove("onclick");
	snap.classList.add("validate");
	setTimeout(() => {
		//snap.classList.remove("validate");
		window.location.replace(responseURL);
	}, 1000);
}

function added() {
	error.innerHTML = 'Adding frame.';
	error.style.opacity = '1';
	error.style.color = '#6EC867';
	//snap.classList.add("validate");
	counter.innerHTML = count;
	setTimeout(() => {
		error.style.opacity = '0';
		error.style.color = '';
		error.innerHTML = 'No errors';
		snap.classList.remove("onclick");
		//snap.classList.remove("validate");
		if (count === 3) {
			directions.innerHTML = 'Try slightly different angles too.';
		}
		if (count === 0) {
			document.getElementById('counter').innerHTML = '';
			directions.innerHTML = 'Ready to train.';
			snap.remove();
			let button_snippet = document.createRange().createContextualFragment(`<button type="button" class='button' id="train"></button>`);
			buttons.appendChild(button_snippet);
			snap = document.getElementById('train');
			snap.addEventListener('click', send);
		} else {
			snap.addEventListener('click', add_frame);
		}

	}, 1000);
}

function failed(err) {
	error.style.opacity = '1';
	snap.classList.remove("onclick");
	error.innerHTML = err;
}

function add_frame() {
	snap.removeEventListener('click', add_frame);
	snap.classList.add("onclick");
	count -= 1;
	let frame = captureVideoFrame('video', 'png');
	data.append('frame', frame.blob, 'face.png');
	console.log('Added frame.');
	added();
}

function send() {
	snap.removeEventListener('click', send);
	snap.classList.add("onclick");
	let http = new XMLHttpRequest();
	http.addEventListener("load", res_listen);
	http.open('POST', '/train', true);
	http.send(data);

	directions.remove();
	let loading = document.createRange().createContextualFragment('<p class="loading" id="status">Training<span>.</span><span>.</span><span>.</span></p>');
	loading = document.getElementById('intro').appendChild(loading);
}

function res_listen() {
	//console.log(this.response);
	success(this.responseURL);
}

snap.classList.add("onclick");
getUserMedia();
