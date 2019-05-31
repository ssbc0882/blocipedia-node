const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

    create() {
        return this.new();
    }

    destroy() {
        return this._isOwner() || this.isAdmin();
    }

    update() {
        return this.edit();
    }

    edit() {
        return this._isOwner() || this.isAdmin() || this.isPublic();
    }

    private() {
        return this.isAdmin() || this.isPremium();
    }
}