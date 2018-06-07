let form = document.getElementById('signin_form');
let signup_button = document.getElementById('signup');
let fname = document.forms["signin_form"]["fname"];
let lname = document.forms["signin_form"]["lname"];
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
    if (fname.checkValidity() && lname.checkValidity()) {
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
        fname.value = '';
        lname.value = '';

    }, 2000);
}

function failed() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    if (!fname.value || !lname.value) {
        error.innerHTML = 'Please fill out all the fields.';
    }
}

function in_use() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    error.innerHTML = 'Name already in use. Pick a different one.';
    fname.value = '';
    lname.value = '';
}

function send() {
    const body = {
        name: fname.value + lname.value,
        fname: fname.value,
        lname: lname.value,
    };

    var http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.addEventListener("load", res_listen);
    http.open('POST', `/signup`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(body));
}

function res_listen() {
    console.log(this);
    if (this.responseURL.endsWith('/train')) {
        success();
        window.location.replace(this.responseURL);
    } else {
        in_use();
    }
}