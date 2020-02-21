const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username:  { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    verified: {type: Boolean, default: false},
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' }
}, {
	timestamps: true	
});

const autoPopulateChildren = function (next) {
    this.populate('profile', '-__v');
	next();
};

usersSchema
	.pre('find', autoPopulateChildren)
	.pre('findOne', autoPopulateChildren);

let userModel = mongoose.model('users', usersSchema);

module.exports = userModel;