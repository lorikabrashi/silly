const mongoose = require('mongoose')

const permissionAttribute = { type: Boolean, default: false }
const permissionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        config: {
            type: { type: String, enum: ['Default', 'Custom'], default: 'Custom' },
            parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projects' },
        },
        permissions: {
            invite_peers: permissionAttribute,
            qa: permissionAttribute,
            stage: permissionAttribute,
            categories: permissionAttribute,
            positions: permissionAttribute,
        },
    },
    {
        timestamps: true,
    }
)

const permissionModel = mongoose.model('permissions', permissionSchema)
module.exports = permissionModel
