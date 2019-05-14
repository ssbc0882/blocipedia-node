const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {

    beforeEach((done) => {

        sequelize.sync({ force: true })
            .then(() => {
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
    });

    describe("#create()", () => {

        it("should create an User object with a valid username email, and password", (done) => {

            User.create({
                username: "testing",
                email: "user@example.com",
                password: "123456789"
            })
                .then((user) => {
                    expect(user.username).toBe("testing");
                    expect(user.email).toBe("user@example.com");
                    expect(user.id).toBe(1);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })

        it("should not create an user with an invalid email or password", (done) => {

            User.create({
                username: "testing",
                email: "It's-a me, Mario!",
                password: "123456789"
            })
                .then((user) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Validation error: must be a valid email");
                    done();
                })
        })

        it("should not create a duplicate user", (done) => {

            User.create({
                username: "testing",
                email: "user@example.com",
                password: "123456789"
            })
                .then((user) => {
                    User.create({
                        username: "testing",
                        email: "user@example.com",
                        password: "nananananananananananananananana BATMAN!"
                    })
                        .then((user) => {
                            done();
                        })
                        .catch((err) => {
                            expect(err.message).toContain("Validation error");
                            done();
                        })
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                })
        })
    })
})