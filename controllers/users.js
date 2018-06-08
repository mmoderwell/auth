const User = require('../models/user');
//user authentication
const passport = require('passport');
//child process, for python backend
const exec = require('child_process').exec;
//file upload handling
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function(req, file, cb) {
        //cb(null, file.originalname)
        cb(null, Date.now() + '.png')
    },
});
const storage_array = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `../train/${req.user.fname}_${req.user.lname}/`)
    },
    filename: function(req, file, cb) {
        //cb(null, file.originalname)
        cb(null, Date.now() + '.png')
    },
});

const upload = multer({ storage: storage });
const upload_array = multer({ storage: storage_array });
const fs = require('fs');

module.exports = {

    signup(req, res, next) {
        const body = req.body;
        const { fname, lname } = body;
        const name = fname + ' ' + lname;

        User.findOne({ name: name })
            .then((users) => {
                if (users) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send({ in_use: true });
                } else {

                    let folder_path = "../train/" + fname + '_' + lname + "/";
                    if (!fs.existsSync(folder_path)) {
                        fs.mkdirSync(folder_path);
                    }
                    //Store user in DB
                    const user = new User({ name: name, fname: fname, lname: lname });
                    user.save()
                        .then(() => {
                            User.findOne({ name: user.name })
                                .then((user) => {
                                    const id = user._id.toString();
                                    console.log('Created new user: ' + id);
                                    req.login(id, (err) => {
                                        if (err) { console.log(err) }
                                        res.setHeader('Content-Type', 'text/html');
                                        res.redirect('/train');
                                    });
                                });
                        });
                    console.log('New user: ' + user);
                }
            });
    },

    frame: upload.single('frame'),

    face(req, res, next) {
        console.log('Saved a frame: ' + req.file.filename);
        frame_name = req.file.filename;
        let tries = 0;
        let max_tries = 30; //equivalent to 4 seconds

        function get_name() {
            let file = fs.readFileSync("../uploads/output.json");
            file = JSON.parse(file);
            if (file[frame_name]) {
                res.send(file[frame_name]);
                res.end();
            } else {
                setTimeout(get_name, 200);
                tries += 1;
            }
            if (tries == max_tries) {
                res.send({ failed: true });
            }
        }
        setTimeout(get_name, 200);
    },

    frames: upload_array.array('frame', 10),

    train(req, res, next) {
        //console.log(req.user.name);
        res.setHeader('Content-Type', 'text/html');
        return res.redirect('/');
        let train_script = exec('sh train.sh ../auth_backend',
            (error, stdout, stderr) => {
                console.log(`${stdout}`);
                console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
        train_script();
        return res.redirect('/');
    }
};

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
