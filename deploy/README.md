# Deploy Evernode

## Get testnet account

> Copy the `seed` from the tesnet response into the `env.sh` script.

I also copy the `seed` and `address` into a `keystore.json` file for reuse. (ONLY IN DEV)

## Generate Keys

`yarn run keygen`

> Copy the `privateKey` and `publicKey` from the keygen function console response into the `env.sh` script.

I also copy the `privateKey` and `publicKey` into a `keystore.json` file for reuse. (ONLY IN DEV)

## Add Keys to Env

Copy the keys into the env.sh script and run. (or just make sure they are in the env)

`./scripts/env.sh`

## Build The Distribution Bundle

`yarn run build`

## Acquire an instance

`yarn run acquire`

> Copy the `ip` and `user_port` from the acquire function console response into the `contract_env.sh` script.

## Deploy the contract

`yarn run deploy`