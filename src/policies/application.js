module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }

    isAdmin() {
        return this.user && this.user.role === 2;
    }

    isPremium() {
        return this.user && this.user.role === 1;
    }

    isStandard() {
        return this.user && this.user.role === 0;
    }

    isPrivate() {
        return this.record && this.record.private === true;
    }

    isPublic() {
        return this.record && this.record.private === false;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {

        return this.user != null;
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
}