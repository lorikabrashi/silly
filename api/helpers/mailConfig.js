module.exports = {
    config: Object.freeze({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true, //Force TLS
        tls: {  
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS 
        }
    }),
    templates: {
        /**
         * @param { string } username - Username of the new user
         * @param { string } email - Email of the new user
         * @param { string } token - JWT to be send by email for verifying 
        */
        verification: (username, email, token) => {
            const verificationURL = `${process.env.API_URL}/email-verification/${token}`;
            return {
                from: process.env.EMAIL,
                to: email,
                subject: `Silly - Account Verification`,
                text: `Dear ${username}, your account at Silly needs verification.
                
                Please copy the link below and paste it in your browser to verify your account:
                
                 ${verificationURL}`,
                html: `<h2>Dear ${username}, your account at Silly needs verification.</h2>
                
                <p>Please click at the link below to verify your account:</p>
                
                <a href='${verificationURL}'>Verify Account</a>`
            }
        },
        /**
         * @param { string } username - Username of the user
         * @param { string } email - Email of the user
         * @param { string } token - JWT to be send by email for verifying 
        */
        resetPassword: (username, email, token) => {
            const resetUrl = `${process.env.CLIENT_URL}/forgot-password?code=${token}`;
            return {
                from: process.env.EMAIL,
                to: email,
                subject: `Silly - Forgot Password`,
                text: `Dear ${username}, we received a request to reset your password.
                
                Use the link below to set up a new password for your account. If you did not request
                to reset your password, ignore this email and the link will expire on its own.
                    
                    ${resetUrl}
                `,
                html: `<h2> Dear ${username}, we received a request to reset your password.</h2>
                
                <p>Use the link below to set up a new password for your account. If you did not request
                to reset your password, ignore this email and the link will expire on its own.</p>
                    
                    <a href="${resetUrl}"> Set new password</a>
                `,
            }
        },
        /**
         * @param { string } email - Email of the user
         * @param { string } username - Username of the user
         * @param { string } projectName - Project title
        */
        invitePeer: (email, username, projectName) => {
            const responseUrl = `${process.env.CLIENT_URL}/dashboard/invites`;;
            return {
                from: process.env.EMAIL,
                to: email,
                subject: `Silly - Project invitation`,
                text: `Dear ${username}, you have been invited to participate in the following project: ${projectName}.
                    
                    The invitation will expire in one week.

                    Please follow the link to resond to the invitaion  

                    ${responseUrl}

                `,
                html: `<h2> Dear ${username}, you have been invited to participate in the following project: ${projectName}. </h2>
                
                <p>
                    The invitation will expire in one week.

                    Please click on the link to resond to the invitaion
                    <a href="${responseUrl}"> Respond to invite </a>
                 </p>
                `
            }
        },
        /**
         * @param { Array } emails - Email array of the user to notify
         * @param { string } username - Username of the user
         * @param { string } projectName - Project title
         * @param { string } response - Response to invitation
         * @param { string } reason - Response text to invitation
        */
        responseToInvite: (emails, username, projectName, response, reason) => {
            return {
                from: process.env.EMAIL,
                to: emails,
                subject: `Silly - Project invitation response`,
                text: `Dear Silly user. 
                    The user with the name of ${username} has ${response} the invitation for the project ${projectName}.
                    Response Text: ${reason}`,
                html: `<h2>The user with the name of ${username} has ${response} the invitation for the project ${projectName}.</h2>
                <p> <b>Response Text:</b> ${reason} </p>`
            }        
        },
        invitationExpired: (email, username, projectName) => {
            return {
                from: process.env.EMAIL,
                to: email,
                subject: `Silly - Project Invitation expired`,
                text: `Dear ${username}, the invitations for the project ${projectName} has expired.
                It was auto rejcted in order to inform other project peers.  
                `,
                html: `<h2>Dear ${username}, the invitations for the project ${projectName} has expired.</h2>
                <p>It was auto rejcted in order to inform other prject peers.</p>`
            }
        }
    }
}