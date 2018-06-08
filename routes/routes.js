const users = require('../controllers/users');
const info = require('../controllers/info');
const passport = require('passport');

module.exports = (app) => {

	//user creation / login routes
	app.get('/signup', (req, res) => {
		res.render('../views/signup.ejs');
	});
	app.get('/login', (req, res) => {
		res.render('../views/login.ejs');
	});
	app.get('/logout', (req, res) => {
		req.logout();
		req.session.destroy(() => {
			res.clearCookie('connect.sid');
			res.redirect('/login');
		});
	});

	app.post('/signup', users.signup);
	app.post('/face', users.frame, users.face);
	app.post('/login', passport.authenticate('local', { successRedirect: '/' }),
		(req, res) => {
			//res.redirect('/');
		});
	app.get('/exec', () => {
		let train_script = exec('sh train.sh ../auth_backend',
			(error, stdout, stderr) => {
				console.log(`${stdout}`);
				console.log(`${stderr}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
					res.send({ success: false });
				}
			});
		train_script();
		return res.send({ success: false });
	})
	//logged in user routes

	app.get('/', (req, res) => {
		//console.log(req.user);
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated()) {
			res.render('../views/home.ejs', { user: req.user });
		} else {
			res.redirect('/login');
		}
	});
	app.get('/train', (req, res) => {
		//console.log(req.user);
		//console.log(req.isAuthenticated());
		if (req.isAuthenticated()) {
			res.render('../views/train.ejs', { user: req.user });
		} else {
			res.redirect('/login');
		}
	});
	app.post('/train', users.frames, users.train);

}