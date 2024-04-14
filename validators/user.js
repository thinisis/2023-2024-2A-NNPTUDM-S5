const { check } = require('express-validator');
const util = require('util');

const options = {
    username: {
        min: 5,
        max: 32
    },
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
    }
}

const Notifies = {
    EMAIL_NOTI: 'email phai dung dinh dang',
    USERNAME_NOTI: 'username phai dai tu %d den %d ki tu',
    PASSWORD_NOTI: 'password phai dai it nhat %d ki tu, trong do co %d ki tu chu hoa, %d ki tu chu thuong, %d ki tu ky hieu, %d ki tu so'
}

module.exports = {
    UserValidate: function () {
        return [
            check('email', Notifies.EMAIL_NOTI).isEmail(),
            check('username', util.format(Notifies.USERNAME_NOTI, options.username.min, options.username.max)).isLength(options.username),
            //check('role', 'Role khong hop le').isIn(['USER', 'ADMIN', 'PUBLISHER'])
        ]
    },
    PasswordValidate: function () {
        return [
            check('password', util.format(Notifies.PASSWORD_NOTI, options.password.minLength, options.password.minUppercase, options.password.minLowercase, options.password.minSymbols, options.password.minNumbers)).isStrongPassword(options.password)
        ]
    },
    EmailValidate: function () {
        return [
            check('email', 'Email phai dung dinh dang').isEmail()
        ];
    }
}
