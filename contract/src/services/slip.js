const { LMDBDatabase } = require('../core_services/lmdb-handler')
const settings = require('../settings.json').settings;

class SlipService {
    #slip = null;
    #dbPath = 'slips';
    #db = null;

    constructor(slip) {
        this.#slip = slip;
        this.#db = new LMDBDatabase(this.#dbPath);
    }

    // Creates a db record when a slip is created
    async create() {
        const data = this.#slip.data;
        const id = this.#slip.id;
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
        return resObj;
    }
}

module.exports = {
    SlipService
}