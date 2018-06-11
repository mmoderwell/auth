const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const bodyParser = require('body-parser');
const routes = require('./routes/routes');

//Authentication Packages
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoDBStore = require('connect-mongodb-session')(session);

const child_process = require('child_process');
let mongo_uri;
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'DEVELOPMENT') {
	mongo_uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/auth`;
} else {
	mongo_uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/auth`;
}

mongoose.connect(mongo_uri).then(() => console.log('Connected to mongodb.'))
	.catch((e) => {
		console.error('Connection to mongodb failed.');
	});

//the database connection is disconnected
mongoose.connection.on('disconnected', function() {
	console.log('Connection to mongodb is disconnected.');
});
app.identify = child_process.spawn('../auth_backend/identify.sh');
app.identify.on('exit', () => {
	console.log('Classifier script finished.');
});
app.identify.stdout.on('data', (data) => {
	console.log('Classifer out: ' + data.toString('utf8'));
});
app.identify.stderr.on('data', (data) => {
	console.log('Classifier error: ' + data.toString('utf8'));
});
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

app.use(session({
	secret: 'blueberry pancakes',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	store: new MongoDBStore({
		uri: mongo_uri,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

//not 100% what this does at the moment
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

passport.use(new LocalStrategy(
	(username, password, done) => {
		const User = require('./models/user');
		if (username == 'None') {
			//console.log('No face found');
			return done({ face: false }, false);
		}
		User.findOne({ name: username }, function(err, user) {
			if (err) return done(err);
			if (!user) {
				return done(null, false);
			} else {
				return done(null, user);
			}
		});
	}
));
routes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'DEVELOPMENT' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error.ejs', { err });
});

module.exports = app;
