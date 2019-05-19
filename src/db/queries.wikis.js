const Wiki = require("./models").Wiki;

module.exports = {
    getAllWikis(callback) {
        return Wiki.findAll()
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },

    addWiki(newWiki, callback) {
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getWiki(id, callback) {
        return Wiki.findById(id)
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },

    deleteWiki(req, callback) {
        return Wiki.findById(req.params.id)
            .then((wiki) => {
                callback(null, wiki);
            })
            .catch((err) => {
                callback(err);
            })
    },
    updateWiki(id, updatedWiki, callback) {
        return Wiki.findById(id)
            .then((wiki) => {
                if (!wiki) {
                    return callback("Wiki not found");
                }

                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                    .then(() => {
                        callback(null, wiki);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            })
    }
}