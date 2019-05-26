const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

    beforeEach((done) => {
        this.user;

        sequelize.sync({ force: true })
            .then((res) => {
                User.create({
                    username: "testing",
                    email: "user@example.com",
                    password: "123456789"
                })
                    .then((user) => {
                        this.user = user;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
            });
    });

    describe("GET /users/signup", () => {

        it("should render a view with a sign up form", (done) => {
            request.get(`${base}signup`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign Up");
                done();
            })
        })
    })

    describe("POST /users/signup", () => {

        it("should create a new user with valid values and redirect", (done) => {

            const options = {
                url: `${base}signup`,
                form: {
                    username: "testing",
                    email: "user@example.com",
                    password: "123456789"
                }
            }
            request.post(options, (err, res, body) => {
                User.findOne({ where: { email: "user@example.com" } })
                    .then((user) => {
                        expect(user).not.toBeNull();
                        expect(user.email).toBe("user@example.com");
                        expect(user.id).toBe(1);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
            });
        });

        it("should not create a new user with invalid attributes and redirect", (done) => {
            request.post(
                {
                    url: `${base}signup`,
                    form: {
                        name: "Joe",
                        email: "no",
                        password: "123456789"
                    }
                },
                (err, res, body) => {
                    User.findOne({ where: { email: "no" } })
                        .then((user) => {
                            expect(user).toBeNull();
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                }
            );
        });
    });

    describe("GET /users/sign_in", () => {

        it("should render a view with a sign in form", (done) => {
            request.get(`${base}sign_in`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign in");
                done();
            })
        })
    })

    describe("GET /users/:id/payment", () => {

        it("should render a payment screen", (done) => {
            request.get(`${base}${this.user.id}/payment`, (err, res, body) => {
                console.log("MARBLES", body)
                expect(body).toContain("Upgrade Account");
                done();
            })
        })
    })
});