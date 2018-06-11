const child_process = require('child_process');

let backend = {};
backend.identify = child_process.spawn('../auth_backend/identify.sh');
backend.identify.on('exit', () => {
	console.log('Classifier script finished.');
});
backend.identify.stdout.on('data', (data) => {
	console.log('Classifer out: ' + data.toString('utf8'));
});
backend.identify.stderr.on('data', (data) => {
	console.log('Classifier error: ' + data.toString('utf8'));
});

module.exports = backend;