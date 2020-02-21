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
                subject: `Your account at Silly needs verification`,
                text: `Dear, ${username} \n\nPlease copy the link below and paste it in your browser to verify your account:\n ${verificationURL}`,
                html: `Dear, ${username} \n\nPlease click at the link below to verify your account:\n <a href='${verificationURL}'>${verificationURL}</a>`
            }
        },
        resetPassword: () => {
            return {

            }
        },
        projectInvite: () => {
            return {

            }
        }
    }
}