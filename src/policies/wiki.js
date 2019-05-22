const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    create() {
        return this.new();
    }

    destroy() {
        return this._isOwner() || this._isAdmin();
    }

    update() {
        return this.edit();
    }
}