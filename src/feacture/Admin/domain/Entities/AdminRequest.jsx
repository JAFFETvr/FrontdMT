export class AdminRequest {
    constructor(id, username, password_hash, status) { 
        this.id = id;
        this.username = username;
        this.password_hash = password_hash;
        this.status = status;
    }

    static fromJSON(data) {
        return new AdminRequest(data.id, data.username, data.password_hash, data.status); 
    }
}