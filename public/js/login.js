let heading = document.getElementById('heading');
let form = document.getElementById('login_form');
let login_button = document.getElementById('login');
let signup_button;
let name;
let email;
let registering = false;
let username = document.forms["login_form"]["username"];
let password = document.forms["login_form"]["password"];
let error = document.getElementById('error');
login_button.addEventListener('click', validate);

document.addEventListener("keydown", function(e) {
    if (e.which == 13 || e.keyCode == 13) {
        if (registering) {
            s_validate();
        } else {
            validate();
        }
        return false;
    }
    return true;
});

function validate() {
    if (username.checkValidity() && password.checkValidity()) {
        login_button.classList.add("onclick");
        send();
    } else {
        failed();
    }
    return false;
}

function success() {
    error.innerHTML = 'You\'re in.';
    error.style.opacity = '1';
    error.style.color = '#6EC867';
    login_button.classList.remove("onclick");
    login_button.classList.add("validate");
    setTimeout(() => {
        error.style.opacity = '0';
        error.innerHTML = 'No errors';
        error.style.color = '';
        login_button.classList.remove("validate");
        username.value = '';
        password.value = '';
    }, 2000);
}

function failed() {
    error.style.opacity = '1';
    login_button.classList.remove("onclick");
    if (!username.value || !password.value) {
        error.innerHTML = 'Please fill out all the fields.';
    } else {
        error.innerHTML = 'Username and password combination is incorrect.';
    }
}

function send() {
    const body = {
        username: username.value,
        password: password.value,
    };

    var http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.addEventListener("load", res_listen);
    http.open('POST', `/login`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(body));

}

function res_listen() {
    if (this.responseURL.endsWith('/')) {
        success();
        window.location.replace(this.responseURL);
    } else  {
        failed();
    }
}

///////////////////////////////////SIGNUP////////////////////////////////////////////////
let register = document.getElementById('new_account');
register.addEventListener('click', new_account);

function new_account() {
    let name_snippet = document.createRange().createContextualFragment(`<div class="form-group">
                        <input name="name" type="text" required="required" autocomplete="name"/>
                        <label class="control-label" for="input">name</label><i class="bar"></i>
                    </div>`);
    let email_snippet = document.createRange().createContextualFragment(`<div class="form-group">
                        <input name="email" type="text" required="required" autocomplete="email"/>
                        <label class="control-label" for="input">email</label><i class="bar"></i>
                    </div>`);
    let button_snippet = document.createRange().createContextualFragment(`<button type="button" class='button' id="signup"></button>`);
    let heading_snippet = 'Create an account with Sage<br><a href="javascript:window.location.href=window.location.href" title="login">Already have an accout?</a>';

    heading.innerHTML = heading_snippet;
    login_button.remove();
    form.appendChild(button_snippet);
    form.insertBefore(email_snippet, form.firstChild);
    form.insertBefore(name_snippet, form.firstChild);
    signup_button = document.getElementById('signup');
    signup_button.addEventListener('click', s_validate);
    registering = true;
}

function s_send() {
    const body = {
        username: username.value,
        password: password.value,
    };
}

function s_validate() {
    name = document.forms["login_form"]["name"];
    email = document.forms["login_form"]["email"];

    if (username.checkValidity() && password.checkValidity() && name.checkValidity() && validateEmail()) {
        signup_button.classList.add("onclick");
        s_send();
    } else {
        s_failed();
    }
    return false;
}

function s_success() {
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

function s_failed() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    if (!username.value || !password.value || !name.value || !email.value) {
        error.innerHTML = 'Please fill out all the fields.';
    }
    if (!validateEmail() && name.value && username.value && password.value) {
        error.innerHTML = 'Please enter a valid email.';
    }
}

function s_in_use() {
    error.style.opacity = '1';
    signup_button.classList.remove("onclick");
    error.innerHTML = 'Username already in use. Pick a different one.';
    username.value = '';
}

function s_send() {
    const body = {
        name: name.value,
        email: email.value,
        username: username.value,
        password: password.value,
    };

    var http = new XMLHttpRequest();
    http.overrideMimeType('application/json');
    http.addEventListener("load", s_res_listen);
    http.open('POST', `/signup`, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(body));

}

function s_res_listen() {
    if (this.responseURL.endsWith('/')) {
        success();
        window.location.replace(this.responseURL);
    } else {
        s_in_use();
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
