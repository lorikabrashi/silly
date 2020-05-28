/*eslint-disable */
const options = {
    passwordRegex : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/,
    phoneRegex : /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/,
    emailRegex: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
    messages: {
        auth: {
            password: "Please enter your password.",
            passwordLong: "Password should have a minimum of six characters, at least one letter, one number and one special character.",
            passwordMismatch: "Passwords do not match.",
            email: "Please enter your email.",
            username: "Please enter your username.",
            emailOrUsername: "Please enter your email or username.",
        },
        user:{
            username : "Username cannot be empty.",
            firstName : "First Name cannot be empty.",
            lastName : "Last Name cannot be empty.",
            phoneNumber : "Phone Number cannot be empty.",
            phoneNumberNotValid : "Phone Number is not valid.",
            email: "Email Address is not valid."
        }
    }
}
/*eslint-enable */
const validationObj = {    
    isValid: true,
    message: ''
}

const _validations_ = {
    validateCreateUser: (user) => {
        const validation = Object.create(validationObj);
        const connector = '<br>';

        if(!options.emailRegex.test(user.email)){
            validation.message += options.messages.user.email + connector;
            validation.isValid = false;
        }
        if(!user.username.length){
            validation.message += options.messages.user.username + connector;
            validation.isValid = false;
        }

        const validPasword = _validations_.validatePassword(user.password, user.confPassword);
        if(!validPasword.isValid){
            validation.message += validPasword.message;
            validation.isValid = false;
        }
        return validation;
    },
    validateEditUser: (user) => {
        const validation = Object.create(validationObj);
        const connector = '<br>';

        if(!user.username.length){
            validation.message = options.messages.user.username + connector;
            validation.isValid = false;
        }
        if(!user.profile.first_name){
            validation.message += options.messages.user.firstName + connector;
            validation.isValid = false;
        }  
        if(!user.profile.last_name){
            validation.message += options.messages.user.lastName + connector;
            validation.isValid = false;
        }
        if(!user.profile.phone_number){
            validation.message += options.messages.user.phoneNumber + connector;
            validation.isValid = false;
        }
        if(!options.phoneRegex.test(user.profile.phone_number)){
            validation.message += options.messages.user.phoneNumberNotValid;
            validation.isValid = false;
        }
        
        return validation;
    },
    validatePassword: (password, confPassword = null) => {

        const validation = Object.create(validationObj);
        
        if(confPassword !== null){
            if(password !== confPassword){
                validation.message = options.messages.auth.passwordMismatch;
                validation.isValid = false;
                return validation;
            }
        }

        if (!password.length) {
            validation.message = options.messages.auth.password;
            validation.isValid = false;
        }
        if (!options.passwordRegex.test(password)) {
            validation.message = options.messages.auth.passwordLong;
            validation.isValid = false;
        }
        return validation;
    },
    validateLogin: (user, password) => {
        const validation = Object.create(validationObj);
        if (!user.length) {
            validation.message = options.messages.auth.emailOrUsername;
            validation.isValid = false;
        }
        if (!password.length) {
            validation.message = options.messages.auth.password;
            validation.isValid = false;
        }
        if (!options.passwordRegex.test(password)) {
            validation.message = options.messages.auth.passwordLong;
            validation.isValid = false;
        }
        return validation;
    },
    validateRegister(username, email, password){
        const validation = Object.create(validationObj);
        if(!username.length){
            validation.message = options.messages.auth.username;
            validation.isValid = false;
        }
        if(!email.length){
            validation.message = options.messages.auth.email;
            validation.isValid = false;
        }
        if (!password.length) {
            validation.message = options.messages.auth.password;
            validation.isValid = false;
        }
        if(!options.passwordRegex.test(password)){
            validation.message = options.messages.auth.passwordLong;
            validation.isValid = false;
        }
        return validation;
    }
}

export default  _validations_