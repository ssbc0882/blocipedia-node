const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

    createUser(newUser, callback) {

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
            .then((user) => {

                const msg = { //sends conf email
                    to: "bryan.heshiki@gmail.com",
                    from: 'testing@example.com',
                    subject: 'Verification email',
                    text: 'Please verify that you made an acoount with Blocipedia',
                    html: '<strong>Verify and enjoy!</strong>',
                };
                sgMail.send(msg);
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            });
    }
}