const User = require("./models").User;
const bcrypt = require("bcryptjs");

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
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getUser(id, callback) {
        let result = {};
        User.findById(id)
            .then((user) => {
                if (!user) {
                    callback(404);
                } else {
                    result["user"] = user;
                    callback(null, result);
                }
            })
            .catch((err) => {
                callback(err);
            })
    },

    updateUserRole(id, updatedRole, callback) {
        return User.findById(id)
            .then((user) => {
                if (!user) {
                    return callback("User not found");
                }
                return user.update({ role: updatedRole }, fields["role"])
                    .then(() => {
                        callback(null, user);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            })
    }
}