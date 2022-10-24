# Evernode + LMDB

## Running the Contract

`cd contract`

### Initialize

First if you dont have a `mydata` directory in the `dist` directory it might fail. So lets add that.

`mkdir dist/mydata`

### Install

`npm install`

### Start (LINUX)

`npm run start`

### Start (DARWIN)

`npm run build`

Because of the system architechure and process to deploy the build performed on a mac os will build the application for the mac os. This generates a folder inside `contract/dist/prebuilds` for the coresponding os. The image platform does not alway match the os platform so we have to make some changes.

We will update the `index.js`

Change:

`module.exports = require(__nccwpck_require__.ab + "prebuilds/darwin-x64/node.abi93.node");`

To:

`module.exports = require(__nccwpck_require__.ab + "prebuilds/linux-x64/node.abi93.node");`

### Deploy

`npm run deploy`


## Running the Client

`cd client`

### Install

`npm install`

### Start

`node client.js`

> This repo would not be possible without @Udith-Gayan and his evernode + sqlite [example](https://github.com/Udith-Gayan/Decentralized-Hotel-Booking-System)