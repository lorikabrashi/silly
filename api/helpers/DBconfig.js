const mongoose = require('mongoose');
const permissionModel = require('../models/permission');

/**
 * Creates default permissions
 */
const createDefaultPermissions = async () => {
    const defaultPermissions = [
        { 
            name: 'Administrator',
            description: "Administrator Role",
            config: {
                type: "Default", 
            },
            permissions: {
                invite_peers: true,
                qa: true,
                stage: true,
                categories: true,
                positions: true
            }
        }
    ]
    const permissionNames = [];   
    defaultPermissions.forEach(e => permissionNames.push( { name: e.name }) )
    const query = { $or : permissionNames }
    try{
        const permissions = await permissionModel.find(query).exec();
        defaultPermissions.forEach(async elem => {
            if(!permissions.filter(e => e.name == elem.name).length > 0){
                await permissionModel.create(elem);
            }
        })  
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    /**
     * Connection to mongo db
     */
    connect: () => {
        mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, async function (err, res) {
            if (err) {
                console.log('Error establishing database connection: ' + err)
            }
            else {
                await createDefaultPermissions();
                console.log('Connected to DB...' + process.env.DB_URL)
            }
        });
    }
}