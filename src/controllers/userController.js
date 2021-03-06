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
    },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again");
                req.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in");
                res.redirect("/");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out");
        res.redirect("/");
    },

    //upgrade to premium account

    payment(req, res, next) {
        res.render("users/payment");
    },

    upgradePremium(req, res, next) {
        var stripe = require("stripe")('pk_test_VJYXfuhTbA1yxw7xH0MYsxuR00F2uwMJ3x');

        const token = req.body.stripeToken;

        const charge = stripe.charges.create({
            amount: 1000,
            currency: 'usd',
            description: 'Premium charge',
            source: token
        })
            .then((charge) => {
                userQueries.updateUserRole(req.params.id, 1, (err, user) => {
                    if (err || user == null) {
                        req.flash("notice", "No results found");
                        res.redirect(404, `/users/${req.params.id}`);
                    } else {
                        req.flash("ntoice", "You've upgraded to premium!");
                        res.redirect(`/users/${req.params.id}`);
                    }
                })
            })
    },

    downgrade(req, res, next) {

        userQueries.updateUserRole(req.params.id, 0, (err, user) => {
            if (err || user == null) {
                req.flash("notice", "No results found");
                res.redirect(404, `/users/${req.params.id}`);
            } else {
                req.flash("notice", "Your account is at standard");
                res.redirect(`/users/${req.params.id}`);
            }
        })
    }


}



