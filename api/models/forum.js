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
let forumModel = mongoose.model('forum', forumSchema);
module.exports = forumModel;