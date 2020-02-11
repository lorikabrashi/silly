const mongoose = require('mongoose');

const cateogrySchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: { type: String },
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'categories'}],
}, {
	timestamps: true	
});

let categoryModel = mongoose.model('categories', cateogrySchema);
module.exports = categoryModel;