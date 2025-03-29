export class AdminRequest {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }

    static fromJSON(data) {
        return new AdminRequest(data.id, data.username);
    }
}
