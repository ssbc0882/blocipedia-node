const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

    beforeEach((done) => {
        this.user;
        this.wiki;

        sequelize.sync({ force: true })
            .then((res) => {

                User.create({
                    username: "testing",
                    email: "user@example.com",
                    password: "123456789"
                })
                    .then((user) => {
                        this.user = user;

                        Wiki.create({
                            title: "Learning Code",
                            body: "Takes a lifetime to excel",
                            userId: this.user.id
                        })
                            .then((wiki) => {
                                this.wiki = wiki;
                                done();
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
            })
    })

    describe("user performing CRUD actions for a wiki", () => {

        beforeEach((done) => {
            User.create({
                username: "testing",
                email: "user@example.com",
                password: "123456789"
            })
                .then((user) => {
                    request.get({
                        url: "http://localhost:3000/auth/fake",
                        form: {
                            userId: user.id,
                            username: user.username,
                            email: user.email
                        }
                    },
                        (err, res, body) => {
                            done();
                        })
                })
        })


        describe("GET /wikis", () => {

            it("should return a status code 200 and all wikis", (done) => {
                request.get(base, (err, res, body) => {
                    expect(res.statusCode).toBe(200);
                    expect(err).toBeNull();
                    expect(body).toContain("Learning Code");
                    done();
                })
            })
        })

        describe("GET /wikis/new", () => {

            it("should render a new wiki form", (done) => {
                request.get(`${base}new`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("New Wiki");
                    done();
                })
            })
        })

        describe("POST /wikis/create", () => {

            it("should create a new wiki and redirect", (done) => {
                const options = {
                    url: `${base}create`,
                    form: {
                        title: "Learning Code",
                        body: "Takes a lifetime to excel",
                        userId: this.user.id
                    }
                }

                request.post(options, (req, res, body) => {
                    Wiki.findOne({ where: { title: "Learning Code" } })
                        .then((wiki) => {
                            expect(wiki).not.toBeNull();
                            expect(wiki.title).toBe("Learning Code");
                            expect(wiki.body).toBe("Takes a lifetime to excel");
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        })
                })
            })
        })

        describe("GET /wikis/:id", () => {

            it("should render a view with the selected wiki", (done) => {
                request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Takes a lifetime to excel");
                    done();
                })
            })
        })

        describe("POST /wikis/:id/destroy", () => {

            it("should delete a wiki with the associated id", (done) => {
                Wiki.findAll()
                    .then((wiki) => {

                        const wikiCountBeforeDelete = wiki.length;
                        expect(wikiCountBeforeDelete).toBe(1);

                        request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                            Wiki.findById(this.wiki.id)
                                .then((wiki) => {
                                    expect(err).toBeNull();
                                    done();
                                })
                                .catch((err) => {
                                    console.log(err);
                                    done();
                                })
                        })
                    })
            })
        })

        describe("GET /wikis/:id/edit", () => {

            it("should render a view with the an edit wiki form", (done) => {
                request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
                    expect(err).toBeNull();
                    expect(body).toContain("Edit Wiki");
                    done();
                })
            })
        })

        describe("POST /wikis/:id/update", () => {

            it("should update the wiki with the given values", (done) => {
                const options = {
                    url: `${base}${this.wiki.id}/update`,
                    form: {
                        title: "Learning Code",
                        body: "Takes a lifetime to excel",
                        userId: this.user.id
                    }
                }

                request.post(options, (err, res, body) => {
                    expect(err).toBeNull();

                    Wiki.findOne({
                        where: { id: 1 }
                    })
                        .then((wiki) => {
                            expect(wiki.body).toBe("Takes a lifetime to excel");
                            done();
                        })

                })
            })
        })
    })

})