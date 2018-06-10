const child_process = require('child_process');

console.log('Starting train script.');
const process = child_process.spawn('../auth_backend/train.sh');
process.on('exit', () => {
    console.log('Script finished.');
});
process.stdout.on('data', (data) => {
    console.log('Output: ' + data.toString('utf8'));
});
process.stderr.on('data', (data) => {
    console.log('Error: ' + data.toString('utf8'));
});
