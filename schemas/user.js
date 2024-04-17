var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken')
var configs = require('../configs/config')
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: [String],
        default: ["USER"]
    },
    status: {
        type: Boolean,
        default: true
    },
    email: String,
    ResetPasswordToken: String,
    ResetPasswordExp: String,
    address: String,
    phone: String,
    name: String,
    avatarUrl: {
        type: [String],
        default: "default"
    }
}, { timestamps: true })

userSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
})

userSchema.methods.getJWT = function () {
    var token = jwt.sign({ id: this._id }, configs.SECRET_KEY, {
        expiresIn: configs.EXP_JWT
    });
    return token;
}
userSchema.methods.genTokenResetPassword = function () {
    this.ResetPasswordToken = crypto.randomBytes(30).toString('hex');
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    this.ResetPasswordExp = expirationTime;
    return this.ResetPasswordToken;
}

module.exports = new mongoose.model('user', userSchema);