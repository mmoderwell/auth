const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	fname: String,
	lname: String,
});

const user = mongoose.model('user', userSchema);

module.exports = user;