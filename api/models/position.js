const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    type: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, enum: ['open', 'closed'], default: 'open'},
    qa: [ { type: mongoose.Schema.Types.ObjectId, ref: 'forum' } ],
}, {
	timestamps: true	
});


const autoPopulateChildren = function (next) {
    this.populate("qa", '-__v');
    next();
};

positionSchema
    .pre("find", autoPopulateChildren)
    .pre("findOne", autoPopulateChildren);


let positionModel = mongoose.model('positions', positionSchema);

module.exports = positionModel;