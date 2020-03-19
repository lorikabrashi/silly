const projectModel = require('../models/project')
const permissionsModel = require('../models/permission')
const userModel = require('../models/user');

const ErrorWithStatusCode = require('../helpers/ErrorWithStatusCode')
const { excractFields, getDefaultQueryParams } = require('../helpers/general');

const mailConfig = require('../helpers/mailConfig');

module.exports = projectController = {
    invitationResponse: async(params, userId) => {

        const { projectId, response, reason } = params;
        
        const project = await projectModel.findOne({ _id: projectId }).exec();
        if(!project){
            throw new ErrorWithStatusCode("Incorect project ID", 400);
        }
        const peerInvitation = project.peers.filter(e => { return e.user._id == userId });
        if(peerInvitation.length === 0 ){
            throw new ErrorWithStatusCode("No invitation found with this user Id", 404)
        }
        if(peerInvitation[0].status !== 'pending'){
            throw new ErrorWithStatusCode("Already responded to this invitation", 401)
        }

        const status =  JSON.parse(response) ? 'accepted' : 'rejected';
        await userModel.updateOne({ _id: userId, 'invites.project': projectId }, { 'invites.$.status': status, 'invites.$.responseText': reason }).exec()
        await projectModel.updateOne({ _id: projectId, 'peers.user': userId }, { 'peers.$.status': status, 'peers.$.responseText': reason }).exec()
        
        const emailList = [];
        project.peers.forEach(elem => {
            if(elem.status === 'accepted'){
                emailList.push(elem.user.email);
            }
        })
    
        await mailConfig.sendMail(mailConfig.templates.responseToInvite(emailList, username, project.name, status, reason));
        
        return { projectId, response, reason } 
    },
    invitePeer: async (params, userId) => {
        
        const { projectId, username, permissionsId, title, description } = params;

        const project = await projectModel.findOne({ _id: projectId }).exec();
        if(!project){
            throw new ErrorWithStatusCode("Incorect project ID", 400);
        }

        // check if userId is the project owner or has the permissions to send invitation about project
        if(userId != project.created_from._id){
            
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
        const user = await userModel.findOne({ username: username }).exec();
        if(!user) throw new ErrorWithStatusCode('No peer found with the given username', 404);
        
        // Cannot invite self
        if(user._id == userId) throw new ErrorWithStatusCode('Bad request', 400);
       
        let invitationStatus = {
            isInvited: false,
            invitationsSent: 1
        };

        project.peers.forEach(elem => {
            if(elem.user._id.toString() == user._id.toString()) {
                if(elem.status !== 'rejected'){
                    throw new ErrorWithStatusCode('This user was already invited to this project', 400);
                }
                if(elem.invitationsSent >= 3){
                    throw new ErrorWithStatusCode('Max invitation per user reached', 400);
                }
                invitationStatus.isInvited = true;
                invitationStatus.invitationsSent = parseInt(elem.invitationsSent) + 1
            }
        })

        const invite = {
            title: title,
            description: description,
            user: user._id,
            permission: permissionsId,
            invitationsSent: invitationStatus.invitationsSent
        };
       
        if(invitationStatus.isInvited){
            await projectModel.updateOne({ _id: project._id }, { $pull : { 'peers': { user: user._id} }}).exec();             
        }
        
        // store invite to user & store user as peer on the project
        await projectModel.updateOne({ _id: project._id }, { $push : { peers: invite }}).exec();
        await userModel.updateOne({ _id: user._id }, { $push : { invites: { project: project._id } } }).exec();

        // send invitation to email
        await mailConfig.sendMail(mailConfig.templates.invitePeer(user.email, username, project.name));

        return { username, userId: user._id, message: "invite was successful"} 
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
              
        params.peers = [{
            status: "accepted",
            user: created_from,
            permissions: adminRole._id,
            title: "Ideator",
            description: "Project Creator",
            responseText: "Auto Accepted"
        }]
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