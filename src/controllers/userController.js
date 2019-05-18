const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");

module.exports = {
    signUp(req, res, next) {
        res.render("users/signup");
    },

    create(req, res, next) {

        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {

                passport.authenticate("local")(req, res, () => {

                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })

                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const msg = {
                    to: req.body.email,
                    from: 'verify@example.com',
                    subject: 'Verification email',
                    text: 'Please verify that you made an acoount with Blocipedia',
                    html: '<strong>Verify and enjoy!</strong>',
                };

                sgMail.send(msg);
            }
        });
    }

}



