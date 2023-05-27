// const { SqliteDatabase, DataTypes } = require("../core_services/sqlite-handler")
const { LMDBDatabase } = require("../core_services/lmdb-handler")
const { MessageService } = require('./message');
const settings = require('../settings.json').settings;

class ApiService {

    dbPath = settings.dbPath;
    #messageService = null;

    constructor() {
        console.log('CONSTRUCTOR');
        // this.db = new LMDBDatabase('messages');
    }

    async handleRequest(user, request, isReadOnly) {
        console.log('HANDLE REQUEST');

        let result;
        console.log(request.type);
        console.log(request.command);
        if (request.type == 'message') {
            // this.db.open();
            this.#messageService = new MessageService(request);
            if (request.command == 'create') { 
                result = await this.#messageService.create();
            }
            if (request.command == 'get') { 
                result = await this.#messageService.get();
            }
        }

        console.log(result);
        
        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, {id: request.id, ...result});
        }

        // this.db.close();
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }
}
module.exports = {
    ApiService
}