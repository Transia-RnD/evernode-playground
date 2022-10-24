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
        let resObj = {};
        try {
            this.#db.open();
            await this.#db.create(id, { ...data });
            resObj.success = { id: id };
        } catch (error) {
            resObj.error = `Error in creating the ${this.#dbPath} ${error}`;
        } finally {
            console.log('FINALLY');
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
            console.log('FINALLY');
            this.#db.close();
        }
        return resObj;
    }
}

module.exports = {
    MessageService
}