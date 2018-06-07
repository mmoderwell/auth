let error = document.getElementById('error');
let video = document.querySelector('video');
let snap = document.getElementById('snapshot');
let counter = document.getElementById('count');

snap.addEventListener('click', add_frame);

let data = new FormData();
let count = 2;

function getUserMedia() {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(mediaStream => {
			document.querySelector('video').srcObject = mediaStream;
			const track = mediaStream.getVideoTracks()[0];
			window.stream = track;
		})
		.catch(error => console.log(error));
}

function success() {
	error.innerHTML = 'You\'re in.';
	error.style.opacity = '1';
	error.style.color = '#6EC867';
	snap.classList.remove("onclick");
	snap.classList.add("validate");
	setTimeout(() => {
		error.style.opacity = '0';
		error.innerHTML = 'No errors';
		error.style.color = '';
		snap.classList.remove("validate");
	}, 2000);
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
		if (count === 0) {
			snap.removeEventListener('click', add_frame);
			snap.addEventListener('click', send);
		} else {
			snap.addEventListener('click', add_frame);
		}

	}, 2000);
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
	snap.removeEventListener('click', add_frame);
	snap.removeEventListener('click', send);
	snap.classList.add("onclick");
	let http = new XMLHttpRequest();
	http.addEventListener("load", res_listen);
	http.open('POST', '/train', true);

	http.send(data);
}

function res_listen() {
	console.log(this.response);
	snap.classList.remove("onclick");
}

getUserMedia();