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
                    email: "test@example.com",
                    password: "123456789"
                })
                    .then((user) => {
                        this.user = user;
                        Wiki.create({
                            title: "Learning Code",
                            body: "Takes a lifetime to excel",
                            userId: user.id,
                            private: false
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

    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
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
                    title: "Cooking Tips",
                    body: "Save time in the kitchen",
                    userId: this.user.id
                }
            }

            request.post(options, (req, res, body) => {
                Wiki.findOne({ where: { title: "Cooking Tips" } })
                    .then((wiki) => {
                        expect(wiki).not.toBeNull();
                        expect(wiki.title).toBe("Cooking Tips");
                        expect(wiki.body).toBe("Saving time in the kitchen");
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
            })
        })

        it("should not create a new wiki that fails validations", (done) => {
            const options = {
                url: `${base}create`,
                form: {
                    title: "a",
                    body: "b"
                }
            }

            request.post(options, (err, res, body) => {
                Wiki.findOne({ where: { title: "a" } })
                    .then((wiki) => {
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
                expect(body).toContain("Saving time in the kitchen");
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
                        Wiki.findAll()
                            .then((wiki) => {
                                expect.toBeNull();
                                expect(wiki.length).toBe(wikiCountBeforeDelete - 1);
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
                expect(body).toBeNull("Saving time in the kitchen");
                done();
            })
        })
    })

    describe("POST /wikis/:id/update", () => {
        it("should update the wiki with the given values", (done) => {
            const options = {
                url: `${base}${this.wiki.id}/update`,
                form: {
                    title: "Cooking Tips",
                    body: "Saving time in the kitchen",
                    userId: this.user.id
                }
            }

            request.post(options, (err, res, body) => {
                expect(err).toBeNull();

                Wiki.findOne({
                    where: { id: 1 }
                })
                    .then((wiki) => {
                        expect(wiki.body).toBe("Saving time in the kitchen");
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