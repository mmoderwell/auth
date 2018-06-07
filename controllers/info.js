const User = require('../models/user');
const https = require('https');
const EventEmitter = require('events');

module.exports = {

    user(req, res) {

        let { name } = req.body;
        User.findOne({ name: req.user.name }, (err, user) => {
            user.name = name;

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