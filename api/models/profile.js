const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    first_name : { type: String },
    last_name: { type: String },
    avatar: { type: String },
    phone_number: { type: String,
        validate: {
            validator: function(v) {
                return  /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        },
    }
},{
    timestamps: true	
});

let profileModel = mongoose.model('profiles', profileSchema);

module.exports = profileModel;