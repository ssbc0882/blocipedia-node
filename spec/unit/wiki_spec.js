const sequelize = require("../../db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

    beforeEach((done) => {
        this.wiki;
        this.user;
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
                            userId: this.user.id
                        })
                            .then((wiki) => {
                                this.wiki = wiki;
                                done();
                            })
                    })
            })
    })

    describe("#create()", () => {

        it("should create a wiki project with a title and body", (done) => {
            Wiki.create({
                title: "Learning Code",
                body: "Takes a lifetime to excel",
                userId: this.user.id
            })
                .then((wiki) => {
                    expect(wiki.title).toBe("Learning Code");
                    expect(wiki.body).toBe("Takes a lifetime to excel");
                    expect(wiki.private).toBe(false);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })

        it("should not create a wiki with a missing title or body", (done) => {
            Wiki.create({
                title: "Learning Code"
            })
                .then((wiki) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("body cannot be null");
                    done();
                })
        })
    })

    describe("#setUser()", () => {
        it("should associate a wiki and user together", (done) => {
            User.create({
                username: "testing",
                email: "test@example.com",
                password: "123456789"
            })
                .then((newUser) => {
                    expect(this.wiki.userId).toBe(this.wiki.id);
                    this.wiki.setUser(newUser)
                        .then((wiki) => {
                            expect(this.wiki.userId).toBe(newUser.id);
                            done();
                        })
                })
        })
    })

    describe("#getUser()", () => {
        it("should return the associated wiki", (done) => {
            this.wiki.getUser()
                .then((associatedUser) => {
                    expect(associatedUser.email).toBe("test@example.com");
                    done();
                })
        })
    })
})