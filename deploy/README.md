# Deploy Evernode

## Get testnet account

> Copy the `seed` from the tesnet response into the `env.sh` script.

I also copy the `seed` and `address` into a `keystore.json` file for reuse. (ONLY IN DEV)

## Generate Keys

`npm run keygen`

> Copy the `privateKey` and `publicKey` from the keygen function console response into the `env.sh` script.

I also copy the `privateKey` and `publicKey` into a `keystore.json` file for reuse. (ONLY IN DEV)

## Add Keys to Env

Copy the keys into the env.sh script and run. (or just make sure they are in the env)

```
export EV_TENANT_SECRET=sh2TnuWTvChC5gzeJeC9LrHXBSoVD
export EV_USER_PRIVATE_KEY=ed93a88b554bd237b5f9e1418f7f8da849f704113ff5a0927f6cdb32b76c2f09be2f06a72850d48b025c4c9f53776a6dc1d20e2e28fa1429570f672c3b6984360e
export EV_USER_PUBLIC_KEY=ed2f06a72850d48b025c4c9f53776a6dc1d20e2e28fa1429570f672c3b6984360e
export EV_INSTANCE_CONFIG_PATH=config.json
```

`./env/env.sh`

## Build The Distribution Bundle

`npm run build`

## Acquire an instance

`npm run acquire`

> Copy the `ip` and `user_port` from the acquire function console response into the `contract_env.sh` script.

## Deploy the contract

```
export EV_USER_IP="caldera.lavatide.io"
export EV_USER_PORT="26203"
```

`npm run deploy`