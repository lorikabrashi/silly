const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
}, {
	timestamps: true	
});

let categoryModel = mongoose.model('categories', cateogrySchema);
module.exports = categoryModel;