const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
        children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' }],
    },
    {
        timestamps: true,
    }
)

const autoPopulateChildren = function (next) {
    this.populate('children', '-__v')
    next()
}

categorySchema.pre('find', autoPopulateChildren).pre('findOne', autoPopulateChildren)

module.exports = mongoose.model('categories', categorySchema)
