(function sidebar() {
    let button = document.getElementById('sidebar-button');
    let wrapper = document.getElementById('wrapper');

    function open() {
        button.setAttribute('class', 'open');
        wrapper.setAttribute('class', 'toggled');
        button.innerHTML = 'Close';
    }

    function close() {
        button.removeAttribute('class', 'open');
        wrapper.removeAttribute('class', 'toggled');
        button.innerHTML = 'Settings';
    }

    button.addEventListener('click', () => {
        if (button.getAttribute('class')) {
            close();
        } else {
            open();
        }
    });

    document.onkeydown = function(e) {
        e = e || window.event;
        if (e.keyCode == 27) {
            if (button.getAttribute('class')) {
                close();
            }
        }
    };
})();