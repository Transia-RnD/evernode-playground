const { LMDBDatabase } = require('../core_services/lmdb-handler')
const settings = require('../settings.json').settings;

class MessageService {
    #message = null;
    #dbPath = 'messages';
    #db = null;

    constructor(message) {
        this.#message = message;
        this.#db = new LMDBDatabase(this.#dbPath);
    }

    // Creates a db record when a message is sent
    async create() {
        const data = this.#message.data;
        const id = this.#message.id;
        console.log(id);
        console.log(data);
        let resObj = {};
        try {
            this.#db.open();
            await this.#db.create(id, { ...data });
            resObj.success = { id: id };
        } catch (error) {
            resObj.error = `Error in creating the ${this.#dbPath} ${error}`;
        } finally {
            this.#db.close();
        }
        // console.log(resObj);
        return resObj;
    }

    // Gets a db record for a message key
    async get() {
        const id = this.#message.id;
        let resObj = {};
        try {
            this.#db.open();
            const result = await this.#db.get(id);
            resObj.success = { data: result };
        } catch (error) {
            resObj.error = `Error in getting the ${this.#dbPath} ${error}`;
        } finally {
            this.#db.close();
        }
        return resObj;
    }

    // Update a db record for a message key
    async update() {
        const id = this.#message.id;
        let resObj = {};
        try {
            this.#db.open();
            const result = await this.#db.update(id);
            resObj.success = { data: result };
        } catch (error) {
            resObj.error = `Error in updating the ${this.#dbPath} ${error}`;
        } finally {
            this.#db.close();
        }
        return resObj;
    }

    // Deletes a db record for a message key
    async delete() {
        const id = this.#message.id;
        let resObj = {};
        try {
            this.#db.open();
            const result = await this.#db.delete(id);
            resObj.success = { data: null };
        } catch (error) {
            resObj.error = `Error in deleting the ${this.#dbPath} ${error}`;
        } finally {
            this.#db.close();
        }
        return resObj;
    }
}

module.exports = {
    MessageService
}