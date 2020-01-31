const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    first_name : { type: String },
    last_name: { type: String },
    image: { type: String },
    phone_number: { type: String ,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    }
},{
    timestamps: true	
});

let profileModel = mongoose.model('profiles', profileSchema);

module.exports = profileModel;