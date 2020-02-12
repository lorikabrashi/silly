const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
}, {
	timestamps: true	
});

const licenseModel = mongoose.model('licenses', licenseSchema);
module.exports = licenseModel;