const CronJob = require('cron').CronJob
const projectModel = require('../models/project')
const userModel = require('../models/user')
const mailConfig = require('./mailConfig')

const autoRejectInvitations = async () => {
    const getQuery = (resource, time) => {
        const updateStatusKey = resource + '.$.status'
        const updateTextKey = resource + '.$.responseText'
        return {
            find: {
                [resource]: {
                    $elemMatch: {
                        createdAt: { $lte: time },
                        status: 'pending',
                    },
                },
            },
            update: {
                [updateStatusKey]: 'rejected',
                [updateTextKey]: 'auto rejected (inactivity)',
            },
            opt: { multi: true },
        }
    }

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const projectQuery = getQuery('peers', weekAgo)
    const userQuery = getQuery('invites', weekAgo)

    const projects = await projectModel.find(projectQuery.find).exec()

    await userModel.update(userQuery.find, userQuery.update, userQuery.opt).exec()

    await projectModel.update(projectQuery.find, projectQuery.update, projectQuery.opt).exec()

    // Notify other users
    projects.forEach(async (project) => {
        const pendingPeers = project.peers.filter((e) => e.status === 'pending')
        const peers = project.peers.filter((e) => e.status === 'accepted')
        const peerEmails = []

        peers.forEach((peer) => peerEmails.push(peer.user.email))

        let username = ''
        pendingPeers.forEach(async (peer) => {
            const expireDate = new Date(peer.createdAt)
            expireDate.setDate(expireDate.getDate() + 7)
            if (new Date() > expireDate) {
                username = peer.user.username

                await mailConfig.sendMail(mailConfig.templates.invitationExpired(peer.user.email, peer.user.username, project.name))
            }
        })
        await mailConfig.sendMail(mailConfig.templates.responseToInvite(peerEmails, username, project.name, '(auto) Rejected', 'Inactivity for one week'))
    })
}

const _crons = {
    /**
     * Starts all cron jobs (Will effect only functions that start with "job_")
     */
    startAll: () => {
        Object.values(_crons).forEach((func) => {
            if (typeof func === 'function' && func.name.startsWith('job_')) {
                func()
            }
        })
    },
    /**
     * Reject project invitations that are pending for at least 1 week.
     * Triggers at midnight
     */
    job_checkForExpiredInvitations: () => {
        const job = new CronJob('00 00 00 * * *', autoRejectInvitations)
        job.start()
    },
}

module.exports = _crons
