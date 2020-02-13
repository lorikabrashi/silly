const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    title: {type: String },
    content: {type: String },
    attachments: [{
        media_type: { type: String, enum: ['IMAGE', "EMBED"], default: 'IMAGE' },
        media: { type: String },
    }],
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'forum' } ],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'forum' }
}, {
	timestamps: true	
});

const autoPopulateChildren = function (next) {
    this.populate("comments", '-__v');
    next();
};

forumSchema
    .pre("find", autoPopulateChildren)
    .pre("findOne", autoPopulateChildren);

module.exports = mongoose.model('forum', forumSchema);
