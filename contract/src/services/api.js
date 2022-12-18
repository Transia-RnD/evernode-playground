// const { SqliteDatabase, DataTypes } = require("../core_services/sqlite-handler")
const { LMDBDatabase } = require("../core_services/lmdb-handler")
// const { PoolService } = require('./pool');
const { BetService } = require('./bet');
const { SlipService } = require('./slip');
const settings = require('../settings.json').settings;

export class ApiService {

    dbPath = settings.dbPath;
    #betService = null;
    #slipService = null;

    constructor() {
        console.log('CONSTRUCTOR');
        this.betsDb = new LMDBDatabase('bets');
        this.slipsDb = new LMDBDatabase('slips');
    }

    async handleRequest(user, message, isReadOnly) {
        console.log('HANDLE REQUEST');
        this.betsDb.open();
        this.#betService = new BetService(message);

        let result;
        console.log(message.type);
        console.log(message.command);
        if (message.type == 'bet') {
            this.betsDb.open();
            this.#betService = new BetService(message);
            if (message.command == 'create') { 
                result = await this.#betService.create();
            }
            if (message.command == 'close') { 
                result = await this.#betService.close();
            }
            if (message.command == 'get') { 
                result = await this.#betService.get();
            }
            if (message.command == 'query') { 
                result = await this.#betService.query();
            }
        }

        if (message.type == 'slip') {
            this.slipDb.open();
            this.#slipService = new SlipService(message);
            if (message.command == 'submit') {
                result = await this.#slipService.submit();
            }
        }
        
        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, {id: message.id, ...result});
        }

        this.betsDb.close();
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }

}