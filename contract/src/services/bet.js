const { LMDBDatabase } = require('../core_services/lmdb-handler')
const settings = require('../settings.json').settings;

class BetService {
    #bet = null;
    #dbPath = 'bets';
    #db = null;

    constructor(bet) {
        this.#bet = bet;
        this.#db = new LMDBDatabase(this.#dbPath);
    }

    // Creates a db record when a bet is sent
    async create() {
        const data = this.#bet.data;
        const id = this.#bet.id;
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

    // Gets a db record for a bet key
    async get() {
        const id = this.#bet.id;
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

    // Queries a db record for a bet key
    async query(start, end, offset, limit) {
        const start = this.#bet.start;
        const end = this.#bet.end;
        const offset = this.#bet.offset;
        const limit = this.#bet.limit;
        let resObj = {};
        try {
            this.#db.open();
            const result = await this.#db.query(start, end, offset, limit);
            resObj.success = { data: result };
        } catch (error) {
            resObj.error = `Error in querying the ${this.#dbPath} ${error}`;
        } finally {
            this.#db.close();
        }
        return resObj;
    }
}

module.exports = {
    BetService
}