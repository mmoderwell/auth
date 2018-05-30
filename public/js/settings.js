{
    let body = document.getElementsByTagName("body")[0];
    let content = document.querySelectorAll('.content');
    let box = document.querySelectorAll('.box');
    let side_bar = document.getElementById('sidebar-wrapper');
    let night_mode = document.getElementById('night_mode');
    let night_mode_status = localStorage.getItem("night_mode");
    //let picture = document.querySelector('.img_content');

    function night() {

        if (night_mode.getAttribute('class')) {
            sidebar_functions.disable();
        } else {
            sidebar_functions.enable();
        }
    }
    let sidebar_functions = {
        enable: function() {
            night_mode.setAttribute('class', 'active');
            night_mode.innerHTML = 'Light Mode';
            body.style.background = '#000';
            body.style.color = '#bfbfbf';
            side_bar.style.background = '#161616';
            //picture.style.filter = 'grayscale(80%)';
            Array.prototype.forEach.call(box, (e) => {
                e.style.backgroundColor = '#1f2846';
            });
            Array.prototype.forEach.call(content, (e) => {
                e.style.color = '#bfbfbf';
            });
            console.log('Night mode is active.');
            localStorage.setItem("night_mode", 'active');
            night_mode_status = localStorage.getItem("night_mode");
        },

        disable: function() {
            night_mode.removeAttribute('class', 'active');
            night_mode.innerHTML = 'Night Mode';
            body.style.background = '';
            body.style.color = '';
            side_bar.style.background = '';
            //picture.style.filter = '';
            Array.prototype.forEach.call(box, (e) => {
                e.style.backgroundColor = '';
            });
            Array.prototype.forEach.call(content, (e) => {
                e.style.color = '';
            });
            console.log('Night mode is deactivated.');
            localStorage.setItem("night_mode", 'inactive');
            night_mode_status = localStorage.getItem("night_mode");
        }
    };

    if (night_mode_status == 'active') {
        sidebar_functions.enable();
    } else {
        sidebar_functions.disable();
    }

    document.getElementById('night_mode').addEventListener('click', night);
}