const wikiQueries = require("../db/queries.wikis.js");

module.exports = {

    index(req, res, next) {
        wikiQueries.getAllWikis((err, wiki) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wiki/index", { wiki });
            }
        })
    },

    new(req, res, next) {
        res.render("wiki/new");
    },

    create(req, res, next) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        };

        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if (err) {
                res.redirect(500, "/wiki/new");
            } else {
                res.redirect(303, `/wiki/${wiki.id}`);
            }
        })
    },

    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                res.render("wiki/show", { wiki });
            }
        })
    },

    destroy(req, res, next) {
        wikiQueries.deleteWiki(req.params.id, (err, wiki) => {
            if (err) {
                res.redirect(err, `/wiki/${req.params.id}`);
            } else {
                res.redirect(303, "/wiki/");
            }
        })
    },

    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, "/wiki/");
            } else {
                res.render("wiki/edit", { wiki });
            }
        })
    },

    update(req, res, next) {
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err) {
                res.redirect(401, `/wiki/${req.params.id}/edit`)
            } else {
                res.redirect(`/wiki/${req.params.id}`);
            }
        })
    }
}