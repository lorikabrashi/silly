const { check } = require('express-validator');
const ErrorWithStatusCode = require('./ErrorWithStatusCode')
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/;
const passwordMessage = 'Password should not be empty, minimum six characters, at least one letter, one number and one special character';

module.exports = _validators = {
    users: [
        check('username', 'Username cannot be empty' ).notEmpty(),
        check('email', 'Email field must be a valid email address!').isEmail(),
        check('password', passwordMessage).exists().isLength({ min: 6}).matches(passwordRegex)
    ],
    profile: [
        check('first_name', 'First name cannot be empty').notEmpty(),
        check('last_name', 'Last Name cannot be empty').notEmpty()
    ],
    validatePassword: (password) => {
        var isValid = passwordRegex.test(password);
        if (!isValid) {
            throw new ErrorWithStatusCode(passwordMessage, 400);
        }
        return true;
    } 
}