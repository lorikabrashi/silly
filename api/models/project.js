const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    license: { type: mongoose.Schema.Types.ObjectId, ref: 'licenses' },
    qa: [ {type: mongoose.Schema.Types.ObjectId, ref: 'forum'} ],
    categories: [ { type: mongoose.Schema.Types.ObjectId, ref: 'categories'} ],
    created_from: { type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    peers: [ 
        { 
           user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
           permissions: { type: mongoose.Schema.Types.ObjectId, ref: 'permissions' }
        }
    ],
    stage: { type: String, enum: ['initiation', 'planning', 'execution', 'closure' ], default: 'initiation' },
    open_positions: [ { type: mongoose.Schema.Types.ObjectId, ref: 'positions' }  ]
}, {
	timestamps: true	
});



let projectModel = mongoose.model('projects', projectSchema);

module.exports = projectModel;