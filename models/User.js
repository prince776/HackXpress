const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Chat = new mongoose.Schema({
    content: {
        type: String
    },
    sender: {
        type: String
    },
    to: {
        type: String
    }

})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    signUpDate: {
        type: Date,
        default: Date.now()
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    contacts: [{
        type: String
    }],
    chats: [{
        type: Chat
    }]
});

//methods
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

//export as a mongoose.model using Schema
module.exports = mongoose.model("User", UserSchema);
