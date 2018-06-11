let error = document.getElementById('error');
let video = document.querySelector('video');
let signup = document.getElementById('new_account');
let login = document.getElementById('login');
let feed = document.getElementById('feed');

login.addEventListener('click', send);
signup.addEventListener('click', () => {
	window.location.href = '/signup'
});

function getUserMedia() {
	navigator.mediaDevices.getUserMedia({ video: true })
		.then(mediaStream => {
			document.querySelector('video').srcObject = mediaStream;
			const track = mediaStream.getVideoTracks()[0];
			window.stream = track;

			if (window.stream.enabled) {
				login.classList.remove("onclick");
				login.addEventListener('click', send);
			};
		})
		.catch(error => console.log(error));
}

function feed_toggle() {
	console.log(stream);

	if (stream.active) {
		video.stop();
	}
	// if (video) {
	// 	video.onerror = null;
	// 	video.pause();
	// 	if (video.mozSrcObject)
	// 		video.mozSrcObject = null;
	// 	video.src = "";
	// }
	// myButton = document.getElementById('buttonStart');
	// if (myButton) myButton.disabled = false;
}

function success() {
	error.innerHTML = 'You\'re in.';
	error.style.opacity = '1';
	error.style.color = '#6EC867';
	login.classList.remove("onclick");
	login.classList.add("validate");
	setTimeout(() => {
		error.style.opacity = '0';
		error.innerHTML = 'No errors';
		error.style.color = '';
		login.classList.remove("validate");
	}, 2000);
}

function failed(err) {
	error.style.opacity = '1';
	login.classList.remove("onclick");
	error.innerHTML = err;
}

function send() {
	//console.log('Send');
	login.removeEventListener('click', send);
	login.classList.add("onclick");
	let http = new XMLHttpRequest();
	http.addEventListener("load", res_listen);
	http.open('POST', '/face', true);

	let frame = captureVideoFrame('video', 'png');
	// Send frame blob to Node server
	let data = new FormData();
	data.append('frame', frame.blob, 'face.png');
	http.send(data);
}

function res_listen() {
	//console.log(this.response);
	if (this.response.failed) {
		failed('Facial recognition backend offline');
		login.addEventListener('click', send);
	} else {
		name = this.response;
		const body = {
			username: name,
			password: 'blueberry',
		};

		let http = new XMLHttpRequest();
		http.overrideMimeType('application/json');
		http.addEventListener("load", res_listen_login);

		http.open('POST', '/login', true);
		http.setRequestHeader('Content-Type', 'application/json');
		http.send(JSON.stringify(body));
	}
}

function res_listen_login() {
	console.log(this);
	if (this.responseURL.endsWith('/')) {
		success();
		window.location.replace(this.responseURL);
	} else if (this.status === 401) {
		login.addEventListener('click', send);
		failed('Face not recognized.');
	} else if (this.status === 500) {
        login.addEventListener('click', send);
        failed('No face found.');
    }
}

login.classList.add("onclick");
getUserMedia();
