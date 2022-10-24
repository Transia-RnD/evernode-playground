// const { SqliteDatabase, DataTypes } = require("../core_services/sqlite-handler")
const { LMDBDatabase } = require("../core_services/lmdb-handler")
const { MessageService } = require('./message');
const settings = require('../settings.json').settings;

export class ApiService {

    dbPath = settings.dbPath;
    #messageService = null;

    constructor() {
        console.log('CONSTRUCTOR');
        this.db = new LMDBDatabase('messages');
    }

    async handleRequest(user, message, isReadOnly) {
        console.log('HANDLE REQUEST');
        this.db.open();
        this.#messageService = new MessageService(message);

        let result;
        console.log(message.type);
        console.log(message.command);
        if (message.type == 'message') {
            if (message.command == 'create') { 
                result = await this.#messageService.create();
            }
            if (message.command == 'get') { 
                result = await this.#messageService.get();
            }
        }

        console.log(result);
        
        if(isReadOnly){
            await this.sendOutput(user, result);
        } else {
            await this.sendOutput(user, {id: message.id, ...result});
        }

        this.db.close();
    }

    sendOutput = async (user, response) => {
        await user.send(response);
    }

}