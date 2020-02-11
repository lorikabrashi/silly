const mongoose = require('mongoose');

const permissionAttribute = { type: Boolean, default: false };

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    
    permissions: {
        invite_peers: permissionAttribute,
        qa: permissionAttribute,
        stage: permissionAttribute,
        categories: permissionAttribute,
        positions: permissionAttribute
    }
}, {
    timestamps: true
});

let permissionModel = mongoose.model('permissions', permissionSchema);
module.exports = permissionModel;