const projectModel = require('../models/project')
const permissionsModel = require('../models/permission')
const userModel = require('../models/user');

const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

const mailConfig = require('../helpers/mailConfig');
const nodemailer = require('nodemailer');

module.exports = projectController = {
    invitationResponse: async( params, userId ) =>{
        const { projectId, response, reason } = params
        
        /* TODO: */
        //check project if exist
        //check if user has been invited
        // responde to invitation

    },
    invitePeer: async (params, userId) => {
        const { projectId, username, permissionsId, title, description } = params;

        const project = await projectModel.findOne({ _id: projectId }).exec();
        if(!project){
            throw new ErrorWithStatusCode("Incorect project ID", 400);
        }

        // check if userId is the project owner or has the permissions to send invitation about project
        if(userId !== project.created_from){
            
            if(project.peers.length === 0) throw new ErrorWithStatusCode('No sufficient permissions', 401);
            const peer = project.peers.filter(e => { return e.user === userId ? e : null } );
            if (!peer){
                throw new ErrorWithStatusCode('No sufficient permissions', 401);
            }
            else{
                const permission = await permissionsModel.findOne({_id: peer.permission}).exec()
                if(!permission.permissions.invite_peers) throw new ErrorWithStatusCode('No sufficient permissions', 401);
            }
        }
        // check username if exist as user
        const user = await userModel.findOne({username: username }).exec();
        if(!user) throw new ErrorWithStatusCode('No peer found with the given username', 404);
        
        // Cannot invite self
        if(user.username === username) throw new ErrorWithStatusCode('Bad request', 400);
        
        // check if username already has the same invitation as accepted/pending state
        if(project.peers.filter(e => { return e.user === user._id ? !(e.status === 'rejected') : false })){ throw new ErrorWithStatusCode('Bad request', 400); }

        
        // TODO validate that no more than 3 invitaions for a user are allowed 

        // store invite to user & store user as peer on the project
        const invite = {
            title: title,
            description: description,
            user: user._id,
            permission: permissionsId,
            invitationsSent: 0 
        }
        await projectModel.updateOne({ _id: project._id }, { $push : { peers: invite }}).exec();

        await userModel.updateOne({_id: user._id }, { $push : { invites: { project: project._id } } }).exec();
        
        // send invitation to his email
        const smtpTrans = nodemailer.createTransport(mailConfig.config);
        await smtpTrans.sendMail(mailConfig.templates.invitePeer(user.email, username, project.title));

        return { username, userId: user._id, message: "invite was successful"} 

        /* TODO: TEST Func */
    },
    create: async (params) => {
        
        params = { name, description, license, categories, stage, created_from } = params;
        
        /* Get default permissions and add them to the project */
        const permissions = await permissionsModel.find({'config.type': 'Default'});
        const deafultPermissions = [];
        permissions.forEach(e => deafultPermissions.push(e._id));
        params.permissions = deafultPermissions;
        
        /* Create self as peer with administrator permissions */
        const adminRole = permissions.find(e => e.name === 'Administrator');
        params.peers = [
            {
                user: created_from,
                permissions: adminRole._id
            }
        ]
        const project = await projectModel.create(params);
        return `Created project - ${project._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const projects = await projectModel.find({}, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });

        return Array.from(projects).map(project => {
            return excractFields(project, qParams.fields);
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams);
        const project = await projectModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit : qParams.limit });
        return excractFields(project, qParams.fields);
    },
    update: async(id, params) => {
        params = { name, description, license, categories, stage } = params;
        return await projectModel.findByIdAndUpdate(id, params, { new: true }).select('-__v').exec(); 
    },
    delete: async(id) => {
        const project = await projectModel.findByIdAndRemove(id).exec();
        return `Deleted project - ${project._id}`
    } 
}