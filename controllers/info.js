const User = require('../models/user');
const https = require('https');
const EventEmitter = require('events');

module.exports = {

    user(req, res) {

        let { name, email, username } = req.body;
        User.findOne({ username: req.user.username }, (err, user) => {
            user.name = name;
            user.email = email;
            user.username = username;

            user.save()
                .then(() => {
                    res.setHeader('Content-Type', 'text/html');
                    res.redirect('/profile');
                });
        });

    },
    hello(req, res) {
        res.send({ hello: 'there' });
    }
};