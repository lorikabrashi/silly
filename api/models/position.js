const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    type: {type: String, required: true},
    description: {type: String, required: true},
    qa: [ {type: mongoose.Schema.Types.ObjectId, ref: 'forum'} ],
}, {
	timestamps: true	
});



let positionModel = mongoose.model('positions', positionSchema);

module.exports = positionModel;