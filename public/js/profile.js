const app_info_button = document.getElementById('app_info');
app_info_button.addEventListener('click', app_edit);

const old_zip = document.getElementById('zip').innerHTML;

///////////// app info edit /////////////////
function app_edit() {
	app_info_button.innerHTML = 'Save';
	document.getElementById('zip').innerHTML = '';
	document.querySelector('.zip_edit').style.display = 'block';

	app_info_button.addEventListener('click', app_save);
}

function app_reset() {
	document.getElementById('zip').innerHTML = old_zip;
	document.querySelector('.zip_edit').style.display = 'none';
	app_info_button.innerHTML = 'Edit';
	app_info_button.removeEventListener('click', app_save);
	app_info_button.addEventListener('click', app_edit);
}

function app_save() {
	//get new zip value from input field
	let updated_info = document.getElementById('new_zip').value;

	if (!updated_info || updated_info === old_zip) {
		app_reset();
	} else {

		document.getElementById('zip').innerHTML = updated_info;
		document.querySelector('.zip_edit').style.display = 'none';
		app_info_button.innerHTML = 'Saving<span>.</span><span>.</span><span>.</span>';

		const body = {
			zip: updated_info,
		};

		var http = new XMLHttpRequest();
		http.overrideMimeType('application/json');
		http.addEventListener("load", app_res_listen);
		http.open('POST', `/api/info/zip`, true);
		http.setRequestHeader('Content-Type', 'application/json');
		http.send(JSON.stringify(body));
	}
}

function app_res_listen() {
	//console.log(this.responseURL);
	window.location.replace(this.responseURL);
}

///////////// user info edit /////////////////

const user_info_button = document.getElementById('user_info');
user_info_button.addEventListener('click', user_edit);

const old_name = document.getElementById('name').innerHTML;
const old_email = document.getElementById('email').innerHTML;
const old_username = document.getElementById('username').innerHTML;

function user_edit() {
	user_info_button.innerHTML = 'Save';
	document.getElementById('name').innerHTML = '';
	document.getElementById('email').innerHTML = '';
	document.getElementById('username').innerHTML = '';
	document.querySelector('.name_edit').style.display = 'block';
	document.querySelector('.email_edit').style.display = 'block';
	document.querySelector('.username_edit').style.display = 'block';

	user_info_button.addEventListener('click', user_save);
}

function user_reset() {
	document.getElementById('name').innerHTML = old_name;
	document.getElementById('email').innerHTML = old_email;
	document.getElementById('username').innerHTML = old_username;
	document.querySelector('.user_edit').style.display = 'none';
	user_info_button.innerHTML = 'Edit';
	user_info_button.removeEventListener('click', user_save);
	user_info_button.addEventListener('click', user_edit);
}

function user_save() {
	//get new value from input field
	let updated_info = {
		name: document.getElementById('new_name').value || old_name,
		email: document.getElementById('new_email').value || old_email,
		username: document.getElementById('new_username').value || old_username
	};

	console.log(updated_info);

	document.getElementById('name').innerHTML = new_name.value;
	document.getElementById('email').innerHTML = new_email.value;
	document.getElementById('username').innerHTML = new_username.value;
	document.querySelector('.name_edit').style.display = 'none';
	document.querySelector('.email_edit').style.display = 'none';
	document.querySelector('.username_edit').style.display = 'none';
	user_info_button.innerHTML = 'Saving<span>.</span><span>.</span><span>.</span>';

	var http = new XMLHttpRequest();
	http.overrideMimeType('application/json');
	http.addEventListener("load", user_res_listen);
	http.open('POST', `/api/info/user`, true);
	http.setRequestHeader('Content-Type', 'application/json');
	http.send(JSON.stringify(updated_info));
}

function user_res_listen() {
	//console.log(this.responseURL);
	window.location.replace(this.responseURL);
}