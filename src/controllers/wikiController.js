const wikiQueries = require("../db/queries.wikis.js");
const collaboratorQueries = require("../db/queries.collaborators.js")
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {

    index(req, res, next) {
        wikiQueries.getAllWikis((err, wikis) => {
            if (err) {
                res.redirect(500, "static/index");
            } else {
                res.render("wikis/index", { wikis });
            }
        })
    },

    new(req, res, next) {

        res.render("wikis/new");
    },

    create(req, res, next) {

        const authorized = new Authorizer(req.user).create();

        if (authorized) {

            let newWiki = {
                title: req.body.title,
                body: req.body.body,
                userId: req.user.id
            };

            wikiQueries.addWiki(newWiki, (err, wiki) => {
                if (err) {
                    res.redirect(500, "/wikis");
                } else {
                    res.redirect(303, `/wikis/${wiki.id}`);
                }
            })
        } else {
            req.flash("notice", "You are not authorized to do that");
            res.redirect("/wikis");
        }
    },

    show(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            let wikiMarkdown = {
                title: markdown.toHTML(wiki.title),
                body: markdown.toHTML(wiki.body),
                private: wiki.private,
                userId: wiki.userId,
                id: wiki.id
            }
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                res.render("wikis/show", { wikiMarkdown });
            }
        })
    },

    destroy(req, res, next) {
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if (err) {
                res.redirect(500, "/wikis");
            } else {
                res.redirect(303, "/wikis");
            }
        })
    },

    edit(req, res, next) {

        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, "/");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if (authorized) {
                    res.render("wikis/edit", { wiki });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.id}`);
                }

            }

        })
    },

    update(req, res, next) {
        wikiQueries.updateWiki(req, req.body, (err, wiki) => {
            if (err) {
                res.redirect(401, `/wikis/${req.params.id}/edit`)
            } else {
                res.redirect(`/wikis/${wiki.id}`);
            }
        })
    },

    updatePrivate(req, res, next) {
        wikiQueries.private(req, true, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(401, `/wikis/${wiki.id}`);
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if (authorized) {
                    res.redirect(`/wikis/${wiki.id}`);
                }
            }
        })
    },

    updatePublic(req, res, next) {
        wikiQueries.private(req, false, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(401, "/wikis");
            } else {
                const authorized = new Authorizer(req.user, wiki).edit();
                if (authorized) {
                    res.redirect(`/wikis/${wiki.id}`);
                }
            }
        })
    }
}