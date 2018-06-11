const app = require('../app');
const User = require('../models/user');
//user authentication
const passport = require('passport');
//child process, for python backend
const child_process = require('child_process');
//file upload handling
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, '../uploads/');
	},
	filename: function(req, file, cb) {
		//cb(null, file.originalname)
		cb(null, Date.now() + '.png');
	},
});
const storage_array = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, `../train/${req.user.fname}_${req.user.lname}/`);
	},
	filename: function(req, file, cb) {
		//cb(null, file.originalname)
		cb(null, Date.now() + '.png');
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
				return res.send(file[frame_name]);
			} else {
				setTimeout(get_name, 200);
				tries += 1;
			}
			if (tries == max_tries) {
				return res.send({ failed: true });
			}
		}
		setTimeout(get_name, 200);
	},

	frames: upload_array.array('frame', 10),

	train(req, res, next) {
		backend.identify.kill('SIGINT');
		console.log('Starting train script.');
		const process = child_process.spawn('../auth_backend/train.sh');
		process.on('exit', () => {
			console.log('Script finished.');
			backend.identify = child_process.spawn('../auth_backend/identify.sh');
			req.logout();
			req.session.destroy(() => {
				res.clearCookie('connect.sid');
				res.redirect('/login');
			});
		});
		process.stdout.on('data', (data) => {
			console.log('Output: ' + data.toString('utf8'));
		});
		process.stderr.on('data', (data) => {
			console.log('Error: ' + data.toString('utf8'));
		});
	},
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