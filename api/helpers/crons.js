const CronJob = require('cron').CronJob;
const projectModel = require('../models/project');

const autoRejectInvitations = () => {
    /* TODO: SETUP A CRON JOB TO AUTO REJECT AFTER 1 WEEK OF NO RESPONSE */
}

module.exports = _crons = {
    /**
     * Starts all cron jobs (Will effect only functions that start with "job_")
    */
    startAll: () => {
        Object.values( _crons ).forEach( func => { 
            if(typeof func === 'function' && func.name.startsWith('job_')) {
                func();
            } 
        });
    },
    /**
     * Reject project invitations that are pending for at least 1 week.
     * Triggers at midnight
    */
    job_checkForExpiredInvitations:  () => {
        const job = new CronJob('00 00 00 * * *', autoRejectInvitations);
        job.start();
    }
}