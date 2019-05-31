const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {

    getAllCollaborators(callback) {

        return User.getAll(
            {

                include: [{
                    model: Collaborator,
                    as: "collaborators"
                }]
            }
        )
            .then((users) => {
                callback(null, users)
            })
            .catch((err) => {
                callback(err);
            })
    },

    addCollaborator(req, callback) {

        return Collaborator.findOne({
            where: {
                wikiId: req.parmas.wikiId,
                userId: req.body.id
            }
        })
            .then((collaborator) => {
                if (!collaborator) {
                    Collaborator.create({
                        wikiId: req.parmas.wikiId,
                        userId: req.body.id
                    })
                        .then((collaborator) => {
                            callback(null, collaborator);
                        })
                        .catch((err) => {
                            callback(err);
                        });
                } else {
                    callback("error", "Collaborator exists");
                }
            })
    },

    removeCollaborator(req, callback) {

        return Collaborator.findOne({
            where: {
                wikiId: req.parmas.wikiId,
                userId: req.body.id
            }
        })
            .then((collaborator) => {
                if (collaborator) {
                    Collaborator.destroy({
                        where: {
                            id: collaborator.id
                        }
                    })
                        .then((collaborator) => {
                            callback(null, collaborator);
                        })
                        .catch((err) => {
                            callback(err);
                        })
                } else {
                    callback("error", "Collaborator exists"); s
                }
            })
    }

}