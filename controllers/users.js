const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    signup(req, res, next) {
        const body = req.body;
        const { name, email, username, password } = body;

        User.findOne({ username: username })
            .then((users) => {
                if (users) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send({ in_use: true });
                } else {
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                        const user = new User({ name: name, email: email, username: username, password: hash });
                        user.save()
                            .then(() => {
                                User.findOne({ username: user.username })
                                    .then((user) => {
                                        const id = user._id.toString();
                                        console.log('Created new user: ' + id);
                                        req.login(id, (err) => {
                                            if (err) {console.log(err)}
                                            res.setHeader('Content-Type', 'text/html');
                                            res.redirect('/');
                                        });
                                    });
                            });
                       //console.log('New user: ' + user);
                    });
                }
            });
    },
    profile(req, res, next) {
        if (req.isAuthenticated()) {
            res.render('../views/profile.ejs', { user: req.user });
        } else {
            res.redirect('/login');
        }
    }
}

passport.serializeUser(function(id, done) {
    //console.log(id + ' serialized');
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, id) {
        if (err) return done(null, err);
        //console.log(id + ' deserialized');
        done(null, id);
    });
});
