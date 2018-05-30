let heading = document.getElementById('heading');
let form = document.getElementById('login_form');
let signup_button = document.getElementById('signup');
let name = document.forms["login_form"]["name"];
let email = document.forms["login_form"]["email"];
let username = document.forms["login_form"]["username"];
let password = document.forms["login_form"]["password"];
let error = document.getElementById('error');
signup_button.addEventListener('click', validate);

document.addEventListener("keydown", function(e) {
    if (e.which == 13 || e.keyCode == 13) {
        validate();
        return false;
    }
    return true;
});

function validate() {
    name = document.forms["login_form"]["name"];
    email = document.forms["login_form"]["email"];

    if (username.checkValidity() && password.checkValidity() && name.checkValidity() && validateEmail()) {
        signup_button.classList.add("onclick");
        send();
    } else {
        failed();
    }
    return false;
}

function success() {
    error.innerHTML = 'Success, account created.';
    error.style.opacity = '1';
    error.style.color = '#6EC867';
    signup_button.classList.remove("onclick");
    signup_button.classList.add("validate");
    setTimeout(() => {
        error.style.opacity = '0';
        error.innerHTML = 'No errors';
        error.style.color = '';
        signup_button.classList.remove("validate");
        username.value = '';
        password.value = '';
        name.value = '';
        email.value = '';
    }, 2000);
}

function failed() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    if (!username.value || !password.value || !name.value || !email.value) {
        error.innerHTML = 'Please fill out all the fields.';
    }
    if (!validateEmail() && name.value && username.value && password.value) {
        error.innerHTML = 'Please enter a valid email.';
    }
}

function in_use() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    error.innerHTML = 'Username already in use. Pick a different one.';
    username.value = '';
}

function send() {
    const body = {
        name: name.value,
        email: email.value,
        username: username.value,
        password: password.value,
    };

    var http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.addEventListener("load", res_listen);
    http.open('POST', `/signup`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(body));

}

function res_listen() {
    if (this.responseURL.endsWith('/')) {
        success();
        window.location.replace(this.responseURL);
    } else {
        in_use();
    }
}

function validateEmail() {
    var x = email.value;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        email.setCustomValidity("Please enter a valid email.");
        return false;
    } else {
        email.setCustomValidity("");
        return true;
    }
}
