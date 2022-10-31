const lmdb = require('node-lmdb');
// const { open } = require('lmdb');

class LMDBDatabase {

    constructor(dbCollection) {
        this.characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.dbCollection = dbCollection;
        this.openConnections = 0;
    }

    open() {
        // Make sure only one connection is open at a time.
        // If a connection is already open increase the connection count.
        // This guarantees only one connection is open even if open() is called before closing the previous connections. 
        if (this.openConnections <= 0) {
            console.log('OPEN');
            // node-lmdb
            this.env = new lmdb.Env();
            this.env.open({
                path: 'mydata',
                mapSize: 2*1024*1024*1024, // maximum database size
                maxDbs: 3,
                // These options prevent LMDB from automatically syncing on commit
                noMetaSync: true,
                noSync: true
            });
            console.log(`OPENING COLLECTION: ${this.dbCollection}`);
            this.db = this.env.openDbi({
                name: this.dbCollection,
                create: true // will create if database did not exist
            })
            this.openConnections = 1;
        }
        else
            console.log('OPEN - ELSE');
            this.openConnections++;
    }

    close() {
        // Only close the connection for the last open connection.
        // Otherwise keep decreasing until connection count is 1.
        // This prevents closing the connection even if close() is called while db is used by another open session.
        if (this.openConnections <= 1) {
            console.log('CLOSE');
            if (this.db && this.env) {
                this.db.close();
                this.env.close();
                this.db = null;
                this.env = null;
                this.openConnections = 0;
            }
        }
        else
            console.log('CLOSE - ELSE');
            this.openConnections--;
    }

    create(key, value) {
        if (!this.env)
            throw 'Env connection is not open.';
        if (!this.db)
            throw 'Database connection is not open.';

        // node-lmdb
        console.log('LMDB CREATE');
        var txn = this.env.beginTxn();
        txn.putBinary(this.db, key, Buffer.from(JSON.stringify(value)));
        txn.commit();
        return key
    }

    async get(key) {
        if (!this.env)
            throw 'Env connection is not open.';
        if (!this.db)
            throw 'Database connection is not open.';

        // node-lmdb
        console.log('LMDB GET');
        var txn = this.env.beginTxn();
        var data = txn.getBinary(this.db, key);
        txn.commit()

        if (!data) {
            // throw Error('No Data');
            return {
                error: 'No Data',
                status: 'error',
                type: 'error',
            }
        }
        return JSON.parse(data.toString());
    }

    async update(key) {
        if (!this.env)
            throw 'Env connection is not open.';
        if (!this.db)
            throw 'Database connection is not open.';

        // node-lmdb
        console.log('LMDB UPDATE');
        var txn = this.env.beginTxn();
        txn.putBinary(this.db, key, Buffer.from(JSON.stringify(value)));
        txn.commit()

        if (!data) {
            // throw Error('No Data');
            return {
                error: 'No Data',
                status: 'error',
                type: 'error',
            }
        }
        return JSON.parse(data.toString());
    }

    async delete(key) {
        if (!this.env)
            throw 'Env connection is not open.';
        if (!this.db)
            throw 'Database connection is not open.';

        // node-lmdb
        console.log('LMDB DELETE');
        var txn = this.env.beginTxn();
        txn.del(this.db, key)
        txn.commit()

        if (!data) {
            // throw Error('No Data');
            return {
                error: 'No Data',
                status: 'error',
                type: 'error',
            }
        }
        return JSON.parse(data.toString());
    }

    async transaction(key, value) {
        console.log('GET');
    }

    generateKey(length) {
        let result = ' ';
        const charactersLength = this.characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

module.exports = {
    LMDBDatabase
}