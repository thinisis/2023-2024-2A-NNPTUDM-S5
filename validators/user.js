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
    EMAIL_NOTI: 'Email không đúng định dạng!',
    USERNAME_NOTI: 'Username phải dài từ %d đến %d kí tự',
    PASSWORD_NOTI: 'Password phải dài ít nhất %d kí tự, trong đó có %d kí tự chữ hoa, %d kí tự chữ thường, %d kí tự đặc biệt, %d kí tự số'
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
            check('email', 'Email không đúng định dạng!').isEmail()
        ];
    }
}
