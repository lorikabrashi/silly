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
        invitePeer: () => {
            return {

            }
        }
    }
}