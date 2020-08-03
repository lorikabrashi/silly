const mongoose = require('mongoose')

const peerSchema = new mongoose.Schema(
    {
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        title: { type: String, require: true },
        description: { type: String, require: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        permission: { type: mongoose.Schema.Types.ObjectId, ref: 'permissions' },
        responseText: { type: String, require: true },
        invitationsSent: { type: Number, default: 1 },
    },
    {
        timestamps: true,
    }
)

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        license: { type: mongoose.Schema.Types.ObjectId, ref: 'licenses' },
        qa: [{ type: mongoose.Schema.Types.ObjectId, ref: 'forum' }],
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
        created_from: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        peers: [peerSchema],
        stage: { type: String, enum: ['initiation', 'planning', 'execution', 'closure'], default: 'initiation' },
        positions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'positions' }],
        permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }],
    },
    {
        timestamps: true,
    }
)

const autoPopulateChildren = function (next) {
    this.populate('license', '-__v')
    this.populate('qa', '-__v')
    this.populate('categories', ['-children', '-parent', '-__v'])
    this.populate('created_from', ['-password', '-__v'])
    this.populate('positions', '-__v')
    this.populate('permissions')
    this.populate('peers.user', ['username', 'email', '-profile'])
    this.populate('peers.permission', 'name')

    next()
}

projectSchema.pre('find', autoPopulateChildren).pre('findOne', autoPopulateChildren)

module.exports = mongoose.model('projects', projectSchema)
